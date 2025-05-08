import {
  EdgeChange,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { ForwardedRef, useEffect, useImperativeHandle } from "react";

import {
  Edge,
  IUseStoreProps,
  Node,
  OnePassFlowNodeDataType,
  OnePassFlowRefType,
} from "./types";
import { getLayout, getTreeNodes } from "./utils";
export const useStore = <
  N extends Record<string, unknown> = Record<string, unknown>,
  E extends Record<string, unknown> = Record<string, unknown>,
>(
  props: IUseStoreProps<N, E>,
  ref?: ForwardedRef<OnePassFlowRefType<N, E>>,
) => {
  const { onTransformNode, onTransformEdge, initByCardHeight } = props;

  const [nodes, setNodes, onNodeChange] = useNodesState<Node<N>>([]);

  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge<E>>([]);

  const { getNodes } = useReactFlow();

  const nodesInitialized = useNodesInitialized({
    includeHiddenNodes: initByCardHeight?.includeHiddenNodes ?? false,
  });

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
  }));

  const handleOnNodesChange: OnNodesChange = (changes) => {
    onNodeChange(
      (props?.onNodesChange?.(changes) ?? changes) as NodeChange<Node<N>>[],
    );
  };

  const handleOnEdgesChange: OnEdgesChange = (changes) => {
    onEdgeChange(
      (props?.onEdgesChange?.(changes) ?? changes) as EdgeChange<Edge<E>>[],
    );
  };

  useEffect(() => {
    if (initByCardHeight && nodesInitialized) {
      const nodes = getNodes() as Node<N>[];

      setNodes(getLayout(nodes));
    }
  }, [getNodes, initByCardHeight, nodesInitialized, setNodes]);

  return {
    nodes,
    edges,
    handleOnNodesChange,
    handleOnEdgesChange,
  };
};
