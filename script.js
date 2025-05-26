// Quantum Digital Reality - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all quantum systems
    initializeQuantumSystems();
    initializeScrollAnimations();
    initializeParticleSystem();
    initializeNeuralNetwork();
    initializeTerminalTyping();
    initializeStatCounters();
    initializeProgressBars();
    initializeGlitchEffects();
});

// Quantum Systems Initialization
function initializeQuantumSystems() {
    console.log('🚀 Initializing Quantum Reality Systems...');
    
    // Add quantum noise to background
    createQuantumNoise();
    
    // Initialize navigation effects
    setupNavigationEffects();
    
    // Setup button interactions
    setupButtonEffects();
    
    // Initialize reality preview interactions
    setupRealityPreview();
    
    console.log('✅ Quantum systems online');
}

// Create dynamic background noise effect
function createQuantumNoise() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-3';
    canvas.style.opacity = '0.05';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function generateNoise() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;     // red
            data[i + 1] = value; // green
            data[i + 2] = value; // blue
            data[i + 3] = 20;    // alpha
        }
        
        ctx.putImageData(imageData, 0, 0);
        animationId = requestAnimationFrame(generateNoise);
    }
    
    resizeCanvas();
    generateNoise();
    
    window.addEventListener('resize', resizeCanvas);
    
    // Stop noise when page becomes hidden to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            generateNoise();
        }
    });
}

// Navigation Effects
function setupNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px var(--primary-color)';
            this.style.transform = 'scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
            this.style.transform = 'scale(1)';
        });
        
        // Smooth scrolling
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add glitch effect to target section
                addGlitchEffect(targetSection);
            }
        });
    });
}

// Button Effects
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            
            // Add quantum ripple effect
            createQuantumRipple(this);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
        
        button.addEventListener('click', function() {
            // Quantum click effect
            createQuantumExplosion(this);
            
            // Add console log for interaction
            console.log(`🌊 Quantum interaction detected: ${this.textContent}`);
        });
    });
}

// Quantum Ripple Effect
function createQuantumRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '10';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Animate ripple
    let size = 0;
    const maxSize = Math.max(element.offsetWidth, element.offsetHeight) * 2;
    
    const animate = () => {
        size += 5;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.opacity = 1 - (size / maxSize);
        
        if (size < maxSize) {
            requestAnimationFrame(animate);
        } else {
            ripple.remove();
        }
    };
    
    animate();
}

// Quantum Explosion Effect
function createQuantumExplosion(element) {
    const explosion = document.createElement('div');
    explosion.style.position = 'absolute';
    explosion.style.top = '50%';
    explosion.style.left = '50%';
    explosion.style.width = '10px';
    explosion.style.height = '10px';
    explosion.style.background = 'var(--primary-color)';
    explosion.style.borderRadius = '50%';
    explosion.style.transform = 'translate(-50%, -50%)';
    explosion.style.pointerEvents = 'none';
    explosion.style.zIndex = '20';
    explosion.style.boxShadow = '0 0 20px var(--primary-color)';
    
    element.style.position = 'relative';
    element.appendChild(explosion);
    
    // Create multiple particles
    for (let i = 0; i < 8; i++) {
        createExplosionParticle(element, i);
    }
    
    // Remove explosion element
    setTimeout(() => explosion.remove(), 500);
}

function createExplosionParticle(parent, index) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.top = '50%';
    particle.style.left = '50%';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'var(--secondary-color)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '20';
    
    parent.appendChild(particle);
    
    const angle = (index / 8) * Math.PI * 2;
    const distance = 50;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    particle.animate([
        { transform: 'translate(-50%, -50%) translate(0, 0)', opacity: 1 },
        { transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`, opacity: 0 }
    ], {
        duration: 300,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('stat-card')) {
                    triggerStatAnimation(entry.target);
                }
                
                if (entry.target.classList.contains('system-card')) {
                    triggerSystemCardAnimation(entry.target);
                }
                
                if (entry.target.classList.contains('neural-interface')) {
                    triggerNeuralAnimation();
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatedElements = document.querySelectorAll(
        '.stat-card, .system-card, .neural-interface, .reality-showcase, .connection-interface'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Stat Counter Animations
function initializeStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = stat.dataset.value;
        if (target && target !== '∞') {
            stat.textContent = '0.00';
        }
    });
}

function triggerStatAnimation(statCard) {
    const statValue = statCard.querySelector('.stat-value');
    const statFill = statCard.querySelector('.stat-fill');
    const target = statValue.dataset.value;
    
    if (target === '∞') return;
    
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = parseFloat(target);
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        
        statValue.textContent = currentValue.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            statValue.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
    
    // Animate stat bar
    if (statFill) {
        setTimeout(() => {
            statFill.style.width = statFill.dataset.width + '%';
        }, 500);
    }
}

// Progress Bar Animations
function initializeProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach(fill => {
        fill.style.width = '0%';
    });
}

function triggerSystemCardAnimation(card) {
    const progressFill = card.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = progressFill.dataset.progress + '%';
        }, 300);
    }
}

// Neural Network Animation
function triggerNeuralAnimation() {
    console.log('🧠 Neural network synchronization initiated...');
    
    // Add additional neural activity
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        setTimeout(() => {
            node.style.transform = 'scale(1.5)';
            node.style.boxShadow = '0 0 20px var(--secondary-color)';
            
            setTimeout(() => {
                node.style.transform = 'scale(1)';
                node.style.boxShadow = '0 0 10px var(--secondary-color)';
            }, 200);
        }, index * 100);
    });
}

// Particle System
function initializeParticleSystem() {
    createFloatingParticles();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-1';
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
        
        particleContainer.appendChild(particle);
        
        const duration = Math.random() * 10000 + 5000;
        const drift = (Math.random() - 0.5) * 200;
        
        particle.animate([
            { transform: 'translateY(0) translateX(0)', opacity: particle.style.opacity },
            { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => particle.remove();
    }
    
    // Create particles periodically
    setInterval(createParticle, 300);
}

// Terminal Typing Effect
function initializeTerminalTyping() {
    const typingElement = document.querySelector('.typing-animation');
    if (!typingElement) return;
    
    const commands = [
        'access neural_network',
        'initialize quantum_state',
        'load reality_matrix',
        'sync consciousness',
        'establish connection'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeCommand() {
        const currentCommand = commands[commandIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentCommand.substring(0, charIndex - 1) + '_';
            charIndex--;
        } else {
            typingElement.textContent = currentCommand.substring(0, charIndex + 1) + '_';
            charIndex++;
        }
        
        let timeout = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentCommand.length) {
            timeout = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
            timeout = 500;
        }
        
        setTimeout(typeCommand, timeout);
    }
    
    typeCommand();
}

// Reality Preview Interactions
function setupRealityPreview() {
    const previewFrame = document.querySelector('.preview-frame');
    if (!previewFrame) return;
    
    previewFrame.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 0 40px var(--secondary-color)';
        
        // Increase particle activity
        const particles = this.querySelector('.reality-particles');
        if (particles) {
            particles.style.animationDuration = '3s';
        }
    });
    
    previewFrame.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'var(--shadow-pink)';
        
        // Reset particle activity
        const particles = this.querySelector('.reality-particles');
        if (particles) {
            particles.style.animationDuration = '6s';
        }
    });
    
    previewFrame.addEventListener('click', function() {
        // Create reality portal effect
        createRealityPortal(this);
    });
}

function createRealityPortal(element) {
    const portal = document.createElement('div');
    portal.style.position = 'absolute';
    portal.style.top = '50%';
    portal.style.left = '50%';
    portal.style.width = '0';
    portal.style.height = '0';
    portal.style.background = 'radial-gradient(circle, var(--secondary-color) 0%, transparent 70%)';
    portal.style.borderRadius = '50%';
    portal.style.transform = 'translate(-50%, -50%)';
    portal.style.pointerEvents = 'none';
    portal.style.zIndex = '100';
    
    element.style.position = 'relative';
    element.appendChild(portal);
    
    portal.animate([
        { width: '0', height: '0', opacity: 1 },
        { width: '200px', height: '200px', opacity: 0.8 },
        { width: '500px', height: '500px', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    }).onfinish = () => portal.remove();
    
    console.log('🌀 Reality portal activated!');
}

// Glitch Effects
function initializeGlitchEffects() {
    // Random glitch effects on titles
    const titles = document.querySelectorAll('.section-title, .hero-title');
    
    titles.forEach(title => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                addGlitchEffect(title);
            }
        }, 2000);
    });
}

function addGlitchEffect(element) {
    const originalTransform = element.style.transform;
    const glitchFrames = [
        { transform: 'translateX(0px)', filter: 'hue-rotate(0deg)' },
        { transform: 'translateX(-2px)', filter: 'hue-rotate(90deg)' },
        { transform: 'translateX(2px)', filter: 'hue-rotate(180deg)' },
        { transform: 'translateX(-1px)', filter: 'hue-rotate(270deg)' },
        { transform: 'translateX(0px)', filter: 'hue-rotate(360deg)' }
    ];
    
    element.animate(glitchFrames, {
        duration: 200,
        easing: 'steps(4)'
    }).onfinish = () => {
        element.style.transform = originalTransform;
        element.style.filter = '';
    };
}

// Initialize Neural Network Background
function initializeNeuralNetwork() {
    const neuralNetwork = document.querySelector('.neural-network');
    if (!neuralNetwork) return;
    
    // Create neural nodes
    for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.style.position = 'absolute';
        node.style.width = '4px';
        node.style.height = '4px';
        node.style.background = 'var(--primary-color)';
        node.style.borderRadius = '50%';
        node.style.left = Math.random() * 100 + '%';
        node.style.top = Math.random() * 100 + '%';
        node.style.boxShadow = '0 0 10px var(--primary-color)';
        node.style.animation = `nodePulse ${2 + Math.random() * 3}s ease-in-out infinite`;
        node.style.animationDelay = Math.random() * 2 + 's';
        
        neuralNetwork.appendChild(node);
    }
}

// Utility Functions
function getRandomColor() {
    const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createQuantumSignature() {
    console.log(`
    ╔══════════════════════════════════════╗
    ║        QUANTUM REALITY ONLINE        ║
    ║                                      ║
    ║  🌌 Neural pathways synchronized     ║
    ║  ⚛️  Quantum matrices initialized    ║
    ║  🔗 Reality vectors stable           ║
    ║  🧠 Consciousness stream active      ║
    ║                                      ║
    ║        Welcome to EnterX             ║
    ╚══════════════════════════════════════╝
    `);
}

// Initialize quantum signature
createQuantumSignature();

// Advanced interaction handling
document.addEventListener('keydown', function(e) {
    // Easter egg: Konami code for special effects
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.code);
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence.shift();
    }
    
    if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        activateQuantumMode();
        window.konamiSequence = [];
    }
});

function activateQuantumMode() {
    console.log('🚀 QUANTUM MODE ACTIVATED!');
    
    document.body.style.animation = 'quantumPulse 0.5s ease-in-out 3';
    
    // Add quantum mode styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes quantumPulse {
            0%, 100% { filter: brightness(1) hue-rotate(0deg); }
            50% { filter: brightness(1.5) hue-rotate(180deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Create massive particle explosion
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createQuantumExplosion(document.querySelector('.hero-visual'));
        }, i * 50);
    }
    
    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 2000);
}

// Performance monitoring
function initializePerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function updateFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            console.log(`⚡ Quantum FPS: ${frameCount}`);
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    updateFPS();
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initializePerformanceMonitoring();
}