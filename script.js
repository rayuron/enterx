// Setup body styling via JavaScript
document.body.style.cssText = `
    background: radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.7), transparent 60%),
        radial-gradient(circle at 75% 80%, rgba(173, 202, 255, 0.55), transparent 55%),
        linear-gradient(165deg, #f3f7ff, #c9dfff);
    display: grid;
    place-items: center;
    position: relative;
    font-family: "Futura", "Futura PT", "Avenir Next", "Helvetica Neue", "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
`;

const container = document.querySelector('.webgl');
if (!container) {
    throw new Error('Missing .webgl container');
}

// Style container
container.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';

const overlay = document.querySelector('.overlay');
if (overlay) {
    overlay.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.4rem 2.4rem;
        min-width: 240px;
        width: min(82vw, 560px);
        border-radius: 999px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(230, 242, 255, 0.08));
        backdrop-filter: blur(32px) saturate(170%);
        border: 0.5px solid rgba(255, 255, 255, 0.35);
        box-shadow:
            0 8px 32px rgba(60, 110, 180, 0.08),
            0 2px 8px rgba(60, 110, 180, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.22),
            inset 0 0 60px rgba(255, 255, 255, 0.03);
        z-index: 1;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Add hover/touch effect for liquid glass
    overlay.addEventListener('pointerenter', () => {
        overlay.style.transform = 'scale(1.02)';
        overlay.style.boxShadow = `
            0 12px 48px rgba(60, 110, 180, 0.12),
            0 4px 12px rgba(60, 110, 180, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.65),
            inset 0 -1px 0 rgba(255, 255, 255, 0.28),
            inset 0 0 80px rgba(255, 255, 255, 0.05)
        `;
    });

    overlay.addEventListener('pointerleave', () => {
        overlay.style.transform = 'scale(1)';
        overlay.style.boxShadow = `
            0 8px 32px rgba(60, 110, 180, 0.08),
            0 2px 8px rgba(60, 110, 180, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.22),
            inset 0 0 60px rgba(255, 255, 255, 0.03)
        `;
    });
}

const logotype = document.querySelector('.logotype');
if (logotype) {
    logotype.style.cssText = `
        font-size: clamp(2rem, 4.5vw, 2.8rem);
        font-weight: 800;
        letter-spacing: 0.72em;
        color: rgba(14, 18, 28, 0.98);
        text-align: center;
        padding-left: 0.72em;
        text-shadow: 0 3px 18px rgba(255, 255, 255, 0.32);
    `;
}

let birdSketchInstance = null;

const initBirdSketch = () => {
    if (birdSketchInstance || typeof window === 'undefined' || !window.p5) {
        return;
    }

    const sketch = (p) => {
        let t = 0;
        const baseSize = 400;
        let canvas;

        // Touch/mouse interaction
        let touchX = 0.5;
        let touchY = 0.5;
        let touchActive = false;
        let touchInfluence = 0;

        p.setup = () => {
            try {
                // Reduce pixel density for mobile performance
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                // iOS Safari has canvas size limits - use smaller size for mobile
                let canvasWidth = window.innerWidth;
                let canvasHeight = window.innerHeight;

                if (isMobile) {
                    // iOS Safari hard limit: 16,777,216 pixels (width × height)
                    const maxPixels = 16777216;
                    const pixelCount = canvasWidth * canvasHeight;

                    if (pixelCount > maxPixels) {
                        const scale = Math.sqrt(maxPixels / pixelCount);
                        canvasWidth = Math.floor(canvasWidth * scale);
                        canvasHeight = Math.floor(canvasHeight * scale);
                    }

                    // Additional safety: cap at 2048 per dimension
                    canvasWidth = Math.min(canvasWidth, 2048);
                    canvasHeight = Math.min(canvasHeight, 2048);
                }

                // Explicitly use P2D renderer for better mobile compatibility
                canvas = p.createCanvas(canvasWidth, canvasHeight, p.P2D);
                const targetDensity = Math.min(window.devicePixelRatio || 1, 2.5);
                p.pixelDensity(targetDensity);

                // Append directly to body instead of container
                document.body.appendChild(canvas.elt);

                // Style canvas - simple and direct
                canvas.elt.style.position = 'fixed';
                canvas.elt.style.top = '0';
                canvas.elt.style.left = '0';
                canvas.elt.style.width = '100vw';
                canvas.elt.style.height = '100vh';
                canvas.elt.style.display = 'block';
                canvas.elt.style.zIndex = '0';
                canvas.elt.style.pointerEvents = 'none';

                p.noFill();
                p.strokeJoin(p.ROUND);
                p.strokeCap(p.ROUND);
                p.colorMode(p.HSB, 360, 255, 255, 255);
            } catch (error) {
                console.error('Canvas error:', error);
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };

        // Touch and mouse interaction handlers
        p.touchStarted = () => {
            if (p.touches.length > 0) {
                touchX = p.touches[0].x / p.width;
                touchY = p.touches[0].y / p.height;
                touchActive = true;
            }
            return false; // Prevent default
        };

        p.touchMoved = () => {
            if (p.touches.length > 0) {
                touchX = p.touches[0].x / p.width;
                touchY = p.touches[0].y / p.height;
                touchActive = true;
            }
            return false;
        };

        p.touchEnded = () => {
            touchActive = false;
            return false;
        };

        p.mouseMoved = () => {
            touchX = p.mouseX / p.width;
            touchY = p.mouseY / p.height;
            touchActive = true;
        };

        p.mousePressed = () => {
            touchActive = true;
        };

        p.mouseReleased = () => {
            touchActive = false;
        };

        p.draw = () => {
            // Smoothly interpolate touch influence
            if (touchActive) {
                touchInfluence = p.lerp(touchInfluence, 1, 0.1);
            } else {
                touchInfluence = p.lerp(touchInfluence, 0, 0.05);
            }

            // Solid white background per request
            p.background(0, 0, 255, 255);
            p.strokeWeight(0.7);

            const applyFeatherColor = (y, s, alpha = 140) => {
                const longitudinal = p.constrain(1 - y / 45, 0, 1);
                const span = p.constrain(s, 0, 1);
                const tipShift = p.lerp(-18, 12, span);
                const shimmer = p.sin(t * 0.6 + y * 0.18 + span * p.TWO_PI) * 5;
                const ripple = p.cos(t * 0.45 + y * 0.12) * 3;
                const hueBase = p.constrain(202 + tipShift * 0.55 + shimmer + ripple, 188, 228);

                const saturation = p.constrain(
                    95
                        + longitudinal * 90
                        + p.sin(t * 0.8 + span * p.PI) * 32
                        + p.cos(y * 0.16 + t * 0.65) * 20,
                    80,
                    210,
                );

                const brightness = p.constrain(
                    208
                        + longitudinal * 44
                        + p.cos(t * 0.9 + span * p.TWO_PI) * 18
                        + p.sin(y * 0.22 + t * 0.5) * 14,
                    198,
                    255,
                );

                p.colorMode(p.HSB, 360, 255, 255, 255);
                p.stroke(hueBase, saturation, brightness, alpha);

                return { hue: hueBase, saturation, brightness, depth: longitudinal, span };
            };

            const drawLayeredStroke = (x1, y1, x2, y2, yIndex, sIndex, alpha = 120) => {
                const featherFactor = 0.65 + (1 - sIndex) * 0.45 + touchInfluence * 0.25;

                // Base chroma in HSB space
                const chroma = applyFeatherColor(yIndex, sIndex, alpha);
                p.strokeWeight(0.75 + featherFactor * 0.32);
                p.line(x1, y1, x2, y2);

                // Soft luminous highlight using RGB stroke(r,g,b,alpha)
                p.push();
                p.colorMode(p.RGB, 255, 255, 255, 255);
                const glowDepth = chroma.depth;
                const glowAlpha = 38 + featherFactor * 30 + touchInfluence * 42 + glowDepth * 22;
                const glowBlue = p.constrain(196 + glowDepth * 52 + featherFactor * 18, 180, 255);
                const glowGreen = p.constrain(190 + glowDepth * 38 + p.sin(t * 1.2 + sIndex * p.TWO_PI) * 8, 170, 255);
                const glowRed = p.constrain(150 + glowDepth * 26 + p.cos(t * 0.9 + yIndex * 0.12) * 6, 130, 210);
                p.stroke(glowRed, glowGreen, glowBlue, glowAlpha);
                p.strokeWeight(1.25 + featherFactor * 0.6);
                p.line(x1, y1, x2, y2);

                // Inner core accent with stroke(grayscale, alpha)
                const coreAlpha = 26 + featherFactor * 18 + glowDepth * 16;
                p.stroke(255, coreAlpha);
                p.strokeWeight(0.65 + featherFactor * 0.38);
                p.line(x1, y1, x2, y2);

                // Ambient shadow to add depth
                const shadowOffsetX = (touchX - 0.5) * 6;
                const shadowOffsetY = (touchY - 0.5) * 6;
                const shadowAlpha = 22 + featherFactor * 14 + (1 - glowDepth) * 18;
                p.stroke(48, 68, 120, shadowAlpha);
                p.strokeWeight(1.5 + featherFactor * 0.42);
                p.line(x1 + shadowOffsetX, y1 + shadowOffsetY, x2 + shadowOffsetX, y2 + shadowOffsetY);
                p.pop();

                p.colorMode(p.HSB, 360, 255, 255, 255);
            };

            // Add touch influence to wave motion
            const touchOffsetX = (touchX - 0.5) * touchInfluence * 0.3;
            const touchOffsetY = (touchY - 0.5) * touchInfluence * 0.3;

            const w1 = p.sin(t * 2.2 + touchOffsetX) * (0.75 + touchInfluence * 0.2);
            const w2 = p.cos(t * 3.1 + touchOffsetY) * (0.55 + touchInfluence * 0.15);
            const w3 = p.sin(t * 1.8 + touchOffsetX * 0.5) * (0.45 + touchInfluence * 0.1);
            const w4 = p.cos(t * 2.6 + touchOffsetY * 0.5) * (0.35 + touchInfluence * 0.08);
            const w5 = p.sin(t * 1.5) * (0.25 + touchInfluence * 0.05);

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

                    drawLayeredStroke(x1, y1, x2, y2, y, s);
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

                    drawLayeredStroke(x1, y1, x2, y2, y, s);
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

                    const x2 = x1 + r * p.cos(a) * spread
                        + p.cos(s * p.TWO_PI + t * 2.1) * 7
                        + p.sin(s * p.PI * 1.5 + t * 1.7) * 4;
                    const y2 = y1 + r * p.sin(a)
                        * (1
                            + p.sin(w3 + y * 0.18) * 0.14
                            + p.cos(w4 + s * p.PI) * 0.09
                            + p.sin(w5 + y * 0.12) * 0.06);

                    drawLayeredStroke(x1, y1, x2, y2, y, s, 100);
                }
            }

            p.pop();

            t += p.PI / 300;
        };
    };

    try {
        birdSketchInstance = new window.p5(sketch);
    } catch (error) {
        console.error('p5 instance error:', error);
    }
};

const readyPromise = new Promise((resolve) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
        return;
    }

    document.addEventListener('DOMContentLoaded', resolve, { once: true });
});

const p5LoadedPromise = new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.p5) {
        resolve();
        return;
    }

    const checkP5 = () => {
        if (window.p5) {
            resolve();
            return;
        }
        setTimeout(checkP5, 50);
    };

    const p5Script = document.querySelector('script[src*="p5"]');
    if (p5Script) {
        p5Script.addEventListener('load', resolve, { once: true });
        p5Script.addEventListener('error', resolve, { once: true });
    }

    checkP5();
});

Promise.all([readyPromise, p5LoadedPromise]).then(() => {
    initBirdSketch();
}).catch((error) => {
    console.error('Init error:', error);
});

const pointer = { x: 0.5, y: 0.5 };
const pointerTarget = { x: 0.5, y: 0.5 };
const overlayPointer = { x: 0.5, y: 0.5 };
const overlayTarget = { x: 0.5, y: 0.5 };

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

const updateTargets = (clientX, clientY) => {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    const x = clamp01(clientX / width);
    const y = clamp01(clientY / height);
    pointerTarget.x = x;
    pointerTarget.y = y;
    overlayTarget.x = x;
    overlayTarget.y = y;
};

const handlePointerEnter = (event) => {
    updateTargets(event.clientX, event.clientY);
    overlay?.classList.add('is-active');
};

const handlePointerMove = (event) => {
    updateTargets(event.clientX, event.clientY);
};

const resetPointer = () => {
    overlay?.classList.remove('is-active');
    updateTargets(window.innerWidth / 2, window.innerHeight / 2);
};

window.addEventListener('pointerdown', handlePointerEnter);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', resetPointer);
window.addEventListener('pointerleave', resetPointer);
window.addEventListener('blur', resetPointer);

const animateOverlay = () => {
    pointer.x += (pointerTarget.x - pointer.x) * 0.12;
    pointer.y += (pointerTarget.y - pointer.y) * 0.12;

    overlayPointer.x += (overlayTarget.x - overlayPointer.x) * 0.1;
    overlayPointer.y += (overlayTarget.y - overlayPointer.y) * 0.1;

    if (overlay) {
        overlay.style.setProperty('--pointer-x', `${overlayPointer.x * 100}%`);
        overlay.style.setProperty('--pointer-y', `${overlayPointer.y * 100}%`);
        overlay.style.setProperty('--tilt-x', `${(overlayPointer.x - 0.5) * 14}deg`);
        overlay.style.setProperty('--tilt-y', `${(0.5 - overlayPointer.y) * 11}deg`);
    }

    requestAnimationFrame(animateOverlay);
};

animateOverlay();
