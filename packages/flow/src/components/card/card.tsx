import "./card.css";

import { Handle, NodeProps, Position } from "@xyflow/react";
import { useBoolean } from "ahooks";
import React from "react";

import type { ICardProps } from "../../types/card-types";
import type { Node } from "../../types/one-pass-flow-types";
import IconFont from "../iconfonts";
export const Card = React.memo((props: ICardProps) => {
  const {
    data,
    hiddenDescription,
    allowCopy,
    allowDelete,
    className,
    renderForm,
  } = props;

  const [open, setOpen] = useBoolean(false);

  const { name, description, type } = data;

  const getCardStatusClassName = (status?: "error" | "warning" | "success") => {
    switch (status) {
      case "error":
        return "one-pass-card-error";
      case "warning":
        return "one-pass-card-warning";
      default:
        return "";
    }
  };

  const renderDescription = () => {
    if (!description) return;

    if (type === "ConditionNode") {
      const descriptions = description.split("####");

      return descriptions.map((item) => (
        <div key={item} className="break-words">
          <span>{item}</span>
          <br />
        </div>
      ));
    }

    return (
      <div className="overflow-hidden whitespace-nowrap text-ellipsis">
        {description}
      </div>
    );
  };

  return (
    <>
      <div
        className={`one-pass-card-default ${className ?? ""} ${getCardStatusClassName(data.status)}`}
      >
        <div className="one-pass-card-title">
          {name}
          <div className="one-pass-card-button nodrag">
            {/* TODO: 确认方法是不是要从data入 */}
            {allowCopy && (
              <IconFont
                name="a-_duplicate_5"
                // onClick={() => onCopy && onCopy(props)}
              />
            )}
            {allowDelete && (
              <IconFont
                className="cursor-pointer ml-4"
                name="close"
                color={"#fff"}
                // onClick={() => onDelete && onDelete(props)}
              />
            )}
          </div>
        </div>
        <div
          className={`one-pass-card-content ${hiddenDescription ? "one-pass-card-empty-content" : ""}`}
          onClick={() => setOpen.setTrue()}
        >
          {!hiddenDescription &&
            (renderDescription() || (
              <span className="one-pass-card-placeholder">待選擇</span>
            ))}
        </div>
      </div>
      <Handle
        type="target"
        style={{ opacity: 0, marginTop: -4 }}
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
      {open && renderForm && renderForm()}
    </>
  );
});

export const DEFAULT_NODES_TYPES = {
  InitiatorNode: (rest: NodeProps<Node>) => (
    <Card
      {...rest}
      hiddenDescription
      targetPosition={undefined}
      className="one-pass-card-initiator"
    />
  ),
  ApproverNode: (rest: NodeProps<Node>) => (
    <Card {...rest} className="one-pass-card-approver" allowDelete />
  ),
  CcRecipientNode: (rest: NodeProps<Node>) => (
    <Card {...rest} className="one-pass-card-cc-recipient" allowDelete />
  ),
  ConditionNode: (rest: NodeProps<Node>) => (
    <Card
      {...rest}
      className="one-pass-card-condition"
      // allowCopy={!(rest.data.setting as ConditionDateSettingType)?.isDefault}
      // allowDelete={!(rest.data.setting as ConditionDateSettingType)?.isDefault}
    />
  ),
  // End,
};
