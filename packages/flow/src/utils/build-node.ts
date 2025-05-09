import {
  Node,
  OnePassFlowNodeDataType,
  OnTransformNodeType,
} from "../types/one-pass-flow-types";

export const buildNode = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
>(
  id: string,
  data: OnePassFlowNodeDataType,
  onTransformNode?: OnTransformNodeType<N>,
): Node => {
  const rest = onTransformNode && onTransformNode(id, data);

  return {
    id,
    type: data.type,
    ...rest,
    position: rest?.position ?? { x: 0, y: 0 },
    data: rest?.data ?? data,
  };
};
