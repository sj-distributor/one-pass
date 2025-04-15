import { useEdgesState, useNodesState } from "@xyflow/react";
import { ForwardedRef, useImperativeHandle } from "react";

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
  const { onTransformNode, onTransformEdge } = props;

  const [nodes, setNodes, onNodeChange] = useNodesState<Node>([]);

  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);

  const handleUpdate = (nodes: Node[], edges: Edge[]) => {
    setNodes(nodes);
    setEdges(edges);
  };

  const handleSetData = (data: OnePassFlowNodeDataType[]) => {
    const { nodes, edges } = getTreeNodes(
      data,
      onTransformNode,
      onTransformEdge,
    );

    setNodes(nodes);
    setEdges(edges);
  };

  useImperativeHandle(ref, () => ({
    data: nodes,
    handleUpdate,
    handleSetData,
    onNodeChange,
    onEdgeChange,
  }));

  return {
    nodes,
    edges,
  };
};
