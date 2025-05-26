// Three.js Art Gallery - Interactive 3D Experience
class QuantumArtGallery {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.currentMode = 'particles';
        this.animationSpeed = 1.0;
        this.isAnimating = true;
        this.controls = {};
        this.stats = {
            renderTime: 0,
            triangles: 0,
            memory: 0
        };
        this.charts = {};
        
        this.init();
        this.setupEventListeners();
        this.setupUI();
    }

    init() {
        const canvas = document.getElementById('artCanvas');
        if (!canvas) {
            console.error('Art canvas not found');
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 50, 200);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 50);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Initial mode
        this.setMode('particles');
        
        // Start render loop
        this.animate();
        
        console.log('🎨 Quantum Art Gallery initialized');
    }

    setMode(mode) {
        this.currentMode = mode;
        this.clearScene();
        
        switch(mode) {
            case 'particles':
                this.createParticleSystem();
                break;
            case 'galaxy':
                this.createGalaxySystem();
                break;
            case 'neural':
                this.createNeuralNetwork();
                break;
            case 'fractal':
                this.createFractalLandscape();
                break;
        }
        
        this.updateSceneInfo();
        console.log(`🌟 Switched to ${mode} mode`);
    }

    clearScene() {
        // Remove all meshes from scene
        const meshes = [];
        this.scene.traverse((object) => {
            if (object.isMesh) {
                meshes.push(object);
            }
        });
        
        meshes.forEach((mesh) => {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => mat.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        });
        
        this.particles = [];
    }

    createParticleSystem() {
        const particleCount = this.controls.particleCount || 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        const colorScheme = this.getColorScheme();
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Colors
            const colorIndex = Math.floor(Math.random() * colorScheme.length);
            const color = new THREE.Color(colorScheme[colorIndex]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Velocities
            velocities[i3] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
        
        // Add some geometric shapes
        this.addGeometricShapes();
    }

    addGeometricShapes() {
        const shapes = [
            new THREE.BoxGeometry(5, 5, 5),
            new THREE.SphereGeometry(3, 16, 16),
            new THREE.ConeGeometry(3, 8, 8),
            new THREE.TetrahedronGeometry(4),
            new THREE.OctahedronGeometry(4)
        ];
        
        const colorScheme = this.getColorScheme();
        
        for (let i = 0; i < 10; i++) {
            const geometry = shapes[Math.floor(Math.random() * shapes.length)];
            const material = new THREE.MeshPhongMaterial({
                color: colorScheme[Math.floor(Math.random() * colorScheme.length)],
                transparent: true,
                opacity: 0.6,
                wireframe: Math.random() > 0.5
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80
            );
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.scene.add(mesh);
        }
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
        pointLight.position.set(0, 0, 20);
        this.scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0xff0080, 1, 100);
        pointLight2.position.set(-20, 20, -20);
        this.scene.add(pointLight2);
    }

    createGalaxySystem() {
        const particleCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const colorScheme = this.getColorScheme();
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 50 + 5;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 10;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            const color = new THREE.Color(colorScheme[i % colorScheme.length]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        const galaxy = new THREE.Points(geometry, material);
        this.scene.add(galaxy);
        this.particles.push(galaxy);
        
        // Add spiral arms effect
        this.addSpiralArms();
    }

    addSpiralArms() {
        for (let arm = 0; arm < 3; arm++) {
            const armGeometry = new THREE.BufferGeometry();
            const armPositions = new Float32Array(1000 * 3);
            const armColors = new Float32Array(1000 * 3);
            
            for (let i = 0; i < 1000; i++) {
                const i3 = i * 3;
                const t = i / 1000;
                const angle = arm * (Math.PI * 2 / 3) + t * Math.PI * 4;
                const radius = t * 40 + 5;
                
                armPositions[i3] = Math.cos(angle) * radius;
                armPositions[i3 + 1] = (Math.random() - 0.5) * 5;
                armPositions[i3 + 2] = Math.sin(angle) * radius;
                
                const color = new THREE.Color(0x00ffff);
                armColors[i3] = color.r;
                armColors[i3 + 1] = color.g;
                armColors[i3 + 2] = color.b;
            }
            
            armGeometry.setAttribute('position', new THREE.BufferAttribute(armPositions, 3));
            armGeometry.setAttribute('color', new THREE.BufferAttribute(armColors, 3));
            
            const armMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });
            
            const armPoints = new THREE.Points(armGeometry, armMaterial);
            this.scene.add(armPoints);
        }
    }

    createNeuralNetwork() {
        const nodeCount = 50;
        const nodes = [];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(geometry, material);
            node.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            
            this.scene.add(node);
            nodes.push(node);
        }
        
        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0080,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = 0; i < nodeCount; i++) {
            const connectionCount = Math.floor(Math.random() * 5) + 1;
            
            for (let j = 0; j < connectionCount; j++) {
                const targetIndex = Math.floor(Math.random() * nodeCount);
                if (targetIndex !== i) {
                    const lineGeometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    
                    positions[0] = nodes[i].position.x;
                    positions[1] = nodes[i].position.y;
                    positions[2] = nodes[i].position.z;
                    positions[3] = nodes[targetIndex].position.x;
                    positions[4] = nodes[targetIndex].position.y;
                    positions[5] = nodes[targetIndex].position.z;
                    
                    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    this.scene.add(line);
                }
            }
        }
        
        this.particles = nodes;
    }

    createFractalLandscape() {
        const size = 64;
        const geometry = new THREE.PlaneGeometry(80, 80, size - 1, size - 1);
        const positions = geometry.attributes.position.array;
        
        // Generate fractal heights
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            positions[i + 1] = this.fractalNoise(x * 0.02, z * 0.02) * 10;
        }
        
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        
        const landscape = new THREE.Mesh(geometry, material);
        landscape.rotation.x = -Math.PI / 2;
        this.scene.add(landscape);
        
        // Add floating particles above landscape
        this.addFloatingParticles();
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
        directionalLight.position.set(0, 50, 20);
        this.scene.add(directionalLight);
    }

    addFloatingParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = Math.random() * 50 + 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            const color = new THREE.Color(0xffff00);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    fractalNoise(x, y) {
        let value = 0;
        let frequency = 1;
        let amplitude = 1;
        
        for (let i = 0; i < 6; i++) {
            value += Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
            frequency *= 2;
            amplitude *= 0.5;
        }
        
        return value;
    }

    getColorScheme() {
        const schemes = {
            cyber: [0x00ffff, 0xff0080, 0xffff00],
            neon: [0xff1493, 0x00ff00, 0x1e90ff, 0xffd700],
            quantum: [0x0080ff, 0x4040ff, 0x8080ff, 0xc0c0ff],
            fire: [0xff4500, 0xff6347, 0xffa500, 0xffff00]
        };
        
        return schemes[this.controls.colorScheme] || schemes.cyber;
    }

    updateParticles() {
        if (!this.isAnimating) return;
        
        this.particles.forEach((particleSystem, index) => {
            if (particleSystem.geometry && particleSystem.geometry.attributes.position) {
                const positions = particleSystem.geometry.attributes.position.array;
                const time = Date.now() * 0.001 * this.animationSpeed;
                
                switch (this.currentMode) {
                    case 'particles':
                        this.updateParticleSystem(positions, time, index);
                        break;
                    case 'galaxy':
                        this.updateGalaxySystem(particleSystem, time);
                        break;
                    case 'neural':
                        this.updateNeuralNetwork(particleSystem, time, index);
                        break;
                    case 'fractal':
                        this.updateFractalParticles(positions, time);
                        break;
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    updateParticleSystem(positions, time, index) {
        const turbulence = this.controls.turbulence || 1;
        const gravity = this.controls.gravity || 0.5;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.1 * turbulence;
            positions[i + 1] += Math.cos(time + i * 0.5) * 0.1 * turbulence - gravity * 0.01;
            positions[i + 2] += Math.sin(time * 0.5 + i * 0.3) * 0.1 * turbulence;
            
            // Boundary checks
            if (positions[i + 1] < -50) positions[i + 1] = 50;
            if (Math.abs(positions[i]) > 50) positions[i] *= 0.9;
            if (Math.abs(positions[i + 2]) > 50) positions[i + 2] *= 0.9;
        }
    }

    updateGalaxySystem(particleSystem, time) {
        particleSystem.rotation.y = time * 0.1;
        particleSystem.rotation.z = Math.sin(time * 0.05) * 0.1;
    }

    updateNeuralNetwork(node, time, index) {
        if (node.isMesh) {
            node.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.2);
            node.material.opacity = 0.6 + Math.sin(time * 3 + index) * 0.2;
        }
    }

    updateFractalParticles(positions, time) {
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + i * 0.01) * 0.05;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const startTime = performance.now();
        
        this.updateParticles();
        this.updateCamera();
        this.renderer.render(this.scene, this.camera);
        
        const endTime = performance.now();
        this.updateStats(endTime - startTime);
    }

    updateCamera() {
        const time = Date.now() * 0.001;
        if (this.currentMode !== 'neural') {
            this.camera.position.x = Math.cos(time * 0.1) * 50;
            this.camera.position.z = Math.sin(time * 0.1) * 50;
            this.camera.lookAt(0, 0, 0);
        }
    }

    updateStats(renderTime) {
        this.stats.renderTime = renderTime.toFixed(1);
        this.stats.triangles = this.renderer.info.render.triangles;
        this.stats.memory = (this.renderer.info.memory.geometries + this.renderer.info.memory.textures);
        
        document.getElementById('renderStats').textContent = `FPS: ${Math.round(1000/renderTime)}`;
        document.getElementById('renderTime').textContent = this.stats.renderTime;
        document.getElementById('triangleCount').textContent = this.stats.triangles.toLocaleString();
        document.getElementById('memoryUsage').textContent = this.stats.memory;
        
        this.updateCharts();
    }

    updateCharts() {
        // Update performance charts (simplified)
        Object.keys(this.charts).forEach(chartId => {
            const chart = this.charts[chartId];
            if (chart && chart.data) {
                chart.data.push(this.stats[chartId.replace('Chart', '')]);
                if (chart.data.length > 50) chart.data.shift();
                this.drawChart(chartId, chart.data);
            }
        });
    }

    drawChart(chartId, data) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const max = Math.max(...data, 1);
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - (value / max) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modeCard = e.target.closest('.mode-card');
                const mode = modeCard.dataset.mode;
                this.setMode(mode);
            });
        });
        
        // Control buttons
        document.getElementById('resetView')?.addEventListener('click', () => {
            this.camera.position.set(0, 0, 50);
            this.camera.lookAt(0, 0, 0);
        });
        
        document.getElementById('toggleAnimation')?.addEventListener('click', () => {
            this.isAnimating = !this.isAnimating;
        });
        
        document.getElementById('changeMode')?.addEventListener('click', () => {
            const modes = ['particles', 'galaxy', 'neural', 'fractal'];
            const currentIndex = modes.indexOf(this.currentMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            this.setMode(nextMode);
        });
        
        // Fullscreen
        document.querySelector('.fullscreen-btn')?.addEventListener('click', () => {
            const canvas = document.getElementById('artCanvas');
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('artCanvas');
            if (canvas && this.camera && this.renderer) {
                this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            }
        });
        
        // Mouse interaction
        this.setupMouseControls();
    }

    setupMouseControls() {
        const canvas = document.getElementById('artCanvas');
        if (!canvas) return;
        
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            
            this.camera.position.x += deltaX * 0.1;
            this.camera.position.y -= deltaY * 0.1;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1.1 : 0.9;
            this.camera.position.multiplyScalar(delta);
        });
    }

    setupUI() {
        // Initialize control values
        this.controls = {
            colorScheme: 'cyber',
            particleCount: 1000,
            animationSpeed: 1.0,
            gravity: 0.5,
            turbulence: 1.0,
            fieldStrength: 2.0,
            bloomEffect: 1.0,
            trailEffect: true,
            musicReactive: true
        };
        
        // Setup control listeners
        this.setupControlListeners();
        
        // Initialize charts
        this.charts = {
            renderChart: { data: [] },
            triangleChart: { data: [] },
            memoryChart: { data: [] }
        };
        
        // Initial scene info
        this.updateSceneInfo();
    }

    setupControlListeners() {
        // Color scheme
        document.getElementById('colorScheme')?.addEventListener('change', (e) => {
            this.controls.colorScheme = e.target.value;
            this.setMode(this.currentMode); // Refresh with new colors
        });
        
        // Particle count
        document.getElementById('particleCount')?.addEventListener('input', (e) => {
            this.controls.particleCount = parseInt(e.target.value);
            document.getElementById('particleCountValue').textContent = e.target.value;
            if (this.currentMode === 'particles') {
                this.setMode('particles'); // Refresh
            }
        });
        
        // Animation speed
        document.getElementById('animationSpeed')?.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            document.getElementById('animationSpeedValue').textContent = e.target.value + 'x';
        });
        
        // Physics controls
        ['gravity', 'turbulence', 'fieldStrength', 'bloomEffect'].forEach(control => {
            document.getElementById(control)?.addEventListener('input', (e) => {
                this.controls[control] = parseFloat(e.target.value);
                document.getElementById(control + 'Value').textContent = e.target.value;
            });
        });
        
        // Checkboxes
        ['trailEffect', 'musicReactive'].forEach(control => {
            document.getElementById(control)?.addEventListener('change', (e) => {
                this.controls[control] = e.target.checked;
            });
        });
    }

    updateSceneInfo() {
        const sceneNames = {
            particles: 'Quantum Geometric Particles',
            galaxy: 'Digital Galaxy Simulation',
            neural: '3D Neural Network',
            fractal: 'Procedural Fractal Landscape'
        };
        
        document.getElementById('sceneInfo').textContent = sceneNames[this.currentMode];
    }
}

// Initialize the art gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('artCanvas')) {
        window.artGallery = new QuantumArtGallery();
        console.log('🎨 Quantum Art Gallery loaded successfully');
    }
});

// Export for global access
window.QuantumArtGallery = QuantumArtGallery;