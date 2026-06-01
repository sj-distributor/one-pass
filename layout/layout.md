# Layout 树节点算法题，DAG算法

## 问题描述

现有一个布局树

1. 每个节点都有一个parentIds数组，表示该节点的所有父节点的id。其中首节点的parentIds数组为空或["0"]。
2. 每个节点都有一个类型，分别为: ConditionNode, CcRecipientNode, ApproverNode, InitiatorNode,EmptyNode,EndNode。其中首节点均为InitiatorNode。
3. ConditionNode节点为条件分支节点，同一层级的多个条件分支在汇聚点处共用一个 EmptyNode。
4. EndNode与EmptyNode不会在布局树中出现，需要推导出来。EndNode 的 parentIds 为 DAG 中所有出度为0的叶子节点。id为”汇合点id+A后缀“
5. EndNode节点为结束节点，在布局树转换为DAG图时，全图只有一个EndNode节点和一个InitiatorNode节点。
6. ConditionNode可以条件分支再嵌套条件分支，
7. 虚拟根节点 "0" 不出现在输出中。
8. EndNode节点的parentIds有且只有一个元素，为汇聚点的id。

## 输入输出

输入为一个布局树，输出为一个DAG图。

### 示例 1

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ApproverNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1"],
        type: "CcRecipientNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ApproverNode",
    },
    {
        id: "1-1-1-1-1",
        parentIds: ["1-1-1-1", "1-2-1"],
        type: "ApproverNode",
    }
];

<!-- 示例DAG图 -->


const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ApproverNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1"],
        type: "CcRecipientNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ApproverNode",
    },
    {
        id: "1-1-1-1-A",
        parentIds: ["1-1-1-1", "1-2-1"],
        type: "EmptyNode",
    },
    {
        id: "1-1-1-1-1",
        parentIds: ["1-1-1-1-A"],
        type: "ApproverNode",
    },
    {
        id: "end",
        parentIds: ["1-1-1-1-1"],
        type: "EndNode",
    }
];

```

### 示例 2

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1"],
        type: "ApproverNode",
    },
    {
        id: "1-1-2-1",
        parentIds: ["1-1-2"],
        type: "ApproverNode",
    },
    {
        id: "1-1-1-1-1",
        parentIds: ["1-1-1-1", "1-1-2-1"],
        type: "ApproverNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ApproverNode",
    },
    {
        id: "1-2-1-1",
        parentIds: ["1-2-1"],
        type: "CcRecipientNode",
    },
    {
        id: "1-1-1-1-1-1",
        parentIds: ["1-1-1-1-1", "1-2-1-1"],
        type: "ApproverNode",
    }
];

<!-- 示例DAG图 -->


const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1"],
        type: "ApproverNode",
    },
    {
        id: "1-1-2-1",
        parentIds: ["1-1-2"],
        type: "ApproverNode",
    },
    {
        id: "1-1-1-1-A",
        parentIds: ["1-1-1-1", "1-1-2-1"],
        type: "EmptyNode",
    },
    {
        id: "1-1-1-1-1",
        parentIds: ["1-1-1-1-A"],
        type: "ApproverNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ApproverNode",
    },
    {
        id: "1-2-1-1",
        parentIds: ["1-2-1"],
        type: "CcRecipientNode",
    },
    {
        id: "1-1-1-1-1-A",
        parentIds: ["1-1-1-1-1", "1-2-1-1"],
        type: "EmptyNode",
    }
    {
        id: "1-1-1-1-1-1",
        parentIds: ["1-1-1-1-1-A"],
        type: "ApproverNode",
    },
    {
        id: "end",
        parentIds: ["1-1-1-1-1-1"],
        type: "EndNode",
    }
];

```

### 示例 3

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ApproverNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ApproverNode",
    }

];

<!-- 示例DAG图 -->

const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ApproverNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ApproverNode",
    }
    {
        id: "1-1-1-A",
        parentIds: ["1-1-1", "1-2-1"],
        type: "EmptyNode",
    },
    {
        id: "end",
        parentIds: ["1-1-1-A"],
        type: "EndNode",
    }
];

```

### 示例 4

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ConditionNode",
    },
    {
        id: "1-2-2",
        parentIds: ["1-2"],
        type: "ConditionNode",
    },
];


<!-- 示例DAG图 -->

const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-A",
        parentIds: ["1-1-1", "1-1-2"],
        type: "EmptyNode",
    },
    {
        id: "1-2-1",
        parentIds: ["1-2"],
        type: "ConditionNode",
    },
    {
        id: "1-2-2",
        parentIds: ["1-2"],
        type: "ConditionNode",
    },
    {
        id: "1-2-1-A",
        parentIds: ["1-2-1", "1-2-2"],
        type: "EmptyNode",
    },
    {
        id: "1-1-1-A-A",
        parentIds: ["1-1-1-A", "1-2-1-A"],
        type: "EmptyNode",
    },
    {
        id: "end",
        parentIds: ["1-1-1-A-A"],
        type: "EndNode",
    }
];

```

### 示例 5

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-2",
        parentIds: ["1-1-1"],
        type: "ConditionNode",
    }
];

<!-- 示例DAG图 -->

const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-2",
        parentIds: ["1-1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-1-A",
        parentIds: ["1-1-1-1", "1-1-1-2"],
        type: "EmptyNode",
    },
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
    {
        id: "end",
        parentIds: ["1-1-1-1-A-A-A"],
        type: "EndNode",
    }
];
```

### 示例6

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "2-1",
        parentIds: ["1-1", "1-2"],
        type: "ConditionNode",
    },
    {
        id: "2-2",
        parentIds: ["1-1", "1-2"],
        type: "ConditionNode",
    },
]

<!-- 示例DAG图 -->

const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-A",
        parentIds: ["1-1", "2-1"],
        type: "EmptyNode",
    }
    {
        id: "2-1",
        parentIds: ["1-1-A"],
        type: "ConditionNode",
    },
    {
        id: "2-2",
        parentIds: ["1-1-A"],
        type: "ConditionNode",
    },
    {
        id: "2-1-A",
        parentIds: ["2-1", "2-2"],
        type: "EmptyNode",
    },
    {
        id: "end",
        parentIds: ["2-1-A"],
        type: "EndNode",
    }
];
```

### 示例7

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1", "1-1-2"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-2",
        parentIds: ["1-1-1", "1-1-2"],
        type: "ConditionNode",
    },
]

<!-- 示例DAG图 -->

const dagNodes: TreeNode[] = [
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
        id: "1-2",
        parentIds: ["1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-2",
        parentIds: ["1-1"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-A",
        parentIds: ["1-1-1", "1-1-2"],
        type: "EmptyNode",
    },
    {
        id: "1-1-1-1",
        parentIds: ["1-1-1-A"],
        type: "ConditionNode",
    },
    {
        id: "1-1-1-2",
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
        parentIds: ["1-1-1-1-A", "1-2"],
        type: "EmptyNode",
    },
    {
        id: "end",
        parentIds: ["1-1-1-1-A-A"],
        type: "EndNode",
    }
];
```

### 示例 11

```
type TreeNode = {
    id: string;
    parentIds: string[];
    type: string;
}

<!-- 示例布局树 -->
const treeNodes: TreeNode[] = [
    {
        id: "A",
        parentIds: ["0"],
        type: "InitiatorNode",
    },
    {
        id: "B",
        parentIds: ["A"],
        type: "ConditionNode",
    },
    {
        id: "C",
        parentIds: ["A"],
        type: "ConditionNode",
    },
    {
        id: "D",
        parentIds: ["B"],
        type: "ConditionNode",
    },
    {
        id: "E",
        parentIds: ["B"],
        type: "ConditionNode",
    },
    {
        id: "F",
        parentIds: ["D"],
        type: "ConditionNode",
    },
    {
        id: "G",
        parentIds: ["E"],
        type: "ConditionNode",
    }
]


```