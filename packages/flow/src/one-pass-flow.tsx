import "@xyflow/react/dist/style.css";

import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { omit } from "ramda";
import React, { ForwardedRef, forwardRef } from "react";

import { Approver } from "./components/approver/approver";
import { Card } from "./components/card/card";
import { Condition } from "./components/condition/condition";
import { End } from "./components/end/end";
import { Initiator } from "./components/initiator/initiator";
import { Recipient } from "./components/recipent/recipent";
import {
  FlowComponentType,
  IOnePassFlowProps,
  NodeComponentType,
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
  OnePassFlowRefType,
} from "./types";
import { useStore } from "./use-store";

export const ONE_PASS_FLOW_DEFAULT_NODE_TYPES = {
  InitiatorNode: (props: NodeComponentType) => <Initiator {...props} />,
  ApproverNode: (props: NodeComponentType) => <Approver {...props} />,
  CcRecipientNode: (props: NodeComponentType) => <Recipient {...props} />,
  ConditionNode: (props: NodeComponentType) => <Condition {...props} />,
  EndNode: (props: NodeComponentType) => <End {...props} />,
};

const ONE_PASS_FLOW_NODE_TYPES = {
  EmptyNode: (props: NodeComponentType) => <Card {...props} />,
};

const FlowInner = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  props: IOnePassFlowProps<N, E>,
  ref?: ForwardedRef<OnePassFlowRefType<N, E>>,
) => {
  const { nodes, edges, handleOnNodesChange, handleOnEdgesChange } = useStore<
    N,
    E
  >(props, ref);

  const { nodeTypes } = props;

  return (
    <ReactFlow
      {...omit(
        ["flowRef", "onTransformNode", "onTransformEdge", "initByCardHeight"],
        props,
      )}
      nodeTypes={{ ...nodeTypes, ...ONE_PASS_FLOW_NODE_TYPES }}
      nodes={nodes}
      edges={edges}
      onNodesChange={handleOnNodesChange}
      onEdgesChange={handleOnEdgesChange}
    />
  );
};

const Flow = forwardRef(FlowInner) as FlowComponentType;

export const OnePassFlow = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  props: IOnePassFlowProps<N, E>,
) => (
  <ReactFlowProvider>
    <Flow<N, E> {...props} ref={props.flowRef} />
  </ReactFlowProvider>
);
