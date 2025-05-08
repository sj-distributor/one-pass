import * as d3 from "d3-hierarchy";
import { aperture, omit, slice, startsWith } from "ramda";

import { Node, OnePassFlowNodeDataType } from "../types/one-pass-flow-types";

type DataType = Node["data"] & {
  children: DataType[];
};

// TODO: 后续调整不同层级的计算
export const getDThreeTree = (
  currentNodes: Node<any>[],
  gap?: number,
  isNodeHeight?: boolean,
): { nodes: Node[]; nodeHeight: number } => {
  const toTree = (root: DataType) => {
    const children: DataType[] = currentNodes
      .filter((item) => item.data.parentId === root.id)
      .map((item) => toTree(item.data));

    return {
      ...root,
      children,
    };
  };

  const match = (currentNode: d3.HierarchyNode<DataType>) => {
    treeNode.push(currentNode);
    currentNode.children?.map((item) => match(item));
  };

  const currentTree = toTree(currentNodes[0].data);

  const root: d3.HierarchyNode<DataType> = d3.hierarchy(currentTree);

  const filedsLength = Math.max(currentNodes[0]?.data?.fields?.length ?? 2, 2);

  const nodeHeight = isNodeHeight
    ? Math.max(...currentNodes.map((item) => item.measured?.height ?? 0)) + 100
    : (filedsLength - 2) * 20 + (gap ?? 150);

  const treeLayout = d3.tree<DataType>().nodeSize([304, nodeHeight]);

  treeLayout(root);

  root.x = currentNodes[0].position.x ?? 0;
  root.y = currentNodes[0].position.y ?? 0;

  const treeNode: d3.HierarchyNode<DataType>[] = [];

  match(root);

  // 如果根节点有坐标，需要处理偏移量
  root.descendants().forEach((d) => {
    if (d.y && root.y && d.parent) {
      d.y += root.y;
    }
  });

  return {
    nodes: currentNodes.map((item: Node, index) => {
      const current = treeNode.find((value) => value.data.id === item.data.id);

      return {
        ...item,
        zIndex: currentNodes.length - index,
        data: { ...omit(["children"], item.data) },
        position: {
          x: current?.x ?? item.position.x,
          y: current?.y ?? item.position.y,
        },
      };
    }) as Node[],
    nodeHeight,
  };
};

export const getTreePosition = (
  root: Node,
  end: Node,
  children: Node[],
  isNodeHeight?: boolean,
): Node[] => {
  const { nodes, nodeHeight } = getDThreeTree(
    [root, ...children],
    200,
    isNodeHeight,
  );

  const maxHeight = Math.max(...nodes.map((item) => item.position.y));

  return [
    ...nodes,
    {
      ...end,
      position: { x: root.position.x, y: maxHeight + nodeHeight },
    },
  ];
};

export const getLayout = <
  T extends Record<string, unknown> = OnePassFlowNodeDataType,
>(
  data: Node<T>[],
): Node<T>[] => {
  const resultNodes: Node<T>[] = [];

  const roots = data.filter((item) => !item.id.includes("-"));

  resultNodes.push(roots[0]);

  const trees: Array<Node<T>[]> = aperture(2, roots);

  trees.map(([start, end]) => {
    const currentRoot = resultNodes.find((item) => item.id === start.id);

    if (!currentRoot) {
      throw new Error("Cannot find the end");
    }

    const currentNode = data.filter((item) =>
      startsWith(`${start.id}-`, item.id),
    );

    // 获取该树所有坐标
    const nodes = getTreePosition(
      currentRoot,
      end,
      currentNode,
      true,
    ) as Node<T>[];

    resultNodes.push(...slice(1, Infinity, nodes));
  });

  console.log(resultNodes);

  return resultNodes;
};
