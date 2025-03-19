import {
  Edge as XyflowEdge,
  Node as XyflowNode,
  NodeProps as XyflowNodeProps,
  NodeTypes as XyflowNodeTypes,
  ReactFlowProps,
} from "@xyflow/react";
import { ComponentType } from "react";

export type OnePassFlowNodeDataType = {
  name?: string;
  id: string;
  // TODO: 可能会移除
  parentId: string;
  parentIds?: string[];
  //   handler?: null;
  type: string;
  //   expressionInit?: null;
  sortNumber?: number;
  description?: string;
  status?: "error" | "warning" | "success";
  //   setting?: ConditionDateSettingType | ApproverSettingType;
  conditionPriority?: number;
  formId?: string;
  //   formSetting?: IDataType[];
};

export type Node<T extends Record<string, unknown> = Record<string, unknown>> =
  XyflowNode<OnePassFlowNodeDataType & T>;

export type OnePassFlowEdgeDataType = {
  source?: Node;
  target?: Node;
  status?: "error" | "warning" | "success";
  message?: string;
};

export type Edge<T extends Record<string, unknown> = Record<string, unknown>> =
  XyflowEdge<OnePassFlowEdgeDataType & T>;

export type NodeComponentType = XyflowNodeProps<Node> & {
  type: any;
};

export type NodeTypes = XyflowNodeTypes & {
  InitiatorNode: ComponentType<NodeComponentType>;
  ConditionNode: ComponentType<NodeComponentType>;
  ApproverNode: ComponentType<NodeComponentType>;
  CcRecipientNode: ComponentType<NodeComponentType>;
  EndNode: ComponentType<NodeComponentType>;
};

// TODO: 后续会按实际情况进行调整
export type OnePassFlowRefType = {
  data: any[];
  handleSetData: (data: OnePassFlowNodeDataType[]) => void;
  handleUpdate: (nodes: Node[], edges: Edge[]) => void;
};

export interface IOnePassFlowProps extends Omit<ReactFlowProps, "height"> {
  nodeTypes: NodeTypes;
  flowRef?: React.RefObject<OnePassFlowRefType>;
}

export interface IUseStoreProps extends IOnePassFlowProps {}
