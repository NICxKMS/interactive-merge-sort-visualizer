
/**
 * Core utility functions for the merge sort visualization
 */

// Initialize array with random values and visualize bars with labels
function initArray() {
    array = [];
    visualization.innerHTML = '';
    const arraySize = parseInt(arraySizeControl.value);
    
    for (let i = 0; i < arraySize; i++) {
        let value = Math.floor(Math.random() * 90) + 10;
        array.push(value);
        createBar(value);
    }
}

// Create a bar element for visualization
function createBar(value) {
    let bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = (value * 2) + 'px';
    
    let label = document.createElement('span');
    label.className = 'barLabel';
    label.textContent = value;
    bar.appendChild(label);
    visualization.appendChild(bar);
}

// Utility: Sleep for animation delay with pause support
function sleep(ms) {
    return new Promise(resolve => {
        if (isPaused) {
            pausePromiseResolve = resolve;
        } else {
            setTimeout(resolve, ms);
        }
    });
}

// Log a step to the stepsOutput container with phase info
function logStep(message, phase = '') {
    const stepElement = document.createElement('div');
    stepElement.className = 'step ' + phase;
    stepElement.innerHTML = message;
    stepsOutput.appendChild(stepElement);
    stepsOutput.scrollTop = stepsOutput.scrollHeight;
}

// Reset visualization with proper cleanup
function resetVisualization() {
    array = [];
    visualization.innerHTML = '';
    stepsOutput.innerHTML = '';
    divideTreeContainer.innerHTML = '';
    mergeTreeContainer.innerHTML = '';
    
    // Reset node ID counter
    nodeIdCounter = 0;
    
    // Reset connection tracking
    nodeConnections.divide = [];
    nodeConnections.merge = [];
    
    initArray();
}

// Helper function to update node content
function updateNodeContent(node, array) {
    const arrayValues = node.querySelector('.array-values');
    if (arrayValues) {
        if (array.length > 12) {
            arrayValues.textContent = `[${array.slice(0, 5).join(', ')}, ... ${array.length - 10} more ..., ${array.slice(-5).join(', ')}]`;
            arrayValues.title = `[${array.join(', ')}]`;
        } else {
            arrayValues.textContent = '[' + array.join(', ') + ']';
        }
    }
}

// Function to toggle pause state
function togglePause() {
    isPaused = !isPaused;
    pauseResumeBtn.textContent = isPaused ? 'Resume' : 'Pause';
    
    // If resuming, resolve the promise waiting in the sleep function
    if (!isPaused && pausePromiseResolve) {
        pausePromiseResolve();
        pausePromiseResolve = null;
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initArray,
        createBar,
        sleep,
        logStep,
        resetVisualization,
        updateNodeContent,
        togglePause
    };
}
