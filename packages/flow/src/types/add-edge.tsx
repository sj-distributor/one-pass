import { ReactNode } from "react";

import { EdgeComponentType } from "./one-pass-flow-types";

export interface IAddEdgeProps {
  edge: EdgeComponentType;
  open?: boolean;
  isCondition?: boolean;
  isEnd?: boolean;
  addButtonPosition?: (edge: EdgeComponentType) => { x: number; y: number };
  onOpenChange?: (open?: boolean) => void;
  renderEdgeLabel?: (
    edge: EdgeComponentType,
    addButtonNode: (
      translateX: number,
      translateY: number,
      filter?: string[],
    ) => ReactNode,
  ) => ReactNode;
  renderForm?: (
    type: "ConditionNode" | "ApproverNode" | "CcRecipientNode" | string,
    edgeData: EdgeComponentType["data"],
    onClose: () => void,
  ) => ReactNode;
}
