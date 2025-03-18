import "@xyflow/react/dist/style.css";

import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import React, { ForwardedRef } from "react";

import { DEFAULT_NODES_TYPES } from "./components/card/card";
import { IOnePassFlowProps, OnePassFlowRefType } from "./types";
import { useStore } from "./use-store";

export const Flow = React.forwardRef(
  (props: IOnePassFlowProps, ref?: ForwardedRef<OnePassFlowRefType>) => {
    const { nodes, edges } = useStore(props, ref);

    return (
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={DEFAULT_NODES_TYPES} />
    );
  },
);

export const OnePassFlow = (props: IOnePassFlowProps) => (
  <ReactFlowProvider>
    <Flow {...props} ref={props.flowRef} />
  </ReactFlowProvider>
);
