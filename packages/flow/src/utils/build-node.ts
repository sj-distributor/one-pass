import { Node, OnePassFlowNodeDataType } from "../types";

export const buildNode = (
  id: string,
  data: OnePassFlowNodeDataType,
  draggable?: boolean,
): Node => ({
  id,
  position: { x: 0, y: 0 },
  data,
  type: data.type,
  draggable,
});
