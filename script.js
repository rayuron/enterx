import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/environments/RoomEnvironment.js';

const container = document.querySelector('.webgl');
if (!container) {
    throw new Error('Missing .webgl container');
}

const overlay = document.querySelector('.overlay');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 30);
camera.position.set(0, 0.24, 3.6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x010103, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = environment;

const root = new THREE.Group();
scene.add(root);

const ambient = new THREE.AmbientLight(0x88a8ff, 0.32);
scene.add(ambient);

const spot = new THREE.SpotLight(0xffa4ff, 12, 10, Math.PI / 5, 0.6, 1);
spot.position.set(2.4, 3.8, 3.6);
spot.target.position.set(0, -0.1, 0);
scene.add(spot);
scene.add(spot.target);

const rim = new THREE.DirectionalLight(0x82eaff, 3.2);
rim.position.set(-2.6, 1.5, -2.8);
scene.add(rim);

const petals = new THREE.Group();
root.add(petals);

const petalGeometry = new THREE.PlaneGeometry(0.6, 1.6, 40, 40);
const petalPositions = petalGeometry.attributes.position;
for (let i = 0; i < petalPositions.count; i++) {
    const x = petalPositions.getX(i);
    const y = petalPositions.getY(i);
    const normalizedY = (y + 0.8) / 1.6;
    const flare = Math.sin(normalizedY * Math.PI) ** 0.85;
    const taper = 0.32 + flare * 0.88;
    const fold = Math.sin((normalizedY + 0.12) * Math.PI * 0.9) * 0.36;
    const rimCurl = Math.pow(Math.abs(x), 1.8) * 0.22;

    petalPositions.setX(i, x * taper);
    petalPositions.setY(i, (y + 0.18) * 0.92);
    petalPositions.setZ(i, fold - rimCurl);
}
petalGeometry.computeVertexNormals();

const petalMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.66, 0.85, 1.0),
    emissive: new THREE.Color(0.08, 0.04, 0.18),
    emissiveIntensity: 0.45,
    roughness: 0.14,
    metalness: 0.02,
    transmission: 1,
    thickness: 1.28,
    attenuationTint: new THREE.Color(0.82, 0.64, 1.0),
    attenuationDistance: 1.1,
    transparent: true,
    opacity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.45,
    iridescenceIOR: 1.32,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5
});

const petalCount = 18;
const petalsData = [];
for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const radius = 0.38 + Math.sin(angle * 3.2) * 0.012;
    const mesh = new THREE.Mesh(petalGeometry, petalMaterial);
    mesh.position.set(Math.cos(angle) * radius, -0.22 + Math.cos(angle * 1.6) * 0.08, Math.sin(angle) * radius);
    mesh.rotation.x = Math.PI / 2.35;
    mesh.rotation.y = angle;
    mesh.rotation.z = Math.sin(angle * 1.8) * 0.32;
    petals.add(mesh);

    petalsData.push({
        mesh,
        baseRotationX: mesh.rotation.x,
        baseRotationZ: mesh.rotation.z,
        baseY: mesh.position.y,
        phase: Math.random() * Math.PI * 2
    });
}

const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.96, 0.68, 1.0),
    emissive: new THREE.Color(0.52, 0.12, 0.48),
    emissiveIntensity: 1.35,
    roughness: 0.16,
    metalness: 0.04,
    transmission: 1,
    thickness: 0.72,
    attenuationTint: new THREE.Color(1.0, 0.72, 1.0),
    attenuationDistance: 0.46,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.8
});

const core = new THREE.Mesh(new THREE.SphereGeometry(0.22, 64, 64), coreMaterial);
core.position.y = -0.08;
root.add(core);

const innerPulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0x9beaff,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
innerPulse.position.y = -0.08;
root.add(innerPulse);

const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.01, 16, 240),
    new THREE.MeshBasicMaterial({
        color: 0x7ff0ff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
halo.rotation.x = Math.PI / 2;
root.add(halo);

const ribbonMaterialBase = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.62, 0.92, 1.0),
    roughness: 0.08,
    metalness: 0,
    transmission: 1,
    thickness: 0.45,
    attenuationTint: new THREE.Color(0.66, 0.88, 1.0),
    attenuationDistance: 1.6,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.4,
    side: THREE.DoubleSide
});

const ribbons = [];
const buildRibbon = (radius, phase, heightScale) => {
    const points = [];
    for (let i = 0; i <= 220; i++) {
        const t = i / 220;
        const angle = t * Math.PI * 2;
        const undulation = Math.sin(angle * 3.1 + phase) * 0.05;
        const y = Math.cos(angle * 1.7 + phase) * 0.28 * heightScale - 0.05;
        points.push(new THREE.Vector3(
            Math.cos(angle) * (radius + undulation),
            y,
            Math.sin(angle) * (radius + undulation)
        ));
    }
    const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.45);
    const geometry = new THREE.TubeGeometry(curve, 420, 0.012, 16, true);
    const material = ribbonMaterialBase.clone();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.02;
    root.add(mesh);
    ribbons.push({ mesh, phase });
};

buildRibbon(0.58, 0.0, 1.0);
buildRibbon(0.74, 1.3, 1.2);
buildRibbon(0.94, -0.8, 0.85);

const sparkCount = 1100;
const sparkGeometry = new THREE.BufferGeometry();
const sparkPositions = new Float32Array(sparkCount * 3);
const sparkBase = new Float32Array(sparkCount * 3);
for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.7 + Math.random() * 2.4;
    const height = (Math.random() - 0.5) * 2.4;
    sparkBase[i * 3] = angle;
    sparkBase[i * 3 + 1] = radius;
    sparkBase[i * 3 + 2] = height;
    sparkPositions[i * 3] = Math.cos(angle) * radius;
    sparkPositions[i * 3 + 1] = height;
    sparkPositions[i * 3 + 2] = Math.sin(angle) * radius;
}

sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

const sparkMaterial = new THREE.PointsMaterial({
    color: 0xbaf3ff,
    size: 0.018,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.68,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
root.add(sparks);

const pointer = new THREE.Vector2(0, 0);
const pointerTarget = new THREE.Vector2(0, 0);
const glassPointer = new THREE.Vector2(0.5, 0.5);
const glassTarget = new THREE.Vector2(0.5, 0.5);

const updatePointerTargets = (event) => {
    const normX = event.clientX / window.innerWidth;
    const normY = event.clientY / window.innerHeight;
    pointerTarget.set(normX * 2 - 1, normY * 2 - 1);
    glassTarget.set(normX, normY);
    overlay?.classList.add('is-active');
};

window.addEventListener('pointermove', updatePointerTargets);

window.addEventListener('pointerleave', () => {
    pointerTarget.set(0, 0);
    glassTarget.set(0.5, 0.5);
    overlay?.classList.remove('is-active');
});

window.addEventListener('blur', () => {
    pointerTarget.set(0, 0);
    glassTarget.set(0.5, 0.5);
    overlay?.classList.remove('is-active');
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
const animate = () => {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointerTarget.x - pointer.x) * 0.05;
    pointer.y += (pointerTarget.y - pointer.y) * 0.05;

    glassPointer.x += (glassTarget.x - glassPointer.x) * 0.08;
    glassPointer.y += (glassTarget.y - glassPointer.y) * 0.08;

    if (overlay) {
        overlay.style.setProperty('--pointer-x', `${glassPointer.x * 100}%`);
        overlay.style.setProperty('--pointer-y', `${glassPointer.y * 100}%`);
        overlay.style.setProperty('--tilt-x', `${(glassPointer.x - 0.5) * 14}deg`);
        overlay.style.setProperty('--tilt-y', `${(0.5 - glassPointer.y) * 10}deg`);
    }

    petalsData.forEach((data) => {
        const { mesh, baseRotationX, baseRotationZ, baseY, phase } = data;
        mesh.rotation.x = baseRotationX + Math.sin(elapsed * 0.9 + phase) * 0.14 + pointer.y * 0.08;
        mesh.rotation.z = baseRotationZ + Math.sin(elapsed * 1.18 + phase * 1.4) * 0.2;
        mesh.position.y = baseY + Math.sin(elapsed * 0.8 + phase) * 0.05;
    });

    const coreScale = 1 + Math.sin(elapsed * 1.6) * 0.06;
    core.scale.setScalar(coreScale);
    innerPulse.scale.setScalar(1.08 + Math.sin(elapsed * 1.1) * 0.14);
    innerPulse.material.opacity = 0.16 + Math.sin(elapsed * 1.2) * 0.06;

    ribbons.forEach(({ mesh, phase }, index) => {
        mesh.rotation.y = elapsed * 0.18 + phase;
        mesh.material.opacity = 0.22 + Math.sin(elapsed * 0.9 + phase + index * 0.4) * 0.08;
    });

    const positions = sparkGeometry.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
        const baseAngle = sparkBase[i * 3];
        const baseRadius = sparkBase[i * 3 + 1];
        const baseHeight = sparkBase[i * 3 + 2];
        const angle = baseAngle + elapsed * 0.2 + Math.sin(elapsed * 0.6 + baseHeight * 1.4) * 0.04;
        const radius = baseRadius + Math.sin(elapsed * 0.8 + baseAngle * 3.0) * 0.05;
        const height = baseHeight + Math.sin(elapsed * 0.9 + baseAngle * 1.8) * 0.08;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    sparkGeometry.attributes.position.needsUpdate = true;

    halo.rotation.z = elapsed * 0.28;
    halo.material.opacity = 0.24 + Math.sin(elapsed * 0.7) * 0.08;

    root.rotation.y = elapsed * 0.12 + pointer.x * 0.28;
    root.rotation.x = -0.12 + pointer.y * 0.18;

    camera.position.x = pointer.x * 0.24;
    camera.position.y = 0.24 + pointer.y * 0.12;
    camera.lookAt(0, -0.1, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();
