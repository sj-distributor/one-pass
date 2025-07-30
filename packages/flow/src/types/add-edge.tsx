import { ReactNode } from "react";

import { Edge, EdgeComponentType } from "./one-pass-flow-types";

export interface IAddEdgeProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  edge: EdgeComponentType<T>;
  open?: boolean;
  isCondition?: boolean;
  isEnd?: boolean;
  addButtonPosition?: (edge: EdgeComponentType<T>) => { x: number; y: number };
  onOpenChange?: (open?: boolean) => void;
  renderEdgeLabel?: (
    edge: EdgeComponentType<T>,
    addButtonNode: (
      translateX: number,
      translateY: number,
      openType: "normal" | "edgeLabel",
      filter?: string[],
    ) => ReactNode,
  ) => ReactNode;
  renderForm?: (props: {
    openType: "normal" | "edgeLabel";
    type: "ConditionNode" | "ApproverNode" | "CcRecipientNode" | string;
    data: Edge<T>["data"];
    onClose: (value: boolean) => void;
  }) => ReactNode;
}
