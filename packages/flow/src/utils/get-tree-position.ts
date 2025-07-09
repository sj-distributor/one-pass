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
  const heightMap = new Map<number, number>();

  nodes.map((node) => {
    if (node.id === "EndNode") return;
    const id = node.id.split("-").length;

    heightMap.set(
      id,
      Math.max(heightMap.get(id) ?? 0, node.measured?.height ?? 0),
    );
  });

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
      "elk.layered.considerModelOrder.strategy": "PREFER_NODES",
      "elk.layered.layering.strategy": "LONGEST_PATH_SOURCE",
      "elk.layered.spacing.nodeNodeBetweenLayers": "120",
      "elk.spacing.nodeNode": "32",
    },
    children: nodes.map((node) => ({
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      width: node.type === "EmptyNode" ? 1 : (node?.measured?.width ?? 200),
      height:
        node.type === "EmptyNode"
          ? 1
          : heightMap.get(node.id.split("-").length) || 88,
    })),
    edges,
  };

  const result = await elk.layout(graph as unknown as ElkNode);

  const layout = nodes.map((node) => {
    const position = result?.children?.find((item) => item.id === node.id);

    return {
      ...node,
      position: {
        x: position?.x ?? node.position.x,
        y: position?.y ?? node.position.y,
      },
    };
  });

  return {
    edges,
    nodes: layout,
  };
};
