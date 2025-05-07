import { useMount } from "ahooks";
import {
  AddEdge,
  EdgeComponentType,
  EdgeTypes,
  ONE_PASS_FLOW_DEFAULT_NODE_TYPES,
  OnePassFlow,
  OnePassFlowEdgeDataType,
  OnePassFlowNodeDataType,
  OnePassFlowRefType,
} from "one-pass-flow";
import { useRef } from "react";

import data from "./data.json";

const EdgesType: EdgeTypes = {
  AddEdge: (rest) => <AddEdge edge={rest} />,
  ConditionEdge: (rest) => (
    <AddEdge
      edge={rest}
      isCondition
      // renderForm={(type, data, onClose) => (
      //   <div
      //     className=" text-purple-400 fixed "
      //     onClick={() => {
      //       onClose();
      //     }}
      //   >
      //     {"AAAA"}
      //   </div>
      // )}
    />
  ),
  EndEdge: (rest: EdgeComponentType) => (
    <AddEdge
      edge={rest}
      isEnd
      addButtonPosition={(edge) => ({
        x: edge.targetX,
        y: (edge.targetY + edge.sourceY) / 2,
      })}
      // renderEdgeLabel={(edge, addButton) =>
      //   ((edge.data?.parentIds as Array<any>)?.length ?? 0) > 1 &&
      //   addButton(edge.targetX, edge.targetY - 20, ["ConditionNode"])
      // }
    />
  ),
};

export const Demo = () => {
  const flowRef =
    useRef<
      OnePassFlowRefType<
        OnePassFlowNodeDataType & { onEdite?: () => void },
        OnePassFlowEdgeDataType
      >
    >(null);

  useMount(() => {
    flowRef.current?.handleSetData(data);
  });

  return (
    <div className="text-center h-screen">
      <OnePassFlow<OnePassFlowNodeDataType>
        flowRef={flowRef}
        nodeTypes={ONE_PASS_FLOW_DEFAULT_NODE_TYPES}
        edgeTypes={EdgesType}
      />
    </div>
  );
};
