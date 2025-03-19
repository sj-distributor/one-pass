import { ReactNode } from "react";

import { Node, NodeComponentType } from "./one-pass-flow-types";

export interface IRenderFormProps {
  data: Node["data"];
  handleOpen: (value: boolean) => void;
}

export type CardType = NodeComponentType & {
  allowCopy?: boolean;
  allowDelete?: boolean;
  className?: string;
  hiddenDescription?: boolean;
  renderForm?: (props: IRenderFormProps) => ReactNode;
};
