/**
 * validate-input.ts — 布局树输入合法性校验
 *
 * 用法: npx tsx validate-input.ts
 */

// type TreeNode = {
//   id: string;
//   parentIds: string[];
//   type: string;
// };

interface IValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const KNOWN_TYPES = new Set([
  "InitiatorNode",
  "ConditionNode",
  "ApproverNode",
  "CcRecipientNode",
  "EmptyNode",
  "EndNode",
]);

const FORBIDDEN_INPUT_TYPES = new Set(["EmptyNode", "EndNode"]);

// ── helpers ──────────────────────────────────────────────────────────

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

function hasCycle(nodes: TreeNode[]): string[] | null {
  const { children, inDegree } = buildGraph(nodes);

  const deg = new Map(inDegree);

  const queue: string[] = [];

  const sorted: string[] = [];

  for (const [id, d] of deg) {
    if (d === 0) queue.push(id);
  }

  let head = 0;

  while (head < queue.length) {
    const cur = queue[head++];

    sorted.push(cur);
    for (const child of children.get(cur) || []) {
      const newDeg = deg.get(child)! - 1;

      deg.set(child, newDeg);
      if (newDeg === 0) queue.push(child);
    }
  }

  if (sorted.length < nodes.length) {
    return nodes.filter((n) => !sorted.includes(n.id)).map((n) => n.id);
  }

  return null;
}

// ── validation ───────────────────────────────────────────────────────

function validateTreeNodes(nodes: TreeNode[]): IValidationResult {
  const errors: string[] = [];

  const warnings: string[] = [];

  // 1. Unique IDs
  const seen = new Set<string>();

  for (const n of nodes) {
    if (seen.has(n.id)) {
      errors.push(`[dup-id] 节点 id "${n.id}" 重复`);
    }
    seen.add(n.id);
  }

  // 2. Exactly one InitiatorNode
  const initiators = nodes.filter((n) => n.type === "InitiatorNode");

  if (initiators.length === 0) {
    errors.push("[no-init] 缺少 InitiatorNode");
  } else if (initiators.length > 1) {
    errors.push(
      `[multi-init] 存在 ${initiators.length} 个 InitiatorNode: [${initiators.map((n) => n.id).join(", ")}]`,
    );
  }

  // 3. InitiatorNode parentIds
  if (initiators.length === 1) {
    const init = initiators[0];

    const pids = init.parentIds.filter((p) => p !== "0");

    if (pids.length > 0) {
      errors.push(
        `[init-parent] InitiatorNode "${init.id}" 的 parentIds 应仅为 ["0"] 或 [], 实际: [${init.parentIds.join(", ")}]`,
      );
    }
  }

  // 4. All parentIds reference existing nodes (or "0")
  const idSet = new Set(nodes.map((n) => n.id));

  for (const n of nodes) {
    for (const pid of n.parentIds) {
      if (pid === "0") continue;
      if (!idSet.has(pid)) {
        errors.push(
          `[missing-parent] 节点 "${n.id}" 的 parentId "${pid}" 不存在`,
        );
      }
    }
  }

  // 5. No cycles (skip if duplicate IDs corrupt the graph)
  let cycleNodes: string[] | null = null;

  if (seen.size === nodes.length) {
    cycleNodes = hasCycle(nodes);
    if (cycleNodes) {
      errors.push(
        `[cycle] 检测到循环引用, 涉及节点: [${cycleNodes.join(", ")}]`,
      );
    }
  }

  // 6. All nodes reachable from InitiatorNode
  if (initiators.length === 1 && !cycleNodes && seen.size === nodes.length) {
    const { children } = buildGraph(nodes);

    const visited = new Set<string>();

    const queue = [initiators[0].id];

    let head = 0;

    while (head < queue.length) {
      const cur = queue[head++];

      if (visited.has(cur)) continue;
      visited.add(cur);
      for (const child of children.get(cur) || []) {
        if (!visited.has(child)) queue.push(child);
      }
    }
    const unreachable = nodes.filter((n) => !visited.has(n.id));

    if (unreachable.length > 0) {
      errors.push(
        `[unreachable] ${unreachable.length} 个节点无法从 InitiatorNode 到达: [${unreachable.map((n) => n.id).join(", ")}]`,
      );
    }
  }

  // 7. Forbidden types in input
  for (const n of nodes) {
    if (FORBIDDEN_INPUT_TYPES.has(n.type)) {
      errors.push(
        `[forbidden-type] 节点 "${n.id}" 的类型 "${n.type}" 不应出现在输入中（由算法推导）`,
      );
    }
  }

  // 8. ConditionNode sibling groups (warning)
  const groupMap = new Map<string, string[]>();

  for (const n of nodes) {
    if (n.type !== "ConditionNode") continue;
    const key = [...n.parentIds].sort().join(",");

    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(n.id);
  }
  for (const [key, members] of groupMap) {
    if (members.length < 2) {
      warnings.push(
        `[single-cond] ConditionNode "${members[0]}" (parentIds=[${key}]) 是唯一的条件分支节点，可能缺少配对`,
      );
    }
  }

  // 9. Known types
  for (const n of nodes) {
    if (!KNOWN_TYPES.has(n.type)) {
      errors.push(
        `[unknown-type] 节点 "${n.id}" 的类型 "${n.type}" 不是已知类型`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ── demo ─────────────────────────────────────────────────────────────

function demo(label: string, nodes: TreeNode[]) {
  const { valid, errors, warnings } = validateTreeNodes(nodes);

  const status = valid ? "✓ 合法" : "✗ 不合法";

  console.log(`\n${label}: ${status}`);
  for (const e of errors) console.log(`  ❌ ${e}`);
  for (const w of warnings) console.log(`  ⚠️  ${w}`);
  if (errors.length === 0 && warnings.length === 0) console.log("  (无问题)");
}

function run() {
  console.log("布局树输入校验\n");

  // Valid input
  const validInput: TreeNode[] = [
    { id: "1", parentIds: ["0"], type: "InitiatorNode" },
    { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
    { id: "1-2", parentIds: ["1"], type: "ConditionNode" },
    { id: "1-1-1", parentIds: ["1-1"], type: "ApproverNode" },
    { id: "1-2-1", parentIds: ["1-2"], type: "ApproverNode" },
  ];

  // Invalid: duplicate ID
  const dupInput: TreeNode[] = [
    { id: "1", parentIds: ["0"], type: "InitiatorNode" },
    { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
    { id: "1-1", parentIds: ["1"], type: "ConditionNode" }, // duplicate
  ];

  // Invalid: missing parent, forbidden type, single ConditionNode
  const badInput: TreeNode[] = [
    { id: "1", parentIds: ["0"], type: "InitiatorNode" },
    { id: "1-1", parentIds: ["1"], type: "ConditionNode" },
    { id: "1-2", parentIds: ["999"], type: "ApproverNode" }, // missing parent "999"
    { id: "1-1-1", parentIds: ["1-1"], type: "EmptyNode" }, // forbidden in input
  ];

  demo("合法输入", validInput);
  demo("重复 ID", dupInput);
  demo("缺少父节点 + 禁止类型 + 单 ConditionNode", badInput);
}

run();
