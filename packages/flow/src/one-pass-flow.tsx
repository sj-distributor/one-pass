import "@xyflow/react/dist/style.css";

import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { omit } from "ramda";
import React, { ForwardedRef } from "react";

import { Approver } from "./components/approver/approver";
import { Condition } from "./components/condition/condition";
import { End } from "./components/end/end";
import { Initiator } from "./components/initiator/initiator";
import { Recipient } from "./components/recipent/recipent";
import {
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

// TODO: 暂无引擎设计无法支撑增删改
// export const ONE_PASS_FLOW_DEFAULT_EDGE_TYPES = {
//   AddEdge: (rest: EdgeComponentType) => <AddEdge edge={rest} />,
//   ConditionEdge: (rest: EdgeComponentType) => (
//     <AddEdge edge={rest} isCondition />
//   ),
//   EndEdge: (rest: EdgeComponentType) => (
//     <AddEdge
//       edge={rest}
//       isEnd
//       renderEdgeLabel={(edge, addButton) =>
//         addButton(edge.targetX, edge.targetY - 20, ["ConditionNode"])
//       }
//     />
//   ),
// };

export const Flow = React.forwardRef(
  (props: IOnePassFlowProps, ref?: ForwardedRef<OnePassFlowRefType>) => {
    const { nodes, edges } = useStore(props, ref);

    return (
      <ReactFlow
        {...omit(["flowRef", "onTransformNode", "onTransformEdge"], props)}
        nodes={nodes}
        edges={edges}
      />
    );
  },
);

export const OnePassFlow = (props: IOnePassFlowProps) => (
  <ReactFlowProvider>
    <Flow {...props} ref={props.flowRef} />
  </ReactFlowProvider>
);
