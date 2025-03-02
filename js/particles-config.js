/**
 * Enhanced particles.js configuration with more interactive elements
 * and GPU acceleration
 */

// Enhanced configuration with multiple particle shapes, better interactivity and GPU acceleration
const particlesConfig = {
    "particles": {
        "number": {
            "value": 40,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": ["circle", "triangle", "edge", "star", "polygon"]
        },
        "opacity": {
            "value": 0.7,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.3,
                "sync": false
            }
        },
        "size": {
            "value": 5,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 120,
            "color": "#ffffff",
            "opacity": 0.8,
            "width": 2.5
        },
        "move": {
            "enable": true,
            "speed": 2, // Default speed (not 3)
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": true,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 0.5
                }
            },
            "push": {
                "particles_nb": 3
            }
        }
    },
    "retina_detect": true,
    // GPU acceleration settings
    "fps_limit": 60,
    "hardware_acceleration": true,  // Attempt hardware acceleration
    "detect_retina": true
};

// Initialize particles with enhanced settings and GPU acceleration
function initializeParticles() {
    try {
        // Apply GPU acceleration via CSS before initialization
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesContainer.style.transform = 'translate3d(0,0,0)';
            particlesContainer.style.willChange = 'transform';
            particlesContainer.style.backfaceVisibility = 'hidden';
            particlesContainer.style.perspective = '1000';
        }
        
        // Initialize particles directly with our enhanced config
        particlesJS('particles-js', particlesConfig);
        console.log("GPU-accelerated particles initialized");
        
        // Apply additional styling if needed
        setTimeout(() => {
            const particlesCanvas = document.querySelector('#particles-js canvas');
            if (particlesCanvas) {
                // Make sure it's properly positioned with GPU acceleration
                particlesCanvas.style.position = "fixed";
                particlesCanvas.style.top = "0";
                particlesCanvas.style.left = "0";
                particlesCanvas.style.transform = "translate3d(0,0,0)";
                particlesCanvas.style.willChange = "transform";
                particlesCanvas.style.backfaceVisibility = "hidden";
            }
        }, 200);
    } catch (error) {
        console.error("Error initializing particles:", error);
        
        // Fallback to simpler initialization if needed
        try {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80 },
                    shape: { type: "circle" },
                    size: { value: 4 },
                    move: { 
                        speed: 1,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                retina_detect: true,
                fps_limit: 60
            });
        } catch (e) {
            console.error("Both particle initialization methods failed:", e);
        }
    }
}

// Optimize particle count based on device performance
function optimizeParticlesForDevice() {
    // Check if device is likely mobile or low power
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPower = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || isLowPower) {
        // Reduce particles for better performance
        particlesConfig.particles.number.value = 20;
        particlesConfig.particles.move.speed = 1;
    } else {
        // Maintain higher particle count on powerful devices
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl && gl.getExtension('WEBGL_debug_renderer_info')) {
            const renderer = gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
            const isHighEnd = /(nvidia|amd|radeon)/i.test(renderer);
            
            if (isHighEnd) {
                // Increase particles on high-end GPUs
                particlesConfig.particles.number.value = 60;
                particlesConfig.particles.move.speed = 2.5;
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Optimize for device
    optimizeParticlesForDevice();
    
    // Initialize particles with GPU acceleration
    initializeParticles();
});

// Adjust particles for different screen sizes
window.addEventListener('resize', function() {
    // A small timeout to prevent excessive redraws
    clearTimeout(window.particleResizeTimeout);
    window.particleResizeTimeout = setTimeout(() => {
        // Re-initialize with optimized settings for new screen size
        optimizeParticlesForDevice();
        initializeParticles();
    }, 500);
});
