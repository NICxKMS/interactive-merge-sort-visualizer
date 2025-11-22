// Use a simple counter or random string since uuid might not be available or heavy
const generateId = () => Math.random().toString(36).substr(2, 9);

export type TreeNode = {
  id: string;
  parentId: string | null;
  depth: number;
  values: number[];
  type: 'divide' | 'merge' | 'leaf';
  status: 'active' | 'visited' | 'sorted';
  x?: number; // Position hints
  y?: number;
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
      treeNodes: JSON.parse(JSON.stringify(treeNodes)), // Deep copy to preserve history
      activeNodeId,
      log,
      phase
    });
  };

  // Initial State
  pushFrame(initialArray, [], [], null, 'Starting Merge Sort...', 'idle');

  const mergeSort = (
    arr: number[],
    startIdx: number,
    depth: number,
    parentId: string | null,
    xPos: number // simple x-coordinate logic for tree layout
  ): { sorted: number[], nodeId: string } => {

    const nodeId = generateId();
    const isLeaf = arr.length <= 1;

    const node: TreeNode = {
      id: nodeId,
      parentId,
      depth,
      values: [...arr],
      type: isLeaf ? 'leaf' : 'divide',
      status: 'active',
      x: xPos,
      y: depth * -2 // Visual depth
    };

    treeNodes.push(node);

    pushFrame(
      initialArray, // The main array visualization often stays static during divide or we can animate it.
                    // For this viz, we will keep the main array reflecting the current actual state of the sort.
                    // But during divide, the array doesn't change.
      [],
      [],
      nodeId,
      `Dividing subarray [${arr.join(', ')}]`,
      'divide'
    );

    if (arr.length <= 1) {
      // Base case
      pushFrame(initialArray, [], [], nodeId, `Reached leaf node [${arr[0]}]`, 'divide');

      // Mark as visited/ready to merge
      const n = treeNodes.find(n => n.id === nodeId);
      if (n) n.status = 'visited';

      return { sorted: arr, nodeId };
    }

    const mid = Math.floor(arr.length / 2);
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    // Recursive calls
    // We can try to calculate X positions. Root is 0.
    // Children are at x - offset and x + offset. Offset reduces with depth.
    const offset = 10 / (depth + 1);

    mergeSort(leftArr, startIdx, depth + 1, nodeId, xPos - offset);
    mergeSort(rightArr, startIdx + mid, depth + 1, nodeId, xPos + offset);

    // MERGE PHASE
    const mergedArr: number[] = [];
    let i = 0, j = 0;
    let k = startIdx; // Index in the main array

    // Create a Merge Node
    const mergeNodeId = generateId();
    const mergeNode: TreeNode = {
      id: mergeNodeId,
      parentId: nodeId, // Visually connects back to the divide node or replaces it?
                        // In dual tree, this is a separate tree.
                        // For simplicity in 3D, let's spawn a "Merge Node" at the same position as the Divide Node but maybe different color/shape?
                        // Or we update the existing Divide Node to be a Merge Node.
      depth: depth,
      values: [], // Will fill as we merge
      type: 'merge',
      status: 'active',
      x: xPos,
      y: (depth * -2) - 10 // Render merge tree below? Or maybe just change the existing node.
                           // Let's create a new node for the "Merge Tree" visualization.
    };
    // Actually, updating the existing node type is cleaner for a single tree view that transforms.
    // But the requirement is "Dual Tree".
    // Let's add a separate merge node.
    mergeNode.y = (depth * 2) + 5; // Position merge tree below or inverted.
    treeNodes.push(mergeNode);

    pushFrame(initialArray, [], [], mergeNodeId, `Merging subarrays...`, 'merge');

    while (i < leftArr.length && j < rightArr.length) {
      pushFrame(
        initialArray,
        [startIdx + i, startIdx + mid + j], // Highlighting elements being compared in main array
        [],
        mergeNodeId,
        `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        'merge'
      );

      if (leftArr[i] <= rightArr[j]) {
        mergedArr.push(leftArr[i]);
        initialArray[k] = leftArr[i]; // Update main array in place for visualization
        i++;
      } else {
        mergedArr.push(rightArr[j]);
        initialArray[k] = rightArr[j];
        j++;
      }

      // Update the merge node's values to show progress
      const mNode = treeNodes.find(n => n.id === mergeNodeId);
      if (mNode) mNode.values = [...mergedArr];

      pushFrame(
        initialArray,
        [k], // Highlight the position being filled
        [],
        mergeNodeId,
        `Placed ${initialArray[k]} at index ${k}`,
        'merge'
      );

      k++;
    }

    while (i < leftArr.length) {
      mergedArr.push(leftArr[i]);
      initialArray[k] = leftArr[i];

      const mNode = treeNodes.find(n => n.id === mergeNodeId);
      if (mNode) mNode.values = [...mergedArr];

      pushFrame(initialArray, [k], [], mergeNodeId, `Copying remaining ${leftArr[i]}`, 'merge');
      i++; k++;
    }

    while (j < rightArr.length) {
      mergedArr.push(rightArr[j]);
      initialArray[k] = rightArr[j];

      const mNode = treeNodes.find(n => n.id === mergeNodeId);
      if (mNode) mNode.values = [...mergedArr];

      pushFrame(initialArray, [k], [], mergeNodeId, `Copying remaining ${rightArr[j]}`, 'merge');
      j++; k++;
    }

    // Mark merge node as sorted
    const mNode = treeNodes.find(n => n.id === mergeNodeId);
    if (mNode) mNode.status = 'sorted';

    pushFrame(initialArray, [], [], mergeNodeId, `Merged segment: [${mergedArr.join(', ')}]`, 'merge');

    return { sorted: mergedArr, nodeId: mergeNodeId };
  };

  mergeSort(initialArray, 0, 0, null, 0);

  pushFrame(initialArray, [], initialArray.map((_, i) => i), null, 'Sort Complete!', 'completed');

  return frames;
};
