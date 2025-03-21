import { ReactNode } from "react";

import { EdgeComponentType } from "./one-pass-flow-types";

export interface IAddEdgeProps {
  edge: EdgeComponentType;
  renderEdgeLabel?: (edge: EdgeComponentType) => ReactNode;
}
