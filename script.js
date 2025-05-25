// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Cache header element reference
    const header = document.querySelector('.header');
    
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to navigation links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function setActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Add scroll event listener for active navigation
    window.addEventListener('scroll', setActiveLink);
    
    // Header background opacity on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.service-card, .stat, .tech-category, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize the Minecraft game if canvas exists
    if (document.getElementById('minecraftCanvas')) {
        initMinecraft();
    }
});

// Minecraft Game Implementation
function initMinecraft() {
    // Three.js scene setup
    const canvas = document.getElementById('minecraftCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x87ceeb); // Sky blue
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
    
    // Game state
    let gameState = {
        selectedBlock: 'grass',
        world: new Map(),
        playerPosition: { x: 0, y: 10, z: 0 },
        keys: {},
        mouseX: 0,
        mouseY: 0,
        isPointerLocked: false
    };
    
    // Block types and materials
    const blockMaterials = {
        grass: new THREE.MeshLambertMaterial({ color: 0x7cfc00 }),
        dirt: new THREE.MeshLambertMaterial({ color: 0x8b4513 }),
        stone: new THREE.MeshLambertMaterial({ color: 0x696969 }),
        wood: new THREE.MeshLambertMaterial({ color: 0xdaa520 }),
        water: new THREE.MeshLambertMaterial({ color: 0x0077be, transparent: true, opacity: 0.7 })
    };
    
    // Block geometry (reused for all blocks)
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Camera controls
    const controls = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        canJump: false,
        velocity: new THREE.Vector3(),
        direction: new THREE.Vector3()
    };
    
    // Set initial camera position
    camera.position.set(0, 10, 5);
    
    // World generation
    function generateTerrain() {
        const size = 32;
        const halfSize = size / 2;
        
        for (let x = -halfSize; x < halfSize; x++) {
            for (let z = -halfSize; z < halfSize; z++) {
                // Simple height map using sine waves for terrain
                const height = Math.floor(3 * Math.sin(x * 0.1) * Math.cos(z * 0.1)) + 5;
                
                // Generate layers
                for (let y = 0; y <= height; y++) {
                    let blockType;
                    if (y === height && y > 3) {
                        blockType = 'grass';
                    } else if (y >= height - 2 && y > 2) {
                        blockType = 'dirt';
                    } else {
                        blockType = 'stone';
                    }
                    
                    addBlock(x, y, z, blockType);
                }
                
                // Add some water at sea level
                if (height <= 3) {
                    for (let y = height + 1; y <= 3; y++) {
                        addBlock(x, y, z, 'water');
                    }
                }
            }
        }
        
        // Add some trees
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * size) - halfSize;
            const z = Math.floor(Math.random() * size) - halfSize;
            const groundHeight = getGroundHeight(x, z);
            
            if (groundHeight > 3) {
                // Tree trunk
                for (let y = groundHeight + 1; y <= groundHeight + 4; y++) {
                    addBlock(x, y, z, 'wood');
                }
                
                // Tree leaves (simple cross pattern)
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dz = -1; dz <= 1; dz++) {
                        for (let dy = 0; dy <= 1; dy++) {
                            if (dx === 0 && dz === 0 && dy === 0) continue;
                            addBlock(x + dx, groundHeight + 4 + dy, z + dz, 'grass');
                        }
                    }
                }
            }
        }
    }
    
    function getGroundHeight(x, z) {
        return Math.floor(3 * Math.sin(x * 0.1) * Math.cos(z * 0.1)) + 5;
    }
    
    function addBlock(x, y, z, type) {
        const key = `${x},${y},${z}`;
        if (gameState.world.has(key)) return;
        
        const block = new THREE.Mesh(blockGeometry, blockMaterials[type]);
        block.position.set(x, y, z);
        block.castShadow = true;
        block.receiveShadow = true;
        block.userData = { type: type, position: { x, y, z } };
        
        scene.add(block);
        gameState.world.set(key, block);
    }
    
    function removeBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        const block = gameState.world.get(key);
        if (block) {
            scene.remove(block);
            gameState.world.delete(key);
        }
    }
    
    // Raycasting for block interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function getBlockAtPosition(x, y, z) {
        const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        return gameState.world.get(key);
    }
    
    function handleBlockInteraction(event) {
        if (!gameState.isPointerLocked) return;
        
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.intersectObjects(Array.from(gameState.world.values()));
        
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const block = intersection.object;
            const face = intersection.face;
            const point = intersection.point;
            
            if (event.button === 0) {
                // Left click - remove block
                const pos = block.userData.position;
                removeBlock(pos.x, pos.y, pos.z);
            } else if (event.button === 2) {
                // Right click - place block
                const faceNormal = face.normal.clone();
                faceNormal.transformDirection(block.matrixWorld);
                
                const newPos = {
                    x: Math.floor(point.x + faceNormal.x * 0.5),
                    y: Math.floor(point.y + faceNormal.y * 0.5),
                    z: Math.floor(point.z + faceNormal.z * 0.5)
                };
                
                // Don't place block where player is standing
                const playerGridPos = {
                    x: Math.floor(camera.position.x),
                    y: Math.floor(camera.position.y),
                    z: Math.floor(camera.position.z)
                };
                
                if (!(newPos.x === playerGridPos.x && 
                      (newPos.y === playerGridPos.y || newPos.y === playerGridPos.y - 1) && 
                      newPos.z === playerGridPos.z)) {
                    addBlock(newPos.x, newPos.y, newPos.z, gameState.selectedBlock);
                }
            }
        }
    }
    
    // Event listeners
    document.addEventListener('keydown', (event) => {
        gameState.keys[event.code] = true;
        
        // Block selection with number keys
        const blockTypes = ['grass', 'dirt', 'stone', 'wood', 'water'];
        const keyNumber = parseInt(event.key);
        if (keyNumber >= 1 && keyNumber <= 5) {
            setSelectedBlock(blockTypes[keyNumber - 1]);
        }
    });
    
    document.addEventListener('keyup', (event) => {
        gameState.keys[event.code] = false;
    });
    
    // Pointer lock for mouse look
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });
    
    document.addEventListener('pointerlockchange', () => {
        gameState.isPointerLocked = document.pointerLockElement === canvas;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!gameState.isPointerLocked) return;
        
        const sensitivity = 0.002;
        gameState.mouseX -= event.movementX * sensitivity;
        gameState.mouseY -= event.movementY * sensitivity;
        gameState.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, gameState.mouseY));
        
        camera.rotation.order = 'YXZ';
        camera.rotation.y = gameState.mouseX;
        camera.rotation.x = gameState.mouseY;
    });
    
    canvas.addEventListener('mousedown', handleBlockInteraction);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Block selection UI
    function setSelectedBlock(blockType) {
        gameState.selectedBlock = blockType;
        
        // Update UI
        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.block === blockType) {
                btn.classList.add('active');
            }
        });
        
        document.getElementById('selected-block').textContent = 
            blockType.charAt(0).toUpperCase() + blockType.slice(1);
    }
    
    document.querySelectorAll('.block-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setSelectedBlock(btn.dataset.block);
        });
    });
    
    // Physics and movement
    function updateMovement(deltaTime) {
        const speed = 10;
        
        controls.direction.set(0, 0, 0);
        
        if (gameState.keys['KeyW']) controls.direction.z -= 1;
        if (gameState.keys['KeyS']) controls.direction.z += 1;
        if (gameState.keys['KeyA']) controls.direction.x -= 1;
        if (gameState.keys['KeyD']) controls.direction.x += 1;
        
        controls.direction.normalize();
        
        // Apply camera rotation to movement direction
        const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
        controls.direction.applyEuler(euler);
        
        // Simple gravity
        controls.velocity.y -= 30 * deltaTime;
        
        // Apply movement
        if (controls.direction.x !== 0 || controls.direction.z !== 0) {
            controls.velocity.x = controls.direction.x * speed;
            controls.velocity.z = controls.direction.z * speed;
        } else {
            controls.velocity.x *= 0.8;
            controls.velocity.z *= 0.8;
        }
        
        // Update position
        camera.position.x += controls.velocity.x * deltaTime;
        camera.position.z += controls.velocity.z * deltaTime;
        camera.position.y += controls.velocity.y * deltaTime;
        
        // Simple collision detection with ground
        const groundHeight = getGroundHeight(camera.position.x, camera.position.z) + 1.8;
        if (camera.position.y < groundHeight) {
            camera.position.y = groundHeight;
            controls.velocity.y = 0;
            controls.canJump = true;
        }
        
        // Jump
        if (gameState.keys['Space'] && controls.canJump) {
            controls.velocity.y = 10;
            controls.canJump = false;
        }
        
        // Update UI
        document.getElementById('position').textContent = 
            `${Math.floor(camera.position.x)}, ${Math.floor(camera.position.y)}, ${Math.floor(camera.position.z)}`;
    }
    
    // Animation loop
    let lastTime = 0;
    let frameCount = 0;
    let lastFpsUpdate = 0;
    
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        updateMovement(deltaTime);
        
        renderer.render(scene, camera);
        
        // Update FPS counter
        frameCount++;
        if (currentTime - lastFpsUpdate > 1000) {
            document.getElementById('fps').textContent = frameCount;
            frameCount = 0;
            lastFpsUpdate = currentTime;
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Initialize the world and start the game
    generateTerrain();
    animate(0);
    
    console.log('Minecraft clone initialized! Click on the game area and use WASD to move, mouse to look around.');
}