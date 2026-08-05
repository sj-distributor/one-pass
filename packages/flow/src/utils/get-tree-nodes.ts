import {
  Edge,
  Node,
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
  OnTransformEdgeType,
  OnTransformNodeType,
} from "../types/one-pass-flow-types";
import { buildEdge } from "./build-edge";
import { buildNode } from "./build-node";
import { getLayout } from "./get-tree-position";
export const buildTreeNodes = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  tree: OnePassFlowNodeDataType[],
  onTransformNode?: OnTransformNodeType<N>,
  onTransformEdge?: OnTransformEdgeType<E>,
): { nodes: Node<N>[]; edges: Edge<E>[] } => {
  if (!tree.length) return { nodes: [], edges: [] };
  const root = buildNode("1", tree[0], onTransformNode);

  const childrenByParentId = new Map<string, OnePassFlowNodeDataType[]>();

  for (const item of tree) {
    for (const parentId of item.parentIds ?? []) {
      const children = childrenByParentId.get(parentId);

      if (children) {
        children.push(item);
      } else {
        childrenByParentId.set(parentId, [item]);
      }
    }
  }

  const resultNode: Node[] = [root];

  const resultEdge: Edge[] = [];

  // Map 索引：O(1) 查找替代 O(n) 的 resultNode.find / resultEdge.find
  const nodeMap = new Map<string, Node>();

  nodeMap.set(root.data.id, root);

  const edgeMap = new Map<string, Edge>();

  // DAG 中多个父节点可能汇合到同一个节点；记录已展开的业务节点，
  // 避免从汇合点开始重复递归整段下游。
  const expandedNodeIds = new Set<string>();

  const expandedEdgeIds = new Set<string>();

  // 转换节点
  const bfsNode = (root: Node) => {
    if (expandedNodeIds.has(root.data.id)) return;
    expandedNodeIds.add(root.data.id);

    const children = childrenByParentId.get(root.data.id) ?? [];

    const emptyNode: OnePassFlowNodeDataType[] = children.filter(
      (item) => item.type === "EmptyNode",
    );

    const otherNode: Node[] = children
      .filter((item) => item.type !== "EmptyNode")
      .map((item, index) => {
        const visited = nodeMap.get(item.id);

        return visited
          ? null
          : buildNode(
              `${root.id}-${index + 1}`,
              {
                ...item,
                conditionPriority:
                  (item.type === "ConditionNode" && children.length) || 0,
              },
              onTransformNode,
            );
      })
      .filter((item) => !!item);

    for (const node of otherNode) {
      nodeMap.set(node.data.id, node);
    }

    resultNode.push(...otherNode);

    emptyNode.map((item) => {
      const visited = nodeMap.get(item.id);

      if (!visited || visited.type !== "EmptyNode") {
        const node = buildNode(`${root.id}-A`, item, onTransformNode);

        nodeMap.set(node.data.id, node);
        resultNode.push(node);
        otherNode.push(node);
      }
    });

    otherNode.map((item) => bfsNode(item));
  };

  // 转换边
  const bfsEdge = (root: Node) => {
    if (expandedEdgeIds.has(root.data.id)) return;
    expandedEdgeIds.add(root.data.id);

    const children: Node[] = (childrenByParentId.get(root.data.id) ?? [])
      .map((item) => nodeMap.get(item.id))
      .filter((item) => !!item);

    children.map((item) => {
      const id = `s${root.id}t${item.id}`;

      if (!edgeMap.has(id)) {
        const edge = buildEdge(
          id,
          { source: root, target: item },
          onTransformEdge,
        );

        edgeMap.set(id, edge);
        resultEdge.push(edge);
      }
      bfsEdge(item);
    });
  };

  bfsNode(root);

  bfsEdge(root);

  return {
    nodes: resultNode as Node<N>[],
    edges: resultEdge as Edge<E>[],
  };
};

export const getTreeNodes = async <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  tree: OnePassFlowNodeDataType[],
  onTransformNode?: OnTransformNodeType<N>,
  onTransformEdge?: OnTransformEdgeType<E>,
): Promise<{ nodes: Node<N>[]; edges: Edge<E>[] }> => {
  const result = buildTreeNodes<N, E>(tree, onTransformNode, onTransformEdge);

  const { nodes, edges } = await getLayout<N, E>(result.nodes, result.edges);

  return { nodes, edges };
};
