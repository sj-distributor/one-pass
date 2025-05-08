/**
 * @description D3处理树状图，后续将调整为其他算法进行处理
 */
import { aperture, assocPath, equals, slice } from "ramda";

import {
  Edge,
  Node,
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
  OnTransformEdgeType,
  OnTransformNodeType,
} from "../types/one-pass-flow-types";
import { buildNode } from "./build-node";
import { getTreePosition } from "./get-tree-position";
import { transformFlow } from "./transform-flow";

export const getTreeNodes = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  tree: OnePassFlowNodeDataType[],
  onTransformNode?: OnTransformNodeType<N>,
  onTransformEdge?: OnTransformEdgeType<E>,
): { nodes: Node<N>[]; edges: Edge<E>[] } => {
  if (!tree.length) return { nodes: [], edges: [] };

  const resultNodes: Node[] = [];

  const resultEdges: Edge[] = [];

  const EndNode = buildNode(
    "EndNode",
    {
      id: "End",
      parentId: "End",
      type: "EndNode",
    },
    onTransformNode,
  );

  // 所有根节点+结束节点
  const roots = tree
    .filter(
      (item) => (item.parentIds?.length ?? 1) > 1 || equals("0")(item.parentId),
    )
    .map((item, index) =>
      buildNode((index + 1).toString(), item, onTransformNode),
    )
    .concat(EndNode);

  // 添加原始树节点
  resultNodes.push(roots[0]);

  // 分成每一颗树的根节点与结束节点
  const trees: Array<Node[]> = aperture(2, roots);

  trees.map(([start, end]) => {
    const { currentNode, currentEdge } = transformFlow(
      start,
      end,
      tree,
      onTransformNode,
      onTransformEdge,
    );

    // 获取当前树根节点的位置坐标
    const currentRoot = resultNodes.find((item) => item.id === start.id);

    if (!currentRoot) {
      throw new Error("Cannot find the end");
    }

    // 处理结束节点添加多个父节点的parentId逻辑
    if (end.id === "End") {
      const parentIds = currentEdge
        .filter((item) => item.target === "End")
        .map((item) => item.data?.source?.data.id);

      const edges =
        parentIds.length > 1
          ? currentEdge.map((item) =>
              item.target === "End"
                ? assocPath(
                    ["data", "target", "data", "parentIds"],
                    parentIds,
                    item,
                  )
                : item,
            )
          : currentEdge;

      resultEdges.push(...edges);
      currentEdge.map((item) => item.target === "");
    } else {
      resultEdges.push(...currentEdge);
    }

    // 获取该树所有坐标
    const nodes = getTreePosition(currentRoot, end, currentNode);

    resultNodes.push(...slice(1, Infinity, nodes));
  });

  // TODO: 后续修正
  return {
    nodes: resultNodes as Node<N>[],
    edges: resultEdges as Edge<E>[],
  };
};
