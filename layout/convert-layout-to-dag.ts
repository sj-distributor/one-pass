type TreeNode = {
  id: string;
  parentIds: string[];
  type: string;
};

// ── helpers ──────────────────────────────────────────────────────────

function buildMaps(nodes: Map<string, TreeNode>) {
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
}

/** BFS descendants. Returns reachable ids (excluding startId). */
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

/** Shortest-path distance from startId to targetId. */
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

/** Longest-path depth from InitiatorNode. Uses topological DP. */
function computeDepths(
  nodes: Map<string, TreeNode>,
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

// ── group processing ─────────────────────────────────────────────────

interface IConvInfo {
  nodeId: string;
  branchEnds: Map<string, string>; // ci → parent id in ci's exclusive subgraph
  totalDist: number;
}

/**
 * Process a single ConditionNode group.
 * Inserts an EmptyNode at the earliest convergence point.
 */
function processGroup(
  group: string[],
  nodes: Map<string, TreeNode>,
  children: Map<string, string[]>,
): { changed: boolean; emptyNode?: TreeNode } {
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

    let lastEmptyNode: TreeNode | undefined;

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

      const emptyNode: TreeNode = {
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

  const emptyNode: TreeNode = {
    id: emptyId,
    parentIds: unique,
    type: "EmptyNode",
  };

  return { changed: true, emptyNode };
}

// ── main ─────────────────────────────────────────────────────────────

function convertLayoutToDAG(treeNodes: TreeNode[]): TreeNode[] {
  // Deep copy
  const nodes = new Map<string, TreeNode>();

  for (const n of treeNodes) {
    nodes.set(n.id, { id: n.id, parentIds: [...n.parentIds], type: n.type });
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
  const { children } = buildMaps(nodes);

  const leafIds: string[] = [];

  for (const node of nodes.values()) {
    if (node.type === "ConditionNode") continue;
    const outgoing = children.get(node.id) || [];

    if (outgoing.length === 0) {
      leafIds.push(node.id);
    }
  }

  const endNode: TreeNode = {
    id: "end",
    parentIds: leafIds.sort(),
    type: "EndNode",
  };

  nodes.set("end", endNode);

  return [...nodes.values()];
}

// ── tests ────────────────────────────────────────────────────────────

function normalize(nodes: TreeNode[]): string {
  const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id));

  return JSON.stringify(
    sorted.map((n) => ({
      id: n.id,
      parentIds: [...n.parentIds].sort(),
      type: n.type,
    })),
    null,
    2,
  );
}

function assertEq(label: string, got: TreeNode[], expected: TreeNode[]) {
  const g = normalize(got);

  const e = normalize(expected);

  if (g === e) {
    console.log(`✓ ${label}`);
  } else {
    console.log(`✗ ${label} FAILED`);
    console.log("  got:\n" + g);
    console.log("  expected:\n" + e);
  }
}

// ── example 1 ────────────────────────────────────────────────────────

const ex1Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "CcRecipientNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-1-1-1-1", parentIds: ["1-1-1-1", "1-2-1"], type: "ApproverNode" },
];

const ex1Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "CcRecipientNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-1-1-1-A", parentIds: ["1-1-1-1", "1-2-1"], type: "EmptyNode" },
  { id: "1-1-1-1-1", parentIds: ["1-1-1-1-A"], type: "ApproverNode" },
  { id: "end", parentIds: ["1-1-1-1-1"], type: "EndNode" },
];

// ── example 2 ────────────────────────────────────────────────────────

const ex2Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "ApproverNode" },
  { id: "1-1-2-1", parentIds: ["1-1-2"], type: "ApproverNode" },
  { id: "1-1-1-1-1", parentIds: ["1-1-1-1", "1-1-2-1"], type: "ApproverNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-2-1-1", parentIds: ["1-2-1"], type: "CcRecipientNode" },
  {
    id: "1-1-1-1-1-1",
    parentIds: ["1-1-1-1-1", "1-2-1-1"],
    type: "ApproverNode",
  },
];

const ex2Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "ApproverNode" },
  { id: "1-1-2-1", parentIds: ["1-1-2"], type: "ApproverNode" },
  { id: "1-1-1-1-A", parentIds: ["1-1-1-1", "1-1-2-1"], type: "EmptyNode" },
  { id: "1-1-1-1-1", parentIds: ["1-1-1-1-A"], type: "ApproverNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-2-1-1", parentIds: ["1-2-1"], type: "CcRecipientNode" },
  {
    id: "1-1-1-1-1-A",
    parentIds: ["1-1-1-1-1", "1-2-1-1"],
    type: "EmptyNode",
  },
  {
    id: "1-1-1-1-1-1",
    parentIds: ["1-1-1-1-1-A"],
    type: "ApproverNode",
  },
  { id: "end", parentIds: ["1-1-1-1-1-1"], type: "EndNode" },
];

// ── example 3 ────────────────────────────────────────────────────────

const ex3Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
];

const ex3Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-1-1-A", parentIds: ["1-1-1", "1-2-1"], type: "EmptyNode" },
  { id: "end", parentIds: ["1-1-1-A"], type: "EndNode" },
];

// ── example 4 ────────────────────────────────────────────────────────

const ex4Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-2-2", parentIds: ["1-2"], type: "ConditionNode" },
];

const ex4Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-A", parentIds: ["1-1-1", "1-1-2"], type: "EmptyNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-2-2", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-2-1-A", parentIds: ["1-2-1", "1-2-2"], type: "EmptyNode" },
  { id: "1-1-1-A-A", parentIds: ["1-1-1-A", "1-2-1-A"], type: "EmptyNode" },
  { id: "end", parentIds: ["1-1-1-A-A"], type: "EndNode" },
];

// ── example 5 ────────────────────────────────────────────────────────

const ex5Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1"], type: "ConditionNode" },
];

const ex5Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-1-1-A", parentIds: ["1-1-1-1", "1-1-1-2"], type: "EmptyNode" },
  {
    id: "1-1-1-1-A-A",
    parentIds: ["1-1-1-1-A", "1-1-2"],
    type: "EmptyNode",
  },
  {
    id: "1-1-1-1-A-A-A",
    parentIds: ["1-1-1-1-A-A", "1-2"],
    type: "EmptyNode",
  },
  { id: "end", parentIds: ["1-1-1-1-A-A-A"], type: "EndNode" },
];

// ── example 6 ────────────────────────────────────────────────────────

const ex6Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "2-1", parentIds: ["1-1", "1-2"], type: "ConditionNode" },
  { id: "2-2", parentIds: ["1-1", "1-2"], type: "ConditionNode" },
];

const ex6Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-A", parentIds: ["1-1", "1-2"], type: "EmptyNode" },
  { id: "2-1", parentIds: ["1-1-A"], type: "ConditionNode" },
  { id: "2-2", parentIds: ["1-1-A"], type: "ConditionNode" },
  { id: "2-1-A", parentIds: ["2-1", "2-2"], type: "EmptyNode" },
  { id: "end", parentIds: ["2-1-A"], type: "EndNode" },
];

// ── example 7 ────────────────────────────────────────────────────────

const ex7Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1", "1-1-2"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1", "1-1-2"], type: "ConditionNode" },
];

const ex7Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-1-A", parentIds: ["1-1-1", "1-1-2"], type: "EmptyNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1-A"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1-A"], type: "ConditionNode" },
  { id: "1-1-1-1-A", parentIds: ["1-1-1-1", "1-1-1-2"], type: "EmptyNode" },
  {
    id: "1-1-1-1-A-A",
    parentIds: ["1-1-1-1-A", "1-2"],
    type: "EmptyNode",
  },
  { id: "end", parentIds: ["1-1-1-1-A-A"], type: "EndNode" },
];

// ── extra: 3+ sibling ConditionNodes ─────────────────────────────────

const ex8Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-3", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-3-1", parentIds: ["1-3"], type: "ApproverNode" },
];

// ── extra: simple chain (no ConditionNodes) ──────────────────────────

const ex9Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ApproverNode" },
];

// case 8

const ex10Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-2-2", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1", "1-1-2"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1", "1-1-2"], type: "ConditionNode" },
  { id: "1-2-1-1", parentIds: ["1-2-1", "1-2-2"], type: "ConditionNode" },
  { id: "1-2-1-2", parentIds: ["1-2-1", "1-2-2"], type: "ConditionNode" },
];

const ex10Expected: TreeNode[] = [
  {
    id: "1",
    parentIds: ["0"],
    type: "InitiatorNode",
  },
  {
    id: "1-1",
    parentIds: ["1"],
    type: "ConditionNode",
  },
  {
    id: "1-1-1",
    parentIds: ["1-1"],
    type: "ConditionNode",
  },
  {
    id: "1-1-1-1",
    parentIds: ["1-1-1-A"],
    type: "ConditionNode",
  },
  {
    id: "1-1-1-1-A",
    parentIds: ["1-1-1-1", "1-1-1-2"],
    type: "EmptyNode",
  },
  {
    id: "1-1-1-1-A-A",
    parentIds: ["1-1-1-1-A", "1-2-1-1-A"],
    type: "EmptyNode",
  },
  {
    id: "1-1-1-2",
    parentIds: ["1-1-1-A"],
    type: "ConditionNode",
  },
  {
    id: "1-1-1-A",
    parentIds: ["1-1-1", "1-1-2"],
    type: "EmptyNode",
  },
  {
    id: "1-1-2",
    parentIds: ["1-1"],
    type: "ConditionNode",
  },
  {
    id: "1-2",
    parentIds: ["1"],
    type: "ConditionNode",
  },
  {
    id: "1-2-1",
    parentIds: ["1-2"],
    type: "ConditionNode",
  },
  {
    id: "1-2-1-1",
    parentIds: ["1-2-1-A"],
    type: "ConditionNode",
  },
  {
    id: "1-2-1-1-A",
    parentIds: ["1-2-1-1", "1-2-1-2"],
    type: "EmptyNode",
  },
  {
    id: "1-2-1-2",
    parentIds: ["1-2-1-A"],
    type: "ConditionNode",
  },
  {
    id: "1-2-1-A",
    parentIds: ["1-2-1", "1-2-2"],
    type: "EmptyNode",
  },
  {
    id: "1-2-2",
    parentIds: ["1-2"],
    type: "ConditionNode",
  },
  {
    id: "end",
    parentIds: ["1-1-1-1-A-A"],
    type: "EndNode",
  },
];

// case 9
const ex11Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-2-2", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-2-1", parentIds: ["1-1-2"], type: "ConditionNode" },
  { id: "1-1-2-2", parentIds: ["1-1-2"], type: "ConditionNode" },
  { id: "1-2-1-1", parentIds: ["1-2-1"], type: "ConditionNode" },
  { id: "1-2-1-2", parentIds: ["1-2-1"], type: "ConditionNode" },
  { id: "1-2-2-1", parentIds: ["1-2-2"], type: "ConditionNode" },
  { id: "1-2-2-2", parentIds: ["1-2-2"], type: "ConditionNode" },
];

const ex11Expected: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-1-2", parentIds: ["1-1"], type: "ConditionNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-2-2", parentIds: ["1-2"], type: "ConditionNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-1-2", parentIds: ["1-1-1"], type: "ConditionNode" },
  { id: "1-1-1-1-A", parentIds: ["1-1-1-1", "1-1-1-2"], type: "EmptyNode" },
  { id: "1-1-2-1", parentIds: ["1-1-2"], type: "ConditionNode" },
  { id: "1-1-2-2", parentIds: ["1-1-2"], type: "ConditionNode" },
  { id: "1-1-2-1-A", parentIds: ["1-1-2-1", "1-1-2-2"], type: "EmptyNode" },
  {
    id: "1-1-1-1-A-A",
    parentIds: ["1-1-1-1-A", "1-1-2-1-A"],
    type: "EmptyNode",
  },
  { id: "1-2-1-1", parentIds: ["1-2-1"], type: "ConditionNode" },
  { id: "1-2-1-2", parentIds: ["1-2-1"], type: "ConditionNode" },
  { id: "1-2-1-1-A", parentIds: ["1-2-1-1", "1-2-1-2"], type: "EmptyNode" },
  { id: "1-2-2-1", parentIds: ["1-2-2"], type: "ConditionNode" },
  { id: "1-2-2-2", parentIds: ["1-2-2"], type: "ConditionNode" },
  { id: "1-2-2-1-A", parentIds: ["1-2-2-1", "1-2-2-2"], type: "EmptyNode" },
  {
    id: "1-2-1-1-A-A",
    parentIds: ["1-2-1-1-A", "1-2-2-1-A"],
    type: "EmptyNode",
  },
  {
    id: "1-1-1-1-A-A-A",
    parentIds: ["1-1-1-1-A-A", "1-2-1-1-A-A"],
    type: "EmptyNode",
  },
  { id: "end", parentIds: ["1-1-1-1-A-A-A"], type: "EndNode" },
];

// case 10: cross-group EmptyNode ID collision
// Two independent ConditionNode groups under different parents both
// try to generate EmptyNode "N1-A". Must produce unique IDs.
const ex12Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "G1", parentIds: ["1"], type: "ConditionNode" },
  { id: "C1", parentIds: ["G1"], type: "ConditionNode" },
  { id: "C2", parentIds: ["G1"], type: "ConditionNode" },
  { id: "N1", parentIds: ["C1", "D1"], type: "ApproverNode" },
  { id: "Z1", parentIds: ["C2"], type: "ApproverNode" },
  { id: "G2", parentIds: ["1"], type: "ConditionNode" },
  { id: "D1", parentIds: ["G2"], type: "ConditionNode" },
  { id: "D2", parentIds: ["G2"], type: "ConditionNode" },
  { id: "Z2", parentIds: ["D2"], type: "ApproverNode" },
];

// case 11: same-group independent convergence clusters
// Four ConditionNodes under same parent form two independent
// convergence pairs. Must create two separate EmptyNodes.
const ex13Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "A", parentIds: ["1"], type: "ConditionNode" },
  { id: "B", parentIds: ["1"], type: "ConditionNode" },
  { id: "C", parentIds: ["1"], type: "ConditionNode" },
  { id: "D", parentIds: ["1"], type: "ConditionNode" },
  { id: "P", parentIds: ["A", "B"], type: "ApproverNode" },
  { id: "Q", parentIds: ["C", "D"], type: "ApproverNode" },
];

// ── run ──────────────────────────────────────────────────────────────

function test() {
  console.log("Testing convertLayoutToDAG...\n");

  assertEq("example 1", convertLayoutToDAG(ex1Input), ex1Expected);
  assertEq("example 2", convertLayoutToDAG(ex2Input), ex2Expected);
  assertEq("example 3", convertLayoutToDAG(ex3Input), ex3Expected);
  assertEq("example 4", convertLayoutToDAG(ex4Input), ex4Expected);
  assertEq("example 5", convertLayoutToDAG(ex5Input), ex5Expected);
  assertEq("example 6", convertLayoutToDAG(ex6Input), ex6Expected);
  assertEq("example 7", convertLayoutToDAG(ex7Input), ex7Expected);
  assertEq("example 8", convertLayoutToDAG(ex10Input), ex10Expected);
  assertEq("example 9", convertLayoutToDAG(ex11Input), ex11Expected);

  console.log("\n--- edge cases ---");
  console.log(
    "cross-group collision:",
    normalize(convertLayoutToDAG(ex12Input)),
  );
  console.log("cluster split:", normalize(convertLayoutToDAG(ex13Input)));

  console.log("\n--- extra ---");
  console.log("3 siblings:", normalize(convertLayoutToDAG(ex8Input)));
  console.log("simple chain:", normalize(convertLayoutToDAG(ex9Input)));
}

test();
