# EmptyNode 处理逻辑

### 第一步：节点数据预处理

```javascript
const mapping = {};
nodes.forEach((node) => {
  mapping[node.id] = node;
});
```

### 第二步：查找全部合并节点

```javascript
const mergedNodes = nodes.filter((node) => node.parent_ids.length > 1);
```

### 第三步：合并节点的父节点分组

```javascript
const parentGroups = {};

mergedNodes.forEach((mergedNode) => {
  const groups = {};
  mergedNode.parent_ids.forEach((parentId) => {
    const parentNode = mapping[parentId];
    const key = parentNode.parent_ids.sort().join(","); // 父ID列表相同代表是同级叶子节点
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(parentNode);
  });
  parentGroups[mergedNode.id] = groups;
});
```

### 第四步：处理生成 EmptyNode

```javascript
Object.keys(parentGroups).forEach((mergedNodeId) => {
  const mergedNode = mapping[mergedNodeId];
  const groups = parentGroups[mergedNodeId];
  let mergedNodeNewParentIds = [];
  Object.keys(groups).forEach((key) => {
    const parentNodes = groups[key];
    if (parentNodes.length > 1) {
      const parentIds = parentNodes.map((node) => node.id);
      const emptyNode = {
        // ... 其他属性
        parent_id: parentIds[0],
        parent_ids: parentIds,
      };

      mapping[emptyNode.id] = emptyNode;

      mergedNodeNewParentIds.push(emptyNode.id);
    } else {
      mergedNodeNewParentIds.push(parentNodes[0].id);
    }
  });

  mapping[mergedNode.id].parent_id = mergedNodeNewParentIds[0];
  mapping[mergedNode.id].parent_ids = mergedNodeNewParentIds;
});

nodes = Object.values(mapping);
```
