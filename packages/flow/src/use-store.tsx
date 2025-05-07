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
export const useStore = <
  N extends Record<string, unknown> = Record<string, unknown>,
  E extends Record<string, unknown> = Record<string, unknown>,
>(
  props: IUseStoreProps<N, E>,
  ref?: ForwardedRef<OnePassFlowRefType<N, E>>,
) => {
  const { onTransformNode, onTransformEdge } = props;

  const [nodes, setNodes, onNodeChange] = useNodesState<Node<N>>([]);

  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge<E>>([]);

  const handleUpdate = (nodes: Node<N>[], edges: Edge<E>[]) => {
    setNodes(nodes);
    setEdges(edges);
  };

  const handleSetData = (data: OnePassFlowNodeDataType[]) => {
    const { nodes, edges } = getTreeNodes<N, E>(
      data,
      onTransformNode,
      onTransformEdge,
    );

    setNodes(nodes);
    setEdges(edges);
  };

  useImperativeHandle(ref, () => ({
    nodes,
    edges,
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
