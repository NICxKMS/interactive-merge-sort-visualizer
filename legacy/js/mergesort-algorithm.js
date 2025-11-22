/**
 * Merge Sort Algorithm implementation with visualization support
 */

// Enhanced merge sort with standard top-down tree visualization for both phases
async function mergeSort(arr, start, end, level = 0) {
    if (start >= end) {
        // Leaf node case - single element
        const divideLevel = getLevel(divideTreeContainer, level);
        const leafNodeDivide = createTreeNode([arr[start]], 'leaf', level);
        divideLevel.appendChild(leafNodeDivide);
        
        // Create leaf node in merge tree at the same level
        const mergeLevel = getLevel(mergeTreeContainer, level);
        const leafNodeMerge = createTreeNode([arr[start]], 'leaf', level);
        mergeLevel.appendChild(leafNodeMerge);
        
        logStep(`Leaf node: [${arr[start]}]`, 'divide');
        await sleep(animationSpeed);
        
        // Update layouts
        enhanceTreeLayout();
        
        return { 
            divideNode: leafNodeDivide, 
            mergeNode: leafNodeMerge, 
            array: [arr[start]] 
        };
    }
    
    const mid = Math.floor((start + end) / 2);
    
    // Log divide step
    logStep(`Dividing array [${arr.slice(start, end + 1).join(', ')}]`, 'divide');
    
    // Create divide node in divide tree
    const divideLevel = getLevel(divideTreeContainer, level);
    const divideNode = createTreeNode(arr.slice(start, end + 1), 'divide', level);
    divideLevel.appendChild(divideNode);
    
    // Create a corresponding node in merge tree (will be updated after merge)
    const mergeLevel = getLevel(mergeTreeContainer, level);
    const mergeNode = createTreeNode(arr.slice(start, end + 1), 'merge', level);
    mergeLevel.appendChild(mergeNode);
    
    await sleep(animationSpeed);
    
    // Recursively sort left and right halves
    const leftResult = await mergeSort(arr, start, mid, level + 1);
    const rightResult = await mergeSort(arr, mid + 1, end, level + 1);
    
    // Connect nodes in the divide tree and immediately update for smooth appearance
    const divideConn1 = createConnection(divideTreeContainer, divideNode, leftResult.divideNode, true);
    const divideConn2 = createConnection(divideTreeContainer, divideNode, rightResult.divideNode, false);
    
    // Connect nodes in the merge tree and immediately update for smooth appearance
    const mergeConn1 = createConnection(mergeTreeContainer, mergeNode, leftResult.mergeNode, true);
    const mergeConn2 = createConnection(mergeTreeContainer, mergeNode, rightResult.mergeNode, false);
    
    // Brief delay to let connections be drawn with animation
    await sleep(animationSpeed * 0.2);
    
    // Merge the sorted halves
    const merged = await mergeArrays(leftResult.array, rightResult.array);
    
    // Update original array portion
    for (let i = 0; i < merged.length; i++) {
        arr[start + i] = merged[i];
    }
    
    // Update array visualization
    await updateVisualization(arr, Array.from({length: merged.length}, (_, i) => start + i));
    
    // Update merge node content to show the merged result
    updateNodeContent(mergeNode, merged);
    
    // Log merge step
    logStep(`Merging: [${merged.join(', ')}]`, 'merge');
    
    // Enhance layout after adding new nodes
    enhanceTreeLayout();
    
    // Ensure connections are updated after layout changes
    // Only update the affected connections for better performance
    updateNodeConnections(divideNode, leftResult.divideNode, rightResult.divideNode, 
                          mergeNode, leftResult.mergeNode, rightResult.mergeNode);
    
    return { 
        divideNode: divideNode, 
        mergeNode: mergeNode, 
        array: merged 
    };
}

// Optimized function to update specific node connections
function updateNodeConnections(divideParent, divideLeftChild, divideRightChild, 
                              mergeParent, mergeLeftChild, mergeRightChild) {
    // Update divide tree connections
    if (divideParent && divideLeftChild) {
        updateSpecificConnection(divideTreeContainer, divideParent, divideLeftChild, true);
    }
    if (divideParent && divideRightChild) {
        updateSpecificConnection(divideTreeContainer, divideParent, divideRightChild, false);
    }
    
    // Update merge tree connections
    if (mergeParent && mergeLeftChild) {
        updateSpecificConnection(mergeTreeContainer, mergeParent, mergeLeftChild, true);
    }
    if (mergeParent && mergeRightChild) {
        updateSpecificConnection(mergeTreeContainer, mergeParent, mergeRightChild, false);
    }
}

// Update a specific connection with animation
function updateSpecificConnection(container, parent, child, isLeft) {
    // Find existing connection or create a new one
    const connections = container === divideTreeContainer ? 
        nodeConnections.divide : nodeConnections.merge;
    
    let connection = null;
    
    // Find the existing connection
    for (let conn of connections) {
        if (conn.parent === parent && conn.child === child) {
            connection = conn.connection;
            break;
        }
    }
    
    // If no connection found, create a new one
    if (!connection) {
        connection = createConnection(container, parent, child, isLeft);
    } else {
        // Update the existing connection
        updateConnectionPosition(connection, parent, child);
    }
    
    return connection;
}

// Merge two sorted arrays with visualization
async function mergeArrays(left, right) {
    let result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // Add remaining elements
    result = result.concat(left.slice(i)).concat(right.slice(j));
    await sleep(animationSpeed / 2);
    
    return result;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mergeSort,
        mergeArrays,
        updateNodeConnections,
        updateSpecificConnection
    };
}
