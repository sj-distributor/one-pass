import {
  Edge,
  Node,
  OnePassFlowNodeDataType,
  OnTransformEdgeType,
  OnTransformNodeType,
} from "../types";
import { buildEdge } from "./build-edge";
import { buildNode } from "./build-node";

export const transformFlow = (
  root: Node,
  end: Node,
  data: OnePassFlowNodeDataType[],
  onTransformNode?: OnTransformNodeType,
  onTransformEdge?: OnTransformEdgeType,
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
    const currentBranch = buildEdge(
      `s${root.id}t${end.id}`,
      {
        source: root,
        target: end,
      },
      onTransformEdge,
    );

    branch.push(currentBranch);
  } else {
    const isCondition = children.some((item) => item.type === "ConditionNode");

    children.map((item, index) => {
      const currentRoot = buildNode(
        `${root.id}-${index + 1}`,
        { ...item, conditionPriority: (isCondition && children.length) || 0 },
        onTransformNode,
      );

      const currentBranch = buildEdge(
        `s${root.id}t${currentRoot.id}`,
        {
          source: root,
          target: currentRoot,
        },
        onTransformEdge,
      );

      const { currentNode, currentEdge } = transformFlow(
        currentRoot,
        end,
        data,
        onTransformNode,
        onTransformEdge,
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
