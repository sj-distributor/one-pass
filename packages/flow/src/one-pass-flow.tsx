import "@xyflow/react/dist/style.css";

import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import React, { ForwardedRef } from "react";

import { AddEdge } from "./components/add-edge/add-edge";
import { Approver } from "./components/approver/approver";
import { Condition } from "./components/condition/condition";
import { End } from "./components/end/end";
import { Initiator } from "./components/initiator/initiator";
import { Recipient } from "./components/recipent/recipent";
import {
  EdgeComponentType,
  IOnePassFlowProps,
  NodeComponentType,
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

export const ONE_PASS_FLOW_DEFAULT_EDGE_TYPES = {
  AddEdge: (rest: EdgeComponentType) => <AddEdge edge={rest} />,
  ConditionEdge: (rest: EdgeComponentType) => <AddEdge edge={rest} />,
  EndEdge: (rest: EdgeComponentType) => <AddEdge edge={rest} />,
};

export const Flow = React.forwardRef(
  (props: IOnePassFlowProps, ref?: ForwardedRef<OnePassFlowRefType>) => {
    const { nodes, edges } = useStore(props, ref);

    const { nodeTypes } = props;

    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={ONE_PASS_FLOW_DEFAULT_EDGE_TYPES}
      />
    );
  },
);

export const OnePassFlow = (props: IOnePassFlowProps) => (
  <ReactFlowProvider>
    <Flow {...props} ref={props.flowRef} />
  </ReactFlowProvider>
);
