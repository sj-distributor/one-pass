<?php
/**
 * validate-input.php — 布局树输入合法性校验 (PHP 版)
 *
 * 用法:
 *   php validate-input.php                      # 使用内置示例
 *   php validate-input.php data.json             # 从 JSON 文件读取
 *   cat data.json | php validate-input.php       # 从 stdin 读取
 */

class LayoutValidator
{
    private array $errors = [];
    private array $warnings = [];

    private const KNOWN_TYPES = [
        'InitiatorNode',
        'ConditionNode',
        'ApproverNode',
        'CcRecipientNode',
        'EmptyNode',
        'EndNode',
    ];

    private const FORBIDDEN_INPUT_TYPES = ['EmptyNode', 'EndNode'];

    /**
     * @param array<int, array{id:string, parentIds:string[], type:string}> $nodes
     * @return array{valid: bool, errors: string[], warnings: string[]}
     */
    public function validate(array $nodes): array
    {
        $this->errors = [];
        $this->warnings = [];

        // 1. Unique IDs
        $ids = array_column($nodes, 'id');
        $counts = array_count_values($ids);
        foreach ($counts as $id => $count) {
            if ($count > 1) {
                $this->error("[dup-id] 节点 id \"{$id}\" 重复出现 {$count} 次");
            }
        }

        // 2. Exactly one InitiatorNode
        $initiators = array_values(array_filter($nodes, fn($n) => $n['type'] === 'InitiatorNode'));
        if (count($initiators) === 0) {
            $this->error('[no-init] 缺少 InitiatorNode');
        } elseif (count($initiators) > 1) {
            $initIds = implode(', ', array_column($initiators, 'id'));
            $this->error("[multi-init] 存在 " . count($initiators) . " 个 InitiatorNode: [{$initIds}]");
        }

        // 3. InitiatorNode parentIds
        if (count($initiators) === 1) {
            $init = $initiators[0];
            $pids = array_values(array_filter($init['parentIds'], fn($p) => $p !== '0'));
            if (!empty($pids)) {
                $pidStr = implode(', ', $init['parentIds']);
                $this->error("[init-parent] InitiatorNode \"{$init['id']}\" 的 parentIds 应仅为 [\"0\"] 或 [], 实际: [{$pidStr}]");
            }
        }

        // 4. All parentIds reference existing nodes (or "0")
        $idSet = array_flip($ids); // id => index
        foreach ($nodes as $n) {
            foreach ($n['parentIds'] as $pid) {
                if ($pid === '0') continue;
                if (!isset($idSet[$pid])) {
                    $this->error("[missing-parent] 节点 \"{$n['id']}\" 的 parentId \"{$pid}\" 不存在");
                }
            }
        }

        // 5. No cycles (skip if duplicate IDs corrupt the graph)
        $cycleNodes = null;
        if (count($ids) === count(array_unique($ids))) {
            $cycleNodes = $this->detectCycle($nodes);
            if ($cycleNodes !== null) {
                $cycleStr = implode(', ', $cycleNodes);
                $this->error("[cycle] 检测到循环引用, 涉及节点: [{$cycleStr}]");
            }
        }

        // 6. All nodes reachable from InitiatorNode
        if (count($initiators) === 1 && $cycleNodes === null && count($ids) === count(array_unique($ids))) {
            $graph = $this->buildGraph($nodes);
            $visited = [];
            $queue = [$initiators[0]['id']];
            $head = 0;

            while ($head < count($queue)) {
                $cur = $queue[$head++];
                if (isset($visited[$cur])) continue;
                $visited[$cur] = true;

                foreach (($graph['children'][$cur] ?? []) as $child) {
                    if (!isset($visited[$child])) {
                        $queue[] = $child;
                    }
                }
            }

            $unreachable = [];
            foreach ($nodes as $n) {
                if (!isset($visited[$n['id']])) {
                    $unreachable[] = $n['id'];
                }
            }
            if (!empty($unreachable)) {
                $unrStr = implode(', ', $unreachable);
                $count = count($unreachable);
                $this->error("[unreachable] {$count} 个节点无法从 InitiatorNode 到达: [{$unrStr}]");
            }
        }

        // 7. Forbidden types in input
        foreach ($nodes as $n) {
            if (in_array($n['type'], self::FORBIDDEN_INPUT_TYPES, true)) {
                $this->error("[forbidden-type] 节点 \"{$n['id']}\" 的类型 \"{$n['type']}\" 不应出现在输入中（由算法推导）");
            }
        }

        // 8. ConditionNode sibling groups (warning)
        $groupMap = [];
        foreach ($nodes as $n) {
            if ($n['type'] !== 'ConditionNode') continue;
            $key = implode(',', $n['parentIds']);
            sort($n['parentIds']); // sort for key consistency
            $key = implode(',', $n['parentIds']);
            $groupMap[$key][] = $n['id'];
        }
        foreach ($groupMap as $key => $members) {
            if (count($members) < 2) {
                $this->warning("[single-cond] ConditionNode \"{$members[0]}\" (parentIds=[{$key}]) 是唯一的条件分支节点，可能缺少配对");
            }
        }

        // 9. Known types
        foreach ($nodes as $n) {
            if (!in_array($n['type'], self::KNOWN_TYPES, true)) {
                $this->error("[unknown-type] 节点 \"{$n['id']}\" 的类型 \"{$n['type']}\" 不是已知类型");
            }
        }

        return [
            'valid' => empty($this->errors),
            'errors' => $this->errors,
            'warnings' => $this->warnings,
        ];
    }

    private function error(string $msg): void
    {
        $this->errors[] = $msg;
    }

    private function warning(string $msg): void
    {
        $this->warnings[] = $msg;
    }

    private function buildGraph(array $nodes): array
    {
        $children = [];
        $inDegree = [];

        foreach ($nodes as $n) {
            $id = $n['id'];
            if (!isset($children[$id])) $children[$id] = [];
            if (!isset($inDegree[$id])) $inDegree[$id] = 0;
        }

        foreach ($nodes as $n) {
            foreach ($n['parentIds'] as $pid) {
                if ($pid === '0') continue;
                if (isset($children[$pid])) {
                    $children[$pid][] = $n['id'];
                }
                $inDegree[$n['id']] = ($inDegree[$n['id']] ?? 0) + 1;
            }
        }

        return ['children' => $children, 'inDegree' => $inDegree];
    }

    /** @return string[]|null — list of nodes in cycle, or null if acyclic */
    private function detectCycle(array $nodes): ?array
    {
        $graph = $this->buildGraph($nodes);
        $deg = $graph['inDegree'];
        $children = $graph['children'];

        $queue = [];
        foreach ($deg as $id => $d) {
            if ($d === 0) $queue[] = $id;
        }

        $sorted = [];
        $head = 0;
        while ($head < count($queue)) {
            $cur = $queue[$head++];
            $sorted[] = $cur;

            foreach (($children[$cur] ?? []) as $child) {
                $deg[$child]--;
                if ($deg[$child] === 0) {
                    $queue[] = $child;
                }
            }
        }

        if (count($sorted) < count($nodes)) {
            $sortedSet = array_flip($sorted);
            $cycleIds = [];
            foreach ($nodes as $n) {
                if (!isset($sortedSet[$n['id']])) {
                    $cycleIds[] = $n['id'];
                }
            }
            return $cycleIds;
        }

        return null;
    }
}

// ── demo / CLI ───────────────────────────────────────────────────────

function loadInput(): array
{
    global $argv;

    // Read from file argument
    if (isset($argv[1]) && file_exists($argv[1])) {
        $json = file_get_contents($argv[1]);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }

    // Read from stdin (piped or redirected)
    $stdin = file_get_contents('php://stdin');
    if (!empty(trim($stdin))) {
        $data = json_decode($stdin, true);
        if (is_array($data)) return $data;
    }

    return [];
}

function printResult(string $label, array $result): void
{
    $status = $result['valid'] ? '✓ 合法' : '✗ 不合法';
    echo "\n{$label}: {$status}\n";
    foreach ($result['errors'] as $e) {
        echo "  ❌ {$e}\n";
    }
    foreach ($result['warnings'] as $w) {
        echo "  ⚠️  {$w}\n";
    }
    if (empty($result['errors']) && empty($result['warnings'])) {
        echo "  (无问题)\n";
    }
}

function run(): void
{
    echo "布局树输入校验 (PHP)\n";

    $validator = new LayoutValidator();

    // Try loading from external source first
    $external = loadInput();
    if (!empty($external)) {
        printResult('外部输入', $validator->validate($external));
        return;
    }

    // Built-in demos
    $validInput = [
        ['id' => '1',   'parentIds' => ['0'],  'type' => 'InitiatorNode'],
        ['id' => '1-1', 'parentIds' => ['1'],  'type' => 'ConditionNode'],
        ['id' => '1-2', 'parentIds' => ['1'],  'type' => 'ConditionNode'],
        ['id' => '1-1-1', 'parentIds' => ['1-1'], 'type' => 'ApproverNode'],
        ['id' => '1-2-1', 'parentIds' => ['1-2'], 'type' => 'ApproverNode'],
    ];

    $badInput = [
        ['id' => '1',   'parentIds' => ['0'],  'type' => 'InitiatorNode'],
        ['id' => '1-1', 'parentIds' => ['1'],  'type' => 'ConditionNode'],
        ['id' => '1-1', 'parentIds' => ['1'],  'type' => 'ConditionNode'], // duplicate
        ['id' => '1-2', 'parentIds' => ['999'], 'type' => 'ApproverNode'], // missing parent
        ['id' => '1-3', 'parentIds' => ['1-1'], 'type' => 'EmptyNode'],   // forbidden
        ['id' => '1-4', 'parentIds' => ['1-3'], 'type' => 'UnknownType'], // unknown type
    ];

    printResult('合法输入', $validator->validate($validInput));
    printResult('多重错误输入', $validator->validate($badInput));
}

run();
