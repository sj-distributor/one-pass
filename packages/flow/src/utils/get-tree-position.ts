import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";

import {
  Edge,
  Node,
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
} from "../types/one-pass-flow-types";

const elk = new ELK();

export const getLayout = async <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  nodes: Node<N>[],
  edges: Edge<E>[],
): Promise<{ nodes: Node<N>[]; edges: Edge<E>[] }> => {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
      "elk.layered.considerModelOrder.strategy": "PREFER_NODES",
      "elk.layered.layering.strategy": "LONGEST_PATH_SOURCE",
      "elk.layered.spacing.nodeNodeBetweenLayers": "88",
      "elk.spacing.nodeNode": "32",
    },
    children: nodes.map((node) => ({
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      width: node?.width ?? 200,
      height: node?.height ?? 88,
    })),
    edges,
  };

  const result = await elk.layout(graph as unknown as ElkNode);

  return {
    edges,
    nodes:
      (result?.children?.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })) as Node<N>[]) || [],
  };
};
