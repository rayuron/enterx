import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const container = document.querySelector('.webgl');
if (!container) {
    throw new Error('Missing .webgl container');
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 12);
camera.position.set(0, 0, 3.1);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfafafa, 1);
container.appendChild(renderer.domElement);

const root = new THREE.Group();
scene.add(root);

const haloGroup = new THREE.Group();
root.add(haloGroup);

// 540 segments chosen for optimal visual quality and smoothness of the halo effect,
// while maintaining good rendering performance on most devices.
const strutSegments = 540;
const strutPositions = new Float32Array(strutSegments * 6);
const strutGeometry = new THREE.BufferGeometry();
strutGeometry.setAttribute('position', new THREE.BufferAttribute(strutPositions, 3));

const strutMaterial = new THREE.LineBasicMaterial({
    color: 0x050505,
    transparent: true,
    opacity: 0.88,
    linewidth: 1
});

const struts = new THREE.LineSegments(strutGeometry, strutMaterial);
haloGroup.add(struts);

const strutBase = Array.from({ length: strutSegments }, (_, i) => ({
    angle: (i / strutSegments) * Math.PI * 2,
    radius: 0.45 + Math.random() * 0.25,
    span: 0.18 + Math.random() * 0.22,
    noise: Math.random() * Math.PI * 2,
    sway: 0.2 + Math.random() * 0.4
}));

const orbitLayers = [];
const orbitCount = 5;
const orbitSegments = 320;

for (let i = 0; i < orbitCount; i++) {
    const radius = 0.6 + i * 0.14;
    const positions = new Float32Array(orbitSegments * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
        color: 0x080808,
        transparent: true,
        opacity: 0.22 + i * 0.12
    });

    const line = new THREE.LineLoop(geometry, material);
    haloGroup.add(line);

    const offsets = new Float32Array(orbitSegments);
    for (let j = 0; j < orbitSegments; j++) {
        offsets[j] = Math.random() * Math.PI * 2;
    }

    orbitLayers.push({ line, positions, radius, offsets });
}

const filamentCount = 180;
const filamentPositions = new Float32Array(filamentCount * 2 * 3);
const filamentGeometry = new THREE.BufferGeometry();
filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3));

const filamentMaterial = new THREE.LineBasicMaterial({
    color: 0x040404,
    transparent: true,
    opacity: 0.6
});

const filaments = new THREE.LineSegments(filamentGeometry, filamentMaterial);
haloGroup.add(filaments);

const filamentBase = Array.from({ length: filamentCount }, () => ({
    anchorAngle: Math.random() * Math.PI * 2,
    anchorRadius: 0.35 + Math.random() * 0.55,
    drift: Math.random() * Math.PI * 2,
    length: 0.2 + Math.random() * 0.35
}));

const sparkCount = 780;
const sparkGeometry = new THREE.BufferGeometry();
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkBase = new Float32Array(sparkCount * 3);

for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.2 + Math.random() * 1.8;
    const elevation = (Math.random() - 0.5) * 0.65;

    sparkBase[i * 3] = Math.cos(angle) * radius;
    sparkBase[i * 3 + 1] = Math.sin(angle) * radius;
    sparkBase[i * 3 + 2] = elevation;

    sparkPositions[i * 3] = sparkBase[i * 3];
    sparkPositions[i * 3 + 1] = sparkBase[i * 3 + 1];
    sparkPositions[i * 3 + 2] = sparkBase[i * 3 + 2];
}

sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

const sparkMaterial = new THREE.PointsMaterial({
    color: 0x0a0a0a,
    size: 0.01,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.45
});

const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
haloGroup.add(sparks);

let pointerX = 0;
let pointerY = 0;

const pointerTarget = new THREE.Vector2(0, 0);

window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointerTarget.set(x, -y);
});

const resizeRenderer = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener('resize', resizeRenderer);

const clock = new THREE.Clock();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateStruts = (elapsed) => {
    const positions = strutGeometry.attributes.position.array;
    for (let i = 0; i < strutSegments; i++) {
        const base = strutBase[i];
        const oscillation = Math.sin(elapsed * 0.7 + base.noise) * base.sway;
        const radius = base.radius + oscillation * 0.16;
        const length = base.span + Math.cos(elapsed * 1.1 + base.noise * 1.9) * 0.12;

        const offsetX = pointerX * 0.12;
        const offsetY = pointerY * 0.12;

        const angle = base.angle + Math.sin(elapsed * 0.35 + base.noise) * 0.18;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const innerIndex = i * 6;
        const outerIndex = innerIndex + 3;

        positions[innerIndex] = cos * radius + offsetX;
        positions[innerIndex + 1] = sin * radius + offsetY;
        positions[innerIndex + 2] = Math.sin(elapsed * 0.5 + base.noise) * 0.04;

        positions[outerIndex] = cos * (radius + length) + offsetX;
        positions[outerIndex + 1] = sin * (radius + length) + offsetY;
        positions[outerIndex + 2] = Math.cos(elapsed * 0.65 + base.noise) * 0.05;
    }
    strutGeometry.attributes.position.needsUpdate = true;
};

const updateOrbits = (elapsed) => {
    orbitLayers.forEach((layer, layerIndex) => {
        const { positions, radius, offsets } = layer;
        for (let i = 0; i < orbitSegments; i++) {
            const baseAngle = (i / orbitSegments) * Math.PI * 2;
            const wave = Math.sin(baseAngle * 4 + elapsed * (0.5 + layerIndex * 0.15) + offsets[i]) * 0.045;
            const r = radius + wave + Math.sin(elapsed * 0.25 + offsets[i]) * 0.02;

            const idx = i * 3;
            positions[idx] = Math.cos(baseAngle) * r;
            positions[idx + 1] = Math.sin(baseAngle) * r;
            positions[idx + 2] = Math.sin(elapsed * 0.4 + baseAngle * 2 + offsets[i]) * 0.08;
        }
        layer.line.rotation.z = elapsed * 0.04 * (layerIndex % 2 === 0 ? 1 : -1);
        layer.line.geometry.attributes.position.needsUpdate = true;
    });
};

const updateFilaments = (elapsed) => {
    const positions = filamentGeometry.attributes.position.array;
    for (let i = 0; i < filamentCount; i++) {
        const base = filamentBase[i];
        const twist = Math.sin(elapsed * 0.8 + base.drift) * 0.4;
        const anchorAngle = base.anchorAngle + twist;
        const anchorRadius = base.anchorRadius + Math.cos(elapsed * 0.9 + base.drift) * 0.1;
        const reach = base.length + Math.sin(elapsed * 1.3 + base.drift * 2.2) * 0.12;

        const offsetX = pointerX * 0.14;
        const offsetY = pointerY * 0.14;

        const cos = Math.cos(anchorAngle);
        const sin = Math.sin(anchorAngle);

        const anchorIndex = i * 6;
        const tipIndex = anchorIndex + 3;

        positions[anchorIndex] = cos * anchorRadius + offsetX;
        positions[anchorIndex + 1] = sin * anchorRadius + offsetY;
        positions[anchorIndex + 2] = Math.sin(elapsed * 0.6 + base.drift) * 0.06;

        positions[tipIndex] = cos * (anchorRadius + reach) + offsetX + Math.sin(elapsed * 1.6 + base.drift) * 0.05;
        positions[tipIndex + 1] = sin * (anchorRadius + reach) + offsetY + Math.cos(elapsed * 1.4 + base.drift) * 0.05;
        positions[tipIndex + 2] = Math.cos(elapsed * 0.7 + base.drift) * 0.08;
    }
    filamentGeometry.attributes.position.needsUpdate = true;
};

const updateSparks = (elapsed) => {
    const positions = sparkGeometry.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
        const idx = i * 3;
        const baseX = sparkBase[idx];
        const baseY = sparkBase[idx + 1];
        const baseZ = sparkBase[idx + 2];

        const radial = Math.sqrt(baseX * baseX + baseY * baseY);
        const angle = Math.atan2(baseY, baseX);

        const pulse = radial + Math.sin(elapsed * 0.45 + angle * 6.0) * 0.06;
        const swirl = angle + Math.cos(elapsed * 0.35 + radial * 4.0) * 0.05;

        positions[idx] = Math.cos(swirl) * pulse + pointerX * 0.2;
        positions[idx + 1] = Math.sin(swirl) * pulse + pointerY * 0.2;
        positions[idx + 2] = baseZ + Math.sin(elapsed * 0.9 + radial * 5.0) * 0.05;
    }
    sparkGeometry.attributes.position.needsUpdate = true;
};

const animate = () => {
    const elapsed = clock.getElapsedTime();

    pointerX += (pointerTarget.x - pointerX) * 0.04;
    pointerY += (pointerTarget.y - pointerY) * 0.04;

    updateStruts(elapsed);
    updateOrbits(elapsed);
    updateFilaments(elapsed);
    updateSparks(elapsed);

    haloGroup.rotation.x += (pointerY * 0.35 - haloGroup.rotation.x) * 0.02;
    haloGroup.rotation.y += (pointerX * 0.35 - haloGroup.rotation.y) * 0.02;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

updateStruts(0);
updateOrbits(0);
updateFilaments(0);
updateSparks(0);
renderer.render(scene, camera);

if (!prefersReducedMotion) {
    animate();
}
