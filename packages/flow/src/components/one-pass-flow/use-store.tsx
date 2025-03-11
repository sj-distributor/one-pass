import { type Edge, type Node, useNodesState } from "@xyflow/react";
import { ForwardedRef, useImperativeHandle, useState } from "react";

import { IUseStoreProps, OnePassFlowRefType } from "./types";
export const useStore = (
  props: IUseStoreProps,
  ref?: ForwardedRef<OnePassFlowRefType>,
) => {
  const [nodes, setNodes] = useNodesState<Node>([]);

  const [edges, setEdges] = useState<Edge[]>([]);

  // const { getNodes } = useReactFlow();

  // TODO: 更新数据
  const handleUpdate = (nodes: Node[], edges: Edge[]) => {
    setNodes(nodes);
    setEdges(edges);
  };

  useImperativeHandle(ref, () => ({
    data: nodes,
    handleUpdate,
  }));

  return {
    nodes,
    edges,
  };
};
