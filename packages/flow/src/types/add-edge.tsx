import { ReactNode } from "react";

import { EdgeComponentType } from "./one-pass-flow-types";

export interface IAddEdgeProps {
  edge: EdgeComponentType;
  open?: boolean;
  isCondition?: boolean;
  addButtonPosition?: { x: number; y: number };
  onOpenChange?: (open?: boolean) => void;
  renderEdgeLabel?: (edge: EdgeComponentType) => ReactNode;
  renderForm?: (
    type: "ConditionNode" | "ApproverNode" | "CcRecipientNode" | string,
    edgeData: EdgeComponentType["data"],
    onClose: () => void,
  ) => ReactNode;
}
