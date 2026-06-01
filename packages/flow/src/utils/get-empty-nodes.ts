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

    // Due to traversal order issues, the IDs generated directly from parentIds may be out of sequence, resulting in incorrect matching.
    const id = parentIds.join(",").split(",").sort().join(",");

    const node: OnePassFlowNodeDataType = {
      id,
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

/** DAG */

interface IConvInfo {
  nodeId: string;
  branchEnds: Map<string, string>; // ci → parent id in ci's exclusive subgraph
  totalDist: number;
}

const buildMaps = (nodes: Map<string, OnePassFlowNodeDataType>) => {
  const children = new Map<string, string[]>();

  const parents = new Map<string, string[]>();

  for (const id of nodes.keys()) {
    children.set(id, []);
    parents.set(id, []);
  }

  for (const node of nodes.values()) {
    for (const pid of node.parentIds) {
      if (pid === "0") continue;
      parents.get(node.id)!.push(pid);
      if (children.has(pid)) {
        children.get(pid)!.push(node.id);
      }
    }
  }

  return { children, parents };
};

function descendants(
  startId: string,
  children: Map<string, string[]>,
): Set<string> {
  const result = new Set<string>();

  const visited = new Set<string>();

  const queue = [startId];

  let head = 0;

  while (head < queue.length) {
    const cur = queue[head++];

    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const child of children.get(cur) || []) {
      if (!visited.has(child)) {
        result.add(child);
        queue.push(child);
      }
    }
  }

  return result;
}

function distance(
  startId: string,
  targetId: string,
  children: Map<string, string[]>,
): number {
  if (startId === targetId) return 0;
  const visited = new Set<string>();

  const queue: [string, number][] = [[startId, 0]];

  let head = 0;

  while (head < queue.length) {
    const [cur, dist] = queue[head++];

    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const child of children.get(cur) || []) {
      if (child === targetId) return dist + 1;
      if (!visited.has(child)) {
        queue.push([child, dist + 1]);
      }
    }
  }

  return Infinity;
}

function computeDepths(
  nodes: Map<string, OnePassFlowNodeDataType>,
  children: Map<string, string[]>,
): Map<string, number> {
  const depths = new Map<string, number>();

  const root = [...nodes.values()].find((n) => n.type === "InitiatorNode");

  if (!root) return depths;

  // Topological sort via Kahn's algorithm
  const inDegree = new Map<string, number>();

  for (const id of nodes.keys()) inDegree.set(id, 0);
  for (const node of nodes.values()) {
    for (const child of children.get(node.id) || []) {
      inDegree.set(child, (inDegree.get(child) || 0) + 1);
    }
  }

  const queue: string[] = [];

  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  depths.set(root.id, 0);

  let head = 0;

  while (head < queue.length) {
    const cur = queue[head++];

    const curDepth = depths.get(cur) || 0;

    for (const child of children.get(cur) || []) {
      const newDepth = curDepth + 1;

      if (newDepth > (depths.get(child) || 0)) {
        depths.set(child, newDepth);
      }
      const newDeg = (inDegree.get(child) || 1) - 1;

      inDegree.set(child, newDeg);
      if (newDeg === 0) queue.push(child);
    }
  }

  return depths;
}

function processGroup(
  group: string[],
  nodes: Map<string, OnePassFlowNodeDataType>,
  children: Map<string, string[]>,
): { changed: boolean; emptyNode?: OnePassFlowNodeDataType } {
  // 1. Compute descendants for each group member
  const descByCi = new Map<string, Set<string>>();

  for (const ci of group) {
    descByCi.set(ci, descendants(ci, children));
  }

  // 2. Compute exclusive descendants per ci (nodes reachable from ci but
  //    not from any other cj in the group). Include ci itself.
  const exclusiveByCi = new Map<string, Set<string>>();

  for (const ci of group) {
    const exclusive = new Set(descByCi.get(ci)!);

    exclusive.add(ci);
    for (const cj of group) {
      if (cj === ci) continue;
      for (const d of descByCi.get(cj)!) {
        exclusive.delete(d);
      }
    }
    exclusiveByCi.set(ci, exclusive);
  }

  // 3. Find convergence nodes — non-EmptyNode whose parentIds span ≥2
  //    exclusive subgraphs
  const convergences: IConvInfo[] = [];

  for (const node of nodes.values()) {
    if (node.type === "EmptyNode") continue;
    if (node.parentIds.length < 2) continue;

    const coveredCis = new Set<string>();

    const branchEnds = new Map<string, string>();

    for (const pid of node.parentIds) {
      for (const ci of group) {
        if (exclusiveByCi.get(ci)!.has(pid) && !coveredCis.has(ci)) {
          coveredCis.add(ci);
          branchEnds.set(ci, pid);
          break;
        }
      }
    }

    if (coveredCis.size >= 2) {
      let totalDist = 0;

      for (const [ci, be] of branchEnds) {
        totalDist += distance(ci, be, children);
      }
      convergences.push({ nodeId: node.id, branchEnds, totalDist });
    }
  }

  // 4. Insert EmptyNode if convergences found
  if (convergences.length > 0) {
    // Pick the earliest convergences (minimum total distance)
    convergences.sort((a, b) => a.totalDist - b.totalDist);
    const minDist = convergences[0].totalDist;

    const nearest = convergences.filter((c) => c.totalDist === minDist);

    // Group nearest convergences into connected clusters by shared
    // covered ConditionNodes. Each cluster gets its own EmptyNode.
    const assigned = new Set<number>();

    const clusters: IConvInfo[][] = [];

    for (let i = 0; i < nearest.length; i++) {
      if (assigned.has(i)) continue;
      const cluster: IConvInfo[] = [nearest[i]];

      assigned.add(i);

      // Expand cluster with all convergences that share a covered ci
      let expanded = true;

      while (expanded) {
        expanded = false;
        for (let j = 0; j < nearest.length; j++) {
          if (assigned.has(j)) continue;
          const jCis = new Set(nearest[j].branchEnds.keys());

          for (const c of cluster) {
            const cCis = new Set(c.branchEnds.keys());

            if ([...jCis].some((ci) => cCis.has(ci))) {
              cluster.push(nearest[j]);
              assigned.add(j);
              expanded = true;
              break;
            }
          }
        }
      }
      clusters.push(cluster);
    }

    let anyChanged = false;

    let lastEmptyNode: OnePassFlowNodeDataType | undefined;

    for (const cluster of clusters) {
      // Collect branch-end IDs for this cluster
      const allBranchEnds = new Set<string>();

      for (const conv of cluster) {
        for (const be of conv.branchEnds.values()) {
          allBranchEnds.add(be);
        }
      }

      const branchEndList = [...allBranchEnds].sort();

      // Check if an EmptyNode with these exact parents already exists
      const existingEmpty = [...nodes.values()].find(
        (n) =>
          n.type === "EmptyNode" &&
          n.parentIds.length === branchEndList.length &&
          n.parentIds.every((p: string) => branchEndList.includes(p)),
      );

      if (existingEmpty) {
        anyChanged = true;
        lastEmptyNode = existingEmpty;
        // Redirect any uncovered nodes that converge at the same
        // branch-ends for this cluster
        const clusterCis = new Set<string>();

        for (const conv of cluster) {
          for (const ci of conv.branchEnds.keys()) {
            clusterCis.add(ci);
          }
        }
        for (const node of nodes.values()) {
          if (node.type === "EmptyNode") continue;
          if (node.parentIds.length < 2) continue;
          const beParents = node.parentIds.filter((pid: string) =>
            allBranchEnds.has(pid),
          );

          if (beParents.length === 0) continue;
          node.parentIds = node.parentIds.filter(
            (pid: string) => !allBranchEnds.has(pid),
          );
          node.parentIds.push(existingEmpty.id);
        }
        continue;
      }

      // Generate unique EmptyNode ID
      let emptyId = branchEndList[0] + "-A";

      while ([...nodes.values()].some((n) => n.id === emptyId)) {
        emptyId = emptyId + "-A";
      }

      const emptyNode: OnePassFlowNodeDataType = {
        id: emptyId,
        parentIds: branchEndList,
        type: "EmptyNode",
      };

      // Add to nodes map immediately so it's visible to subsequent
      // clusters and to the caller
      nodes.set(emptyNode.id, emptyNode);

      // Find all convergences (full list) that share covered cis with
      // this cluster, and redirect them
      const clusterCis = new Set<string>();

      for (const conv of cluster) {
        for (const ci of conv.branchEnds.keys()) {
          clusterCis.add(ci);
        }
      }

      for (const conv of convergences) {
        const convCis = new Set(conv.branchEnds.keys());

        if (![...convCis].some((ci) => clusterCis.has(ci))) continue;

        const convNode = nodes.get(conv.nodeId)!;

        const beParents = convNode.parentIds.filter((pid: string) =>
          allBranchEnds.has(pid),
        );

        if (beParents.length > 0) {
          convNode.parentIds = convNode.parentIds.filter(
            (pid: string) => !allBranchEnds.has(pid),
          );
          convNode.parentIds.push(emptyId);
        }
      }

      lastEmptyNode = emptyNode;
      anyChanged = true;
    }

    return { changed: anyChanged, emptyNode: lastEmptyNode };
  }

  // 5. No convergence — use deepest exclusive node from each branch
  const branchEnds: string[] = [];

  for (const ci of group) {
    const exclusive = exclusiveByCi.get(ci)!;

    // Find deepest exclusive node (max distance from ci within exclusive set)
    let deepest = ci;

    let maxDepth = 0;

    const visited = new Set<string>();

    const dfs = (node: string, depth: number) => {
      if (visited.has(node)) return;
      visited.add(node);
      // Consider as deepest candidate unless it's an EmptyNode whose
      // parents are not all within this branch (foreign EmptyNode leak).
      const nodeObj = nodes.get(node);

      const isForeignEmpty =
        nodeObj?.type === "EmptyNode" &&
        !nodeObj.parentIds.every(
          (pid: string) => pid === ci || exclusive.has(pid),
        );

      if (depth > maxDepth && !isForeignEmpty) {
        maxDepth = depth;
        deepest = node;
      }
      for (const child of children.get(node) || []) {
        if (exclusive.has(child)) dfs(child, depth + 1);
      }
    };

    dfs(ci, 0);
    branchEnds.push(deepest);
  }

  const unique = [...new Set(branchEnds)];

  if (unique.length < 2) return { changed: false };

  // If all branch-ends are the group members themselves AND each
  // member already has outgoing children, the group was already
  // handled by convergence clusters — do not create a new EmptyNode.
  if (
    unique.every(
      (be) => group.includes(be) && (children.get(be) || []).length > 0,
    )
  ) {
    return { changed: false };
  }

  // Check if an EmptyNode with these exact parents already exists
  const existingEmpty = [...nodes.values()].find(
    (n) =>
      n.type === "EmptyNode" &&
      n.parentIds.length === unique.length &&
      n.parentIds.every((p: string) => unique.includes(p)),
  );

  if (existingEmpty) return { changed: false };

  let emptyId = unique.sort()[0] + "-A";

  while ([...nodes.values()].some((n) => n.id === emptyId)) {
    emptyId = emptyId + "-A";
  }

  const emptyNode: OnePassFlowNodeDataType = {
    id: emptyId,
    parentIds: unique,
    type: "EmptyNode",
  };

  return { changed: true, emptyNode };
}

// layout to DAG
export const convertLayoutToDAG = (
  treeNodes: OnePassFlowNodeDataType[],
): OnePassFlowNodeDataType[] => {
  // Deep copy
  const nodes = new Map<string, OnePassFlowNodeDataType>();

  for (const n of treeNodes) {
    nodes.set(n.id, n);
  }

  // Iterate until stable
  let changed = true;

  let iter = 0;

  const MAX_ITER = 100;

  while (changed && iter < MAX_ITER) {
    iter++;
    changed = false;
    let { children } = buildMaps(nodes);

    // Find ConditionNode groups (nodes with same sorted parentIds, ≥2 members)
    const groupMap = new Map<string, string[]>();

    for (const node of nodes.values()) {
      if (node.type !== "ConditionNode") continue;
      const key = node.parentIds.sort().join(",");

      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(node.id);
    }

    // Compute depths for sorting (bottom-up)
    const depths = computeDepths(nodes, children);

    // Build valid groups list
    const groups: { key: string; members: string[]; maxDepth: number }[] = [];

    for (const [key, members] of groupMap) {
      if (members.length < 2) continue;
      let maxD = 0;

      for (const m of members) {
        maxD = Math.max(maxD, depths.get(m) || 0);
      }
      groups.push({ key, members, maxDepth: maxD });
    }

    if (groups.length === 0) break;

    // Process deepest first
    groups.sort((a, b) => b.maxDepth - a.maxDepth);

    for (const g of groups) {
      const result = processGroup(g.members, nodes, children);

      if (result.changed) {
        changed = true;
        if (result.emptyNode) {
          nodes.set(result.emptyNode.id, result.emptyNode);
        }
        // Rebuild children for subsequent groups
        const rebuilt = buildMaps(nodes);

        children = rebuilt.children;
      }
    }
  }

  // Add EndNode
  // First, clean up orphan EmptyNodes: when a higher-level group redirects
  // convergence nodes to a new EmptyNode, lower-level EmptyNodes may lose
  // all their children and become orphan leaves. Remove them via cascading
  // cleanup so they don't pollute the EndNode's parentIds.
  let pruneChanged = true;

  while (pruneChanged) {
    pruneChanged = false;
    const { children: pruneChildren } = buildMaps(nodes);

    // Collect all non-ConditionNode leaves
    const allLeaves: string[] = [];

    for (const node of nodes.values()) {
      if (node.type === "ConditionNode") continue;
      const outgoing = pruneChildren.get(node.id) || [];

      if (outgoing.length === 0) allLeaves.push(node.id);
    }

    // Only prune EmptyNodes if there are non-EmptyNode leaves remaining.
    // When all leaves are EmptyNodes (e.g. examples 3-7 where everything
    // converges to a single EmptyNode), keep them.
    const nonEmptyLeaves = allLeaves.filter(
      (id) => nodes.get(id)!.type !== "EmptyNode",
    );

    if (nonEmptyLeaves.length > 0) {
      for (const id of allLeaves) {
        if (nodes.get(id)!.type === "EmptyNode") {
          nodes.delete(id);
          pruneChanged = true;
        }
      }
    }
  }

  const { children } = buildMaps(nodes);

  const leafIds: string[] = [];

  for (const node of nodes.values()) {
    if (node.type === "ConditionNode") continue;
    const outgoing = children.get(node.id) || [];

    if (outgoing.length === 0) {
      leafIds.push(node.id);
    }
  }

  const endNode: OnePassFlowNodeDataType = {
    id: "end",
    parentIds: leafIds.sort(),
    type: "EndNode",
  };

  nodes.set("end", endNode);

  return [...nodes.values()];

  return [];
};
