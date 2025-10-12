import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const container = document.querySelector('.webgl');
if (!container) {
    throw new Error('Missing .webgl container');
}

const overlay = document.querySelector('.overlay');

let birdSketchInstance = null;

const initBirdSketch = () => {
    if (birdSketchInstance || typeof window === 'undefined' || !window.p5) {
        return;
    }

    const sketch = (p) => {
        let t = 0;
        let canvas;
        const baseSize = 400;

        p.setup = () => {
            canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            if (container) {
                canvas.parent(container);
            }
            p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
            canvas.elt.classList.add('bird-canvas');
            canvas.elt.setAttribute('aria-hidden', 'true');
            canvas.elt.style.zIndex = '-1';
            canvas.elt.style.pointerEvents = 'none';
            p.noFill();
            p.strokeJoin(p.ROUND);
            p.strokeCap(p.ROUND);
            p.colorMode(p.HSB, 360, 255, 255, 255);
        };

        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };

        p.draw = () => {
            p.background(0, 0, 9, 255);
            p.strokeWeight(0.7);

            const w1 = p.sin(t * 2.2) * 0.75;
            const w2 = p.cos(t * 3.1) * 0.55;
            const w3 = p.sin(t * 1.8) * 0.45;
            const w4 = p.cos(t * 2.6) * 0.35;
            const w5 = p.sin(t * 1.5) * 0.25;

            p.push();
            const scaleFactor = Math.min(p.width, p.height) / baseSize;
            p.translate(p.width / 2, p.height / 2);
            p.scale(scaleFactor);
            p.translate(-baseSize / 2, -baseSize / 2);

            for (let i = 0; i < 50; i++) {
                const y = i * 0.7;
                for (let j = 0; j < 18; j++) {
                    const s = j / 17;

                    const a = -p.PI / 2.5
                        + w1 * 0.85
                        + p.sin(y * 0.18 + t * 1.5) * 0.28
                        + p.cos(y * 0.12 - t * 0.9) * 0.22
                        + p.sin(y * 0.25 + t * 1.2) * 0.15
                        + p.cos(y * 0.08 + t * 0.7) * 0.12;

                    const r = y * 3.8
                        + p.sin(t * 0.8 + y * 0.3) * 3.5
                        + p.cos(t * 1.1 + y * 0.2) * 2.8
                        + p.sin(t * 1.4 - y * 0.15) * 1.5;

                    const x1 = -r * p.cos(a)
                        + p.sin(y * 0.08 + t * 0.7) * 0.6
                        + p.cos(y * 0.12 + t * 0.5) * 0.4
                        + 180;
                    const y1 = r * p.sin(a)
                        + p.cos(y * 0.06 + t * 1.1) * 2.5
                        + p.sin(y * 0.09 - t * 0.8) * 1.8
                        + 200;

                    const b = a + p.PI / 2.5
                        + s * 1.1
                        - p.sin(s * p.PI * 2 + y * 0.35 + t * 0.9) * 0.38
                        - p.cos(s * p.PI * 1.5 + t * 1.6) * 0.22
                        - p.sin(s * p.PI + y * 0.2 + t * 1.3) * 0.18;

                    const l = (r * 0.75
                        + p.sin(s * p.PI) * r * 0.6
                        + p.cos(s * p.PI * 2) * 0.3)
                        * p.cos(w1 * 0.85 + p.sin(s * p.PI) * 0.2)
                        * p.sin(w2 + s * p.PI * 0.45)
                        * p.cos(w3 * 0.3 + y * 0.1);

                    const x2 = x1 - l * p.cos(b)
                        * (p.cos(w1 * 0.65)
                            + p.sin(y * 0.22 + t * 0.8) * 0.28
                            + p.cos(w4 + s * p.TWO_PI * 0.3) * 0.15);
                    const y2 = y1 - l * p.sin(b)
                        * (1
                            + p.cos(w2 * 0.45 + s * p.TWO_PI) * 0.18
                            + p.sin(w3 * 0.5 + y * 0.12) * 0.12
                            + p.cos(w5 + s * p.PI) * 0.08);

                    const h = (y * 6 + s * 140 + t * 20) % 360;
                    const sat = h > 270 && h < 330 ? 30 : 230;
                    p.stroke(h, sat, 255, 110);
                    p.line(x1, y1, x2, y2);
                }
            }

            for (let i = 0; i < 50; i++) {
                const y = i * 0.7;
                for (let j = 0; j < 18; j++) {
                    const s = j / 17;

                    const a = -p.PI / 2.5
                        - w1 * 0.85
                        - p.sin(y * 0.18 + t * 1.5) * 0.28
                        - p.cos(y * 0.12 - t * 0.9) * 0.22
                        - p.sin(y * 0.25 + t * 1.2) * 0.15
                        - p.cos(y * 0.08 + t * 0.7) * 0.12;

                    const r = y * 3.8
                        + p.cos(t * 0.8 + y * 0.3) * 3.5
                        + p.sin(t * 1.1 + y * 0.2) * 2.8
                        + p.cos(t * 1.4 - y * 0.15) * 1.5;

                    const x1 = -r * p.cos(a)
                        - p.sin(y * 0.08 + t * 0.7) * 0.6
                        - p.cos(y * 0.12 + t * 0.5) * 0.4
                        + 220;
                    const y1 = r * p.sin(a)
                        - p.cos(y * 0.06 + t * 1.1) * 2.5
                        - p.sin(y * 0.09 - t * 0.8) * 1.8
                        + 200;

                    const b = a - p.PI / 2.5
                        - s * 1.1
                        + p.sin(s * p.PI * 2 + y * 0.35 + t * 0.9) * 0.38
                        + p.cos(s * p.PI * 1.5 + t * 1.6) * 0.22
                        + p.sin(s * p.PI + y * 0.2 + t * 1.3) * 0.18;

                    const l = (r * 0.75
                        + p.sin(s * p.PI) * r * 0.6
                        + p.cos(s * p.PI * 2) * 0.3)
                        * p.cos(-w1 * 0.85 - p.sin(s * p.PI) * 0.2)
                        * p.sin(-w2 + s * p.PI * 0.45)
                        * p.cos(-w3 * 0.3 + y * 0.1);

                    const x2 = x1 - l * p.cos(b)
                        * (p.cos(-w1 * 0.65)
                            - p.sin(y * 0.22 + t * 0.8) * 0.28
                            - p.cos(-w4 + s * p.TWO_PI * 0.3) * 0.15);
                    const y2 = y1 - l * p.sin(b)
                        * (1
                            + p.cos(-w2 * 0.45 + s * p.TWO_PI) * 0.18
                            + p.sin(-w3 * 0.5 + y * 0.12) * 0.12
                            + p.cos(-w5 + s * p.PI) * 0.08);

                    const h = (y * 6 + s * 140 + t * 20) % 360;
                    const sat = h > 270 && h < 330 ? 30 : 230;
                    p.stroke(h, sat, 255, 110);
                    p.line(x1, y1, x2, y2);
                }
            }

            for (let i = 0; i < 30; i++) {
                const y = i * 0.55;
                for (let j = 0; j < 12; j++) {
                    const s = j / 11;

                    const a = p.PI / 2
                        + (s - 0.5) * 1.2
                        + p.sin(t * 1.8 + s * p.PI) * 0.22
                        + p.cos(t * 2.3 + s * p.PI * 1.5) * 0.16
                        + p.sin(t * 1.4 - s * p.PI * 0.8) * 0.12;

                    const r = 40
                        + y * 1.8
                        + p.cos(y * 0.25 + t * 2.1) * 4.5
                        + p.sin(y * 0.18 + t * 1.6) * 3.2
                        + p.cos(y * 0.32 - t * 1.9) * 2.1;

                    const x1 = 200
                        + p.sin(t * 0.85) * 1.8
                        + p.cos(t * 1.2) * 0.9;
                    const y1 = 260
                        + y * 0.6
                        + p.cos(t * 1.4) * 2.5
                        + p.sin(t * 0.95) * 1.5;

                    const spread = p.sin(y * 0.2 + t * 1.5) * 0.65
                        + p.cos(y * 0.15 + t * 1.8) * 0.25
                        + p.sin(y * 0.28 + t * 1.2) * 0.15;

                    const x2 = x1
                        + r * p.cos(a) * spread
                        + p.cos(s * p.TWO_PI + t * 2.1) * 7
                        + p.sin(s * p.PI * 1.5 + t * 1.7) * 4;
                    const y2 = y1
                        + r * p.sin(a)
                            * (1
                                + p.sin(w3 + y * 0.18) * 0.14
                                + p.cos(w4 + s * p.PI) * 0.09
                                + p.sin(w5 + y * 0.12) * 0.06);

                    const h = (y * 7 + s * 160 + t * 25 + 200) % 360;
                    const sat = h > 270 && h < 330 ? 30 : 230;
                    p.stroke(h, sat, 255, 95);
                    p.line(x1, y1, x2, y2);
                }
            }

            p.pop();

            t += p.PI / 150;
        };
    };

    birdSketchInstance = new window.p5(sketch);
};

if (document.readyState === 'complete') {
    initBirdSketch();
} else {
    window.addEventListener('load', initBirdSketch);
}

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
