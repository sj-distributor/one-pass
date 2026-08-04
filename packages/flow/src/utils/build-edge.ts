import { MarkerType } from "@xyflow/react";

import {
  Edge,
  OnePassFlowEdgeDataType,
  OnTransformEdgeType,
} from "../types/one-pass-flow-types";

const getEdgeType = (targetType?: string, targetParentIdsLength?: number) => {
  if ((targetParentIdsLength ?? 1) > 1) return "EndEdge";

  switch (targetType) {
    case "ConditionNode":
      return "ConditionEdge";
    case "EndNode":
      return "EndEdge";
    default:
      return "AddEdge";
  }
};

export const buildEdge = <
  T extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  id: string,
  data: OnePassFlowEdgeDataType,
  onTransformEdge?: OnTransformEdgeType<T>,
): Edge => {
  const rest = onTransformEdge && onTransformEdge(id, data);

  const sourceType = data.source?.type;

  const targetType = data.target?.type;

  const targetParentIdsLength = data.target?.data?.parentIds?.length ?? 1;

  const edgeData = {
    sourceType,
    targetType,
    status: undefined,
    source: data.source,
    target: data.target,
  };

  // Keep source/target available for existing render hooks without making ELK
  // clone the full node objects for every edge during layout.
  Object.defineProperties(edgeData, {
    source: {
      enumerable: false,
      value: data.source,
    },
    target: {
      enumerable: false,
      value: data.target,
    },
  });

  return {
    id,
    source: data.source.id,
    target: data.target.id,
    focusable: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    type: getEdgeType(targetType, targetParentIdsLength),
    data: edgeData,
    selectable: false,
    deletable: false,
    ...rest,
  };
};
