/**
 * Bridge module that connects the merge sort algorithm with the visualization
 * Handles the layout algorithm and tree structure management
 */

// Enhanced tree layout algorithm with improved node positioning and consistent spacing
function enhanceTreeLayout() {
    // Process both tree containers
    [divideTreeContainer, mergeTreeContainer].forEach(container => {
        const treeType = container === divideTreeContainer ? 'divide' : 'merge';
        const arraySize = array.length;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const treeView = container.closest('.tree-view');
        const containerWidth = treeView.clientWidth - 40; // Account for padding
        
        // Ensure container is proper width
        container.style.width = '100%';
        
        // Get all levels
        const levels = container.querySelectorAll('.level');
        
        // Calculate theoretical node counts
        const maxLevels = Math.ceil(Math.log2(arraySize)) + 1;
        const levelNodeCounts = new Array(maxLevels).fill(0);
        
        for (let i = 0; i < maxLevels; i++) {
            levelNodeCounts[i] = Math.min(arraySize, Math.pow(2, i));
        }
        
        // First pass: gather level data and node dimensions
        const levelData = Array.from(levels).map(level => {
            const levelIndex = parseInt(level.dataset.level);
            const nodes = Array.from(level.querySelectorAll('.node'));
            const nodeWidths = nodes.map(node => node.offsetWidth);
            const nodeHeights = nodes.map(node => node.offsetHeight);
            const maxNodeWidth = Math.max(...nodeWidths, 0);
            const maxNodeHeight = Math.max(...nodeHeights, 0);
            const expectedNodeCount = levelNodeCounts[levelIndex];
            
            return {
                level,
                levelIndex,
                nodes,
                nodeWidths,
                nodeHeights,
                maxNodeWidth,
                maxNodeHeight,
                expectedNodeCount
            };
        });
        
        // Sort level data by level index for consistent processing
        levelData.sort((a, b) => a.levelIndex - b.levelIndex);
        
        // Set consistent level heights - adjust spacing based on screen size
        const isMobile = window.innerWidth <= 480;
        const isTinyScreen = window.innerWidth <= 360;
        
        levelData.forEach(data => {
            // Adjust level spacing for different screen sizes
            let levelSpacing;
            if (isTinyScreen) {
                levelSpacing = 20; // Smallest spacing for tiny screens
            } else if (isMobile) {
                levelSpacing = 30; // Reduced spacing for mobile
            } else {
                levelSpacing = 50; // Standard spacing for desktop
            }
            
            data.level.style.height = `${data.maxNodeHeight + levelSpacing}px`;
        });
        
        // Calculate consistent horizontal spacing for all levels - adjust for screen size
        let globalMinNodeSpacing;
        if (isTinyScreen) {
            globalMinNodeSpacing = 15; // Very tight spacing on tiny screens
        } else if (isMobile) {
            globalMinNodeSpacing = 25; // Tighter spacing on mobile
        } else {
            globalMinNodeSpacing = 60; // Standard spacing for desktop
        }
        
        // Create positioning plan with viewport awareness
        const levelPlans = levelData.map(data => {
            const nodes = data.nodes;
            const nodeCount = nodes.length;
            
            if (nodeCount === 0) return { level: data.level, positions: [] };
            
            // Calculate total width needed for nodes with consistent spacing
            const totalNodesWidth = data.nodeWidths.reduce((sum, w) => sum + w, 0);
            const spacingWidth = (nodeCount - 1) * globalMinNodeSpacing;
            const contentWidth = totalNodesWidth + spacingWidth;
            
            // Determine level width - ensure it's at least container width
            const levelWidth = Math.max(containerWidth, contentWidth + (isMobile ? 40 : 80));
            data.level.style.minWidth = `${levelWidth}px`;
            
            // Calculate positions with improved centering
            const positions = [];
            let startPos = (levelWidth - contentWidth) / 2;
            if (startPos < (isMobile ? 20 : 40)) startPos = (isMobile ? 20 : 40); // Adjusted minimum padding
            
            let currentPos = startPos;
            for (let i = 0; i < nodeCount; i++) {
                positions.push({
                    node: nodes[i],
                    left: currentPos,
                    width: data.nodeWidths[i],
                    center: currentPos + (data.nodeWidths[i] / 2)
                });
                
                currentPos += data.nodeWidths[i] + globalMinNodeSpacing;
            }
            
            return {
                level: data.level,
                levelIndex: data.levelIndex,
                positions
            };
        });
        
        // Store level plans
        container.levelPlans = levelPlans;
        
        // Position nodes
        levelPlans.forEach(plan => {
            plan.positions.forEach(pos => {
                pos.node.style.position = 'absolute';
                pos.node.style.left = `${pos.left}px`;
            });
        });
        
        // Get parent-child relationships
        const parentChildMap = buildParentChildRelationships(container, treeType);
        
        // Align parents above children
        alignNodesWithConsistentSpacing(container, levelPlans, parentChildMap);
        
        // Fix overlaps
        fixAllLevelOverlaps(levelPlans, globalMinNodeSpacing);
        
        // Update connections after layout if not zoomed
        if (parseFloat(container.dataset.scale || '1') === 1) {
            setTimeout(() => updateAllConnections(treeType), 50);
        }
        
        // After positioning all nodes, ensure proper container height
        const lastLevel = levels[levels.length - 1];
        if (lastLevel) {
            const lastLevelBottom = lastLevel.offsetTop + lastLevel.offsetHeight;
            // Add extra padding at the bottom - less on mobile
            const bottomPadding = isMobile ? 50 : 100;
            container.style.minHeight = `${lastLevelBottom + bottomPadding}px`;
        }
    });
}

// Build parent-child relationship maps
function buildParentChildRelationships(container, treeType) {
    const connections = nodeConnections[treeType];
    const parentToChildrenMap = new Map();
    
    connections.forEach(conn => {
        if (!conn.parent || !conn.child) return;
        
        const parentId = conn.parent.id;
        
        if (!parentToChildrenMap.has(parentId)) {
            parentToChildrenMap.set(parentId, []);
        }
        
        parentToChildrenMap.get(parentId).push({
            node: conn.child,
            id: conn.child.id,
            isLeft: conn.isLeft
        });
    });
    
    return parentToChildrenMap;
}

// Align nodes with consistent spacing, prioritizing level-wide consistency
function alignNodesWithConsistentSpacing(container, levelPlans, parentChildMap) {
    // Start from the bottom and work upward for alignment
    for (let i = levelPlans.length - 2; i >= 0; i--) {
        const parentLevelPlan = levelPlans[i];
        const childLevelPlan = levelPlans[i + 1];
        
        if (!parentLevelPlan || !childLevelPlan) continue;
        
        // For each parent, place it centered above its children
        parentLevelPlan.positions.forEach(parentPos => {
            const parentId = parentPos.node.id;
            const children = parentChildMap.get(parentId);
            
            if (!children || children.length < 2) return;
            
            // Find child positions in child level plan
            const childPositions = children.map(child => {
                return childLevelPlan.positions.find(pos => pos.node.id === child.id);
            }).filter(pos => pos); // Filter out any undefined positions
            
            if (childPositions.length < 2) return;
            
            // Calculate center point between children
            const leftChildCenter = childPositions[0].center;
            const rightChildCenter = childPositions[1].center;
            const childrenCenter = (leftChildCenter + rightChildCenter) / 2;
            
            // Position parent centered above children
            const parentCenter = parentPos.center;
            const shift = childrenCenter - parentCenter;
            
            // Update parent position in the plan
            parentPos.left += shift;
            parentPos.center += shift;
            
            // Apply updated position
            parentPos.node.style.left = `${parentPos.left}px`;
        });
    }
}

// Fix all node overlaps across all levels while maintaining consistent spacing
function fixAllLevelOverlaps(levelPlans, minSpacing) {
    levelPlans.forEach(plan => {
        // Skip if level has no nodes or only one node
        if (!plan.positions || plan.positions.length < 2) return;
        
        // Sort positions by left coordinate
        const positions = [...plan.positions].sort((a, b) => a.left - b.left);
        
        // Check for overlaps and fix them
        for (let i = 0; i < positions.length - 1; i++) {
            const current = positions[i];
            const next = positions[i + 1];
            
            const currentRight = current.left + current.width;
            const requiredNextLeft = currentRight + minSpacing;
            
            // If next node is too close to current
            if (next.left < requiredNextLeft) {
                const shift = requiredNextLeft - next.left;
                
                // Shift all subsequent nodes to maintain spacing
                for (let j = i + 1; j < positions.length; j++) {
                    positions[j].left += shift;
                    positions[j].center += shift;
                    
                    // Apply the new position
                    positions[j].node.style.left = `${positions[j].left}px`;
                }
            }
        }
        
        // Update level width to accommodate any shifted nodes
        const rightmostEdge = positions[positions.length - 1].left + positions[positions.length - 1].width;
        const requiredWidth = rightmostEdge + 40; // Add padding
        
        if (requiredWidth > plan.level.offsetWidth) {
            plan.level.style.minWidth = `${requiredWidth}px`;
        }
    });
}

// Update layout based on viewport size
function updateLayoutForViewport() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth <= 480;
    
    // Update tree container widths
    [divideTreeContainer, mergeTreeContainer].forEach(container => {
        // Ensure container width is appropriate for viewport
        container.style.width = '100%';
        
        // Apply mobile tree class for additional styling
        if (isMobile) {
            container.classList.add('mobile-tree');
        } else {
            container.classList.remove('mobile-tree');
        }
        
        // Get all levels in this container
        const levels = container.querySelectorAll('.level');
        levels.forEach(level => {
            // Ensure level width is at least container width
            level.style.minWidth = '100%';
        });
    });
    
    // Mobile-specific adjustments
    if (isMobile) {
        // Optimize for mobile: reduce node spacing
        window.mobileView = true;
        
        // Mobile-specific SVG definitions for arrows - add if not present
        setupMobileArrowMarkers();
        
        // Clear any previous transformations and apply mobile-specific scaling
        if (!document.querySelector('.mobile-scale-applied')) {
            setTimeout(() => {
                // Use smaller initial scale for mobile
                const mobileInitialScale = viewportWidth <= 360 ? 0.7 : 0.8;
                
                // Reset zoom for both trees when on mobile
                if (divideTreeScale !== mobileInitialScale) {
                    divideTreeContainer.style.transition = 'transform 0.4s ease';
                    divideTreeContainer.style.transform = `scale(${mobileInitialScale})`;
                    divideTreeContainer.dataset.scale = mobileInitialScale.toString();
                    divideTreeScale = mobileInitialScale;
                }
                
                if (mergeTreeScale !== mobileInitialScale) {
                    mergeTreeContainer.style.transition = 'transform 0.4s ease';
                    mergeTreeContainer.style.transform = `scale(${mobileInitialScale})`;
                    mergeTreeContainer.dataset.scale = mobileInitialScale.toString();
                    mergeTreeScale = mobileInitialScale;
                }
                
                // Mark as applied
                const marker = document.createElement('div');
                marker.className = 'mobile-scale-applied';
                marker.style.display = 'none';
                document.body.appendChild(marker);
                
                // Update connections after scaling with multiple passes to ensure correct positioning
                setTimeout(() => {
                    updateAllConnections();
                    // Do a second pass after a short delay to catch any late layout adjustments
                    setTimeout(() => updateAllConnections(), 300);
                }, 500);
            }, 100);
        }
    } else {
        // Desktop/tablet view
        window.mobileView = false;
        
        // Clean up mobile marker if exists
        const marker = document.querySelector('.mobile-scale-applied');
        if (marker) marker.remove();
    }
}

// Create mobile-specific SVG arrow markers
function setupMobileArrowMarkers() {
    // Check if mobile markers already exist
    if (document.getElementById('arrowhead-divide-mobile')) {
        return;
    }
    
    // Get the existing SVG defs or create new ones if needed
    let svgDefs = document.querySelector('svg > defs');
    if (!svgDefs) {
        // Create new SVG defs element if none exists
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.style.width = "0";
        svgElement.style.height = "0";
        svgElement.style.position = "absolute";
        
        svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svgElement.appendChild(svgDefs);
        document.body.appendChild(svgElement);
    }
    
    // Create smaller markers for mobile view
    const types = [
        { id: "arrowhead-divide-mobile", color: "var(--divide-color)" },
        { id: "arrowhead-merge-mobile", color: "var(--merge-color)" },
        { id: "arrowhead-leaf-mobile", color: "var(--leaf-color)" },
        { id: "arrowhead-mobile", color: "#95a5a6" }
    ];
    
    types.forEach(type => {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", type.id);
        // Smaller marker size for mobile
        marker.setAttribute("markerWidth", "18");  // Smaller than desktop
        marker.setAttribute("markerHeight", "12"); // Smaller than desktop
        marker.setAttribute("refX", "16");         // Adjusted for mobile
        marker.setAttribute("refY", "6");          // Adjusted for mobile
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerUnits", "userSpaceOnUse");
        
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        // Smaller polygon points for mobile arrow
        polygon.setAttribute("points", "0 0, 18 6, 0 12");
        polygon.setAttribute("fill", type.color);
        
        marker.appendChild(polygon);
        svgDefs.appendChild(marker);
    });
}

// Start sorting process
async function startSort() {
    try {
        // Disable the start button to prevent multiple starts
        document.getElementById('startSortBtn').disabled = true;
        
        // Reset the visualization to start fresh
        resetVisualization();
        
        logStep("Starting Merge Sort", "divide");
        
        // Start the merge sort algorithm
        const result = await mergeSort(array, 0, array.length - 1);
        
        // Mark all bars as sorted when complete
        visualization.querySelectorAll('.bar').forEach(bar => {
            bar.classList.add('sorted');
        });
        
        // Final layout enhancement to ensure proper positioning
        enhanceTreeLayout();
        
        // Comprehensive connection update sequence for final visualization
        // First pass - basic update
        updateAllConnections();
        
        // Second pass with timing for smoother animation
        setTimeout(() => {
            // Add transition for smoother appearance
            document.querySelectorAll('.connection-path').forEach(path => {
                path.style.transition = 'stroke-dashoffset 0.4s ease-in-out, stroke-width 0.3s ease';
            });
            
            // Update again to ensure all connections are properly positioned
            updateAllConnections();
            
            // Third pass after layout stabilizes
            setTimeout(() => {
                // Final update for any remaining adjustments
                updateAllConnections();
                
                // Remove transitions after animation completes
                setTimeout(() => {
                    document.querySelectorAll('.connection-path').forEach(path => {
                        path.style.transition = '';
                    });
                }, 500);
            }, 200);
        }, 100);
        
        logStep("Merge Sort Complete! Array is now sorted.", "merge");
        
        // Re-enable the start button
        document.getElementById('startSortBtn').disabled = false;
    } catch (error) {
        console.error("Error during sorting:", error);
        logStep("An error occurred during sorting: " + error.message, "");
        
        // Make sure to re-enable the button even if there's an error
        document.getElementById('startSortBtn').disabled = false;
    }
}

// Export functions if in a module environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enhanceTreeLayout,
        buildParentChildRelationships,
        alignNodesWithConsistentSpacing,
        fixAllLevelOverlaps,
        updateLayoutForViewport,
        startSort
    };
}
