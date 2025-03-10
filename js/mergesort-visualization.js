/**
 * Visualization functions for the merge sort
 * Handles rendering, animations, and UI updates.
 */

// Update visualization on the page with highlighting
async function updateVisualization(arr, highlightIndices = []) {
    try {
        // Batch update for better performance
        const fragment = document.createDocumentFragment();
        
        if (!Array.isArray(arr)) {
            console.error("Invalid array provided to updateVisualization");
            return;
        }
        
        // Determine if we're on mobile for bar sizing
        const isMobile = window.innerWidth <= 480;
        
        arr.forEach((val, idx) => {
            let bar = document.createElement('div');
            bar.className = 'bar';
            if (highlightIndices.includes(idx)) {
                bar.classList.add('comparing');
            }
            
            // Adjust bar height for mobile if needed
            bar.style.height = (val * (isMobile ? 1.5 : 2)) + 'px';
            
            let label = document.createElement('span');
            label.className = 'barLabel';
            label.textContent = val;
            bar.appendChild(label);
            fragment.appendChild(bar);
        });
        
        visualization.innerHTML = '';
        visualization.appendChild(fragment);
        await sleep(animationSpeed);
    } catch (error) {
        console.error("Error in updateVisualization:", error);
    }
}

// Create a tree node with proper styling and unique ID
function createTreeNode(array, phase, level) {
    nodeIdCounter++;
    const nodeId = `node-${phase}-${level}-${nodeIdCounter}`;
    
    const node = document.createElement('div');
    node.className = 'node';
    node.id = nodeId;
    
    const nodeContent = document.createElement('div');
    nodeContent.className = 'node-content';
    
    // Set appropriate phase style
    if (phase === 'divide') {
        nodeContent.classList.add('divide-phase');
    } else if (phase === 'merge') {
        nodeContent.classList.add('merge-phase');
    } else if (phase === 'leaf') {
        nodeContent.classList.add('leaf-node');
    }
    
    const nodeText = document.createElement('div');
    nodeText.className = 'node-text';
    nodeText.textContent = phase === 'leaf' ? 'Leaf' : phase === 'divide' ? 'Divide' : 'Merge';
    
    const arrayValues = document.createElement('div');
    arrayValues.className = 'array-values';
    
    // Check if mobile view for more compact display
    const isMobile = window.innerWidth <= 480;
    const isTinyScreen = window.innerWidth <= 360;
    
    // Adjust text based on array size and device width for better sizing
    if (array.length > (isMobile ? 5 : 12)) {
        // Smaller display on mobile with fewer sample values
        const showItems = isTinyScreen ? 1 : isMobile ? 2 : 5;
        arrayValues.textContent = `[${array.slice(0, showItems).join(', ')}, ... ${array.length - (showItems*2)} more ..., ${array.slice(-showItems).join(', ')}]`;
        // Add title for hover to see full array
        arrayValues.title = `[${array.join(', ')}]`;
    } else {
        arrayValues.textContent = '[' + array.join(', ') + ']';
    }
    
    nodeContent.appendChild(nodeText);
    nodeContent.appendChild(arrayValues);
    node.appendChild(nodeContent);
    
    // Add animation effect
    node.style.opacity = '0';
    node.style.transform = 'scale(0.8)';
    setTimeout(() => {
        node.style.opacity = '1';
        node.style.transform = 'scale(1)';
    }, 50);
    
    return node;
}

// Create or find a level in the specified tree
function getLevel(container, levelIndex) {
    let level = container.querySelector(`.level[data-level="${levelIndex}"]`);
    if (!level) {
        level = document.createElement('div');
        level.className = 'level';
        level.dataset.level = levelIndex;
        level.style.position = 'relative'; // Ensure positioning context
        container.appendChild(level);
        
        // Add extra padding to first level to ensure centering works
        if (levelIndex === 0) {
            level.style.paddingLeft = '20px';
            level.style.paddingRight = '20px';
        }
    }
    return level;
}

// Create a connection between nodes with proper visualization
function createConnection(treeContainer, parentNode, childNode, isLeft) {
    if (!treeContainer || !parentNode || !childNode) {
        console.error("Invalid parameters for createConnection");
        return null;
    }
    
    try {
        // Create a unique ID for this connection
        const connectionId = `conn-${parentNode.id}-to-${childNode.id}`;
        
        // Remove any existing connection with this ID
        const existingConn = document.getElementById(connectionId);
        if (existingConn) existingConn.remove();
        
        // Create a container for the connection
        const connection = document.createElement('div');
        connection.id = connectionId;
        connection.className = 'node-connection';
        
        // Add the connection to the tree container
        treeContainer.appendChild(connection);
        
        // Update the connection position with animation flag for new connections
        updateConnectionPosition(connection, parentNode, childNode, true);
        
        // Store the connection information
        const treeType = treeContainer === divideTreeContainer ? 'divide' : 'merge';
        nodeConnections[treeType].push({
            parent: parentNode,
            child: childNode,
            connection: connection,
            isLeft: isLeft
        });
        
        return connection;
    } catch (error) {
        console.error("Error creating connection:", error);
        return null;
    }
}

// Update the position and appearance of a connection between nodes
function updateConnectionPosition(connection, parentNode, childNode, isNew = false) {
    try {
        if (!connection || !parentNode || !childNode || 
            !parentNode.isConnected || !childNode.isConnected) {
            return;
        }
        
        // Get container bounds
        const treeContainer = parentNode.closest('.tree-container');
        if (!treeContainer) return;
        
        // Determine the phase type for color-coding
        let connectionType = 'default';
        const parentContent = parentNode.querySelector('.node-content');
        
        if (parentContent) {
            if (parentContent.classList.contains('divide-phase')) {
                connectionType = 'divide';
            } else if (parentContent.classList.contains('merge-phase')) {
                connectionType = 'merge';
            } else if (parentContent.classList.contains('leaf-node')) {
                connectionType = 'leaf';
            }
        }
        
        // Check if on mobile for special connection handling
        const isMobile = window.innerWidth <= 480;
        const isTinyScreen = window.innerWidth <= 360;
        
        // Get current scale of the tree container
        const containerScale = parseFloat(treeContainer.dataset.scale || '1');
        
        // Get positions relative to the tree container
        const parentRect = parentNode.getBoundingClientRect();
        const childRect = childNode.getBoundingClientRect();
        const containerRect = treeContainer.getBoundingClientRect();
        
        // Calculate positions relative to the container, accounting for the container's scale
        // This is critical for mobile where we pre-scale the container
        const parentX = (parentRect.left - containerRect.left) / containerScale;
        const parentY = (parentRect.top - containerRect.top) / containerScale;
        const parentWidth = parentRect.width / containerScale;
        const parentHeight = parentRect.height / containerScale;
        
        const childX = (childRect.left - containerRect.left) / containerScale;
        const childY = (childRect.top - containerRect.top) / containerScale;
        const childWidth = childRect.width / containerScale;
        const childHeight = childRect.height / containerScale;
        
        // Position the connection
        connection.style.position = "absolute";
        connection.style.top = "0";
        connection.style.left = "0";
        connection.style.width = "100%";
        connection.style.height = "100%";
        
        // Create SVG element with overflow visible
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.classList.add('connection-svg');
        svg.style.overflow = "visible"; // Ensure paths aren't clipped
        
        // Create path with arrow marker
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.classList.add('connection-path', connectionType);
        
        // Add mobile-specific class for thinner connections
        if (isMobile) {
            path.classList.add('mobile-path');
        }
        
        // Add animation class if it's a new connection
        if (isNew) {
            path.classList.add('new-connection');
        }
        
        // Special handling for merge phase - reverse arrow direction
        if (connectionType === 'merge') {
            // For merge phase, draw arrow from child to parent (upward direction)
            const childCenterX = childX + (childWidth / 2);
            const childTopY = childY;
            const parentCenterX = parentX + (parentWidth / 2);
            const parentBottomY = parentY + parentHeight;
            
            // On mobile, make the path more direct with less curve
            const verticalDistance = childTopY - parentBottomY;
            // Use even straighter paths on mobile for better rendering
            const midpointY = parentBottomY + (verticalDistance * (isMobile ? (isTinyScreen ? 0.3 : 0.35) : 0.5));
            
            // Path data with better control points for mobile
            const pathData = `M ${childCenterX} ${childTopY} ` + 
                          `C ${childCenterX} ${midpointY}, ` + 
                          `${parentCenterX} ${midpointY}, ` + 
                          `${parentCenterX} ${parentBottomY}`;
            
            path.setAttribute("d", pathData);
            
            // Use the appropriate marker for mobile or desktop
            const markerSuffix = isMobile ? '-mobile' : '';
            path.setAttribute("marker-end", `url(#arrowhead-${connectionType}${markerSuffix})`);
        } else {
            // For divide phase and others, keep original top-down arrow direction
            const parentCenterX = parentX + (parentWidth / 2);
            const parentBottomY = parentY + parentHeight;
            const childCenterX = childX + (childWidth / 2);
            const childTopY = childY;
            
            // On mobile, make the path more direct with less curve
            const verticalDistance = childTopY - parentBottomY;
            // Use even straighter paths on mobile for better rendering
            const midpointY = parentBottomY + (verticalDistance * (isMobile ? (isTinyScreen ? 0.3 : 0.35) : 0.5));
            
            // Path data with adjusted control points for mobile
            const pathData = `M ${parentCenterX} ${parentBottomY} ` + 
                          `C ${parentCenterX} ${midpointY}, ` + 
                          `${childCenterX} ${midpointY}, ` + 
                          `${childCenterX} ${childTopY}`;
            
            path.setAttribute("d", pathData);
            
            // Use the appropriate marker for mobile or desktop
            const markerSuffix = isMobile ? '-mobile' : '';
            path.setAttribute("marker-end", `url(#arrowhead-${connectionType}${markerSuffix})`);
        }
        
        // Add animation for new connections - faster on mobile, smoother overall
        if (!connection.hasChildNodes() || isNew) {
            const pathLength = path.getTotalLength ? path.getTotalLength() : 500;
            path.style.strokeDasharray = pathLength;
            path.style.strokeDashoffset = pathLength;
            
            // Use a class-based animation for smoother appearance
            path.style.animation = `dashoffset ${isMobile ? '0.3s' : '0.4s'} ease-in-out forwards`;
        }
        
        svg.appendChild(path);
        connection.innerHTML = '';
        connection.appendChild(svg);
        
    } catch (error) {
        console.error("Error updating connection:", error);
    }
}

// Better zoom function with accurate positioning
function zoom(tree, factor) {
    try {
        // Get the container element
        const container = tree === 'divide' ? divideTreeContainer : mergeTreeContainer;
        const treeView = container.closest('.tree-view');
        
        // Add visual feedback to the button
        const zoomControls = treeView.querySelector('.zoom-controls');
        const zoomBtn = factor > 1 ? 
            zoomControls.querySelector('.zoom-btn[title="Zoom in"]') : 
            zoomControls.querySelector('.zoom-btn[title="Zoom out"]');
        
        if (zoomBtn) {
            zoomBtn.style.backgroundColor = '#e6e6e6';
            setTimeout(() => {
                zoomBtn.style.backgroundColor = '';
            }, 200);
        }
        
        // Get current scroll position before zoom
        const scrollLeft = treeView.scrollLeft;
        const scrollTop = treeView.scrollTop;
        
        // Calculate new scale with limits
        const currentScale = parseFloat(container.dataset.scale || '1');
        const newScale = currentScale * factor;
        
        // Enforce limits
        if (newScale < 0.3 || newScale > 3) {
            return;
        }
        
        // Update scale variables
        if (tree === 'divide') {
            divideTreeScale = newScale;
        } else {
            mergeTreeScale = newScale;
        }
        
        // Apply transform to the container with proper transform-origin
        container.style.transform = `scale(${newScale})`;
        container.dataset.scale = newScale.toString();
        
        // Update the scale indicator in the zoom controls
        const scaleDisplay = document.createElement('div');
        scaleDisplay.className = 'scale-indicator';
        scaleDisplay.textContent = `${Math.round(newScale * 100)}%`;
        scaleDisplay.style.position = 'absolute';
        scaleDisplay.style.top = '-25px';
        scaleDisplay.style.left = '50%';
        scaleDisplay.style.transform = 'translateX(-50%)';
        scaleDisplay.style.background = 'rgba(0,0,0,0.7)';
        scaleDisplay.style.color = 'white';
        scaleDisplay.style.padding = '3px 8px';
        scaleDisplay.style.borderRadius = '4px';
        scaleDisplay.style.fontSize = '12px';
        scaleDisplay.style.opacity = '0';
        scaleDisplay.style.transition = 'opacity 0.3s ease';
        
        // Add to the zoom controls
        zoomControls.appendChild(scaleDisplay);
        
        // Show the indicator briefly
        setTimeout(() => {
            scaleDisplay.style.opacity = '1';
            
            setTimeout(() => {
                scaleDisplay.style.opacity = '0';
                setTimeout(() => {
                    scaleDisplay.remove();
                }, 300);
            }, 1200);
        }, 10);
        
        // Adjust scroll position after zoom to keep content centered
        requestAnimationFrame(() => {
            // Center on current view if zooming in
            if (factor > 1) {
                const scaledHeight = container.scrollHeight * newScale;
                const viewportHeight = treeView.clientHeight;
                treeView.scrollTop = (scaledHeight - viewportHeight) / 2;
            }
        });
        
        console.log(`Zoomed ${tree} tree to scale: ${newScale}`);
    } catch (error) {
        console.error("Error in zoom function:", error);
    }
}

function resetZoom(tree) {
    try {
        // Get the container
        const container = tree === 'divide' ? divideTreeContainer : mergeTreeContainer;
        const treeView = container.closest('.tree-view');
        
        // Add visual feedback
        const resetBtn = treeView.querySelector('.zoom-btn[title="Reset zoom"]');
        if (resetBtn) {
            resetBtn.style.backgroundColor = '#e6e6e6';
            setTimeout(() => {
                resetBtn.style.backgroundColor = '';
            }, 200);
        }
        
        // Get current scale for animation
        const currentScale = parseFloat(container.dataset.scale || '1');
        
        // Reset scale to 1
        if (tree === 'divide') {
            divideTreeScale = 1;
        } else {
            mergeTreeScale = 1;
        }
        
        // Apply transform with transition
        container.style.transition = 'transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)';
        container.style.transform = 'scale(1)';
        container.dataset.scale = '1';
        
        // Reset transition after animation
        setTimeout(() => {
            container.style.transition = '';
        }, 400);
        
        // Show reset indicator
        const zoomControls = treeView.querySelector('.zoom-controls');
        const resetIndicator = document.createElement('div');
        resetIndicator.className = 'scale-indicator';
        resetIndicator.textContent = 'Reset to 100%';
        resetIndicator.style.position = 'absolute';
        resetIndicator.style.top = '-25px';
        resetIndicator.style.left = '50%';
        resetIndicator.style.transform = 'translateX(-50%)';
        resetIndicator.style.background = 'rgba(0,0,0,0.7)';
        resetIndicator.style.color = 'white';
        resetIndicator.style.padding = '3px 8px';
        resetIndicator.style.borderRadius = '4px';
        resetIndicator.style.fontSize = '12px';
        resetIndicator.style.opacity = '0';
        resetIndicator.style.transition = 'opacity 0.3s ease';
        
        // Add to the zoom controls
        zoomControls.appendChild(resetIndicator);
        
        // Show the indicator briefly
        setTimeout(() => {
            resetIndicator.style.opacity = '1';
            
            setTimeout(() => {
                resetIndicator.style.opacity = '0';
                setTimeout(() => {
                    resetIndicator.remove();
                }, 300);
            }, 1200);
        }, 10);
    } catch (error) {
        console.error("Error in resetZoom function:", error);
    }
}

// Simplified update all connections function
function updateAllConnections(tree) {
    // Handle single tree or both trees
    const treesToUpdate = tree ? [tree] : ['divide', 'merge'];
    
    treesToUpdate.forEach(treeType => {
        try {
            const connections = nodeConnections[treeType];
            const treeContainer = treeType === 'divide' ? divideTreeContainer : mergeTreeContainer;
            
            connections.forEach(conn => {
                if (conn.parent && conn.child && 
                    conn.parent.isConnected && conn.child.isConnected) {
                    
                    // Get existing connection or create a new one
                    let connection = conn.connection;
                    if (!connection || !connection.isConnected) {
                        connection = createConnection(treeContainer, conn.parent, conn.child, conn.isLeft);
                        conn.connection = connection;
                    }
                    
                    // Update the connection position - not a new connection for performance
                    updateConnectionPosition(connection, conn.parent, conn.child, false);
                }
            });
        } catch (error) {
            console.error(`Error updating connections for ${tree} tree:`, error);
        }
    });
}

// Export these functions if in a module environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateVisualization,
        createTreeNode,
        getLevel,
        createConnection,
        updateConnectionPosition,
        zoom,
        resetZoom,
        updateAllConnections
    };
}
