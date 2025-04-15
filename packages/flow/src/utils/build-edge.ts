import { MarkerType } from "@xyflow/react";

import {
  Edge,
  OnePassFlowEdgeDataType,
  OnTransformEdgeType,
} from "../types/one-pass-flow-types";

const getEdgeType = (data?: OnePassFlowEdgeDataType) => {
  if ((data?.target?.data.parentIds?.length ?? 1) > 1) return "EndEdge";

  switch (data?.target?.type) {
    case "ConditionNode":
      return "ConditionEdge";
    case "EndNode":
      return "EndEdge";
    default:
      return "AddEdge";
  }
};

export const buildEdge = (
  id: string,
  data: OnePassFlowEdgeDataType,
  onTransformEdge?: OnTransformEdgeType,
): Edge => {
  const rest = onTransformEdge && onTransformEdge(id, data);

  return {
    id,
    source: data.source.id,
    target: data.target.id,
    focusable: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    type: getEdgeType(data),
    data: {
      ...data,
      status: undefined,
    },
    ...rest,
  };
};
