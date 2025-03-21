import { getSmoothStepPath } from "@xyflow/react";

import { IAddEdgeProps } from "../../types/add-edge";

export const useStore = (props: IAddEdgeProps) => {
  const { edge } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    ...edge,
    // centerY: isEnd ? edge.targetY - 40 : undefined,
    borderRadius: 16,
  });

  const translateX = labelX;

  const translateY = labelY;

  return { edgePath, labelX, labelY, translateX, translateY };
};
