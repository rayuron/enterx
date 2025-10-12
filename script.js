const overlay = document.querySelector('.overlay');
if (!overlay) {
    throw new Error('Missing .overlay element');
}

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = { currentX: 0.5, currentY: 0.5, targetX: 0.5, targetY: 0.5 };
let animationFrame = null;

const applyOverlayStyles = () => {
    overlay.style.setProperty('--pointer-x', `${pointer.currentX * 100}%`);
    overlay.style.setProperty('--pointer-y', `${pointer.currentY * 100}%`);
    overlay.style.setProperty('--tilt-x', `${(pointer.currentX - 0.5) * 10}deg`);
    overlay.style.setProperty('--tilt-y', `${(0.5 - pointer.currentY) * 8}deg`);
};

const animate = () => {
    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.12;
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.12;
    applyOverlayStyles();

    if (!motionQuery.matches) {
        animationFrame = requestAnimationFrame(animate);
    }
};

const startAnimation = () => {
    if (animationFrame === null) {
        animationFrame = requestAnimationFrame(animate);
    }
};

const stopAnimation = () => {
    if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
};

const resetPointer = () => {
    pointer.targetX = 0.5;
    pointer.targetY = 0.5;
    if (motionQuery.matches) {
        pointer.currentX = 0.5;
        pointer.currentY = 0.5;
        applyOverlayStyles();
    }
    overlay.classList.remove('is-active');
};

const handlePointerMove = (event) => {
    if (motionQuery.matches) {
        return;
    }

    pointer.targetX = event.clientX / window.innerWidth;
    pointer.targetY = event.clientY / window.innerHeight;
    overlay.classList.add('is-active');
    startAnimation();
};

const handleMotionPreference = (event) => {
    if (event.matches) {
        stopAnimation();
        pointer.currentX = 0.5;
        pointer.currentY = 0.5;
        pointer.targetX = 0.5;
        pointer.targetY = 0.5;
        applyOverlayStyles();
        overlay.classList.remove('is-active');
    } else {
        startAnimation();
    }
};

window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerleave', resetPointer);
window.addEventListener('blur', resetPointer);

if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', handleMotionPreference);
} else if (motionQuery.addListener) {
    motionQuery.addListener(handleMotionPreference);
}

applyOverlayStyles();
if (!motionQuery.matches) {
    startAnimation();
}
