"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const AUTH_CAMERA_Z = 8;
const AUTH_PARTICLE_OPACITY = 0.78;

export function AuthParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const hues = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 8;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      hues[i] = i / particleCount;
      const color = new THREE.Color();
      color.setHSL(hues[i], 0.9, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const context = textureCanvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(32, 32, 32, 0, Math.PI * 2);
      context.fill();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: AUTH_PARTICLE_OPACITY,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.warn("WebGL not supported:", error);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.set(0, 0, 1.2);

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const updateSize = () => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      const height = Math.max(1, Math.round(bounds.height || window.innerHeight));

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    };

    const renderParticles = (time: number) => {
      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
      const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute;
      const color = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        let x = positionAttribute.getX(i) + velocities[i * 3];
        let y = positionAttribute.getY(i) + velocities[i * 3 + 1];
        let z = positionAttribute.getZ(i) + velocities[i * 3 + 2];

        if (x < -12) x = 12;
        if (x > 12) x = -12;
        if (y < -12) y = 12;
        if (y > 12) y = -12;
        if (z < -16) z = 0;
        if (z > 0) z = -16;

        positionAttribute.setXYZ(i, x, y, z);
        hues[i] = (hues[i] + 0.0006) % 1;
        color.setHSL(hues[i], 0.9, 0.6);
        colorAttribute.setXYZ(i, color.r, color.g, color.b);
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
      points.rotation.y = time * 0.02;
      points.rotation.x = time * 0.01;
      renderer.render(scene, camera);
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    gsap.ticker.add(renderParticles);
    const cameraTween = gsap.to(camera.position, {
      z: AUTH_CAMERA_Z,
      duration: 1.35,
      ease: "power2.out",
    });

    return () => {
      cameraTween.kill();
      gsap.ticker.remove(renderParticles);
      window.removeEventListener("resize", updateSize);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <div aria-hidden="true" className="cu-landing-readability absolute inset-0" />
      <div aria-hidden="true" className="cu-landing-fade absolute inset-x-0 bottom-0 h-40" />
    </div>
  );
}
