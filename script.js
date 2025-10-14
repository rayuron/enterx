// Setup body styling via JavaScript
document.body.style.cssText = `
    background-color: #ffffff;
    background-image: none;
    background-size: cover;
    display: grid;
    place-items: center;
    position: relative;
    font-family: "Futura", "Futura PT", "Avenir Next", "Helvetica Neue", "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    color-scheme: light;
`;

const backgroundTintLayer = document.createElement('div');
backgroundTintLayer.setAttribute('aria-hidden', 'true');
backgroundTintLayer.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: none;
`;
document.body.prepend(backgroundTintLayer);

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
        overflow: hidden;
        background:
            radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 72%),
            linear-gradient(155deg, rgba(255, 255, 255, 0.04), rgba(211, 225, 255, 0.03) 48%, rgba(255, 255, 255, 0.015));
        backdrop-filter: blur(46px) saturate(195%) brightness(1.12);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow:
            0 18px 52px rgba(30, 60, 124, 0.1),
            0 6px 22px rgba(30, 60, 124, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(168, 196, 232, 0.2),
            inset 0 0 160px rgba(255, 255, 255, 0.05);
        z-index: 1;
        transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.4s cubic-bezier(0.33, 1, 0.68, 1), background 0.4s ease;
    `;

    const overlayCaustic = document.createElement('span');
    overlayCaustic.setAttribute('aria-hidden', 'true');
    overlayCaustic.style.cssText = `
        position: absolute;
        inset: -20%;
        background: radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0) 55%),
            radial-gradient(circle at 25% 80%, rgba(120, 180, 255, 0.12), rgba(120, 180, 255, 0) 68%);
        opacity: 0.46;
        transform: translate3d(0, 0, 0);
        transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
        pointer-events: none;
    `;
    overlay.appendChild(overlayCaustic);

    overlayCaustic.dataset.active = '0';

    // Add hover/touch effect for liquid glass
    overlay.addEventListener('pointerenter', () => {
        overlay.style.transform = 'scale3d(1.02, 1.02, 1)';
        overlay.style.boxShadow = `
            0 34px 78px rgba(32, 72, 144, 0.18),
            0 12px 30px rgba(32, 72, 144, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.66),
            inset 0 -1px 0 rgba(168, 196, 232, 0.24),
            inset 0 0 170px rgba(255, 255, 255, 0.07)
        `;
        overlayCaustic.style.opacity = '0.6';
        overlayCaustic.dataset.active = '1';
    });

    overlay.addEventListener('pointerleave', () => {
        overlay.style.transform = 'scale3d(1, 1, 1)';
        overlay.style.boxShadow = `
            0 20px 54px rgba(30, 60, 124, 0.12),
            0 5px 18px rgba(30, 60, 124, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.54),
            inset 0 -1px 0 rgba(168, 196, 232, 0.2),
            inset 0 0 150px rgba(255, 255, 255, 0.05)
        `;
        overlayCaustic.style.opacity = '0.46';
        overlayCaustic.dataset.active = '0';
    });

    overlay.__causticElement = overlayCaustic;
}

const logotype = document.querySelector('.logotype');
if (logotype) {
    logotype.style.cssText = `
        font-family: "Futura", "Futura PT", "Avenir Next", "Helvetica Neue", "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: clamp(2.2rem, 4.8vw, 3.1rem);
        font-weight: 700;
        letter-spacing: 0.28em;
        color: rgba(14, 18, 28, 0.98);
        text-align: center;
        padding-left: 0.28em;
        text-shadow: 0 3px 18px rgba(255, 255, 255, 0.32);
    `;
}

let compositionOffset = { x: 0, y: 0 };

const updateLayout = () => {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    const aspectRatio = width > 0 ? height / width : 1;
    const isCompact = width <= 768;
    const isExtraCompact = width <= 480;

    if (overlay) {
        overlay.style.padding = isExtraCompact ? '0.85rem 1.5rem' : isCompact ? '1.05rem 2rem' : '1.35rem 2.6rem';
        overlay.style.minWidth = isCompact ? '0' : '240px';
        overlay.style.maxWidth = isExtraCompact ? '320px' : isCompact ? '420px' : '560px';
        overlay.style.width = isExtraCompact ? 'min(70vw, 300px)' : isCompact ? 'min(60vw, 360px)' : 'min(46vw, 520px)';
    }

    if (logotype) {
        logotype.style.fontSize = isExtraCompact
            ? 'clamp(1.6rem, 8vw, 2.3rem)'
            : isCompact
                ? 'clamp(1.85rem, 6vw, 2.6rem)'
                : 'clamp(2.2rem, 4.2vw, 3.1rem)';
        logotype.style.letterSpacing = isExtraCompact ? '0.18em' : isCompact ? '0.22em' : '0.28em';
        logotype.style.paddingLeft = isExtraCompact ? '0.18em' : isCompact ? '0.22em' : '0.28em';
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
                touchInfluence = p.lerp(touchInfluence, 1, 0.1);
            } else {
                touchInfluence = p.lerp(touchInfluence, 0, 0.05);
            }

            // Solid white background per request
            p.background(0, 0, 255, 255);
            p.strokeWeight(0.7);

            const computeTouchOffsets = () => ({
                x: (touchX - 0.5) * touchInfluence * 0.3,
                y: (touchY - 0.5) * touchInfluence * 0.3,
            });

            const calculateWaveBundle = (time, offsets, influence) => ({
                crest: p.sin(time * 2.2 + offsets.x) * (0.75 + influence * 0.2),
                sway: p.cos(time * 3.1 + offsets.y) * (0.55 + influence * 0.15),
                flutter: p.sin(time * 1.8 + offsets.x * 0.5) * (0.45 + influence * 0.1),
                drift: p.cos(time * 2.6 + offsets.y * 0.5) * (0.35 + influence * 0.08),
                shimmer: p.sin(time * 1.5) * (0.25 + influence * 0.05),
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

            const applyFeatherColor = (y, s, alpha = 110) => {
                const longitudinal = p.constrain(1 - y / 45, 0, 1);
                const span = p.constrain(s, 0, 1);
                const tipShift = p.lerp(-18, 12, span);
                const shimmer = p.sin(t * 0.6 + y * 0.18 + span * p.TWO_PI) * 5;
                const ripple = p.cos(t * 0.45 + y * 0.12) * 3;
                const emberPulse = p.sin(t * 0.7 + y * 0.21 + span * p.PI * 1.4) * 4;
                const hueBase = p.constrain(214 + tipShift * 0.45 + shimmer + ripple + emberPulse * 0.65, 204, 234);

                const saturation = p.constrain(
                    92
                        + longitudinal * 60
                        + p.sin(t * 0.8 + span * p.PI) * 22
                        + p.cos(y * 0.16 + t * 0.65) * 14,
                    70,
                    185,
                );

                const baseBrightness = p.constrain(
                    224
                        + longitudinal * 36
                        + p.cos(t * 0.9 + span * p.TWO_PI) * 14
                        + p.sin(y * 0.22 + t * 0.5) * 10,
                    210,
                    255,
                );

                const pointerGlow = evaluatePointerLuminance(y, span);
                const pointerLift = pointerGlow * touchInfluence;
                const brightness = p.constrain(
                    baseBrightness + pointerLift * 36 - (1 - pointerGlow) * 10,
                    206,
                    255,
                );
                const dynamicAlpha = p.constrain(alpha + pointerLift * 42, 52, 225);

                p.colorMode(p.HSB, 360, 255, 255, 255);
                p.stroke(hueBase, saturation, brightness, dynamicAlpha);

                return { hue: hueBase, saturation, brightness, depth: longitudinal, span, pointerGlow };
            };

            const computeCrimsonAccent = (span, depth, index) => {
                const ridge = (p.sin(t * 1.2 + span * p.TWO_PI + index * 0.18) + 1) * 0.5;
                const pulse = (p.cos(t * 0.9 + span * p.PI * 3 + index * 0.12) + 1) * 0.5;
                const centerBias = 1 - Math.min(Math.abs(span - 0.42) * 2.1, 1);
                const depthBias = Math.pow(depth, 1.25);
                return p.constrain((centerBias * 0.45 + depthBias * 0.35 + ridge * 0.25 + pulse * 0.2) * 0.75, 0, 1);
            };

            const renderCrimsonAccent = (x1, y1, x2, y2, intensity, pointerGlow = 0) => {
                if (intensity <= 0.08) {
                    return;
                }

                p.push();
                p.colorMode(p.HSB, 360, 255, 255, 255);
                const hue = p.lerp(348, 356, (p.sin(t * 1.35 + x1 * 0.01 + y1 * 0.01) + 1) * 0.5);
                const saturation = p.constrain(148 + intensity * 42, 0, 255);
                const pointerLift = pointerGlow * touchInfluence;
                const brightness = p.constrain(218 + intensity * 24 + pointerLift * 22, 0, 255);
                const alpha = p.constrain(34 + intensity * 52 + pointerLift * 34, 0, 255);
                p.stroke(hue, saturation, brightness, alpha);
                p.strokeWeight(0.42 + intensity * 0.55);
                const accentBendX = (touchX - 0.5) * (intensity + pointerLift * 0.6) * 5.5;
                const accentBendY = (touchY - 0.5) * (intensity + pointerLift * 0.6) * -4.2;
                p.line(x1 + accentBendX, y1 + accentBendY, x2 - accentBendX * 0.4, y2 - accentBendY * 0.6);
                p.pop();
            };

            const drawLayeredStroke = (x1, y1, x2, y2, yIndex, sIndex, alpha = 90) => {
                const featherFactor = 0.65 + (1 - sIndex) * 0.45 + touchInfluence * 0.25;

                // Base chroma in HSB space
                const chroma = applyFeatherColor(yIndex, sIndex, alpha);
                const crimsonAccent = computeCrimsonAccent(sIndex, chroma.depth, yIndex);
                const pointerGlow = chroma.pointerGlow;
                const pointerLift = pointerGlow * touchInfluence;
                p.strokeWeight(0.75 + featherFactor * 0.32);
                p.line(x1, y1, x2, y2);

                // Soft luminous highlight using RGB stroke(r,g,b,alpha)
                p.push();
                p.colorMode(p.RGB, 255, 255, 255, 255);
                const glowDepth = chroma.depth;
                const glowAlpha = 30 + featherFactor * 24 + touchInfluence * 26 + glowDepth * 18 + crimsonAccent * 16 + pointerLift * 42;
                const glowBlue = p.constrain(208 + glowDepth * 36 + featherFactor * 14 + pointerLift * 18, 190, 255);
                const glowGreen = p.constrain(202 + glowDepth * 26 + p.sin(t * 1.2 + sIndex * p.TWO_PI) * 6 + pointerLift * 14, 184, 255);
                const glowRed = p.constrain(168 + glowDepth * 18 + p.cos(t * 0.9 + yIndex * 0.12) * 5 + crimsonAccent * 40 + pointerLift * 20, 150, 232);
                p.stroke(glowRed, glowGreen, glowBlue, glowAlpha);
                p.strokeWeight(1.2 + featherFactor * 0.55);
                p.line(x1, y1, x2, y2);

                // Inner core accent with stroke(grayscale, alpha)
                const coreAlpha = 22 + featherFactor * 16 + glowDepth * 14 + pointerLift * 28;
                p.stroke(255, coreAlpha);
                p.strokeWeight(0.6 + featherFactor * 0.34);
                p.line(x1, y1, x2, y2);

                // Ambient shadow to add depth
                const shadowOffsetX = (touchX - 0.5) * 6;
                const shadowOffsetY = (touchY - 0.5) * 6;
                const shadowAlpha = Math.max(0, 18 + featherFactor * 12 + (1 - glowDepth) * 14 - pointerLift * 22);
                p.stroke(36, 58, 122, shadowAlpha);
                p.strokeWeight(1.4 + featherFactor * 0.38);
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

            for (let i = 0; i < 50; i++) {
                const y = i * 0.7;
                for (let j = 0; j < 18; j++) {
                    const s = j / 17;

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

            for (let i = 0; i < 50; i++) {
                const y = i * 0.7;
                for (let j = 0; j < 18; j++) {
                    const s = j / 17;

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

        const caustic = overlay.__causticElement;
        const pointerOffsetX = overlayPointer.x - 0.5;
        const pointerOffsetY = overlayPointer.y - 0.5;

        if (caustic) {
            const causticActive = caustic.dataset.active === '1';
            const causticTranslateX = pointerOffsetX * (causticActive ? 12 : 8);
            const causticTranslateY = pointerOffsetY * (causticActive ? 10 : 6);
            const causticScale = causticActive ? 1.04 : 1;
            caustic.style.transform = `translate3d(${causticTranslateX}%, ${causticTranslateY}%, 0) scale(${causticScale})`;
        }
    }

    requestAnimationFrame(animateOverlay);
};

animateOverlay();
