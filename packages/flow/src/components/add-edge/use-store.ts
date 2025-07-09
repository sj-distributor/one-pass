import { getSmoothStepPath } from "@xyflow/react";
import { useState } from "react";

import { IAddEdgeProps } from "../../types/add-edge";

export const useStore = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: IAddEdgeProps<T>,
) => {
  const { edge, isCondition, isEnd, addButtonPosition } = props;

  const isFromEmptyNode = edge.data?.source?.type === "EmptyNode";

  const isToEmptyNode = edge.data?.target?.type === "EmptyNode";

  const [type, setType] = useState<string>("");

  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    ...edge,
    centerY:
      isFromEmptyNode && isCondition
        ? edge.sourceY + 40
        : isEnd
          ? edge.targetY - 50
          : undefined,
    borderRadius: 16,
  });

  const open = props.open ?? formOpen;

  const handleOpenChange = props.onOpenChange ?? setFormOpen;

  const translateX =
    ((addButtonPosition && addButtonPosition(edge).x) ?? (isEnd || isCondition))
      ? edge.sourceX
      : labelX;

  const translateY = isToEmptyNode
    ? labelY - 40
    : isFromEmptyNode
      ? edge.sourceY
      : ((addButtonPosition && addButtonPosition(edge).y) ??
        (isCondition ? edge.sourceY + 20 : isEnd ? labelY - 25 : labelY));

  return {
    open,
    edgePath,
    isFromEmptyNode,
    isToEmptyNode,
    labelX,
    labelY,
    translateX,
    translateY,
    type,
    setType,
    handleOpenChange,
  };
};
