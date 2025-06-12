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
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
  OnePassFlowRefType,
} from "./types";
import { getLayout, getTreeNodes } from "./utils";
import { getEmptyNode } from "./utils/get-empty-nodes";
export const useStore = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  props: IUseStoreProps<N, E>,
  ref?: ForwardedRef<OnePassFlowRefType<N, E>>,
) => {
  const { onTransformNode, onTransformEdge, initByCardHeight } = props;

  const [nodes, setNodes, onNodeChange] = useNodesState<Node<N>>([]);

  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge<E>>([]);

  const { getNodes, getEdges, setNodes: updateNodes } = useReactFlow();

  const nodesInitialized = useNodesInitialized({
    includeHiddenNodes: initByCardHeight?.includeHiddenNodes ?? false,
  });

  const handleUpdate = (nodes: Node<N>[], edges: Edge<E>[]) => {
    setNodes(nodes);
    setEdges(edges);
  };

  const handleSetData = async (data: OnePassFlowNodeDataType[]) => {
    if (!data.length) {
      setNodes([]);
      setEdges([]);

      return;
    }
    const tranformData = getEmptyNode(data);

    const result = await getTreeNodes<N, E>(
      tranformData,
      onTransformNode,
      onTransformEdge,
    );

    setNodes(result.nodes);
    setEdges(result.edges);
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
      // WHY? Because the nodes are not updated immediately when the handleSetData is called,
      setTimeout(() => {
        getLayout(getNodes() as Node<N>[], getEdges() as Edge<E>[]).then(
          (result) => {
            updateNodes(result.nodes);
          },
        );
      }, 100);
    }
  }, [getEdges, getNodes, initByCardHeight, nodesInitialized, updateNodes]);

  return {
    nodes,
    edges,
    handleOnNodesChange,
    handleOnEdgesChange,
  };
};
