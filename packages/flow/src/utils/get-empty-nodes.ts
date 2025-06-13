import { clone, uniq } from "ramda";

import { OnePassFlowNodeDataType } from "../types/one-pass-flow-types";

const getForkIds = (
  id: string,
  rootId: string,
  data: OnePassFlowNodeDataType[],
): string[] => {
  if (id === rootId) return [id];
  const ids = data.find((node) => id === node.id)?.parentIds?.sort() || [];

  return ids.reduce(
    (acc, parentId) => [...acc, ...getForkIds(parentId, rootId, data)],
    [...ids],
  );
};

const getTreeNodesFormLeaves = (
  nodeData: OnePassFlowNodeDataType[],
  leavesIds: string[],
  childrenMap: Map<string, string[]>,
) => {
  const resultData: OnePassFlowNodeDataType[] = clone(nodeData);

  const treeMap = new Map<string, string[]>();

  const rootId = nodeData[0].id;

  const forkNode = resultData.filter(
    (item) =>
      !item.id.includes("emptyNode") &&
      (childrenMap.get(item.id)?.length ?? 0) > 1,
  );

  leavesIds.map((item) => {
    const parentNode = uniq(getForkIds(item, rootId, nodeData)).filter(
      (item) =>
        !item.includes("emptyNode") && (childrenMap.get(item)?.length ?? 0) > 1,
    );

    treeMap.set(item, parentNode);
  });

  forkNode.reverse().map((current) => {
    const parentIds: string[] = [];

    const grandParentNode: string[] = [];

    treeMap.forEach((value, key) => {
      if (value.includes(current.id)) {
        grandParentNode.push(...value);
        parentIds.push(key);
      }
    });
    const id = parentIds.sort().join(",");

    const node: OnePassFlowNodeDataType = {
      id,
      parentId: id,
      parentIds: parentIds,
      type: "EmptyNode",
    };

    parentIds.map((item) => treeMap.delete(item));

    treeMap.set(id, uniq(grandParentNode));

    parentIds.length > 1 && resultData.push(node);
  });

  return resultData;
};

const getConvergedNode = (
  nodeData: OnePassFlowNodeDataType[],
  multipleNodes: OnePassFlowNodeDataType[],
  childrenMap: Map<string, string[]>,
) => {
  const parentMap = new Map<string, string[]>();

  let resutlData: OnePassFlowNodeDataType[] = clone(nodeData);

  const resultChildrenMap = new Map<string, string[]>(clone(childrenMap));

  multipleNodes.forEach((item) => {
    const key = item.parentIds?.sort().join(",");

    if (!key) return;
    parentMap.set(
      key,
      parentMap.has(key) ? [...parentMap.get(key)!, item.id] : [item.id],
    );
  });

  parentMap.forEach((value, key) => {
    const result = getTreeNodesFormLeaves(
      resutlData,
      key.split(","),
      childrenMap,
    );

    value.map((item) => {
      const index = resutlData.findIndex((node) => node.id === item);

      result[index]["parentId"] = key;
      result[index]["parentIds"] = [key];
    });

    resutlData = result;
  });

  return { data: resutlData, childrenMap: resultChildrenMap };
};

export const getEmptyNode = (data: OnePassFlowNodeDataType[]) => {
  const childrenMap = new Map<string, string[]>();

  const leaves: string[] = [];

  const multipleNodes: OnePassFlowNodeDataType[] = [];

  data.forEach((item) => {
    const children = data.filter((node) => node.parentIds?.includes(item.id));

    !children.length && leaves.push(item.id);
    (item?.parentIds?.length ?? 1) > 1 && multipleNodes.push(item);

    childrenMap.set(
      item.id,
      children?.map((item) => item.id),
    );
  });

  const { data: convergedData, childrenMap: convergedChildrenMap } =
    getConvergedNode(data, multipleNodes, childrenMap);

  const result = getTreeNodesFormLeaves(
    convergedData,
    leaves,
    convergedChildrenMap,
  );

  return result;
};
