import { Edge, Node, ReactFlowProps } from "@xyflow/react";

// TODO: 后续会按实际情况进行调整
export type OnePassFlowRefType = {
  data: any[];
  handleUpdate: (nodes: Node[], edges: Edge[]) => void;
};

export interface IOnePassFlowProps extends Omit<ReactFlowProps, "height"> {
  flowRef?: React.RefObject<OnePassFlowRefType>;
}

export interface IUseStoreProps extends IOnePassFlowProps {}

export type OnePassFlowDataType = {
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
