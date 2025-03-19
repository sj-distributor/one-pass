import "./end.css";

import { Handle, Position } from "@xyflow/react";
import React from "react";

import { CardType } from "../../types/card-types";
export const End = (props?: CardType) => {
  return (
    <div className={props?.className ?? "one-pass-flow-end"}>
      <Handle
        type="target"
        style={{ marginTop: -4, opacity: 0 }}
        position={Position.Top}
        isConnectable={false}
      />
      结束
    </div>
  );
};
