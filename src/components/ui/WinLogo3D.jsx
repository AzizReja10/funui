import { useEffect, useRef } from "react";
import * as THREE from "three";

// Shared texture cache across instances to prevent re-fetching and flickering
const textureCache = new Map();

function getOrCreateTexture(src, onLoad) {
  if (!src) return null;
  if (textureCache.has(src)) {
    const cached = textureCache.get(src);
    if (cached.image && cached.image.complete && cached.image.naturalWidth !== 0) {
      onLoad?.(cached);
    }
    return cached;
  }

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    src,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      onLoad?.(tex);
    },
    undefined,
    () => {
      // Error fallback if image fails to load
    }
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(src, texture);
  return texture;
}

// Fallback texture for items without logoSrc
function createVectorFallbackTexture(entry) {
  const cacheKey = `fallback_${entry.name}_${entry.color}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = entry.color || "#008080";

    // 4-pane classic Windows flag
    ctx.beginPath();
    ctx.moveTo(15, 40); ctx.lineTo(120, 22); ctx.lineTo(120, 122); ctx.lineTo(15, 132); ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(132, 20); ctx.lineTo(240, 5); ctx.lineTo(240, 120); ctx.lineTo(132, 122); ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.94;
    ctx.beginPath();
    ctx.moveTo(15, 142); ctx.lineTo(120, 144); ctx.lineTo(120, 244); ctx.lineTo(15, 252); ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(132, 144); ctx.lineTo(240, 146); ctx.lineTo(240, 256); ctx.lineTo(132, 254); ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

export function WinLogo3D({
  entry,
  activeIndex = 0,
  items = [],
  className = "",
  size = { width: 340, height: 120 },
}) {
  const mountRef = useRef(null);
  const initialEntryRef = useRef(entry);
  const initialIndexRef = useRef(activeIndex);

  const stateRef = useRef({
    mesh: null,
    material: null,
    currentEntry: entry,
    currentIndex: activeIndex,
    transition: null,
    targetScale: { x: 5.5, y: 2.0 },
    currentScale: { x: 5.5, y: 2.0 },
    mouse: { x: 0, y: 0 },
    tilt: { x: 0, y: 0 },
  });

  // Preload all items' textures on mount for instantaneous, zero-lag transitions
  useEffect(() => {
    if (!items || items.length === 0) return;
    items.forEach((item) => {
      if (item.logoSrc) {
        getOrCreateTexture(item.logoSrc);
      }
    });
  }, [items]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = size.width;
    const height = size.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.z = 4.0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const initEntry = initialEntryRef.current;
    const initialTexture = initEntry.logoSrc
      ? getOrCreateTexture(initEntry.logoSrc, (tex) => updateScaleForTexture(tex))
      : createVectorFallbackTexture(initEntry);

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: initialTexture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    stateRef.current.mesh = mesh;
    stateRef.current.material = material;
    stateRef.current.currentEntry = initEntry;
    stateRef.current.currentIndex = initialIndexRef.current;

    function updateScaleForTexture(tex) {
      if (!tex || !tex.image) return;
      const imgW = tex.image.width || tex.image.naturalWidth || 1;
      const imgH = tex.image.height || tex.image.naturalHeight || 1;
      const aspect = imgW / imgH;

      const MAX_W = 7.2;
      const MAX_H = 2.4;

      let w = MAX_W;
      let h = MAX_W / aspect;
      if (h > MAX_H) {
        h = MAX_H;
        w = MAX_H * aspect;
      }

      stateRef.current.targetScale = { x: w, y: h };
      if (!stateRef.current.transition) {
        stateRef.current.currentScale = { x: w, y: h };
        mesh.scale.set(w, h, 1);
      }
    }

    if (initialTexture && initialTexture.image) {
      updateScaleForTexture(initialTexture);
    }

    // Interactive mouse hover parallax
    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      stateRef.current.mouse.x = Math.max(-1, Math.min(1, nx));
      stateRef.current.mouse.y = Math.max(-1, Math.min(1, ny));
    }

    function handleMouseLeave() {
      stateRef.current.mouse.x = 0;
      stateRef.current.mouse.y = 0;
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);

      const state = stateRef.current;
      const { mouse, tilt } = state;

      // Smooth mouse tilt parallax
      tilt.x += (mouse.y * 0.12 - tilt.x) * 0.1;
      tilt.y += (mouse.x * 0.18 - tilt.y) * 0.1;

      let flipRotY = 0;
      let flipZ = 0;
      let flipScaleFactor = 1;

      // Handle simple 3D flip transition
      if (state.transition) {
        const trans = state.transition;
        const elapsed = performance.now() - trans.startTime;
        const progress = Math.min(1, elapsed / trans.duration);

        // Continuous smooth arc for Z depth and scale factor
        flipZ = -Math.sin(progress * Math.PI) * 0.35;
        flipScaleFactor = 1 - Math.sin(progress * Math.PI) * 0.08;

        if (progress < 0.5) {
          // Phase 1: Flip 0° -> 90° edge-on away from camera
          const t = progress * 2;
          const ease = t * t * (3 - 2 * t); // smoothstep
          flipRotY = -trans.dir * (Math.PI / 2) * ease;
        } else {
          // Midpoint swap: Switch texture edge-on where invisible to viewer
          if (!trans.swapped) {
            trans.swapped = true;
            const newTex = trans.targetEntry.logoSrc
              ? getOrCreateTexture(trans.targetEntry.logoSrc, (tex) => updateScaleForTexture(tex))
              : createVectorFallbackTexture(trans.targetEntry);

            state.material.map = newTex;
            state.material.needsUpdate = true;
            updateScaleForTexture(newTex);
          }

          // Phase 2: Flip 90° -> 0° face-on into camera with new logo
          const t = (progress - 0.5) * 2;
          const ease = t * t * (3 - 2 * t);
          flipRotY = trans.dir * (Math.PI / 2) * (1 - ease);
        }

        // Smoothly interpolate currentScale towards targetScale
        state.currentScale.x += (state.targetScale.x - state.currentScale.x) * 0.25;
        state.currentScale.y += (state.targetScale.y - state.currentScale.y) * 0.25;

        if (progress >= 1) {
          state.transition = null;
          state.currentEntry = trans.targetEntry;
          state.currentIndex = trans.targetIndex;
          state.currentScale = { ...state.targetScale };
        }
      } else {
        state.currentScale.x += (state.targetScale.x - state.currentScale.x) * 0.2;
        state.currentScale.y += (state.targetScale.y - state.currentScale.y) * 0.2;
      }

      mesh.rotation.x = -tilt.x;
      mesh.rotation.y = flipRotY + tilt.y;
      mesh.position.z = flipZ;
      mesh.scale.set(
        state.currentScale.x * flipScaleFactor,
        state.currentScale.y * flipScaleFactor,
        1
      );

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size.width, size.height]);

  // Trigger Simple 3D Flip when entry or activeIndex changes
  useEffect(() => {
    const state = stateRef.current;
    if (!state.mesh || state.currentEntry === entry) return;

    const dir = activeIndex >= state.currentIndex ? 1 : -1;

    // Rapid scrubbing handling: if already in phase 1, simply retarget the destination
    if (state.transition && !state.transition.swapped) {
      state.transition.targetEntry = entry;
      state.transition.targetIndex = activeIndex;
      state.transition.dir = dir;
      return;
    }

    state.transition = {
      startTime: performance.now(),
      duration: 280,
      dir,
      swapped: false,
      targetEntry: entry,
      targetIndex: activeIndex,
    };
  }, [entry, activeIndex]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center cursor-pointer select-none transition-transform duration-200 active:scale-95 drop-shadow-sm dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.7)] ${className}`}
      style={{ width: size.width, height: size.height }}
      title={`${entry.name} (${entry.year})`}
    />
  );
}

export default WinLogo3D;
