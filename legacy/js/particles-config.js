/**
 * Enhanced particles.js configuration with more interactive elements,
 * GPU acceleration, adaptive performance optimization, and graceful fallbacks
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
            "value": ["#4aadff", "#3eef8b", "#ff5a4e", "#ffb52e"] // Multi-color particles
        },
        "shape": {
            "type": ["circle", "triangle", "edge", "star", "polygon"],
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
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
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
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
            "speed": 2,
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
        "detect_on": "window", // Keep this setting
        "events": {
            "onhover": {
                "enable": true,
                "mode": ["grab", "bubble"] // Changed from "trail" to "bubble" for better cursor effects
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 200, // Increased distance for better visibility
                "line_linked": {
                    "opacity": 0.8 // More visible connections
                }
            },
            "bubble": {
                "distance": 250, // Increased distance for effect
                "size": 10,
                "duration": 0.4,
                "opacity": 0.8,
                "speed": 3
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true,
    "fps_limit": 60,
    "hardware_acceleration": true,
    "detect_retina": true
};

// Performance-optimized config for mobile devices
const mobileParticlesConfig = {
    "particles": {
        "number": {
            "value": 20 // Further reduced particles for mobile
        },
        "size": {
            "value": 3
        },
        "line_linked": {
            "distance": 120,
            "opacity": 0.3
        },
        "move": {
            "speed": 0.7 // Slower movement on mobile
        }
    },
    "interactivity": {
        "events": {
            "onhover": {
                "enable": false // Disable hover effects on mobile
            }
        }
    },
    "fps_limit": 30 // Lower FPS for mobile
};

// Check if WebGL is available
function isWebGLAvailable() {
    try {
        const canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
        return false;
    }
}

// Initialize particles with enhanced settings and GPU acceleration
function initializeParticles() {
    // Check for reduced motion preference early
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.info("Reduced motion preference detected, lowering animation effects");
        particlesConfig.particles.move.speed = 0.7;
        particlesConfig.fps_limit = 30;
        particlesConfig.interactivity.events.onhover.enable = false;
    }
    
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
        
        // Fix for interaction issues - ensure the canvas is properly positioned for interaction
        setTimeout(() => {
            const particlesCanvas = document.querySelector('#particles-js canvas');
            if (particlesCanvas) {
                // Make sure it's properly positioned with GPU acceleration
                particlesCanvas.style.position = "fixed";
                particlesCanvas.style.top = "0";
                particlesCanvas.style.left = "0";
                particlesCanvas.style.width = "100vw";
                particlesCanvas.style.height = "100vh";
                particlesCanvas.style.zIndex = "-1";
                particlesCanvas.style.transform = "translate3d(0,0,0)";
                particlesCanvas.style.willChange = "transform";
                particlesCanvas.style.backfaceVisibility = "hidden";
                particlesCanvas.style.pointerEvents = "auto"; // Ensure pointer events work
                
                // Fix mouse coordinate tracking by ensuring canvas dimensions match window
                if (particlesCanvas.width !== window.innerWidth || 
                    particlesCanvas.height !== window.innerHeight) {
                    particlesCanvas.width = window.innerWidth;
                    particlesCanvas.height = window.innerHeight;
                    
                    // Trigger a refresh to apply the new dimensions
                    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                        window.pJSDom[0].pJS.canvas.w = window.innerWidth;
                        window.pJSDom[0].pJS.canvas.h = window.innerHeight;
                        window.pJSDom[0].pJS.fn.particlesRefresh();
                        
                        // Fix mouse position handling in pJS
                        fixMouseInteraction(window.pJSDom[0].pJS);
                    }
                }
                
                // CRITICAL: Fix for high DPI displays (like 150% scaling)
                // Match the drawing buffer size to the display size
                const dpr = window.devicePixelRatio || 1;
                const rect = particlesCanvas.getBoundingClientRect();
                
                // Set canvas dimensions that account for device pixel ratio
                particlesCanvas.width = rect.width * dpr;
                particlesCanvas.height = rect.height * dpr;
                
                // Trigger a refresh to apply the new dimensions
                if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                    window.pJSDom[0].pJS.canvas.w = particlesCanvas.width;
                    window.pJSDom[0].pJS.canvas.h = particlesCanvas.height;
                    
                    // Scale the rendering context for high DPI if needed
                    const ctx = window.pJSDom[0].pJS.canvas.ctx;
                    if (dpr !== 1) {
                        ctx.scale(dpr, dpr);
                    }
                    
                    window.pJSDom[0].pJS.fn.canvasSize();
                    window.pJSDom[0].pJS.fn.canvasPaint();
                    window.pJSDom[0].pJS.fn.particlesRefresh();
                    
                    // Apply the DPI-aware mouse interaction handler
                    fixMouseInteraction(window.pJSDom[0].pJS);
                }
                
                // Log the DPI scaling being used
                console.log(`Applied DPI scaling factor: ${dpr}x`);
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

// Fix mouse interaction by overriding the mouse move handler with DPI scaling awareness
function fixMouseInteraction(pJS) {
    if (!pJS) return;
    
    // Get display scaling factor from devicePixelRatio
    const getScalingFactor = () => {
        // DevicePixelRatio accounts for OS scaling (like 150% in Windows)
        const dpr = window.devicePixelRatio || 1;
        return dpr;
    };
    
    // Get canvas element and its context for accurate coordinate mapping
    const canvas = pJS.canvas.el;
    
    // Create a small indicator to show actual cursor position (for debugging)
    const cursorIndicator = document.createElement('div');
    cursorIndicator.id = 'cursor-indicator';
    cursorIndicator.style.position = 'fixed';
    cursorIndicator.style.width = '10px';
    cursorIndicator.style.height = '10px';
    cursorIndicator.style.borderRadius = '50%';
    cursorIndicator.style.background = 'rgba(255, 255, 255, 0.7)';
    cursorIndicator.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
    cursorIndicator.style.transform = 'translate(-50%, -50%)';
    cursorIndicator.style.pointerEvents = 'none';
    cursorIndicator.style.zIndex = '9999';
    cursorIndicator.style.opacity = '0';
    document.body.appendChild(cursorIndicator);
    
    // Fix the particle interactivity by directly updating mouse position with scaling awareness
    window.addEventListener('mousemove', function(e) {
        if (!pJS || !pJS.interactivity) return;
        
        if (!pJS.interactivity.el) {
            pJS.interactivity.el = window;
        }
        
        // Get current scaling factor
        const scalingFactor = getScalingFactor();
        
        // Get canvas bounds
        const rect = canvas.getBoundingClientRect();
        
        // Calculate the correct mouse position within the canvas
        // This handles the scaling factor correctly
        const canvasX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const canvasY = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        // Set all mouse position variables - crucial for fixing the offset
        pJS.interactivity.mouse.pos_x = canvasX;
        pJS.interactivity.mouse.pos_y = canvasY;
        pJS.interactivity.mouse.click_pos_x = canvasX;
        pJS.interactivity.mouse.click_pos_y = canvasY;
        pJS.interactivity.mouse.position_x = canvasX;
        pJS.interactivity.mouse.position_y = canvasY;
        pJS.interactivity.status = 'mousemove';
        
        // For debugging - show the cursor indicator at the exact client position
        cursorIndicator.style.left = e.clientX + 'px';
        cursorIndicator.style.top = e.clientY + 'px';
        
        // Uncomment this line to show the indicator for debugging
        // cursorIndicator.style.opacity = '1';
        
        // Log positions for debugging (uncomment if needed)
        // console.log(`Client: ${e.clientX}, ${e.clientY} | Canvas: ${canvasX}, ${canvasY} | Scale: ${scalingFactor}`);
        
        // Manually check for particle interactions
        manualCheckParticleInteractions(pJS, canvasX, canvasY);
    });
    
    // Also handle touch events with the same scaling awareness
    window.addEventListener('touchmove', function(e) {
        if (!pJS || !pJS.interactivity || e.touches.length === 0) return;
        
        // Get canvas bounds
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        
        // Calculate the correct touch position with scaling
        const canvasX = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const canvasY = (touch.clientY - rect.top) * (canvas.height / rect.height);
        
        // Set all mouse position variables for touch
        pJS.interactivity.mouse.pos_x = canvasX;
        pJS.interactivity.mouse.pos_y = canvasY;
        pJS.interactivity.mouse.click_pos_x = canvasX;
        pJS.interactivity.mouse.click_pos_y = canvasX;
        pJS.interactivity.mouse.position_x = canvasX;
        pJS.interactivity.mouse.position_y = canvasY;
        pJS.interactivity.status = 'touchmove';
        
        // Manually check for particle interactions
        manualCheckParticleInteractions(pJS, canvasX, canvasY);
    });
    
    console.log("Enhanced mouse interaction with DPI scaling fix installed");
}

// Function to manually check particle interactions with the correctly scaled mouse position
function manualCheckParticleInteractions(pJS, mouseX, mouseY) {
    if (!pJS || !pJS.particles || !pJS.particles.array) return;
    
    // Get the interaction mode and settings
    const hoverEnabled = pJS.interactivity.events.onhover.enable;
    if (!hoverEnabled) return;
    
    const hoverModes = Array.isArray(pJS.interactivity.events.onhover.mode) 
        ? pJS.interactivity.events.onhover.mode 
        : [pJS.interactivity.events.onhover.mode];
    
    // Process each enabled mode
    hoverModes.forEach(mode => {
        switch(mode) {
            case "grab":
                processGrabMode(pJS, mouseX, mouseY);
                break;
            case "bubble":
                processBubbleMode(pJS, mouseX, mouseY);
                break;
            case "repulse":
                processRepulseMode(pJS, mouseX, mouseY);
                break;
            case "trail":
                processTrailMode(pJS, mouseX, mouseY);
                break;
        }
    });
    
    // Force redraw to show interactions
    if (typeof pJS.fn.particlesDraw === 'function') {
        pJS.fn.particlesDraw();
    }
}

// Process grab mode interaction
function processGrabMode(pJS, mouseX, mouseY) {
    const grabDistance = pJS.interactivity.modes.grab.distance;
    const lineOpacity = pJS.interactivity.modes.grab.line_linked.opacity;
    
    // For each particle, check if it's within grab distance
    pJS.particles.array.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= grabDistance) {
            // Process interaction between particles
            pJS.particles.array.forEach(p2 => {
                if (p !== p2) {
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    
                    // Only draw lines between nearby particles
                    if (dist2 <= pJS.particles.line_linked.distance) {
                        // Calculate opacity based on distance
                        const opacityLine = lineOpacity - (distance / grabDistance);
                        
                        if (opacityLine > 0) {
                            // Set line properties for particles.js to use
                            p.opacity_line_linked = opacityLine;
                            p.grabbed = true;
                            p2.grabbed = true;
                        }
                    }
                }
            });
        }
    });
}

// Process bubble mode interaction
function processBubbleMode(pJS, mouseX, mouseY) {
    const bubbleDistance = pJS.interactivity.modes.bubble.distance;
    
    pJS.particles.array.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= bubbleDistance) {
            // Apply bubble effect - temp size change
            const size = pJS.interactivity.modes.bubble.size;
            const opacity = pJS.interactivity.modes.bubble.opacity;
            
            p.bubble_size = size;
            p.bubble_opacity = opacity;
            
            // Store the fact that this particle is being affected by bubble mode
            p.bubbled = true;
        }
    });
}

// Process repulse mode interaction
function processRepulseMode(pJS, mouseX, mouseY) {
    const repulseDistance = pJS.interactivity.modes.repulse.distance;
    
    pJS.particles.array.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= repulseDistance) {
            // Calculate repulse strength based on distance
            const normVec = {
                x: dx / distance,
                y: dy / distance
            };
            
            const repulseFactor = (1 - Math.pow((distance / repulseDistance), 2)) * 5;
            
            // Apply repulse force
            p.vx = p.vx - normVec.x * repulseFactor;
            p.vy = p.vy - normVec.y * repulseFactor;
        }
    });
}

// Process trail mode interaction
function processTrailMode(pJS, mouseX, mouseY) {
    // Trail mode typically adds particles, which requires modifying the particle array
    // This is just an example implementation
    const trailSettings = pJS.interactivity.modes.trail || { delay: 0.005, quantity: 1 };
    
    // Only add particles occasionally based on delay
    if (Math.random() > trailSettings.delay) {
        // Add particles near mouse position
        for (let i = 0; i < trailSettings.quantity; i++) {
            const newParticle = {
                x: mouseX + (Math.random() - 0.5) * 20,
                y: mouseY + (Math.random() - 0.5) * 20,
                // Add other particle properties as needed
                color: pJS.particles.color,
                opacity: pJS.particles.opacity,
                size: pJS.particles.size
            };
            
            // Add new particle if possible
            if (typeof pJS.fn.modes.pushParticle === 'function') {
                pJS.fn.modes.pushParticle(newParticle);
            }
        }
    }
}

// Initialize particles with WebGL fallback
function initializeParticlesWithFallback() {
    if (isWebGLAvailable()) {
        // Ensure critical properties exist before setting them
        if (!particlesConfig.particles.move) {
            particlesConfig.particles.move = {};
        }
        
        // Prevent the stack overflow error by modifying the config
        particlesConfig.particles.move.enable = true;
        
        // Ensure number.density exists
        if (!particlesConfig.particles.number.density) {
            particlesConfig.particles.number.density = {};
        }
        particlesConfig.particles.number.density.enable = false; // Disable density to prevent stack overflow
        
        // Rest of the initialization
        // ...existing code...
        // Add more initial spacing between particles
        if (particlesConfig.particles.line_linked) {
            particlesConfig.particles.line_linked.distance = Math.max(150, particlesConfig.particles.line_linked.distance);
        }
        
        // Initialize and immediately apply the checkOverlap patch
        initializeParticles();
        patchParticlesJsCheckOverlap();
    } else {
        console.warn("WebGL not supported, using simplified particles config.");
        // Use a simplified config without WebGL dependencies
        const fallbackConfig = {
            particles: {
                number: { 
                    value: 20,
                    density: { enable: false }
                },
                move: { 
                    enable: true,
                    speed: 0.5,
                    random: false
                },
                size: { value: 3 },
                opacity: { value: 0.5 }
            },
            interactivity: {
                events: {
                    onhover: { enable: false }
                }
            },
            retina_detect: false,
            fps_limit: 30
        };
        
        try {
            particlesJS('particles-js', fallbackConfig);
            patchParticlesJsCheckOverlap();
            console.log("Fallback particles initialized");
        } catch (e) {
            console.error("Fallback particles initialization failed:", e);
            // Hide particles container as last resort
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                particlesContainer.style.display = 'none';
            }
        }
    }
}

// Patch the problematic checkOverlap function in particles.js to prevent stack overflow
function patchParticlesJsCheckOverlap() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const pJS = window.pJSDom[0].pJS;
    
    // Only patch if the vendor functions exist
    if (pJS.fn && pJS.fn.vendors) {
        try {
            // Store original function for reference
            const originalCheckOverlap = pJS.fn.vendors.checkOverlap;
            
            // Replace with a non-recursive version that won't overflow the stack
            pJS.fn.vendors.checkOverlap = function(p1, position) {
                // Get all particles array
                const particles = pJS.particles.array;
                
                // Set maximum iterations to prevent infinite loops - reduce from 100 to 30
                const MAX_ITERATIONS = 30;
                let iterations = 0;
                
                // Check for overlap with existing particles with iteration limit
                for (let i = 0; i < particles.length && iterations < MAX_ITERATIONS; i++) {
                    const p2 = particles[i];
                    
                    // Skip if comparing with self
                    if (p2 === p1) continue;
                    
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // If overlapping, adjust position instead of recursively calling
                    if (dist <= p1.radius + p2.radius) {
                        iterations++;
                        
                        // Use more randomness for new positions to avoid getting stuck
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * 50 + (p1.radius + p2.radius);
                        
                        // If position was provided, adjust around it; otherwise use random position
                        if (position) {
                            // Move in random direction away from collision
                            p1.x = position.x + Math.cos(angle) * distance;
                            p1.y = position.y + Math.sin(angle) * distance;
                        } else {
                            // Use completely random position within canvas
                            p1.x = Math.random() * pJS.canvas.w;
                            p1.y = Math.random() * pJS.canvas.h;
                        }
                        
                        // Don't recursively check again, just continue iteration
                        if (iterations >= MAX_ITERATIONS) {
                            // Only log every 10th warning to reduce console spam
                            if (Math.random() < 0.1) {
                                console.log('Max overlap check iterations reached, breaking loop');
                            }
                            return false; // Return false to stop checking
                        }
                        
                        // Check the new position with the same particle instead of recursive call
                        i--; // Recheck the same particle with new position
                    }
                }
                
                return true; // No more overlaps found within iteration limit
            };
            
            // Also patch the particle creation function to add more spacing between particles
            const originalParticleCreate = pJS.fn.particlesCreate;
            if (typeof originalParticleCreate === 'function') {
                pJS.fn.particlesCreate = function() {
                    // Temporarily increase minimum distance between particles
                    const originalDistance = pJS.particles.line_linked.distance;
                    pJS.particles.line_linked.distance *= 1.5;
                    
                    // Call the original function
                    originalParticleCreate.call(this);
                    
                    // Restore original distance
                    pJS.particles.line_linked.distance = originalDistance;
                };
            }
            
            console.log("Patched particles.js checkOverlap function to prevent stack overflow");
        } catch (error) {
            console.error("Failed to patch checkOverlap function:", error);
        }
    }
}

// Optimize particle count based on device performance
function optimizeParticlesForDevice() {
    // Check if device is likely mobile or low power
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isLowPower = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || isLowPower) {
        // Apply mobile configuration using deep merge instead of shallow merge
        deepMerge(particlesConfig, mobileParticlesConfig);
        console.log("Applied mobile particle configuration");
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

// Helper function to perform a deep merge of objects
function deepMerge(target, source) {
    // For each property in source
    for (const key in source) {
        // If the property is an object and exists in target, recursively merge
        if (source[key] && typeof source[key] === 'object' && 
            target[key] && typeof target[key] === 'object') {
            deepMerge(target[key], source[key]);
        } 
        // Otherwise, just copy the property
        else {
            target[key] = source[key];
        }
    }
    return target;
}

// Function to dynamically reduce particle count for performance
function optimizeParticles() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const pJS = window.pJSDom[0].pJS;
    const fps = pJS.fps;
    
    // If framerate is low, reduce particles
    if (fps && fps.value < 40) {
        // Instead of manually splicing the array, reconfigure with new number
        const currentCount = pJS.particles.array.length;
        const newCount = Math.max(Math.round(currentCount * 0.7), 20); // Reduce by 30%, minimum 20
        
        console.log(`Optimizing particles: ${currentCount} → ${newCount}`);
        
        // More aggressive optimization if FPS is very low
        if (fps.value < 30) {
            // Disable animations completely for very poor performance
            pJS.particles.move.speed *= 0.5;
            pJS.particles.opacity.anim.enable = false;
            pJS.particles.size.anim.enable = false;
            
            // Further reduce particle count when FPS is critically low
            pJS.particles.number.value = Math.max(10, pJS.particles.number.value - 5);
        }
        
        // Update the number value and reset particles
        pJS.particles.number.value = newCount;
        pJS.fn.particlesRefresh();
    }
}

// Debug mode for particle visualization
function debugParticles() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const statsContainer = document.createElement('div');
    statsContainer.style.position = 'fixed';
    statsContainer.style.bottom = '10px';
    statsContainer.style.right = '10px';
    statsContainer.style.padding = '5px 10px';
    statsContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    statsContainer.style.color = '#fff';
    statsContainer.style.fontSize = '12px';
    statsContainer.style.zIndex = '9999';
    statsContainer.id = 'particles-debug';
    document.body.appendChild(statsContainer);

    setInterval(() => {
        const pJS = window.pJSDom[0].pJS;
        if (pJS) {
            statsContainer.innerHTML = `Particles: ${pJS.particles.array.length} | FPS: ${Math.round(pJS.fps.value)}`;
        }
    }, 1000);
}

// Track user activity for performance optimization
let lastActive = Date.now();
function setupActivityTracking() {
    // Update last active timestamp on user interaction
    document.addEventListener("mousemove", () => lastActive = Date.now());
    document.addEventListener("click", () => lastActive = Date.now());
    document.addEventListener("keydown", () => lastActive = Date.now());
    document.addEventListener("touchstart", () => lastActive = Date.now());
    document.addEventListener("scroll", () => lastActive = Date.now());
    
    // Check user activity periodically and adjust particle speed
    setInterval(() => {
        if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
        
        const pJS = window.pJSDom[0].pJS;
        const inactive = Date.now() - lastActive > 10000; // 10 seconds of inactivity
        
        if (pJS.particles && pJS.particles.move) {
            // Store original speed if not already stored
            if (!pJS._originalSpeed && inactive) {
                pJS._originalSpeed = pJS.particles.move.speed;
            }
            
            // Adjust speed based on activity
            if (inactive) {
                pJS.particles.move.speed = pJS._originalSpeed * 0.2; // Slow down to 20% when inactive
                console.log("User inactive, reducing particle speed");
            } else if (pJS._originalSpeed) {
                pJS.particles.move.speed = pJS._originalSpeed; // Restore normal speed
                console.log("User active, restoring particle speed");
            }
            
            pJS.fn.particlesRefresh();
        }
    }, 5000);
}

// Enhanced function to check particles visibility and handle performance optimization
function checkParticlesVisibility() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    const rect = particlesContainer.getBoundingClientRect();
    const pJS = window.pJSDom[0].pJS;
    
    // If container is outside viewport, pause rendering
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
        if (pJS.fn.pause && !pJS._isPaused) {
            pJS.fn.pause();
            pJS._isPaused = true;
            console.log("Particles container not visible, pausing rendering");
        }
    } else if (pJS._isPaused && !pJS._pausedForPerformance) {
        // Only resume if not paused for performance reasons
        if (pJS.fn.play) {
            pJS.fn.play();
            pJS._isPaused = false;
            console.log("Particles container visible, resuming rendering");
        }
    }
}

// New function to pause particles during heavy operations like scrolling
function setupPerformanceOptimization() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const pJS = window.pJSDom[0].pJS;
    let scrollTimeout;
    let animationFrameId;
    
    // Pause during scroll
    window.addEventListener('scroll', function() {
        // Skip if already paused for another reason
        if (pJS._isPaused && !pJS._pausedForPerformance) return;
        
        // Pause particles during scroll
        if (pJS.fn.pause && !pJS._pausedForPerformance) {
            pJS.fn.pause();
            pJS._isPaused = true;
            pJS._pausedForPerformance = true;
        }
        
        // Clear any existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // Resume after short delay when scrolling stops
        scrollTimeout = setTimeout(function() {
            if (pJS._pausedForPerformance) {
                // Check if still visible before resuming
                const particlesContainer = document.getElementById('particles-js');
                if (particlesContainer) {
                    const rect = particlesContainer.getBoundingClientRect();
                    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                        pJS.fn.play();
                        pJS._isPaused = false;
                        pJS._pausedForPerformance = false;
                    }
                }
            }
        }, 200); // 200ms delay after scroll stops
    }, { passive: true }); // Use passive listener for better performance
    
    // Pause during other animations with requestAnimationFrame detection
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    let activeAnimationFrames = 0;
    
    // Monitor animation frame requests to detect heavy animations
    window.requestAnimationFrame = function(callback) {
        activeAnimationFrames++;
        
        // Wrap the callback to detect when animation frame completes
        const wrappedCallback = function(timestamp) {
            activeAnimationFrames--;
            
            // If animations are finished, resume particles after delay
            if (activeAnimationFrames === 0 && pJS._pausedForPerformance) {
                // Use timeout to prevent immediate resume if more frames are coming
                clearTimeout(animationFrameId);
                animationFrameId = setTimeout(() => {
                    if (activeAnimationFrames === 0 && pJS._pausedForPerformance) {
                        // Check visibility before resuming
                        const particlesContainer = document.getElementById('particles-js');
                        if (particlesContainer) {
                            const rect = particlesContainer.getBoundingClientRect();
                            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                                if (pJS.fn.play) {
                                    pJS.fn.play();
                                    pJS._isPaused = false;
                                    pJS._pausedForPerformance = false;
                                }
                            }
                        }
                    }
                }, 300);
            }
            
            // Call the original callback
            return callback(timestamp);
        };
        
        // If many animation frames are active, pause particles
        if (activeAnimationFrames > 5 && !pJS._pausedForPerformance && !pJS._isPaused && pJS.fn.pause) {
            pJS.fn.pause();
            pJS._isPaused = true;
            pJS._pausedForPerformance = true;
        }
        
        return originalRequestAnimationFrame.call(window, wrappedCallback);
    };
    
    // Monitor CSS animations and transitions
    document.addEventListener('animationstart', pauseForAnimation, { passive: true });
    document.addEventListener('transitionstart', pauseForAnimation, { passive: true });
    
    function pauseForAnimation() {
        if (!pJS._pausedForPerformance && !pJS._isPaused && pJS.fn.pause) {
            pJS.fn.pause();
            pJS._isPaused = true;
            pJS._pausedForPerformance = true;
            
            // Resume after animation likely completed
            setTimeout(() => {
                if (pJS._pausedForPerformance) {
                    // Check visibility before resuming
                    const particlesContainer = document.getElementById('particles-js');
                    if (particlesContainer) {
                        const rect = particlesContainer.getBoundingClientRect();
                        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                            if (pJS.fn.play) {
                                pJS.fn.play();
                                pJS._isPaused = false;
                                pJS._pausedForPerformance = false;
                            }
                        }
                    }
                }
            }, 500);
        }
    }
    
    console.log("Performance optimization for particles configured");
}

// Check if particles container is visible in viewport
function checkParticlesVisibility() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    const rect = particlesContainer.getBoundingClientRect();
    const pJS = window.pJSDom[0].pJS;
    
    // If container is outside viewport, pause rendering
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
        if (pJS.fn.pause && !pJS._isPaused) {
            pJS.fn.pause();
            pJS._isPaused = true;
            console.log("Particles container not visible, pausing rendering");
        }
    } else if (pJS._isPaused) {
        // Resume when container is in viewport
        if (pJS.fn.play) {
            pJS.fn.play();
            pJS._isPaused = false;
            console.log("Particles container visible, resuming rendering");
        }
    }
}

// Add dynamic color change on mouse move with improved interaction detection
function setupDynamicColors() {
    let throttleTimer;
    const throttleDelay = 50; // More responsive throttle for better feedback
    
    document.addEventListener("mousemove", (event) => {
        if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
        
        // Throttle the color updates
        if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
                const pJS = window.pJSDom[0].pJS;
                if (pJS && pJS.particles) {
                    try {
                        // Generate color based on mouse position
                        const r = Math.min(255, Math.max(0, Math.floor((event.clientX / window.innerWidth) * 255)));
                        const g = Math.min(255, Math.max(0, Math.floor((event.clientY / window.innerHeight) * 255)));
                        const b = Math.min(255, Math.max(0, Math.floor(((event.clientX + event.clientY) / (window.innerWidth + window.innerHeight)) * 255)));
                        
                        // Create RGB color
                        const color = `rgb(${r}, ${g}, ${b})`;
                        
                        // Apply color to particles near mouse first for better visual feedback
                        const mouseX = event.clientX;
                        const mouseY = event.clientY;
                        const proximityThreshold = 150; // Particles within this distance change color first
                        
                        // Update particles based on distance to cursor
                        for (let i = 0; i < pJS.particles.array.length; i++) {
                            const particle = pJS.particles.array[i];
                            const dx = particle.x - mouseX;
                            const dy = particle.y - mouseY;
                            const distance = Math.sqrt(dx*dx + dy*dy);
                            
                            // Closer particles get the new color immediately
                            if (distance < proximityThreshold) {
                                particle.color.rgb = {
                                    r: r,
                                    g: g,
                                    b: b
                                };
                            } 
                            // Further particles might get a color change based on probability
                            else if (Math.random() < 0.05) { // 5% chance for distant particles
                                particle.color.rgb = {
                                    r: r,
                                    g: g,
                                    b: b
                                };
                            }
                        }
                        
                        // Update particles near cursor for interaction highlight
                        checkParticlesForMouseInteraction(pJS, mouseX, mouseY);
                        
                        // Also update the base config to affect new particles
                        pJS.particles.color.value = color;
                        
                        // Update connecting lines color
                        pJS.particles.line_linked.color = color;
                        pJS.particles.line_linked.color_rgb_line = hexToRgb(color);
                        
                    } catch (e) {
                        console.error("Error updating particle colors:", e);
                    }
                }
                throttleTimer = null;
            }, throttleDelay);
        }
    });
    
    // Create a debug feature to show hover effects
    const debugMode = false;
    if (debugMode) {
        showCursorDebugIndicator();
    }
}

// Helper function to check particles near the mouse position for interaction highlights
function checkParticlesForMouseInteraction(pJS, mouseX, mouseY) {
    if (!pJS || !pJS.particles || !pJS.particles.array) return;
    
    const interactionDistance = 100; // Distance for mouse interaction highlight
    
    // Iterate through particles and mark those close to the cursor
    pJS.particles.array.forEach(particle => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Mark particles close to mouse cursor for special rendering
        if (distance < interactionDistance) {
            // Add a highlight property that can be used during drawing
            particle.highlighted = true;
            particle.highlightIntensity = 1 - (distance / interactionDistance);
        } else {
            particle.highlighted = false;
        }
    });
}

// Helper to show a visual indicator of cursor detection
function showCursorDebugIndicator() {
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '50px';
    indicator.style.left = '50%';
    indicator.style.transform = 'translateX(-50%)';
    indicator.style.background = 'rgba(0,0,0,0.8)';
    indicator.style.color = 'white';
    indicator.style.padding = '10px 15px';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '9999';
    indicator.style.fontFamily = 'Arial, sans-serif';
    indicator.style.fontSize = '14px';
    indicator.textContent = 'Move cursor slowly to see particle interactions';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.remove();
            }, 500);
        }, 4000);
    }, 100);
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
    }
    
    if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + 
              hex.charAt(1) + hex.charAt(1) + 
              hex.charAt(2) + hex.charAt(2);
    }
    
    // Handle RGB format
    if (hex.startsWith('rgb')) {
        const rgbMatch = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(hex);
        if (rgbMatch) {
            return {
                r: parseInt(rgbMatch[1]),
                g: parseInt(rgbMatch[2]), 
                b: parseInt(rgbMatch[3])
            };
        }
    }
    
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Pause particles when tab is inactive
document.addEventListener("visibilitychange", function() {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) return;
    
    const pJS = window.pJSDom[0].pJS;
    if (document.hidden) {
        if (pJS.fn.pause) {
            pJS.fn.pause();
            pJS._tabHidden = true;
            console.log("Tab inactive, pausing particles");
        }
    } else if (pJS._tabHidden) {
        if (pJS.fn.play) {
            pJS.fn.play();
            pJS._tabHidden = false;
            console.log("Tab active, resuming particles");
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Optimize for device
    optimizeParticlesForDevice();
    
    // Initialize particles with a delay to prioritize main content
    setTimeout(() => {
        try {
            // Ensure critical config properties exist
            if (!particlesConfig.particles) {
                particlesConfig.particles = {};
            }
            if (!particlesConfig.particles.number) {
                particlesConfig.particles.number = {};
            }
            if (!particlesConfig.particles.move) {
                particlesConfig.particles.move = {};
            }
            if (!particlesConfig.particles.size) {
                particlesConfig.particles.size = {};
            }
            
            // Safe initial configuration to prevent stack overflow
            particlesConfig.particles.number.density = particlesConfig.particles.number.density || {};
            particlesConfig.particles.number.density.enable = false;
            particlesConfig.particles.move.random = true;
            particlesConfig.particles.number.value = Math.min(60, particlesConfig.particles.number.value || 40);
            
            // Increase minimum particle size to reduce chance of overlaps
            particlesConfig.particles.size.value_min = particlesConfig.particles.size.value_min || 3;
            particlesConfig.particles.size.value = Math.max(6, particlesConfig.particles.size.value || 6);
            
            // Initialize particles with WebGL fallback
            initializeParticlesWithFallback();
            
            // Setup performance monitoring and optimizations
            setTimeout(() => {
                if (window.requestAnimationFrame) {
                    // Set up interval for performance monitoring
                    setInterval(optimizeParticles, 5000);
                    
                    // Set up activity tracking for dynamic speed adjustment
                    setupActivityTracking();
                    
                    // Set up dynamic color changes on mouse move
                    setupDynamicColors();
                    
                    // Set up visibility checking for scroll optimization
                    window.addEventListener("scroll", checkParticlesVisibility);
                    
                    // Set up performance optimization to pause during heavy operations
                    setupPerformanceOptimization();
                    
                    // Check initially
                    checkParticlesVisibility();
                }
                
                // Enable debug mode if flag is set
                if (typeof PARTICLES_DEBUG !== 'undefined' && PARTICLES_DEBUG) {
                    debugParticles();
                }
            }, 2000);
        } catch (error) {
            console.error("Error initializing particles:", error);
            // Fallback to blank container if everything fails
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                particlesContainer.style.display = 'none';
            }
        }
    }, 300);
});

// Optimized resize event handling with DPI awareness
window.addEventListener("resize", () => {
    clearTimeout(window.particleResizeTimeout);
    window.particleResizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Only adjust settings instead of full reinitialization
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
            const pJS = window.pJSDom[0].pJS;
            const canvas = pJS.canvas.el;
            
            // Get current DPI scaling
            const dpr = window.devicePixelRatio || 1;
            
            // Update canvas dimensions with DPI awareness
            const displayWidth = width;
            const displayHeight = height;
            const scaledWidth = displayWidth * dpr;
            const scaledHeight = displayHeight * dpr;
            
            // Update both display size and buffer size
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            
            // Update pJS internal dimensions
            pJS.canvas.w = scaledWidth;
            pJS.canvas.h = scaledHeight;
            
            // Scale context for HDPI displays
            const ctx = pJS.canvas.ctx;
            ctx.scale(dpr, dpr);
            
            // Fix mouse interaction after resize
            fixMouseInteraction(pJS);
            
            // Update settings based on screen size
            if (width < 768) {
                // Mobile settings
                pJS.particles.number.value = 20;
                pJS.particles.move.speed = 0.7;
                pJS.interactivity.events.onhover.enable = false;
            } else {
                // Desktop settings
                pJS.particles.number.value = 40;
                pJS.particles.move.speed = 2;
                pJS.interactivity.events.onhover.enable = true;
            }
            
            // Refresh particles with new settings
            pJS.fn.particlesRefresh();
            console.log(`Particles adjusted for new screen size: ${width}x${height} (DPI: ${dpr}x)`);
        }
    }, 500);
});

// Prevent memory leaks with cleanup on page leave
window.addEventListener("beforeunload", () => {
    if (window.pJSDom && window.pJSDom.length > 0) {
        // Properly destroy particles instance to prevent memory leaks
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        console.log("Particles cleanup performed");
    }
    
    // Remove any debug elements if they exist
    const debugElement = document.getElementById('particles-debug');
    if (debugElement) {
        debugElement.parentNode.removeChild(debugElement);
    }
    
    // Clear any running intervals
    if (window._particleIntervals) {
        window._particleIntervals.forEach(interval => clearInterval(interval));
    }
});

// Store all intervals for cleanup
window._particleIntervals = [];

// Helper function to set intervals that can be cleaned up
function setCleanableInterval(callback, delay) {
    const interval = setInterval(callback, delay);
    if (!window._particleIntervals) window._particleIntervals = [];
    window._particleIntervals.push(interval);
    return interval;
}

// Export functions for external use
window.particlesUtils = {
    initializeParticlesWithFallback,
    setupDynamicColors,
    setupActivityTracking,
    checkParticlesVisibility,
    fixMouseInteraction,
    checkParticlesForMouseInteraction
};
