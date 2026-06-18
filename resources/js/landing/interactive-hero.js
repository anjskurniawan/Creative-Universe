import * as THREE from 'three';

const GSAP_TIMEOUT = 5000;
const CAMERA_Z = 8;
const PARTICLE_OPACITY = 0.78;

let currentHero = null;
let initializationVersion = 0;
let hasWarnedMissingGsap = false;
let hasWarnedWebGl = false;

function waitForGsap({ timeout = GSAP_TIMEOUT, interval = 50 } = {}) {
    if (window.gsap) {
        return Promise.resolve(window.gsap);
    }

    return new Promise((resolve) => {
        const startedAt = performance.now();

        const checkForGsap = () => {
            if (window.gsap) {
                resolve(window.gsap);
                return;
            }

            if (performance.now() - startedAt >= timeout) {
                resolve(null);
                return;
            }

            window.setTimeout(checkForGsap, interval);
        };

        checkForGsap();
    });
}

function splitCharacters(text) {
    if ('Segmenter' in Intl) {
        const segmenter = new Intl.Segmenter('id', {
            granularity: 'grapheme',
        });

        return Array.from(segmenter.segment(text), ({ segment }) => segment);
    }

    return Array.from(text);
}

function applyStaticHero() {
    const title = document.querySelector('[data-typewriter]');
    const textTarget = title?.querySelector('[data-typewriter-text]');
    const cursor = title?.querySelector('[data-typewriter-cursor]');
    const actions = document.querySelector('[data-typewriter-actions]');

    if (title && textTarget) {
        textTarget.textContent = title.dataset.typewriter ?? '';
    }

    if (cursor) {
        cursor.style.opacity = '0';
    }

    if (actions) {
        actions.style.removeProperty('opacity');
        actions.style.removeProperty('filter');
        actions.style.removeProperty('transform');
        actions.style.removeProperty('visibility');
    }
}

function rememberTween(state, tween) {
    state.tweens.add(tween);
    return tween;
}

function initializeTypewriter(gsap, state) {
    const title = document.querySelector('[data-typewriter]');
    const textTarget = title?.querySelector('[data-typewriter-text]');
    const cursor = title?.querySelector('[data-typewriter-cursor]');
    const actions = document.querySelector('[data-typewriter-actions]');
    const text = title?.dataset.typewriter ?? '';

    if (!title || !textTarget || !cursor || title.dataset.typewriterInitialized === 'true') {
        return;
    }

    title.dataset.typewriterInitialized = 'true';
    const characters = splitCharacters(text);
    const progress = { count: 0 };

    textTarget.textContent = '';
    gsap.set(cursor, { opacity: 1 });

    if (actions) {
        gsap.set(actions, {
            opacity: 0,
            filter: 'blur(8px)',
            y: 14,
        });
    }

    const blink = rememberTween(state, gsap.to(cursor, {
        opacity: 0.2,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
    }));

    rememberTween(state, gsap.to(progress, {
        count: characters.length,
        duration: Math.max(2.8, characters.length * 0.075),
        ease: 'none',
        onUpdate: () => {
            textTarget.textContent = characters.slice(0, Math.round(progress.count)).join('');
        },
        onComplete: () => {
            textTarget.textContent = text;

            if (actions) {
                rememberTween(state, gsap.to(actions, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                }));
            }

            rememberTween(state, gsap.delayedCall(2, () => {
                blink.kill();

                rememberTween(state, gsap.to(cursor, {
                    opacity: 0,
                    duration: 0.25,
                    ease: 'power1.out',
                }));
            }));
        },
    }));

    state.cleanups.push(() => {
        delete title.dataset.typewriterInitialized;
        applyStaticHero();
    });
}

function getCssColor(propertyName, fallback) {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(propertyName)
        .trim();

    return value || fallback;
}

function createParticlePosition() {
    const zone = Math.random();
    let normalizedX;
    let normalizedY;

    if (zone < 0.48) {
        normalizedX = 0.01 + Math.random() * 0.34;
        normalizedY = 0.02 + Math.pow(Math.random(), 1.45) * 0.93;
    } else if (zone < 0.76) {
        normalizedX = 0.08 + Math.random() * 0.84;
        normalizedY = 0.01 + Math.pow(Math.random(), 1.8) * 0.29;
    } else {
        normalizedX = 0.68 + Math.random() * 0.31;
        normalizedY = 0.04 + Math.pow(Math.random(), 1.25) * 0.91;
    }

    const isInsideReadingArea = Math.abs(normalizedX - 0.5) < 0.27
        && Math.abs(normalizedY - 0.49) < 0.24;

    if (isInsideReadingArea) {
        normalizedX = normalizedX < 0.5
            ? 0.08 + Math.random() * 0.2
            : 0.72 + Math.random() * 0.2;
    }

    return { normalizedX, normalizedY };
}

function createParticleData(count) {
    return Array.from({ length: count }, () => {
        const position = createParticlePosition();

        return {
            ...position,
            depth: -2.4 + Math.random() * 3.8,
            phase: Math.random() * Math.PI * 2,
            speed: 0.16 + Math.random() * 0.24,
            amplitudeX: 0.025 + Math.random() * 0.055,
            amplitudeY: 0.018 + Math.random() * 0.045,
            spin: (Math.random() - 0.5) * 0.9,
            scale: 0.62 + Math.random() * 1.15,
            driftX: (Math.random() - 0.5) * 0.09,
            driftY: (Math.random() - 0.5) * 0.07,
        };
    });
}

function initializeParticleBackground(gsap, state) {
    const canvas = document.querySelector('[data-particle-canvas]');

    if (!canvas || canvas.dataset.particleInitialized === 'true') {
        return;
    }

    const hero = canvas.closest('[data-interactive-hero]');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const particleCount = isMobile ? 140 : 360;
    const particleData = createParticleData(particleCount);
    const geometry = new THREE.PlaneGeometry(0.085, 0.019);
    // InstancedMesh enables instanceColor without a per-vertex color attribute.
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const rendererOptions = {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
    };
    let renderer;

    const handleUnavailableWebGl = () => {
        geometry.dispose();
        material.dispose();
        canvas.hidden = true;

        if (!hasWarnedWebGl) {
            console.warn('Interactive background is unavailable; the static landing remains active.');
            hasWarnedWebGl = true;
        }
    };

    try {
        const context = canvas.getContext('webgl2', rendererOptions);

        if (!context) {
            handleUnavailableWebGl();
            return;
        }

        renderer = new THREE.WebGLRenderer({
            canvas,
            context,
            ...rendererOptions,
        });
    } catch {
        handleUnavailableWebGl();
        return;
    }

    canvas.dataset.particleInitialized = 'true';
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    camera.position.set(0, 0, CAMERA_Z + 0.55);
    const particles = new THREE.InstancedMesh(geometry, material, particleCount);
    particles.frustumCulled = false;
    scene.add(particles);

    const palette = [
        getCssColor('--color-cu-info', '#3279F9'),
        getCssColor('--color-cu-gradient-middle', '#4285F4'),
        getCssColor('--color-cu-gradient-start', '#7C4DFF'),
        getCssColor('--color-cu-danger', '#EA4335'),
        getCssColor('--color-cu-warning', '#FBBC04'),
        getCssColor('--color-cu-success', '#34A853'),
        getCssColor('--color-cu-gradient-end', '#22D3EE'),
    ];

    particleData.forEach((_, index) => {
        const colorIndex = Math.random() < 0.68
            ? Math.floor(Math.random() * 3)
            : Math.floor(Math.random() * palette.length);

        particles.setColorAt(index, new THREE.Color(palette[colorIndex]));
    });
    particles.instanceColor.needsUpdate = true;

    const viewport = { width: 1, height: 1, aspect: 1 };
    const pointer = { x: 0, y: 0, active: 0 };
    const reveal = { value: 0 };
    const dummy = new THREE.Object3D();
    const fieldOfView = THREE.MathUtils.degToRad(camera.fov);

    const updateSize = () => {
        const bounds = hero?.getBoundingClientRect();
        viewport.width = Math.max(1, Math.round(bounds?.width ?? window.innerWidth));
        viewport.height = Math.max(1, Math.round(bounds?.height ?? window.innerHeight));
        viewport.aspect = viewport.width / viewport.height;

        camera.aspect = viewport.aspect;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(viewport.width, viewport.height, false);
    };

    const pointerX = gsap.quickTo(pointer, 'x', { duration: 0.75, ease: 'power3.out' });
    const pointerY = gsap.quickTo(pointer, 'y', { duration: 0.75, ease: 'power3.out' });
    const pointerActive = gsap.quickTo(pointer, 'active', { duration: 0.9, ease: 'power2.out' });

    const handlePointerMove = (event) => {
        if (!hasFinePointer) {
            return;
        }

        pointerX((event.clientX / window.innerWidth) * 2 - 1);
        pointerY((event.clientY / window.innerHeight) * 2 - 1);
        pointerActive(1);
    };

    const handlePointerLeave = () => {
        pointerX(0);
        pointerY(0);
        pointerActive(0);
    };

    const renderParticles = (time) => {
        const pointerNormalizedX = (pointer.x + 1) * 0.5;
        const pointerNormalizedY = (pointer.y + 1) * 0.5;

        camera.position.x = pointer.x * pointer.active * 0.12;
        camera.position.y = -pointer.y * pointer.active * 0.08;

        particleData.forEach((particle, index) => {
            const distanceFromCamera = CAMERA_Z - particle.depth;
            const visibleHeight = 2 * Math.tan(fieldOfView * 0.5) * distanceFromCamera;
            const visibleWidth = visibleHeight * viewport.aspect;
            const elapsed = time * particle.speed + particle.phase;
            let x = (particle.normalizedX - 0.5) * visibleWidth;
            let y = (0.5 - particle.normalizedY) * visibleHeight;

            x += Math.sin(elapsed * 0.9) * particle.amplitudeX + Math.sin(elapsed * 0.31) * particle.driftX;
            y += Math.cos(elapsed * 0.72) * particle.amplitudeY + Math.cos(elapsed * 0.27) * particle.driftY;

            if (pointer.active > 0.001) {
                const deltaX = particle.normalizedX - pointerNormalizedX;
                const deltaY = particle.normalizedY - pointerNormalizedY;
                const distance = Math.hypot(deltaX, deltaY);
                const influenceRadius = 0.18;

                if (distance > 0.001 && distance < influenceRadius) {
                    const force = Math.pow(1 - distance / influenceRadius, 2) * pointer.active;
                    x += (deltaX / distance) * force * visibleWidth * 0.035;
                    y -= (deltaY / distance) * force * visibleHeight * 0.035;
                }
            }

            const depthScale = THREE.MathUtils.mapLinear(particle.depth, -2.4, 1.4, 0.72, 1.2);
            const scale = particle.scale * depthScale * reveal.value;

            dummy.position.set(x, y, particle.depth);
            dummy.rotation.set(
                Math.sin(elapsed * 0.48) * 0.22,
                Math.cos(elapsed * 0.43) * 0.28,
                particle.phase + time * particle.spin,
            );
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            particles.setMatrixAt(index, dummy.matrix);
        });

        particles.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    gsap.ticker.add(renderParticles);

    rememberTween(state, gsap.to(material, {
        opacity: PARTICLE_OPACITY,
        duration: 1.8,
        ease: 'power2.out',
    }));
    rememberTween(state, gsap.to(reveal, {
        value: 1,
        duration: 2.2,
        ease: 'power3.out',
    }));
    rememberTween(state, gsap.to(camera.position, {
        z: CAMERA_Z,
        duration: 2.4,
        ease: 'power2.out',
    }));

    state.cleanups.push(() => {
        gsap.ticker.remove(renderParticles);
        window.removeEventListener('resize', updateSize);
        window.removeEventListener('pointermove', handlePointerMove);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('blur', handlePointerLeave);
        pointerX.tween.kill();
        pointerY.tween.kill();
        pointerActive.tween.kill();
        scene.remove(particles);
        geometry.dispose();
        material.dispose();
        renderer.renderLists.dispose();
        renderer.dispose();
        scene.clear();
        canvas.hidden = false;
        delete canvas.dataset.particleInitialized;
    });
}

async function initializeInteractiveHero() {
    const canvas = document.querySelector('[data-particle-canvas]');

    if (!canvas || currentHero?.canvas === canvas) {
        return;
    }

    destroyInteractiveHero();

    const state = {
        canvas,
        version: ++initializationVersion,
        cleanups: [],
        tweens: new Set(),
    };
    currentHero = state;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
        canvas.hidden = true;
        applyStaticHero();
        return;
    }

    const gsap = await waitForGsap();

    if (currentHero !== state || state.version !== initializationVersion) {
        return;
    }

    if (!gsap) {
        canvas.hidden = true;
        applyStaticHero();

        if (!hasWarnedMissingGsap) {
            console.warn('GSAP did not load; the static landing fallback is active.');
            hasWarnedMissingGsap = true;
        }

        return;
    }

    initializeTypewriter(gsap, state);
    initializeParticleBackground(gsap, state);
}

function destroyInteractiveHero() {
    initializationVersion += 1;

    if (!currentHero) {
        return;
    }

    currentHero.tweens.forEach((tween) => tween.kill());
    [...currentHero.cleanups].reverse().forEach((cleanup) => cleanup());
    currentHero = null;
}

if (document.readyState === 'complete') {
    initializeInteractiveHero();
} else {
    window.addEventListener('load', initializeInteractiveHero, { once: true });
}

document.addEventListener('livewire:navigated', initializeInteractiveHero);
document.addEventListener('livewire:navigating', destroyInteractiveHero);
window.addEventListener('pagehide', destroyInteractiveHero);

export {
    destroyInteractiveHero,
    initializeInteractiveHero,
};
