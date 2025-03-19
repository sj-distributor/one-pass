import { useNodesState } from "@xyflow/react";
import { ForwardedRef, useImperativeHandle, useState } from "react";

import {
  Edge,
  IUseStoreProps,
  Node,
  OnePassFlowNodeDataType,
  OnePassFlowRefType,
} from "./types";
import { getTreeNodes } from "./utils";
export const useStore = (
  props: IUseStoreProps,
  ref?: ForwardedRef<OnePassFlowRefType>,
) => {
  const [nodes, setNodes] = useNodesState<Node>([]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const handleUpdate = (nodes: Node[], edges: Edge[]) => {
    setNodes(nodes);
    setEdges(edges);
  };

  const handleSetData = (data: OnePassFlowNodeDataType[]) => {
    const { nodes, edges } = getTreeNodes(data);

    setNodes(nodes);
    setEdges(edges);
  };

  useImperativeHandle(ref, () => ({
    data: nodes,
    handleUpdate,
    handleSetData,
  }));

  return {
    nodes,
    edges,
  };
};
