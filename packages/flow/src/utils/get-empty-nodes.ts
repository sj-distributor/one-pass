import { clone, uniq } from "ramda";

import { OnePassFlowNodeDataType } from "../types/one-pass-flow-types";

/**
 * Get converged nodes. Create a converged empty node for nodes with multiple parent nodes.
 * @param nodeData - An array of node data.
 * @param multipleNodes - An array of nodes with multiple parent nodes.
 * @param childrenMap - A map that records the IDs of each node's child nodes.
 * @returns An object containing the updated node data and the child node map.
 */
const getConvergedNode = (
  nodeData: OnePassFlowNodeDataType[],
  multipleNodes: OnePassFlowNodeDataType[],
  childrenMap: Map<string, string[]>,
) => {
  // Used to store the array of child node IDs corresponding to each combination of parent nodes.
  const parentMap = new Map<string, string[]>();

  // Clone the original node data to avoid modifying the original data.
  const resutlData: OnePassFlowNodeDataType[] = clone(nodeData);

  // Clone the original child node map to avoid modifying the original map.
  const resultChildrenMap = new Map<string, string[]>(clone(childrenMap));

  // Iterate through nodes with multiple parent nodes.
  multipleNodes.forEach((item) => {
    // Sort the parent node IDs and join them into a string with commas as the key.
    const key = item.parentIds?.sort().join(",");

    // Skip if the key does not exist.
    if (!key) return;
    // Update the parentMap by adding the current node ID to the corresponding parent node combination.
    parentMap.set(
      key,
      parentMap.has(key) ? [...parentMap.get(key)!, item.id] : [item.id],
    );
  });

  // Iterate through the parentMap.
  parentMap.forEach((value, key) => {
    // Generate the ID of the converged empty node.
    const id = `emptyNode-coverged-${key.replace(",", "###")}`;

    // Create a converged empty node.
    const node: OnePassFlowNodeDataType = {
      id,
      parentId: key,
      parentIds: key.split(","),
      type: "EmptyNode",
    };

    // Add the converged empty node to the result node data.
    resutlData.push(node);

    // Update the parent node information of child nodes.
    value.map((item) => {
      // Find the index of the child node in the result node data.
      const index = resutlData.findIndex((node) => node.id === item);

      // Update the parent node ID and parent node ID array of the child node.
      resutlData[index]["parentId"] = id;
      resutlData[index]["parentIds"] = [id];
    });

    // Update the child node map of parent nodes.
    key.split(",").forEach((item) => {
      resultChildrenMap.set(item, [id]);
    });
  });

  return { data: resutlData, childrenMap: resultChildrenMap };
};

/**
 * Reverse-infer the tree structure from leaf nodes. Create end empty nodes for fork nodes.
 * @param nodeData - An array of node data.
 * @param leavesIds - An array of leaf node IDs.
 * @param childrenMap - A map that records the IDs of each node's child nodes.
 * @returns The updated array of node data.
 */
const getTreeNodesFormLeaves = (
  nodeData: OnePassFlowNodeDataType[],
  leavesIds: string[],
  childrenMap: Map<string, string[]>,
) => {
  // Clone the original node data to avoid modifying the original data.
  const resultData: OnePassFlowNodeDataType[] = clone(nodeData);

  // Used to store the fork nodes on the path from each leaf node to the root node.
  const treeMap = new Map<string, string[]>();

  // Get the root node ID.
  const rootId = resultData[0].id;

  // Filter out fork nodes that are non-empty nodes and have multiple child nodes.
  const forkNode = resultData.filter(
    (item) =>
      !item.id.includes("emptyNode") &&
      (childrenMap.get(item.id)?.length ?? 0) > 1,
  );

  /**
   * Breadth-first search function that recursively searches upward for the parent nodes of the specified node until reaching the root node.
   * @param id - The ID of the current node.
   * @returns An array of all node IDs on the path from the current node to the root node, arranged in the order of search.
   */
  const bfs = (id: string): string[] => {
    // If the current node is the root node, put the root node ID into an array and return it.
    if (id === rootId) return [id];

    // Find the current node from the node data, get its parent node ID array and sort it.
    // If the node is not found or the parent node ID array is empty, return an empty array.
    const ids =
      nodeData.find((node) => id === node.id)?.parentIds?.sort() || [];

    // Recursively call the bfs function, merging the parent node ID array of the current node
    // with the results of upward searches for each parent node.
    return ids.reduce((acc, parentId) => [...acc, ...bfs(parentId)], [...ids]);
  };

  // Iterate through the array of leaf node IDs.
  leavesIds.map((item) => {
    // Get the unique fork nodes on the path from the leaf node to the root node.
    const parentNode = uniq(bfs(item)).filter(
      (item) =>
        !item.includes("emptyNode") && (childrenMap.get(item)?.length ?? 0) > 1,
    );

    // Store the array of fork nodes in the treeMap.
    treeMap.set(item, parentNode);
  });

  // Reverse the array of fork nodes and perform a reduction operation.
  forkNode.reverse().reduce((total: string[], current) => {
    // Generate the ID of the end empty node.
    const id = `emptyNode-end-${current.id}`;

    // Used to store the array of parent node IDs of the end empty node.
    const parentIds: string[] = [];

    // If the total array is not empty, add the last element to the array of parent node IDs.
    total.length && parentIds.push(total[total.length - 1]);

    // Iterate through the treeMap and add the leaf node IDs that contain the current fork node to the array of parent node IDs.
    treeMap.forEach((value, key) => {
      if (value.includes(current.id)) {
        parentIds.push(key);
      }
    });

    // Create an end empty node.
    const node: OnePassFlowNodeDataType = {
      id,
      parentId: parentIds.join(","),
      parentIds: parentIds,
      type: "EmptyNode",
    };

    // Delete the records corresponding to the parent node IDs from the treeMap.
    parentIds.map((item) => treeMap.delete(item));

    // Add the end empty node to the result node data.
    resultData.push(node);

    return [...total, id];
  }, []);

  return resultData;
};

/**
 * Get empty nodes, including converged empty nodes and end empty nodes.
 * @param data - The original array of node data.
 * @returns The updated array of node data.
 */
export const getEmptyNode = (data: OnePassFlowNodeDataType[]) => {
  // Used to store the array of child node IDs of each node.
  const childrenMap = new Map<string, string[]>();

  // Used to store the array of leaf node IDs.
  const leaves: string[] = [];

  // Used to store the array of nodes with multiple parent nodes.
  const multipleNodes: OnePassFlowNodeDataType[] = [];

  // Iterate through the original node data.
  data.forEach((item) => {
    // Filter out the child nodes of the current node.
    const children = data.filter((node) => node.parentIds?.includes(item.id));

    // If there are no child nodes, add its ID to the array of leaf node IDs.
    !children.length && leaves.push(item.id);
    // If the number of parent nodes is greater than 1, add it to the array of nodes with multiple parent nodes.
    (item?.parentIds?.length ?? 1) > 1 && multipleNodes.push(item);

    // Update the child node map.
    childrenMap.set(
      item.id,
      children?.map((item) => item.id),
    );
  });

  // Reverse-infer a tree from the leaf nodes. Get the converged nodes and the updated child node map.
  const { data: convergedData, childrenMap: convergedChildrenMap } =
    getConvergedNode(data, multipleNodes, childrenMap);

  return getTreeNodesFormLeaves(convergedData, leaves, convergedChildrenMap);
};
