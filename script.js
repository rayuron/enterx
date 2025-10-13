// Setup body styling via JavaScript
document.body.style.cssText = `
    background: radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.78), transparent 60%),
        radial-gradient(circle at 75% 80%, rgba(188, 215, 255, 0.6), transparent 55%),
        linear-gradient(165deg, #f5f8ff, #dce7ff 52%, #ffe9f3);
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
        padding: 1.2rem 2.1rem;
        min-width: 200px;
        width: min(68vw, 460px);
        border-radius: 999px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(226, 238, 255, 0.08));
        backdrop-filter: blur(34px) saturate(180%);
        border: 0.5px solid rgba(255, 255, 255, 0.28);
        box-shadow:
            0 8px 32px rgba(47, 90, 180, 0.08),
            0 2px 8px rgba(47, 90, 180, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.45),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18),
            inset 0 0 60px rgba(255, 255, 255, 0.02);
        z-index: 1;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Add hover/touch effect for liquid glass
    overlay.addEventListener('pointerenter', () => {
        overlay.style.transform = 'scale(1.02)';
        overlay.style.boxShadow = `
            0 12px 48px rgba(47, 90, 180, 0.12),
            0 4px 12px rgba(47, 90, 180, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.24),
            inset 0 0 80px rgba(255, 255, 255, 0.04)
        `;
    });

    overlay.addEventListener('pointerleave', () => {
        overlay.style.transform = 'scale(1)';
        overlay.style.boxShadow = `
            0 8px 32px rgba(47, 90, 180, 0.08),
            0 2px 8px rgba(47, 90, 180, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.45),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18),
            inset 0 0 60px rgba(255, 255, 255, 0.02)
        `;
    });
}

const logotype = document.querySelector('.logotype');
if (logotype) {
    logotype.style.cssText = `
        font-family: "Futura", "Futura PT", "Avenir Next", "Helvetica Neue", "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: clamp(1.8rem, 3.8vw, 2.6rem);
        font-weight: 700;
        letter-spacing: 0.24em;
        color: rgba(14, 18, 28, 0.98);
        text-align: center;
        padding-left: 0.24em;
        text-shadow: 0 3px 18px rgba(255, 255, 255, 0.32);
    `;
}

let compositionOffset = { x: 0, y: 0 };

const simplifiedLayout = {
    primaryLayers: 12,
    primarySegments: 6,
    mirrorLayers: 12,
    mirrorSegments: 6,
    accentLayers: 6,
    accentSegments: 4,
};

const layerSpacing = {
    primary: 1.35,
    mirror: 1.35,
    accent: 1.1,
};

const updateLayout = () => {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    const aspectRatio = width > 0 ? height / width : 1;
    const isCompact = width <= 768;
    const isExtraCompact = width <= 480;

    if (overlay) {
        overlay.style.padding = isExtraCompact ? '0.7rem 1.3rem' : isCompact ? '0.95rem 1.8rem' : '1.15rem 2.1rem';
        overlay.style.minWidth = isCompact ? '0' : '200px';
        overlay.style.maxWidth = isExtraCompact ? '260px' : isCompact ? '360px' : '460px';
        overlay.style.width = isExtraCompact ? 'min(64vw, 240px)' : isCompact ? 'min(52vw, 320px)' : 'min(38vw, 420px)';
    }

    if (logotype) {
        logotype.style.fontSize = isExtraCompact
            ? 'clamp(1.4rem, 7vw, 2rem)'
            : isCompact
                ? 'clamp(1.6rem, 5vw, 2.3rem)'
                : 'clamp(1.8rem, 3.4vw, 2.6rem)';
        logotype.style.letterSpacing = isExtraCompact ? '0.16em' : isCompact ? '0.2em' : '0.24em';
        logotype.style.paddingLeft = isExtraCompact ? '0.16em' : isCompact ? '0.2em' : '0.24em';
    }

    const baseOffsetY = aspectRatio > 1.55 ? -12 : -6;
    const compactOffsetY = isCompact ? (isExtraCompact ? -26 : -18) : baseOffsetY;
    compositionOffset.x = 0;
    compositionOffset.y = compactOffsetY;
};

window.addEventListener('resize', updateLayout);
window.addEventListener('orientationchange', updateLayout);

updateLayout();

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
            updateLayout();
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
                touchInfluence = p.lerp(touchInfluence, 1, 0.08);
            } else {
                touchInfluence = p.lerp(touchInfluence, 0, 0.04);
            }

            // Solid white background per request
            p.background(0, 0, 255, 255);
            p.strokeWeight(0.7);

            const computeTouchOffsets = () => ({
                x: (touchX - 0.5) * touchInfluence * 0.3,
                y: (touchY - 0.5) * touchInfluence * 0.3,
            });

            const calculateWaveBundle = (time, offsets, influence) => ({
                crest: p.sin(time * 2.2 + offsets.x) * (0.48 + influence * 0.14),
                sway: p.cos(time * 3.1 + offsets.y) * (0.38 + influence * 0.1),
                flutter: p.sin(time * 1.8 + offsets.x * 0.5) * (0.28 + influence * 0.08),
                drift: p.cos(time * 2.6 + offsets.y * 0.5) * (0.24 + influence * 0.06),
                shimmer: p.sin(time * 1.5) * (0.18 + influence * 0.04),
            });

            const evaluatePointerLuminance = (y, span) => {
                const normalizedY = p.constrain(y / 45, 0, 1);
                const pointerX = p.constrain(touchX, 0, 1);
                const pointerY = p.constrain(touchY, 0, 1);
                const dx = (span - pointerX) * 1.2;
                const dy = (normalizedY - pointerY) * 1.35;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return 1 - p.constrain(distance, 0, 1);
            };

            const applyFeatherColor = (y, s, alpha = 140) => {
                const longitudinal = p.constrain(1 - y / 45, 0, 1);
                const span = p.constrain(s, 0, 1);
                const tipShift = p.lerp(-18, 12, span);
                const shimmer = p.sin(t * 0.6 + y * 0.18 + span * p.TWO_PI) * 5;
                const ripple = p.cos(t * 0.45 + y * 0.12) * 3;
                const emberPulse = p.sin(t * 0.7 + y * 0.21 + span * p.PI * 1.4) * 4;
                const hueBase = p.constrain(214 + tipShift * 0.45 + shimmer + ripple + emberPulse * 0.65, 204, 234);

                const saturation = p.constrain(
                    100
                        + longitudinal * 56
                        + p.sin(t * 0.8 + span * p.PI) * 18
                        + p.cos(y * 0.16 + t * 0.65) * 12,
                    90,
                    190,
                );

                const baseBrightness = p.constrain(
                    220
                        + longitudinal * 28
                        + p.cos(t * 0.9 + span * p.TWO_PI) * 12
                        + p.sin(y * 0.22 + t * 0.5) * 8,
                    208,
                    252,
                );

                const pointerGlow = evaluatePointerLuminance(y, span);
                const pointerLift = pointerGlow * touchInfluence;
                const brightness = p.constrain(
                    baseBrightness + pointerLift * 32 - (1 - pointerGlow) * 10,
                    198,
                    252,
                );
                const dynamicAlpha = p.constrain(alpha + pointerLift * 42, 50, 225);

                p.colorMode(p.HSB, 360, 255, 255, 255);
                p.stroke(hueBase, saturation, brightness, dynamicAlpha);

                return { hue: hueBase, saturation, brightness, depth: longitudinal, span, pointerGlow };
            };

            const computeCrimsonAccent = (span, depth, index) => {
                const ridge = (p.sin(t * 1.2 + span * p.TWO_PI + index * 0.18) + 1) * 0.5;
                const pulse = (p.cos(t * 0.9 + span * p.PI * 3 + index * 0.12) + 1) * 0.5;
                const centerBias = 1 - Math.min(Math.abs(span - 0.42) * 2.1, 1);
                const depthBias = Math.pow(depth, 1.25);
                return p.constrain(centerBias * 0.32 + depthBias * 0.26 + ridge * 0.18 + pulse * 0.15, 0, 1);
            };

            const renderCrimsonAccent = (x1, y1, x2, y2, intensity, pointerGlow = 0) => {
                if (intensity <= 0.08) {
                    return;
                }

                p.push();
                p.colorMode(p.HSB, 360, 255, 255, 255);
                const hue = p.lerp(348, 356, (p.sin(t * 1.35 + x1 * 0.01 + y1 * 0.01) + 1) * 0.5);
                const saturation = p.constrain(150 + intensity * 42, 0, 240);
                const pointerLift = pointerGlow * touchInfluence;
                const brightness = p.constrain(210 + intensity * 24 + pointerLift * 18, 0, 240);
                const alpha = p.constrain(32 + intensity * 52 + pointerLift * 32, 0, 220);
                p.stroke(hue, saturation, brightness, alpha);
                p.strokeWeight(0.35 + intensity * 0.45);
                const accentBendX = (touchX - 0.5) * (intensity + pointerLift * 0.6) * 5.5;
                const accentBendY = (touchY - 0.5) * (intensity + pointerLift * 0.6) * -4.2;
                p.line(x1 + accentBendX, y1 + accentBendY, x2 - accentBendX * 0.4, y2 - accentBendY * 0.6);
                p.pop();
            };

            const drawLayeredStroke = (x1, y1, x2, y2, yIndex, sIndex, alpha = 120) => {
                const featherFactor = 0.5 + (1 - sIndex) * 0.32 + touchInfluence * 0.2;

                // Base chroma in HSB space
                const chroma = applyFeatherColor(yIndex, sIndex, alpha);
                const crimsonAccent = computeCrimsonAccent(sIndex, chroma.depth, yIndex);
                const pointerGlow = chroma.pointerGlow;
                const pointerLift = pointerGlow * touchInfluence;
                p.strokeWeight(0.55 + featherFactor * 0.24);
                p.line(x1, y1, x2, y2);

                // Soft luminous highlight using RGB stroke(r,g,b,alpha)
                p.push();
                p.colorMode(p.RGB, 255, 255, 255, 255);
                const glowDepth = chroma.depth;
                const glowAlpha = 26 + featherFactor * 22 + touchInfluence * 18 + glowDepth * 18 + crimsonAccent * 14 + pointerLift * 32;
                const glowBlue = p.constrain(200 + glowDepth * 36 + featherFactor * 12 + pointerLift * 16, 188, 252);
                const glowGreen = p.constrain(192 + glowDepth * 24 + p.sin(t * 1.2 + sIndex * p.TWO_PI) * 6 + pointerLift * 14, 178, 248);
                const glowRed = p.constrain(158 + glowDepth * 18 + p.cos(t * 0.9 + yIndex * 0.12) * 5 + crimsonAccent * 38 + pointerLift * 18, 142, 222);
                p.stroke(glowRed, glowGreen, glowBlue, glowAlpha);
                p.strokeWeight(0.95 + featherFactor * 0.42);
                p.line(x1, y1, x2, y2);

                // Inner core accent with stroke(grayscale, alpha)
                const coreAlpha = 18 + featherFactor * 14 + glowDepth * 12 + pointerLift * 24;
                p.stroke(255, coreAlpha);
                p.strokeWeight(0.55 + featherFactor * 0.28);
                p.line(x1, y1, x2, y2);

                // Ambient shadow to add depth
                const shadowOffsetX = (touchX - 0.5) * 6;
                const shadowOffsetY = (touchY - 0.5) * 6;
                const shadowAlpha = Math.max(0, 14 + featherFactor * 12 + (1 - glowDepth) * 10 - pointerLift * 18);
                p.stroke(36, 58, 122, shadowAlpha);
                p.strokeWeight(1.2 + featherFactor * 0.32);
                p.line(x1 + shadowOffsetX, y1 + shadowOffsetY, x2 + shadowOffsetX, y2 + shadowOffsetY);
                p.pop();

                renderCrimsonAccent(x1, y1, x2, y2, crimsonAccent, pointerGlow);

                p.colorMode(p.HSB, 360, 255, 255, 255);
            };

            const touchOffsets = computeTouchOffsets();
            const waves = calculateWaveBundle(t, touchOffsets, touchInfluence);

            p.push();
            const scaleFactor = Math.min(p.width, p.height) / baseSize;
            p.translate(p.width / 2, p.height / 2);
            p.scale(scaleFactor);
            p.translate(-baseSize / 2 + compositionOffset.x, -baseSize / 2 + compositionOffset.y);

            for (let i = 0; i < simplifiedLayout.primaryLayers; i++) {
                const y = i * layerSpacing.primary;
                for (let j = 0; j < simplifiedLayout.primarySegments; j++) {
                    const s = simplifiedLayout.primarySegments <= 1 ? 0 : j / (simplifiedLayout.primarySegments - 1);

                    const a = -p.PI / 2.5
                        + waves.crest * 0.85
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
                        * p.cos(waves.crest * 0.85 + p.sin(s * p.PI) * 0.2)
                        * p.sin(waves.sway + s * p.PI * 0.45)
                        * p.cos(waves.flutter * 0.3 + y * 0.1);

                    const x2 = x1 - l * p.cos(b)
                        * (p.cos(waves.crest * 0.65)
                            + p.sin(y * 0.22 + t * 0.8) * 0.28
                            + p.cos(waves.drift + s * p.TWO_PI * 0.3) * 0.15);
                    const y2 = y1 - l * p.sin(b)
                        * (1
                            + p.cos(waves.sway * 0.45 + s * p.TWO_PI) * 0.18
                            + p.sin(waves.flutter * 0.5 + y * 0.12) * 0.12
                            + p.cos(waves.shimmer + s * p.PI) * 0.08);

                    drawLayeredStroke(x1, y1, x2, y2, y, s);
                }
            }

            for (let i = 0; i < simplifiedLayout.mirrorLayers; i++) {
                const y = i * layerSpacing.mirror;
                for (let j = 0; j < simplifiedLayout.mirrorSegments; j++) {
                    const s = simplifiedLayout.mirrorSegments <= 1 ? 0 : j / (simplifiedLayout.mirrorSegments - 1);

                    const a = -p.PI / 2.5
                        - waves.crest * 0.85
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
                        * p.cos(-waves.crest * 0.85 - p.sin(s * p.PI) * 0.2)
                        * p.sin(-waves.sway + s * p.PI * 0.45)
                        * p.cos(-waves.flutter * 0.3 + y * 0.1);

                    const x2 = x1 - l * p.cos(b)
                        * (p.cos(-waves.crest * 0.65)
                            - p.sin(y * 0.22 + t * 0.8) * 0.28
                            - p.cos(-waves.drift + s * p.TWO_PI * 0.3) * 0.15);
                    const y2 = y1 - l * p.sin(b)
                        * (1
                            + p.cos(-waves.sway * 0.45 + s * p.TWO_PI) * 0.18
                            + p.sin(-waves.flutter * 0.5 + y * 0.12) * 0.12
                            + p.cos(-waves.shimmer + s * p.PI) * 0.08);

                    drawLayeredStroke(x1, y1, x2, y2, y, s);
                }
            }

            for (let i = 0; i < simplifiedLayout.accentLayers; i++) {
                const y = i * layerSpacing.accent;
                for (let j = 0; j < simplifiedLayout.accentSegments; j++) {
                    const s = simplifiedLayout.accentSegments <= 1 ? 0 : j / (simplifiedLayout.accentSegments - 1);

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
                            + p.sin(waves.flutter + y * 0.18) * 0.14
                            + p.cos(waves.drift + s * p.PI) * 0.09
                            + p.sin(waves.shimmer + y * 0.12) * 0.06);

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
