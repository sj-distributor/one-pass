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

export const getTreeNodes = async <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  tree: OnePassFlowNodeDataType[],
  onTransformNode?: OnTransformNodeType<N>,
  onTransformEdge?: OnTransformEdgeType<E>,
): Promise<{ nodes: Node<N>[]; edges: Edge<E>[] }> => {
  if (!tree.length) return { nodes: [], edges: [] };
  const root = buildNode("1", tree[0], onTransformNode);

  const end = buildNode(
    "EndNode",
    {
      id: "End",
      parentId: "",
      type: "EndNode",
    },
    onTransformNode,
  );

  const resultNode: Node[] = [root];

  const resultEdge: Edge[] = [];

  // 转换节点
  const bfsNode = (root: Node) => {
    const children = tree.filter((item) =>
      item.parentIds?.includes(root.data.id),
    );

    const emptyNode: OnePassFlowNodeDataType[] = children.filter(
      (item) => item.type === "EmptyNode",
    );

    const otherNode: Node[] = children
      .filter((item) => item.type !== "EmptyNode")
      .map((item, index) =>
        buildNode(
          `${root.id}-${index + 1}`,
          {
            ...item,
            conditionPriority:
              (item.type === "ConditionNode" && children.length) || 0,
          },
          onTransformNode,
        ),
      );

    resultNode.push(...otherNode);

    emptyNode.map((item) => {
      const visited = resultNode.find(
        (node) => node.type === "EmptyNode" && node.data.id === item.id,
      );

      if (!visited) {
        resultNode.push(buildNode(`${root.id}-A`, item, onTransformNode));
        otherNode.push(buildNode(`${root.id}-A`, item, onTransformNode));
      }
    });

    otherNode.map((item) => bfsNode(item));
  };

  // 转换边
  const bfsEdge = (root: Node) => {
    const children: Node[] = tree
      .filter((item) => item.parentIds?.includes(root.data.id))
      ?.map((item) => resultNode.find((node) => node.data.id === item.id))
      .filter((item) => !!item);

    if (!children.length) {
      const id = `s${root.id}tEnd`;

      const visited = resultEdge.find((edge) => edge.id === id);

      !visited &&
        resultEdge.push(
          buildEdge(id, { source: root, target: end }, onTransformEdge),
        );
    }

    children.map((item) => {
      const id = `s${root.id}t${item.id}`;

      const visited = resultEdge.find((edge) => edge.id === id);

      !visited &&
        resultEdge.push(
          buildEdge(id, { source: root, target: item }, onTransformEdge),
        );
      bfsEdge(item);
    });
  };

  bfsNode(root);

  bfsEdge(root);

  resultNode.push(end);

  const { nodes, edges } = await getLayout<N, E>(
    resultNode as Node<N>[],
    resultEdge as Edge<E>[],
  );

  return {
    nodes,
    edges,
  };
};
