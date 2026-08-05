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
import { ForwardedRef, useEffect, useImperativeHandle, useState } from "react";

import {
  Edge,
  IUseStoreProps,
  Node,
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
  OnePassFlowRefType,
} from "./types";
import { buildTreeNodes, getLayout } from "./utils";
import { convertLayoutToDAG } from "./utils/get-empty-nodes";
export const useStore = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  props: IUseStoreProps<N, E>,
  ref?: ForwardedRef<OnePassFlowRefType<N, E>>,
) => {
  const {
    onTransformNode,
    onTransformEdge,
    onLayoutingChange,
    initByCardHeight,
  } = props;

  const shouldLayoutByCardHeight = !!initByCardHeight;

  const includeHiddenNodes = initByCardHeight?.includeHiddenNodes ?? false;

  const [nodes, setNodes, onNodeChange] = useNodesState<Node<N>>([]);

  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge<E>>([]);

  const { getNodes, getEdges, setNodes: updateNodes } = useReactFlow();

  const nodesInitialized = useNodesInitialized({
    includeHiddenNodes,
  });

  const [layouting, setLayouting] = useState(false);

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

    const tranformData = convertLayoutToDAG(data);

    // Step 1: 同步构建节点/边，立即渲染（默认位置），避免 ELK 阻塞白屏
    const preliminary = buildTreeNodes<N, E>(
      tranformData,
      onTransformNode,
      onTransformEdge,
    );

    setNodes(preliminary.nodes);
    setEdges(preliminary.edges);

    if (initByCardHeight) {
      return;
    }

    // Step 2: 异步跑 ELK 布局，完成后更新位置
    setLayouting(true);
    onLayoutingChange?.(true);

    try {
      const { nodes: layoutedNodes } = await getLayout<N, E>(
        preliminary.nodes,
        preliminary.edges,
      );

      setNodes(layoutedNodes);
    } finally {
      setLayouting(false);
      onLayoutingChange?.(false);
    }
  };

  useImperativeHandle(ref, () => ({
    nodes,
    edges,
    layouting,
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
    if (shouldLayoutByCardHeight && nodesInitialized) {
      let cancelled = false;

      const tryLayout = () => {
        if (cancelled) return;

        const currentNodes = getNodes() as Node<N>[];

        // 确保所有非 EmptyNode 节点都已 measured
        const allMeasured = currentNodes.every(
          (n) =>
            n.type === "EmptyNode" || (n.measured?.width && n.measured?.height),
        );

        if (!allMeasured) {
          // measured 还没就绪，等下一帧重试
          requestAnimationFrame(tryLayout);

          return;
        }

        setLayouting(true);
        onLayoutingChange?.(true);

        getLayout(currentNodes, getEdges() as Edge<E>[]).then((result) => {
          if (!cancelled) {
            updateNodes(result.nodes);
            setLayouting(false);
            onLayoutingChange?.(false);
          }
        });
      };

      requestAnimationFrame(tryLayout);

      return () => {
        cancelled = true;
      };
    }
  }, [
    getEdges,
    getNodes,
    nodesInitialized,
    onLayoutingChange,
    shouldLayoutByCardHeight,
    updateNodes,
  ]);

  return {
    nodes,
    edges,
    handleOnNodesChange,
    handleOnEdgesChange,
  };
};
