import {
  Edge as XyflowEdge,
  EdgeProps as XyflowEdgeProps,
  EdgeTypes as XyflowEdgeTypes,
  Node as XyflowNode,
  NodeProps as XyflowNodeProps,
  NodeTypes as XyflowNodeTypes,
  ReactFlowProps,
} from "@xyflow/react";
import { ComponentType, JSX, RefObject } from "react";

export type OnePassFlowNodeDataType = {
  [key: string]: any;
  name?: string;
  id: string;
  // TODO: 可能会移除
  parentId: string;
  parentIds?: string[];
  type: string;
  sortNumber?: number;
  description?: string;
  status?: "error" | "warning" | "success";
  conditionPriority?: number;
  formId?: string;
};

export type Node<T extends Record<string, unknown> = Record<string, unknown>> =
  XyflowNode<OnePassFlowNodeDataType & T>;

export type OnePassFlowEdgeDataType<
  T extends Record<string, unknown> = OnePassFlowNodeDataType,
> = {
  source: Node<T>;
  target: Node<T>;
  status?: "error" | "warning" | "success";
  message?: string;
};

export type Edge<T extends Record<string, unknown> = Record<string, unknown>> =
  XyflowEdge<OnePassFlowEdgeDataType & T>;

export type NodeComponentType<
  T extends Record<string, unknown> = OnePassFlowNodeDataType,
> = XyflowNodeProps<Node<T>> & {
  type: any;
};

export type EdgeComponentType<
  T extends Record<string, unknown> = OnePassFlowEdgeDataType,
> = XyflowEdgeProps<Edge<T>> & {
  type: any;
};

export type NodeTypes<
  T extends Record<string, unknown> = OnePassFlowNodeDataType,
> = XyflowNodeTypes & {
  InitiatorNode: ComponentType<NodeComponentType<T>>;
  ConditionNode: ComponentType<NodeComponentType<T>>;
  ApproverNode: ComponentType<NodeComponentType<T>>;
  CcRecipientNode: ComponentType<NodeComponentType<T>>;
  EndNode: ComponentType<NodeComponentType<T>>;
};

export type EdgeTypes<
  T extends Record<string, unknown> = OnePassFlowEdgeDataType,
> = XyflowEdgeTypes & {
  AddEdge: ComponentType<EdgeComponentType<T>>;
  ConditionEdge: ComponentType<EdgeComponentType<T>>;
  EndEdge: ComponentType<EdgeComponentType<T>>;
};

// TODO: 后续会按实际情况进行调整
export type OnePassFlowRefType<
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
> = {
  nodes: Node<N>[];
  edges: Edge<E>[];
  handleSetData: (data: OnePassFlowNodeDataType[]) => void;
  handleUpdate: (nodes: Node<N>[], edges: Edge<E>[]) => void;
};

export type FlowComponentType = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  props: IOnePassFlowProps<N, E> & {
    ref?: RefObject<OnePassFlowRefType<N, E>>;
  },
) => JSX.Element;

export type OnTransformNodeType = <
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
>(
  id: string,
  data: OnePassFlowNodeDataType,
) => Partial<Node<N>>;

export type OnTransformEdgeType = <
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
>(
  id: string,
  data: OnePassFlowEdgeDataType,
) => Partial<Edge<E>>;

export interface IOnePassFlowProps<
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
> extends Omit<ReactFlowProps, "height"> {
  nodeTypes: NodeTypes<N>;
  edgeTypes: EdgeTypes<E>;
  flowRef?: React.RefObject<OnePassFlowRefType<N, E>>;
  onTransformNode?: OnTransformNodeType;
  onTransformEdge?: OnTransformEdgeType;
  initByCardHeight?: { includeHiddenNodes?: boolean };
}

export interface IUseStoreProps<
  N extends Record<string, unknown> = OnePassFlowNodeDataType,
  E extends Record<string, unknown> = OnePassFlowEdgeDataType,
> extends IOnePassFlowProps<N, E> {}
