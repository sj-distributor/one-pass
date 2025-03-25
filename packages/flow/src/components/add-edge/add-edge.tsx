import "./add-edge.css";

import { BaseEdge as XyflowBaseEdge, EdgeLabelRenderer } from "@xyflow/react";
import React from "react";

import { IAddEdgeProps } from "../../types/add-edge";
import IconFont from "../iconfonts";
import { useStore } from "./use-store";
export const AddEdge = (props: IAddEdgeProps) => {
  const { edge, renderEdgeLabel, renderForm } = props;

  const { data } = edge;

  const {
    open,
    edgePath,
    translateX,
    translateY,
    type,
    setType,
    handleOpenChange,
  } = useStore(props);

  // TODO: 后续兼容不同的Type
  const options = [
    {
      type: "ConditionNode",
      title: "條件",
      icon: <IconFont size={24} name="a-ome_IconDepartmentIcon" />,
    },
    {
      type: "ApproverNode",
      title: "審批人",
      icon: <IconFont size={24} name="PersonLineIcon_" />,
    },
    {
      type: "CcRecipientNode",
      title: "抄送人",
      icon: <IconFont size={24} name="SendIcon_" />,
    },
  ];

  const renderAddButton = () => (
    // multiple?: boolean
    <div
      className="one-pass-add-edge-button nodrag"
      style={{
        transform: `translate(-50%, -50%) translate(${translateX}px,${translateY}px)`,
      }}
    >
      <IconFont name="add" color={"#605DEC"} />
      <div className="one-pass-add-edge-button-inner">
        <div className="one-pass-add-edge-button-popover">
          <div className="one-pass-add-edge-button-popover-content">
            {options.map((item) => (
              <div
                key={item.type}
                className="one-pass-add-edge-button-popover-item"
                onClick={() => {
                  // setMultiple.set(!!multiple);
                  handleOpenChange(true);
                  setType(item.type);
                }}
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <XyflowBaseEdge
        id={edge.id}
        path={edgePath}
        markerEnd={edge.markerEnd}
        style={edge.style}
      />
      <EdgeLabelRenderer>
        {renderAddButton()}
        {/* {isCondition &&
          !!(data?.target?.data.setting as ConditionDateSettingType)
            ?.isDefault && (
            <div
              className={styles.conditionButton}
              style={{
                transform: `translate(-50%, -50%) translate(${edge.sourceX}px,${labelY}px)`,
              }}
              onClick={() => setModalType("ConditionNode")}
            >
              {t("workflowApprovalFlow.addCondition")}
            </div>
          )} */}

        <div className="one-pass-flow-add-edge-form">
          {open &&
            renderForm &&
            renderForm(type, data, () => handleOpenChange(false))}
        </div>
        {renderEdgeLabel && renderEdgeLabel(edge)}
        {/* {isMultipleEnd &&
          renderAddButton(edge.targetX, edge.targetY - 20, true)} */}
      </EdgeLabelRenderer>
    </>
  );
};
