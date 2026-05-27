/**
 * topo-sort.ts — 拓扑序遍历工具
 *
 * 对布局树（输入）和 DAG（输出）进行拓扑序遍历和打印。
 * 用法: npx tsx topo-sort.ts
 */

type TreeNode = {
  id: string;
  parentIds: string[];
  type: string;
};

// ── graph helpers ────────────────────────────────────────────────────

function buildGraph(nodes: TreeNode[]) {
  const children = new Map<string, string[]>();

  const inDegree = new Map<string, number>();

  for (const n of nodes) {
    if (!children.has(n.id)) children.set(n.id, []);
    if (!inDegree.has(n.id)) inDegree.set(n.id, 0);
  }

  for (const n of nodes) {
    for (const pid of n.parentIds) {
      if (pid === "0") continue;
      if (children.has(pid)) {
        children.get(pid)!.push(n.id);
      }
      inDegree.set(n.id, (inDegree.get(n.id) || 0) + 1);
    }
  }

  return { children, inDegree };
}

// ── topological sort (Kahn's algorithm) ──────────────────────────────

/** Returns node IDs in topological order. Throws if a cycle is detected. */
function topologicalSort(nodes: TreeNode[]): string[] {
  const { children, inDegree } = buildGraph(nodes);

  const result: string[] = [];

  // Copy inDegree since we mutate it
  const deg = new Map(inDegree);

  const queue: string[] = [];

  for (const [id, d] of deg) {
    if (d === 0) queue.push(id);
  }

  let head = 0;

  while (head < queue.length) {
    const cur = queue[head++];

    result.push(cur);

    for (const child of children.get(cur) || []) {
      const newDeg = deg.get(child)! - 1;

      deg.set(child, newDeg);
      if (newDeg === 0) queue.push(child);
    }
  }

  if (result.length !== nodes.length) {
    const missing = nodes
      .filter((n) => !result.includes(n.id))
      .map((n) => n.id);

    throw new Error(`Cycle detected or unreachable nodes: [${missing}]`);
  }

  return result;
}

// ── traversals ───────────────────────────────────────────────────────

/** BFS level-order traversal from InitiatorNode, calling visitor for each node. */
function traverseDAG(
  nodes: TreeNode[],
  onEnter: (node: TreeNode, depth: number) => void,
): void {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const root = nodes.find((n) => n.type === "InitiatorNode");

  if (!root) {
    console.log("  (no InitiatorNode found)");

    return;
  }

  const { children } = buildGraph(nodes);

  const visited = new Set<string>();

  const queue: [string, number][] = [[root.id, 0]];

  let head = 0;

  while (head < queue.length) {
    const [curId, depth] = queue[head++];

    if (visited.has(curId)) continue;
    visited.add(curId);

    const node = nodeMap.get(curId);

    if (node) onEnter(node, depth);

    for (const child of children.get(curId) || []) {
      if (!visited.has(child)) {
        queue.push([child, depth + 1]);
      }
    }
  }
}

// ── printing ─────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  InitiatorNode: "○",
  ConditionNode: "◇",
  ApproverNode: "□",
  CcRecipientNode: "△",
  EmptyNode: "●",
  EndNode: "◉",
};

function indent(depth: number): string {
  return "  ".repeat(depth) + (depth > 0 ? "↳ " : "");
}

/** Print a DAG in topological BFS order with type icons and parents. */
function printTopoOrder(nodes: TreeNode[], label: string): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${label}  (${nodes.length} nodes)`);
  console.log("=".repeat(60));

  // Show topo-sorted ID order
  try {
    const order = topologicalSort(nodes);

    console.log(`  Topo order: ${order.join(" → ")}`);
  } catch (e) {
    console.log(`  Topo order: (cycle or unreachable) ${String(e)}`);
  }

  // Show BFS tree structure
  console.log("  Structure:");
  traverseDAG(nodes, (node, depth) => {
    const icon = TYPE_ICONS[node.type] || "?";

    const parents =
      node.parentIds.length > 0 ? ` ← [${node.parentIds.join(",")}]` : "";

    console.log(
      `  ${indent(depth)}${icon} ${node.id} (${node.type})${parents}`,
    );
  });
}

// ── examples ─────────────────────────────────────────────────────────

// Example 1
const ex1Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
  { id: "1-1-1-1", parentIds: ["1-1-1"], type: "CcRecipientNode" },
  { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  { id: "1-1-1-1-1", parentIds: ["1-1-1-1", "1-2-1"], type: "ApproverNode" },
];

const ex1Output: TreeNode[] = [
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

// Example 6 (cross-referencing ConditionNodes)
const ex6Input: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "2-1", parentIds: ["1-1", "1-2"], type: "ConditionNode" },
  { id: "2-2", parentIds: ["1-1", "1-2"], type: "ConditionNode" },
];

const ex6Output: TreeNode[] = [
  { id: "1", parentIds: ["0"], type: "InitiatorNode" },
  { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
  { id: "1-1-A", parentIds: ["1-1", "1-2"], type: "EmptyNode" },
  { id: "2-1", parentIds: ["1-1-A"], type: "ConditionNode" },
  { id: "2-2", parentIds: ["1-1-A"], type: "ConditionNode" },
  { id: "2-1-A", parentIds: ["2-1", "2-2"], type: "EmptyNode" },
  { id: "end", parentIds: ["2-1-A"], type: "EndNode" },
];

// ── run ──────────────────────────────────────────────────────────────

function run() {
  console.log("拓扑序遍历示例\n");

  printTopoOrder(ex1Input, "Example 1 — Input (布局树)");
  printTopoOrder(ex1Output, "Example 1 — Output (DAG)");

  printTopoOrder(ex6Input, "Example 6 — Input (交叉引用布局树)");
  printTopoOrder(ex6Output, "Example 6 — Output (DAG)");
}

run();
