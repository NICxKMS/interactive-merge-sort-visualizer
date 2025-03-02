/**
 * Enhanced particles.js configuration with more interactive elements
 */

// Enhanced configuration with multiple particle shapes and better interactivity
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
            "opacity": 0.7,
            "width": 2.5
        },
        "move": {
            "enable": true,
            "speed": 1, // Default speed (not 3)
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": ["grab", "bubble"]
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 200,
                "line_linked": {
                    "opacity": 0.6
                }
            },
            "bubble": {
                "distance": 150,
                "size": 8,
                "duration": 2,
                "opacity": 0.8
            },
            "repulse": {
                "distance": 100,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 5
            }
        }
    },
    "retina_detect": true
};

// Initialize particles with enhanced settings
function initializeParticles() {
    try {
        // Initialize particles directly with our enhanced config
        particlesJS('particles-js', particlesConfig);
        console.log("Enhanced particles initialized");
        
        // Apply additional styling if needed
        setTimeout(() => {
            const particlesCanvas = document.querySelector('#particles-js canvas');
            if (particlesCanvas) {
                // Make sure it's properly positioned
                particlesCanvas.style.position = "fixed";
                particlesCanvas.style.top = "0";
                particlesCanvas.style.left = "0";
            }
        }, 500);
    } catch (error) {
        console.error("Error initializing particles:", error);
        
        // Fallback to simpler initialization if needed
        try {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 100 },
                    shape: { type: "circle" },
                    size: { value: 5 },
                    move: { speed: 1 }
                }
            });
        } catch (e) {
            console.error("Both particle initialization methods failed:", e);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles immediately
    initializeParticles();
});

// Adjust particles for different screen sizes
window.addEventListener('resize', function() {
    // Allow particles to adapt naturally
});
