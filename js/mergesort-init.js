/**
 * Initialization module for merge sort visualization
 * Handles event listeners, setup, and DOM interactions
 */

// State variables for the visualization
let array = [];
let animationSpeed = 300;
let isPaused = false;
let pausePromiseResolve = null;
let divideTreeScale = 1;
let mergeTreeScale = 1;
let nodeIdCounter = 0;

// Store node connections to redraw them when needed
const nodeConnections = {
    divide: [],
    merge: []
};

// DOM Element references - initialized when the page loads
let visualization;
let stepsOutput;
let divideTreeContainer;
let mergeTreeContainer;
let speedControl;
let speedValue;
let arraySizeControl;
let sizeUpdateBtn;
let pauseResumeBtn;

// Setup optimized scroll handlers for better performance
function setupScrollHandlers() {
    const divideScrollContainer = divideTreeContainer.parentElement;
    const mergeScrollContainer = mergeTreeContainer.parentElement;
    
    // Apply optimized scroll handlers - no connection updates needed during scrolling
    divideScrollContainer.addEventListener('scroll', () => {
        // Don't update connections during scroll when zoomed
        if (divideTreeScale === 1) {
            requestAnimationFrame(() => updateAllConnections('divide'));
        }
    });
    
    mergeScrollContainer.addEventListener('scroll', () => {
        // Don't update connections during scroll when zoomed
        if (mergeTreeScale === 1) {
            requestAnimationFrame(() => updateAllConnections('merge'));
        }
    });
}

// Enhanced window resize handler
function setupResizeHandler() {
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update layout based on new viewport size
            updateLayoutForViewport();
            
            // Enhance tree layout
            enhanceTreeLayout();
            
            // Update connections after layout changes
            setTimeout(() => {
                updateAllConnections();
            }, 100);
        }, 100);
    });
}

// Setup event listeners for controls
function setupEventListeners() {
    // Update speed value display and variable when slider changes
    speedControl.addEventListener('input', function() {
        animationSpeed = parseInt(this.value);
        speedValue.textContent = animationSpeed + 'ms';
    });
    
    // Update array size when button is clicked
    sizeUpdateBtn.addEventListener('click', function() {
        resetVisualization();
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            togglePause();
            event.preventDefault();
        }
    });
}

// Setup SVG definitions for connection arrows
function setupSvgDefinitions() {
    if (!document.getElementById('connection-animations')) {
        // CSS styles for animations and markers
        const style = document.createElement('style');
        style.id = 'connection-animations';
        style.textContent = `
            @keyframes dashoffset {
                from { stroke-dashoffset: 1000; }
                to { stroke-dashoffset: 0; }
            }
            
            /* Ensure connection visibility during zoom */
            .connection-svg {
                overflow: visible !important;
            }
            
            /* Smoother zoom animations */
            .tree-container {
                transform: scale(1);
                transform-origin: top center;
                transition: transform 0.3s ease-out;
            }
            
            /* Mobile path styles */
            .mobile-path {
                stroke-width: 2.5px;
            }
            
            /* Fix for mobile connections */
            @media (max-width: 480px) {
                .node-connection svg {
                    overflow: visible !important;
                }
                
                .tree-container {
                    transform-origin: top center !important;
                }
                
                /* Ensure mobile paths are visible */
                .connection-path.mobile-path {
                    stroke-opacity: 0.9;
                    stroke-width: 2.5px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // SVG definitions for arrowheads
        const svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgDefs.style.width = "0";
        svgDefs.style.height = "0";
        svgDefs.style.position = "absolute";
        svgDefs.setAttribute("id", "svg-defs-container");
        
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        
        // Create markers for each connection type with increased size
        const types = [
            { id: "arrowhead-divide", color: "var(--divide-color)" },
            { id: "arrowhead-merge", color: "var(--merge-color)" },
            { id: "arrowhead-leaf", color: "var(--leaf-color)" },
            { id: "arrowhead", color: "#95a5a6" }
        ];
        
        types.forEach(type => {
            const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
            marker.setAttribute("id", type.id);
            // Standard size for desktop
            marker.setAttribute("markerWidth", "28");
            marker.setAttribute("markerHeight", "20");
            marker.setAttribute("refX", "24");
            marker.setAttribute("refY", "10");
            marker.setAttribute("orient", "auto");
            marker.setAttribute("markerUnits", "userSpaceOnUse");
            
            const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            polygon.setAttribute("points", "0 0, 28 10, 0 20");
            polygon.setAttribute("fill", type.color);
            
            marker.appendChild(polygon);
            defs.appendChild(marker);
        });
        
        svgDefs.appendChild(defs);
        document.body.appendChild(svgDefs);
    }
}

// Initialize zoom button tooltips
function setupZoomControls() {
    // Add tooltips to zoom buttons
    const zoomBtns = document.querySelectorAll('.zoom-btn');
    zoomBtns.forEach(btn => {
        if (btn.textContent === '+') btn.title = "Zoom in";
        if (btn.textContent === '-') btn.title = "Zoom out";
        if (btn.textContent === '⟲') btn.title = "Reset zoom";
    });
}

// Main initialization function
function initializeMergeSortVisualizer() {
    // Get DOM references
    visualization = document.getElementById('visualization');
    stepsOutput = document.getElementById('stepsOutput');
    divideTreeContainer = document.getElementById('divideTreeContainer');
    mergeTreeContainer = document.getElementById('mergeTreeContainer');
    speedControl = document.getElementById('speed');
    speedValue = document.getElementById('speedValue');
    arraySizeControl = document.getElementById('arraySize');
    sizeUpdateBtn = document.getElementById('sizeUpdate');
    pauseResumeBtn = document.getElementById('pauseResumeBtn');
    
    // Initialize tree containers with proper dimensions for visual consistency
    const setupTreeContainers = () => {
        // Match containers width
        const containerWidth = document.querySelector('.container').offsetWidth;
        const treeViews = document.querySelectorAll('.tree-view');
        
        treeViews.forEach(view => {
            // Set width proportional to container but with padding
            view.style.width = 'calc(100% - 40px)';
            
            // Add welcome animations
            const header = view.querySelector('.tree-view-header');
            if (header) {
                header.style.animation = 'fadeIn 0.8s ease-out forwards';
                header.style.opacity = '0';
                setTimeout(() => { header.style.opacity = '1'; }, 100);
            }
        });
        
        // Add hover effect to empty tree containers to suggest interactivity
        [divideTreeContainer, mergeTreeContainer].forEach(container => {
            container.addEventListener('mouseenter', function() {
                if (this.children.length === 0) {
                    this.style.transform = 'scale(1.01)';
                    this.style.transition = 'transform 0.3s ease';
                }
            });
            
            container.addEventListener('mouseleave', function() {
                if (this.children.length === 0) {
                    this.style.transform = 'scale(1)';
                }
            });
        });
    };
    
    // Initialize visualization appearance
    const initializeVisuals = () => {
        // Add a pulsing effect to the start button to draw attention
        const startBtn = document.getElementById('startSortBtn');
        if (startBtn) {
            // Remove pulse animation after first click
            startBtn.addEventListener('click', function() {
                this.style.animation = 'none';
            }, { once: true });
        }
        
        // Initialize array with visually pleasing pattern instead of random
        // This makes the initial state more interesting
        initArrayWithPattern();
    };
    
    // Initialize array with a pattern (ascending, descending, or other pattern)
    function initArrayWithPattern() {
        array = [];
        visualization.innerHTML = '';
        const arraySize = parseInt(arraySizeControl.value);
        
        // Create an array with a visually interesting pattern
        let pattern = Math.floor(Math.random() * 4); // 0-3 for different patterns
        
        switch (pattern) {
            case 0: // Ascending
                for (let i = 0; i < arraySize; i++) {
                    let value = Math.floor(10 + (i * (80 / arraySize))) + Math.floor(Math.random() * 10);
                    array.push(value);
                }
                break;
                
            case 1: // Descending
                for (let i = 0; i < arraySize; i++) {
                    let value = Math.floor(90 - (i * (80 / arraySize))) + Math.floor(Math.random() * 10);
                    array.push(value);
                }
                break;
                
            case 2: // Mountain pattern
                let mid = arraySize / 2;
                for (let i = 0; i < arraySize; i++) {
                    let distFromMid = Math.abs(i - mid) / mid;
                    let value = Math.floor((1 - distFromMid) * 80) + 10 + Math.floor(Math.random() * 10);
                    array.push(value);
                }
                break;
                
            case 3: // Valley pattern
                let mid2 = arraySize / 2;
                for (let i = 0; i < arraySize; i++) {
                    let distFromMid = Math.abs(i - mid2) / mid2;
                    let value = Math.floor(distFromMid * 80) + 10 + Math.floor(Math.random() * 10);
                    array.push(value);
                }
                break;
                
            default: // Random
                for (let i = 0; i < arraySize; i++) {
                    let value = Math.floor(Math.random() * 80) + 10;
                    array.push(value);
                }
        }
        
        // Create bars with animation
        array.forEach((val, idx) => {
            setTimeout(() => {
                createBar(val);
            }, idx * 50); // Staggered animation
        });
    }
    
    // Initialize scale data attributes for proper connection positions
    divideTreeContainer.dataset.scale = '1';
    mergeTreeContainer.dataset.scale = '1';
    
    // Set up event handlers and SVG definitions
    setupEventListeners();
    setupScrollHandlers();
    setupResizeHandler();
    setupSvgDefinitions();
    setupZoomControls();
    
    // Initialize layout for current viewport
    updateLayoutForViewport();
    
    // Now call our new initialization functions
    setupTreeContainers();
    initializeVisuals();
    
    // Listen for orientation changes on mobile to fix connections
    window.addEventListener('orientationchange', function() {
        // Give the browser time to adjust the layout
        setTimeout(() => {
            updateLayoutForViewport();
            enhanceTreeLayout();
            
            // Multiple connection updates to ensure proper rendering
            setTimeout(() => {
                updateAllConnections();
                setTimeout(() => updateAllConnections(), 300);
            }, 200);
        }, 200);
    });
}

// Execute initialization when the DOM is fully loaded
window.addEventListener('load', initializeMergeSortVisualizer);
