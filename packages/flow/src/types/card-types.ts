import { NodeProps } from "@xyflow/react";
import { ReactNode } from "react";

import { Node } from "./one-pass-flow-types";

export interface ICardProps extends NodeProps<Node> {
  allowCopy?: boolean;
  allowDelete?: boolean;
  className?: string;
  hiddenDescription?: boolean;
  // TODO: 待确认renderForm还需要什么
  renderForm?: () => ReactNode;
}
