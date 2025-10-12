import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const container = document.querySelector('.webgl');
if (!container) {
    throw new Error('Missing .webgl container');
}

const overlay = document.querySelector('.overlay');

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.set(0, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const root = new THREE.Group();
scene.add(root);

const hudGroup = createHudLayer();
root.add(hudGroup);

const pointer = new THREE.Vector2(0, 0);
const pointerTarget = new THREE.Vector2(0, 0);
const overlayPointer = new THREE.Vector2(0.5, 0.5);
const overlayTarget = new THREE.Vector2(0.5, 0.5);

const updatePointerTargets = (event) => {
    const normX = event.clientX / window.innerWidth;
    const normY = event.clientY / window.innerHeight;
    pointerTarget.set(normX * 2 - 1, normY * 2 - 1);
    overlayTarget.set(normX, normY);
    overlay?.classList.add('is-active');
};

window.addEventListener('pointermove', updatePointerTargets);

window.addEventListener('pointerleave', () => {
    pointerTarget.set(0, 0);
    overlayTarget.set(0.5, 0.5);
    overlay?.classList.remove('is-active');
});

window.addEventListener('blur', () => {
    pointerTarget.set(0, 0);
    overlayTarget.set(0.5, 0.5);
    overlay?.classList.remove('is-active');
});

const resizeRenderer = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener('resize', resizeRenderer);
resizeRenderer();

const clock = new THREE.Clock();

const animate = () => {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointerTarget.x - pointer.x) * 0.08;
    pointer.y += (pointerTarget.y - pointer.y) * 0.08;

    overlayPointer.x += (overlayTarget.x - overlayPointer.x) * 0.1;
    overlayPointer.y += (overlayTarget.y - overlayPointer.y) * 0.1;

    if (overlay) {
        overlay.style.setProperty('--pointer-x', `${overlayPointer.x * 100}%`);
        overlay.style.setProperty('--pointer-y', `${overlayPointer.y * 100}%`);
        overlay.style.setProperty('--tilt-x', `${(overlayPointer.x - 0.5) * 14}deg`);
        overlay.style.setProperty('--tilt-y', `${(0.5 - overlayPointer.y) * 11}deg`);
    }

    const parallaxX = pointer.x * 0.16;
    const parallaxY = pointer.y * 0.16;

    root.rotation.x = parallaxY * 0.75 + Math.sin(elapsed * 0.6) * 0.02;
    root.rotation.y = -parallaxX * 0.75 + Math.cos(elapsed * 0.4) * 0.02;
    root.rotation.z = Math.sin(elapsed * 0.2) * 0.04;
    root.position.x = parallaxX * 0.5;
    root.position.y = -parallaxY * 0.5;

    hudGroup.rotation.z = Math.sin(elapsed * 0.35) * 0.06;
    hudGroup.position.z = Math.sin(elapsed * 0.6) * 0.08;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

function createHudLayer() {
    const hud = new THREE.Group();

    const ringSegments = 120;
    const ringPositions = [];
    for (let i = 0; i <= ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2;
        const radius = 2.15 + Math.sin(angle * 4) * 0.04;
        ringPositions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    }
    const ringGeometry = new THREE.BufferGeometry();
    ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ringPositions, 3));
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 });
    hud.add(new THREE.LineLoop(ringGeometry, ringMaterial));

    const radialPositions = [];
    const radialCount = 8;
    for (let i = 0; i < radialCount; i++) {
        const angle = (i / radialCount) * Math.PI * 2;
        const inner = 0.4;
        const outer = 2.4;
        radialPositions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, 0);
        radialPositions.push(Math.cos(angle) * outer, Math.sin(angle) * outer, 0);
    }
    const radialGeometry = new THREE.BufferGeometry();
    radialGeometry.setAttribute('position', new THREE.Float32BufferAttribute(radialPositions, 3));
    const radialMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12 });
    hud.add(new THREE.LineSegments(radialGeometry, radialMaterial));

    const gridPositions = [];
    const gridExtent = 1.8;
    for (let i = -3; i <= 3; i++) {
        const offset = (i / 3) * gridExtent;
        gridPositions.push(-gridExtent, offset, 0, gridExtent, offset, 0);
        gridPositions.push(offset, -gridExtent, 0, offset, gridExtent, 0);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.05 });
    hud.add(new THREE.LineSegments(gridGeometry, gridMaterial));

    const labelTexture = createLabelTexture('ORCHID BIO-SCAN\\nVEIN MAPPING ACTIVE');
    const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, color: 0x000000 });
    const labelPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.42), labelMaterial);
    labelPlane.position.set(0, -2.6, 0);
    hud.add(labelPlane);

    const microTexture = createLabelTexture('x-ray refraction  ▲  holographic depth  ▲  specimen jnwd3at ojac56a spc1tb2');
    const microMaterial = new THREE.MeshBasicMaterial({ map: microTexture, transparent: true, color: 0x000000 });
    const microPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.28), microMaterial);
    microPlane.position.set(0, 2.5, 0);
    hud.add(microPlane);

    const tickerTexture = createLabelTexture('00.48  microns // spectral vein glow // lumen status nominal', 256, 32, 9);
    const tickerMaterial = new THREE.MeshBasicMaterial({ map: tickerTexture, transparent: true, color: 0x000000 });
    const tickerPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 0.24), tickerMaterial);
    tickerPlane.position.set(-2.8, 0, 0);
    tickerPlane.rotation.z = Math.PI / 2;
    hud.add(tickerPlane);

    return hud;
}

function createLabelTexture(text, width = 384, height = 96, fontSize = 14) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Unable to acquire 2D context for label texture');
    }

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.font = `600 ${fontSize}px "IBM Plex Mono", "Roboto Mono", monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.imageSmoothingEnabled = false;

    const lines = text.split('\\n');
    const spacing = height / (lines.length + 1);
    lines.forEach((line, index) => {
        ctx.fillText(line.toUpperCase(), width / 2, spacing * (index + 1));
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.anisotropy = 1;
    texture.flipY = false;
    return texture;
}
