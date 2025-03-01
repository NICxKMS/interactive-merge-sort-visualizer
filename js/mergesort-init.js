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
        `;
        document.head.appendChild(style);
        
        // SVG definitions for arrowheads
        const svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgDefs.style.width = "0";
        svgDefs.style.height = "0";
        svgDefs.style.position = "absolute";
        
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        
        // Create markers for each connection type
        const types = [
            { id: "arrowhead-divide", color: "var(--divide-color)" },
            { id: "arrowhead-merge", color: "var(--merge-color)" },
            { id: "arrowhead-leaf", color: "var(--leaf-color)" },
            { id: "arrowhead", color: "#95a5a6" }
        ];
        
        types.forEach(type => {
            const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
            marker.setAttribute("id", type.id);
            marker.setAttribute("markerWidth", "10");
            marker.setAttribute("markerHeight", "7");
            marker.setAttribute("refX", "9");
            marker.setAttribute("refY", "3.5");
            marker.setAttribute("orient", "auto");
            marker.setAttribute("markerUnits", "userSpaceOnUse"); // Better for zooming
            
            const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
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
    
    // Initialize the array visualization
    initArray();
}

// Execute initialization when the DOM is fully loaded
window.addEventListener('load', initializeMergeSortVisualizer);
