import { Edge, Node, OnePassFlowNodeDataType } from "../types";
import { buildEdge } from "./build-edge";
import { buildNode } from "./build-node";

export const transformFlow = (
  root: Node,
  end: Node,
  data: OnePassFlowNodeDataType[],
): {
  currentNode: Node[];
  currentEdge: Edge[];
} => {
  const tree: Node[] = [];

  const branch: Edge[] = [];

  const children: OnePassFlowNodeDataType[] = data.filter(
    (item) =>
      item.parentId === root.data.id && (item.parentIds?.length ?? 1) === 1,
  );

  if (!children.length) {
    const currentBranch = buildEdge(`s${root.id}t${end.id}`, root.id, end.id, {
      source: root,
      target: end,
    });

    branch.push(currentBranch);
  } else {
    const isCondition = children.some((item) => item.type === "ConditionNode");

    children.map((item, index) => {
      const currentRoot = buildNode(
        `${root.id}-${index + 1}`,
        { ...item, conditionPriority: (isCondition && children.length) || 0 },
        // isCondition && !(item.setting as ConditionDateSettingType)?.isDefault,
      );

      const currentBranch = buildEdge(
        `s${root.id}t${currentRoot.id}`,
        root.id,
        currentRoot.id,
        {
          source: root,
          target: currentRoot,
        },
      );

      const { currentNode, currentEdge } = transformFlow(
        currentRoot,
        end,
        data,
      );

      tree.push(currentRoot, ...currentNode);
      branch.push(currentBranch, ...currentEdge);
    });
  }

  return {
    currentNode: tree,
    currentEdge: branch,
  };
};
