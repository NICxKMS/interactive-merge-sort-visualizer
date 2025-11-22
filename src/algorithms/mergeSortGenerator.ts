// Use a simple counter or random string since uuid might not be available or heavy
const generateId = () => Math.random().toString(36).substr(2, 9);

export type TreeNode = {
  id: string;
  parentId: string | null;
  depth: number;
  values: number[];
  type: 'divide' | 'merge' | 'leaf';
  status: 'active' | 'visited' | 'sorted';
  x: number; // Precise X position
  y: number; // Precise Y position
};

export type SortingFrame = {
  array: number[];
  comparingIndices: number[]; // Indices being compared
  sortedIndices: number[]; // Indices that are fully sorted
  treeNodes: TreeNode[];
  activeNodeId: string | null; // The node currently being processed
  log: string;
  phase: 'divide' | 'merge' | 'idle' | 'completed';
};

export const generateMergeSortFrames = (initialArray: number[]): SortingFrame[] => {
  const frames: SortingFrame[] = [];
  const treeNodes: TreeNode[] = [];

  // Spacing constant to match BarChart
  const ITEM_SPACING = 1.4;
  const TOTAL_WIDTH = initialArray.length * ITEM_SPACING;
  const CENTER_OFFSET = TOTAL_WIDTH / 2;

  // Helper to calculate X position based on subarray range
  const getXPos = (start: number, end: number) => {
    const centerIndex = (start + end) / 2;
    // 0.5 accounts for the center of the bar itself
    return (centerIndex * ITEM_SPACING) - CENTER_OFFSET + (ITEM_SPACING / 2);
  };

  // Helper to push a new frame
  const pushFrame = (
    array: number[],
    comparing: number[] = [],
    sorted: number[] = [],
    activeNodeId: string | null = null,
    log: string = '',
    phase: 'divide' | 'merge' | 'idle' | 'completed' = 'idle'
  ) => {
    frames.push({
      array: [...array],
      comparingIndices: [...comparing],
      sortedIndices: [...sorted],
      treeNodes: JSON.parse(JSON.stringify(treeNodes)), // Deep copy
      activeNodeId,
      log,
      phase
    });
  };

  pushFrame(initialArray, [], [], null, 'Starting Merge Sort...', 'idle');

  const mergeSort = (
    arr: number[],
    startIdx: number,
    depth: number,
    parentId: string | null
  ): { sorted: number[], nodeId: string } => {

    const nodeId = generateId();
    const isLeaf = arr.length <= 1;
    const endIdx = startIdx + arr.length - 1;

    // TREE LAYOUT LOGIC
    // X: Centered on the subarray it represents
    // Y: Divide tree goes UP, Merge tree goes DOWN? Or Separate?
    // Let's put Divide Tree ABOVE (Positive Y) and Merge Tree BELOW (Negative Y)
    // relative to a center line.
    // Or: Divide tree at Top, Merge tree at Bottom.

    const xPos = getXPos(startIdx, endIdx);
    const yPos = 15 - (depth * 2.5); // Start high, go down

    const node: TreeNode = {
      id: nodeId,
      parentId,
      depth,
      values: [...arr],
      type: isLeaf ? 'leaf' : 'divide',
      status: 'active',
      x: xPos,
      y: yPos
    };

    treeNodes.push(node);

    pushFrame(initialArray, [], [], nodeId, `Dividing subarray [${arr.join(', ')}]`, 'divide');

    if (arr.length <= 1) {
      const n = treeNodes.find(n => n.id === nodeId);
      if (n) n.status = 'visited';
      return { sorted: arr, nodeId };
    }

    const mid = Math.floor(arr.length / 2);
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    mergeSort(leftArr, startIdx, depth + 1, nodeId);
    mergeSort(rightArr, startIdx + mid, depth + 1, nodeId);

    // MERGE PHASE
    // Create a distinct "Merge Node" in a separate tree structure?
    // Or replicate the tree structure mirrored?
    // Let's mirror it below.
    const mergeNodeId = generateId();
    const mergeYPos = -5 - (depth * 2.5); // Start below bars and go down

    const mergeNode: TreeNode = {
      id: mergeNodeId,
      parentId: nodeId, // This connects to the divide node visually?
                        // Actually, in dual tree, merge nodes connect to THEIR parents (other merge nodes).
                        // But here we are building recursively.
                        // A merge node's parent is the merge node of the caller?
                        // We need to track the parent merge node ID.
                        // For visualization simplicity, let's connect Merge Node to its Divide counterpart?
                        // No, that looks messy.
                        // Let's just position them. We can fix connections in the View component
                        // by finding the parent based on structure (checking depth-1 and overlapping range).
                        // OR: We can just say parentId is the Divide Node for now to show the link?
                        // Let's set parentId to null for now and handle connections in the view logic
                        // or try to pass the parent Merge ID down?
                        // Since we are recursing, we don't have the parent merge node created yet!
                        // Actually we do, but we are in the child call.
                        // The parent call creates the parent merge node AFTER children return.
                        // So children merge nodes are created BEFORE parent merge node.
                        // Connections go UP.
      depth: depth,
      values: [],
      type: 'merge',
      status: 'active',
      x: xPos,
      y: mergeYPos
    };

    treeNodes.push(mergeNode);
    pushFrame(initialArray, [], [], mergeNodeId, `Merging subarrays...`, 'merge');

    // Perform Merge
    const mergedArr: number[] = [];
    let i = 0, j = 0;
    let k = startIdx;

    while (i < leftArr.length && j < rightArr.length) {
      pushFrame(initialArray, [startIdx + i, startIdx + mid + j], [], mergeNodeId, `Comparing ${leftArr[i]} vs ${rightArr[j]}`, 'merge');

      if (leftArr[i] <= rightArr[j]) {
        mergedArr.push(leftArr[i]);
        initialArray[k++] = leftArr[i++];
      } else {
        mergedArr.push(rightArr[j]);
        initialArray[k++] = rightArr[j++];
      }

      // Update node value
      const mNode = treeNodes.find(n => n.id === mergeNodeId);
      if (mNode) mNode.values = [...mergedArr];

      pushFrame(initialArray, [k-1], [], mergeNodeId, `Placed ${initialArray[k-1]}`, 'merge');
    }

    while (i < leftArr.length) {
      mergedArr.push(leftArr[i]);
      initialArray[k++] = leftArr[i++];
      const mNode = treeNodes.find(n => n.id === mergeNodeId);
      if (mNode) mNode.values = [...mergedArr];
      pushFrame(initialArray, [k-1], [], mergeNodeId, `Copying ${leftArr[i-1]}`, 'merge');
    }

    while (j < rightArr.length) {
      mergedArr.push(rightArr[j]);
      initialArray[k++] = rightArr[j++];
      const mNode = treeNodes.find(n => n.id === mergeNodeId);
      if (mNode) mNode.values = [...mergedArr];
      pushFrame(initialArray, [k-1], [], mergeNodeId, `Copying ${rightArr[j-1]}`, 'merge');
    }

    const mNode = treeNodes.find(n => n.id === mergeNodeId);
    if (mNode) mNode.status = 'sorted';
    pushFrame(initialArray, [], [], mergeNodeId, `Merged: [${mergedArr.join(', ')}]`, 'merge');

    return { sorted: mergedArr, nodeId: mergeNodeId };
  };

  mergeSort(initialArray, 0, 0, null);
  pushFrame(initialArray, [], initialArray.map((_, i) => i), null, 'Sort Complete!', 'completed');

  return frames;
};
