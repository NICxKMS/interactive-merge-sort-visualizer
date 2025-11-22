/**
 * Browser compatibility helpers for the Merge Sort visualization
 */

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // Fix Safari backdrop-filter
    checkBackdropFilterSupport();
    
    // Fix scrollbar styling for browsers that don't support modern properties
    polyfillScrollbars();
    
    // Handle theme-color for browsers that don't support the meta tag
    handleThemeColorCompatibility();
});

// Check and polyfill backdrop-filter for Safari
function checkBackdropFilterSupport() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Check for Safari and apply specific fixes
    if (isSafari) {
        const style = document.createElement('style');
        style.textContent = `
            /* Safari backdrop-filter fallbacks */
            .control-panel, .info-panel, #stepsOutput, #visualization, .tree-view, .zoom-controls, .node-content {
                background-color: rgba(0, 0, 0, 0) !important; /* More opaque background for Safari */
            }
        `;
        document.head.appendChild(style);
    }
}

// Apply custom scrollbar styling to browsers that don't support scrollbar-width
function polyfillScrollbars() {
    // Test for scrollbar-width support
    const hasScrollbarWidth = CSS.supports && CSS.supports('scrollbar-width', 'thin');
    
    if (!hasScrollbarWidth) {
        const style = document.createElement('style');
        style.textContent = `
            /* Custom scrollbar styling for browsers that don't support scrollbar-width */
            #stepsOutput::-webkit-scrollbar {
                width: 8px;
            }
            
            #stepsOutput::-webkit-scrollbar-thumb {
                background-color: var(--accent-color);
                border-radius: 4px;
            }
            
            #stepsOutput::-webkit-scrollbar-track {
                background-color: rgba(20, 20, 20, 0.3);
            }
            
            /* IE support */
            #stepsOutput {
                -ms-overflow-style: -ms-autohiding-scrollbar;
            }
        `;
        document.head.appendChild(style);
    }
}

// Handle theme-color for browsers that don't support the meta tag
function handleThemeColorCompatibility() {
    // Detect Firefox
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // Detect Opera
    const isOpera = (!!window.opr && !!opr.addons) || 
                   !!window.opera || 
                   navigator.userAgent.indexOf(' OPR/') >= 0;
    
    if (isFirefox || isOpera) {
        // For Firefox and Opera, we'll add a small colored stripe at the top of the page
        // This doesn't change the browser chrome but gives a visual indicator
        const themeColorBar = document.createElement('div');
        themeColorBar.style.position = 'fixed';
        themeColorBar.style.top = '0';
        themeColorBar.style.left = '0';
        themeColorBar.style.width = '100%';
        themeColorBar.style.height = '3px';
        themeColorBar.style.background = '#121212';
        themeColorBar.style.zIndex = '9999';
        document.body.appendChild(themeColorBar);
        
        // Add CSS variable for theme color to :root
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --browser-theme-color: #121212;
            }
            
            /* Firefox and Opera specific color enhancements */
            body {
                border-top: 3px solid var(--accent-color);
            }
        `;
        document.head.appendChild(style);
    }
}

// Detect browser support for certain CSS features
function detectCssSupport() {
    // Check for transform: translate3d support
    const has3DTransform = CSS.supports && (
        CSS.supports('transform', 'translate3d(0,0,0)') || 
        CSS.supports('-webkit-transform', 'translate3d(0,0,0)')
    );
    
    // Fallback for older browsers that don't support 3D transforms
    if (!has3DTransform) {
        const style = document.createElement('style');
        style.textContent = `
            /* Fallback for browsers without 3D transform support */
            .node-content, .connection-path, .mobile-tree, .connection-svg {
                transform: none !important;
                -webkit-transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}
