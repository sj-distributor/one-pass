import { useMount } from "ahooks";
import {
  ONE_PASS_FLOW_DEFAULT_NODE_TYPES,
  OnePassFlow,
  OnePassFlowRefType,
} from "one-pass-flow";
import { useRef } from "react";

import data from "./data.json";

export const Demo = () => {
  const flowRef = useRef<OnePassFlowRefType>(null);

  useMount(() => {
    flowRef.current?.handleSetData(data);
  });

  return (
    <div className="text-center h-screen">
      <OnePassFlow
        flowRef={flowRef}
        nodeTypes={ONE_PASS_FLOW_DEFAULT_NODE_TYPES}
      />
    </div>
  );
};
