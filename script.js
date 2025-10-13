const container = document.querySelector('.webgl');
if (!container) {
    throw new Error('Missing .webgl container');
}

const overlay = document.querySelector('.overlay');

let birdSketchInstance = null;

// Debug display for mobile
const debugDiv = document.createElement('div');
debugDiv.style.cssText = 'position:fixed;top:0;left:0;background:rgba(0,0,0,0.8);color:#0f0;padding:10px;font-size:10px;z-index:9999;max-width:100vw;overflow:auto;';
document.body.appendChild(debugDiv);

const debugLog = (msg) => {
    console.log(msg);
    debugDiv.innerHTML += (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg) + '<br>';
};

const initBirdSketch = () => {
    if (birdSketchInstance || typeof window === 'undefined' || !window.p5) {
        debugLog('initBirdSketch skipped: ' + JSON.stringify({
            hasInstance: !!birdSketchInstance,
            isWindow: typeof window !== 'undefined',
            hasP5: !!window.p5
        }));
        return;
    }

    debugLog('Initializing bird sketch with p5.js');

    const sketch = (p) => {
        let t = 0;
        const baseSize = 400;
        let canvas;

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
                        debugLog('Scaled down to fit 16.7M pixel limit: ' + canvasWidth + 'x' + canvasHeight);
                    }

                    // Additional safety: cap at 2048 per dimension
                    canvasWidth = Math.min(canvasWidth, 2048);
                    canvasHeight = Math.min(canvasHeight, 2048);

                    debugLog('Final canvas size: ' + canvasWidth + 'x' + canvasHeight + ' = ' + (canvasWidth * canvasHeight) + ' pixels');
                }

                // Explicitly use P2D renderer for better mobile compatibility
                canvas = p.createCanvas(canvasWidth, canvasHeight, p.P2D);
                canvas.parent(container);
                p.pixelDensity(1); // Always use 1 to avoid memory issues

                canvas.elt.classList.add('bird-canvas');
                canvas.elt.setAttribute('aria-hidden', 'true');
                canvas.elt.style.pointerEvents = 'none';

                // Style canvas to fill screen (CSS size is independent of canvas resolution)
                canvas.elt.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;display:block;margin:0;padding:0;z-index:10000!important;';

                // Use p5.js canvas.style() method as recommended
                canvas.style('display', 'block');

                p.noFill();
                p.strokeJoin(p.ROUND);
                p.strokeCap(p.ROUND);
                p.colorMode(p.HSB, 360, 255, 255, 255);
                debugLog('Canvas: ' + canvas.width + 'x' + canvas.height + ' (display: ' + window.innerWidth + 'x' + window.innerHeight + ') mobile:' + isMobile);

                // Check if canvas element exists in DOM
                setTimeout(() => {
                    const canvasInDom = document.querySelector('canvas');
                    debugLog('Canvas in DOM: ' + (canvasInDom ? 'YES' : 'NO'));
                    if (canvasInDom) {
                        const styles = window.getComputedStyle(canvasInDom);
                        debugLog('Canvas display: ' + styles.display + ', visibility: ' + styles.visibility + ', opacity: ' + styles.opacity + ', zIndex: ' + styles.zIndex);
                    }
                }, 100);
            } catch (error) {
                debugLog('Canvas error: ' + error.message);
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };

        let drawCount = 0;
        p.draw = () => {
            drawCount++;
            if (drawCount === 1) {
                debugLog('draw() called, frameRate: ' + Math.round(p.frameRate()));
            }

            // Use RGB instead of HSB for debugging
            p.colorMode(p.RGB, 255, 255, 255, 255);
            p.background(0, 255, 0);  // Bright green - very visible

            // Debug: Draw a simple test shape
            p.fill(255, 0, 0, 255);
            p.noStroke();
            p.circle(p.width / 2, p.height / 2, 100);

            p.colorMode(p.HSB, 360, 255, 255, 255);
            p.noFill();
            p.strokeWeight(0.7);

            const applyBlueStroke = (y, s, alpha = 110) => {
                const baseHue = 208;
                const hueOffset = p.sin(t * 0.8 + y * 0.3 + s * p.TWO_PI) * 10
                    + p.cos(t * 0.6 + y * 0.18) * 8;
                const hue = (baseHue + hueOffset + 360) % 360;
                const saturation = p.constrain(90 + p.sin(t * 0.9 + s * p.PI) * 25 + p.cos(y * 0.24 + t * 0.5) * 18, 40, 150);
                p.stroke(hue, saturation, 255, alpha);
            };

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

                    applyBlueStroke(y, s);
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

                    applyBlueStroke(y, s);
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

                    const x2 = x1 + r * p.cos(a) * spread
                        + p.cos(s * p.TWO_PI + t * 2.1) * 7
                        + p.sin(s * p.PI * 1.5 + t * 1.7) * 4;
                    const y2 = y1 + r * p.sin(a)
                        * (1
                            + p.sin(w3 + y * 0.18) * 0.14
                            + p.cos(w4 + s * p.PI) * 0.09
                            + p.sin(w5 + y * 0.12) * 0.06);

                    applyBlueStroke(y, s, 100);
                    p.line(x1, y1, x2, y2);
                }
            }

            p.pop();

            t += p.PI / 150;
        };
    };

    try {
        birdSketchInstance = new window.p5(sketch);
        debugLog('p5 instance created');
    } catch (error) {
        debugLog('p5 instance error: ' + error.message);
    }
};

const readyPromise = new Promise((resolve) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
        return;
    }

    document.addEventListener('DOMContentLoaded', resolve, { once: true });
});

debugLog('Script loaded');

const p5LoadedPromise = new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.p5) {
        debugLog('p5 already loaded');
        resolve();
        return;
    }

    const checkP5 = () => {
        if (window.p5) {
            debugLog('p5 detected');
            resolve();
            return;
        }
        setTimeout(checkP5, 50);
    };

    const p5Script = document.querySelector('script[src*="p5"]');
    if (p5Script) {
        debugLog('p5 script found');
        p5Script.addEventListener('load', () => {
            debugLog('p5 loaded via event');
            resolve();
        }, { once: true });
        p5Script.addEventListener('error', () => {
            debugLog('p5 load error');
            resolve();
        }, { once: true });
    } else {
        debugLog('p5 script not found');
    }

    checkP5();
});

Promise.all([readyPromise, p5LoadedPromise]).then(() => {
    debugLog('Ready to init');
    initBirdSketch();
}).catch((error) => {
    debugLog('Init error: ' + error.message);
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
