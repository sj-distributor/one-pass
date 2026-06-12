import { Handle, Position } from "@xyflow/react";
import React from "react";

const EmptyInner = () => {
  return (
    <div style={{ height: 1, width: 1 }}>
      <Handle
        type="target"
        style={{ opacity: 0, marginTop: 8 }}
        className="one-pass-card-target-handle"
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        className="one-pass-card-source-handle"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
};

export const Empty = React.memo(EmptyInner) as unknown as typeof EmptyInner;
