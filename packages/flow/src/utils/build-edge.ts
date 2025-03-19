import { MarkerType } from "@xyflow/react";

import { Edge, OnePassFlowEdgeDataType } from "../types";

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
  source: string,
  target: string,
  data: OnePassFlowEdgeDataType,
): Edge => ({
  id,
  source,
  target,
  focusable: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  type: getEdgeType(data),
  data: {
    ...data,
    status: undefined,
  },
});
