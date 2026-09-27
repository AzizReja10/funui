'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PRESET_CONFIGS = {
  chrome: {
    name: 'Liquid Chrome',
    color: 0xf3f4f6,
    roughness: 0.12,
    metalness: 0.95,
    halo1Color: 0x38bdf8,
    halo2Color: 0xe2e8f0,
    firefly1Color: 0x38bdf8,
    firefly2Color: 0xffffff,
    lights: [
      { type: 'dir', color: 0xffffff, intensity: 2.2, pos: [4, 5, 4] },
      { type: 'dir', color: 0x38bdf8, intensity: 1.4, pos: [-4, -2, -3] },
      { type: 'point', color: 0xffffff, intensity: 1.0, pos: [0, 4, 2] },
    ],
    ambient: { color: 0xffffff, intensity: 0.7 },
  },
  iridescent: {
    name: 'Prismatic Opal',
    color: 0xa855f7,
    roughness: 0.22,
    metalness: 0.88,
    halo1Color: 0xff2e93,
    halo2Color: 0x00f0ff,
    firefly1Color: 0xff2e93,
    firefly2Color: 0x00f0ff,
    lights: [
      { type: 'dir', color: 0x00f0ff, intensity: 2.0, pos: [4, 4, 3] },
      { type: 'dir', color: 0xff2e93, intensity: 1.8, pos: [-4, -3, 2] },
      { type: 'point', color: 0xd4f73c, intensity: 1.2, pos: [0, 3, -3] },
    ],
    ambient: { color: 0x4c1d95, intensity: 0.9 },
  },
  neon: {
    name: 'Cyber Lime',
    color: 0x141e06,
    roughness: 0.28,
    metalness: 0.85,
    halo1Color: 0xd4f73c,
    halo2Color: 0x00f0ff,
    firefly1Color: 0xd4f73c,
    firefly2Color: 0x00f0ff,
    lights: [
      { type: 'dir', color: 0xd4f73c, intensity: 2.8, pos: [3, 4, 3] },
      { type: 'dir', color: 0x00f0ff, intensity: 1.5, pos: [-4, -2, -2] },
      { type: 'point', color: 0xd4f73c, intensity: 1.0, pos: [0, -3, 2] },
    ],
    ambient: { color: 0x0a1003, intensity: 0.8 },
  },
  glass: {
    name: 'Frosted Crystal',
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.15,
    halo1Color: 0x93c5fd,
    halo2Color: 0xffffff,
    firefly1Color: 0x93c5fd,
    firefly2Color: 0xffffff,
    lights: [
      { type: 'dir', color: 0xffffff, intensity: 2.0, pos: [4, 4, 4] },
      { type: 'dir', color: 0x93c5fd, intensity: 1.2, pos: [-4, -2, -3] },
      { type: 'point', color: 0xffffff, intensity: 0.8, pos: [0, 3, 2] },
    ],
    ambient: { color: 0xffffff, intensity: 0.95 },
  },
  obsidian: {
    name: 'Obsidian Gold',
    color: 0x18181b,
    roughness: 0.35,
    metalness: 0.9,
    halo1Color: 0xf59e0b,
    halo2Color: 0xd97706,
    firefly1Color: 0xf59e0b,
    firefly2Color: 0xfef3c7,
    lights: [
      { type: 'dir', color: 0xf59e0b, intensity: 2.5, pos: [4, 4, 3] },
      { type: 'dir', color: 0xd97706, intensity: 1.6, pos: [-4, -3, -2] },
      { type: 'point', color: 0xfef3c7, intensity: 1.0, pos: [0, 3, 2] },
    ],
    ambient: { color: 0x27272a, intensity: 0.7 },
  },
};

export function LiquidOrb({
  className = '',
  shape = 'sphere', // 'sphere' | 'knot' | 'crystal' | 'ring'
  preset = 'chrome', // 'chrome' | 'iridescent' | 'neon' | 'glass' | 'obsidian'
  speed = 1.0,
  distortion = 0.32,
  interactive = true,
  wireframe = false,
  showHalos = true, // Kinetic outer gimbal rings
  showParticles = true, // Swarm of orbiting stardust embers
  showFireflies = true, // Orbiting dancing light probes
  magneticCursor = true, // Surface ferrofluid pull towards cursor
  autoRotate = true,
  autoRotateSpeed = 0.6,
  onClick = null,
}) {
  const mountRef = useRef(null);
  const triggerImpulseRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ---- WebGL Renderer ---------------------------------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const cfg = PRESET_CONFIGS[preset] || PRESET_CONFIGS.chrome;

    // ---- Main Morphing Geometry -------------------------------------------
    let geo;
    if (shape === 'knot') {
      geo = new THREE.TorusKnotGeometry(0.95, 0.32, 100, 24);
    } else if (shape === 'crystal') {
      geo = new THREE.IcosahedronGeometry(1.35, 4);
    } else if (shape === 'ring') {
      geo = new THREE.TorusGeometry(1.15, 0.45, 36, 64);
    } else {
      // Default: Organic Sphere Blob
      geo = new THREE.SphereGeometry(1.35, 54, 54);
    }

    const origPositions = Float32Array.from(geo.attributes.position.array);

    const mat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
      wireframe: wireframe,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ---- Creative Element 1: Orbital Quantum Gimbal Halos -----------------
    const haloGroup = new THREE.Group();
    let halo1 = null;
    let halo2 = null;
    let bead1 = null;
    let bead2 = null;

    if (showHalos) {
      // Halo 1: Tilted Inner Gyro Ring
      const ringGeo1 = new THREE.TorusGeometry(1.9, 0.009, 16, 120);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: cfg.halo1Color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      halo1 = new THREE.Mesh(ringGeo1, ringMat1);
      halo1.rotation.x = Math.PI / 3.2;
      haloGroup.add(halo1);

      // Traveling photon bead on Halo 1
      const beadGeo1 = new THREE.SphereGeometry(0.042, 12, 12);
      const beadMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
      bead1 = new THREE.Mesh(beadGeo1, beadMat1);
      halo1.add(bead1);

      // Halo 2: Counter-Tilted Outer Ring
      const ringGeo2 = new THREE.TorusGeometry(2.28, 0.006, 16, 120);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: cfg.halo2Color,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
      });
      halo2 = new THREE.Mesh(ringGeo2, ringMat2);
      halo2.rotation.y = Math.PI / 3.8;
      haloGroup.add(halo2);

      // Traveling photon bead on Halo 2
      const beadGeo2 = new THREE.SphereGeometry(0.035, 12, 12);
      const beadMat2 = new THREE.MeshBasicMaterial({ color: cfg.halo2Color });
      bead2 = new THREE.Mesh(beadGeo2, beadMat2);
      halo2.add(bead2);

      scene.add(haloGroup);
    }

    // ---- Creative Element 2: Dancing Firefly Light Probes -----------------
    const fireflyGroup = new THREE.Group();
    let firefly1 = null;
    let firefly2 = null;
    let fireflyLight1 = null;
    let fireflyLight2 = null;

    if (showFireflies) {
      const probeGeo = new THREE.SphereGeometry(0.038, 12, 12);

      // Firefly 1
      const pMat1 = new THREE.MeshBasicMaterial({ color: cfg.firefly1Color });
      firefly1 = new THREE.Mesh(probeGeo, pMat1);
      fireflyLight1 = new THREE.PointLight(cfg.firefly1Color, 1.8, 8);
      firefly1.add(fireflyLight1);
      fireflyGroup.add(firefly1);

      // Firefly 2
      const pMat2 = new THREE.MeshBasicMaterial({ color: cfg.firefly2Color });
      firefly2 = new THREE.Mesh(probeGeo, pMat2);
      fireflyLight2 = new THREE.PointLight(cfg.firefly2Color, 1.6, 8);
      firefly2.add(fireflyLight2);
      fireflyGroup.add(firefly2);

      scene.add(fireflyGroup);
    }

    // ---- Creative Element 3: Swarm of Orbiting Stardust Embers -----------
    let particleSystem = null;
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleData = [];

    if (showParticles) {
      for (let i = 0; i < particleCount; i++) {
        const radius = 1.65 + Math.random() * 1.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);

        particleData.push({
          radius,
          theta,
          phi,
          speed: 0.18 + Math.random() * 0.35,
          wobbleFreq: 0.8 + Math.random() * 1.5,
          radialDrift: 0,
        });
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: cfg.halo1Color,
        size: 0.045,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      particleSystem = new THREE.Points(pGeo, pMat);
      scene.add(particleSystem);
    }

    // ---- Creative Element 4: Interactive Shockwave Pulse Ring -------------
    const shockwaveGeo = new THREE.RingGeometry(1.2, 1.28, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: cfg.halo1Color,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    scene.add(shockwave);
    let shockwaveTime = 1.0; // 0 to 1 progress

    // ---- Studio Lighting Setup --------------------------------------------
    const ambientLight = new THREE.AmbientLight(cfg.ambient.color, cfg.ambient.intensity);
    scene.add(ambientLight);

    const lightObjects = [];
    cfg.lights.forEach((l) => {
      let light;
      if (l.type === 'point') {
        light = new THREE.PointLight(l.color, l.intensity, 15);
      } else {
        light = new THREE.DirectionalLight(l.color, l.intensity);
      }
      light.position.set(l.pos[0], l.pos[1], l.pos[2]);
      scene.add(light);
      lightObjects.push(light);
    });

    // ---- Interactive Physics & Mouse Tracking -----------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let dragRotation = { x: 0, y: 0 };

    // Spring physics for click squish
    let squish = 1.0;
    let squishVelocity = 0;

    triggerImpulseRef.current = () => {
      squishVelocity = -0.42; // Tactile jello squish
      shockwaveTime = 0.0; // Trigger shockwave ring
      // Stardust particle explosive scatter
      particleData.forEach((p) => {
        p.radialDrift = 0.45;
      });
    };

    function onPointerMove(e) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        dragRotation.y += dx * 0.008;
        dragRotation.x += dy * 0.008;
        prevPointer = { x: e.clientX, y: e.clientY };
      } else if (interactive) {
        mouse.targetX = nx * 0.65;
        mouse.targetY = ny * 0.65;
      }
    }

    function onPointerDown(e) {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    }

    function onPointerUp() {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    }

    function onPointerEnter() {
      setIsHovered(true);
    }

    function onPointerLeave() {
      setIsHovered(false);
      isDragging = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
      renderer.domElement.style.cursor = 'grab';
    }

    function handleClick(e) {
      triggerImpulseRef.current?.();
      onClick?.(e);
    }

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointerenter', onPointerEnter);
    dom.addEventListener('pointerleave', onPointerLeave);
    dom.addEventListener('click', handleClick);

    // ---- ResizeObserver (Fluid Responsive Scaling) ------------------------
    function resize() {
      if (!container) return;
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ---- Animation & Fluid Physics Loop -----------------------------------
    let raf;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime() * speed;

      // 1. Spring physics for elastic squish bounce
      squishVelocity += (1.0 - squish) * 18.0 * dt;
      squishVelocity *= Math.pow(0.12, dt);
      squish += squishVelocity;

      // 2. Heartbeat organic breathing rhythm
      const heartbeat = 1.0 + Math.sin(t * 1.5) * 0.035 + Math.sin(t * 3.0) * 0.015;

      // 3. Mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (autoRotate && !isDragging) {
        dragRotation.y += dt * autoRotateSpeed * 0.6;
      }

      // 4. Fluid Harmonic Waves & Magnetic Cursor Tidal Pull
      const posAttr = geo.attributes.position;
      const count = posAttr.count;

      // Project mouse into 3D local coordinate space for magnetic surface attraction
      const mouse3D = new THREE.Vector3(mouse.x * 2.2, mouse.y * 2.2, 1.4);

      for (let i = 0; i < count; i++) {
        const ox = origPositions[i * 3];
        const oy = origPositions[i * 3 + 1];
        const oz = origPositions[i * 3 + 2];

        // Harmonic multi-frequency waves
        const wave =
          Math.sin(ox * 2.4 + t * 2.4) *
          Math.cos(oy * 2.4 + t * 1.9) *
          Math.sin(oz * 2.4 + t * 2.2);

        // Magnetic ferrofluid pull towards cursor
        let magneticPull = 0;
        if (magneticCursor) {
          const dx = ox - mouse3D.x;
          const dy = oy - mouse3D.y;
          const dz = oz - mouse3D.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          magneticPull = Math.exp(-distSq * 0.75) * 0.38;
        }

        const disp = (1.0 + wave * distortion * 0.35 + magneticPull) * heartbeat;

        // Apply fluid ripple + volume-preserving squish
        posAttr.setXYZ(
          i,
          ox * disp * squish,
          oy * disp * (2.0 - squish),
          oz * disp * squish
        );
      }
      posAttr.needsUpdate = true;
      geo.computeVertexNormals();

      mesh.rotation.x = mouse.y * 0.5 + dragRotation.x;
      mesh.rotation.y = dragRotation.y + mouse.x * 0.5;

      // 5. Animate Quantum Gimbal Halos
      if (showHalos && halo1 && halo2) {
        halo1.rotation.z += dt * 0.5;
        halo2.rotation.x += dt * 0.38;
        haloGroup.rotation.x = mouse.y * 0.35;
        haloGroup.rotation.y = mouse.x * 0.35;

        // Glide beads along halo rings
        if (bead1) {
          const angle1 = t * 1.8;
          bead1.position.set(Math.cos(angle1) * 1.9, Math.sin(angle1) * 1.9, 0);
        }
        if (bead2) {
          const angle2 = -t * 1.4;
          bead2.position.set(Math.cos(angle2) * 2.28, Math.sin(angle2) * 2.28, 0);
        }
      }

      // 6. Animate Dancing Firefly Light Probes
      if (showFireflies && firefly1 && firefly2) {
        // Lissajous 3D orbit 1
        const x1 = Math.sin(t * 1.4) * 2.3;
        const y1 = Math.cos(t * 1.8) * 1.6;
        const z1 = Math.sin(t * 1.6) * 2.1;
        firefly1.position.set(x1, y1, z1);

        // Lissajous 3D orbit 2
        const x2 = Math.cos(t * 1.1) * 2.5;
        const y2 = Math.sin(t * 1.5) * 1.7;
        const z2 = Math.cos(t * 1.9) * 2.2;
        firefly2.position.set(x2, y2, z2);
      }

      // 7. Animate Swarm of Stardust Embers
      if (showParticles && particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const p = particleData[i];
          p.theta += dt * p.speed;
          p.phi += Math.sin(t * p.wobbleFreq) * 0.005;

          // Dissipate click impulse radial drift smoothly
          p.radialDrift *= Math.pow(0.08, dt);
          const currentR = p.radius + p.radialDrift;

          positions[i * 3] = currentR * Math.sin(p.phi) * Math.cos(p.theta);
          positions[i * 3 + 1] = currentR * Math.sin(p.phi) * Math.sin(p.theta);
          positions[i * 3 + 2] = currentR * Math.cos(p.phi);
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      // 8. Animate Click Shockwave Pulse
      if (shockwaveTime < 1.0) {
        shockwaveTime += dt * 1.8;
        const progress = Math.min(1.0, shockwaveTime);
        const scale = 1.0 + progress * 2.3;
        shockwave.scale.set(scale, scale, scale);
        shockwaveMat.opacity = (1.0 - progress) * 0.85;
        shockwave.lookAt(camera.position); // Billboard towards camera
      } else {
        shockwaveMat.opacity = 0;
      }

      // 9. Dynamic studio light orbit based on mouse
      if (lightObjects[0]) {
        lightObjects[0].position.x = 4 + mouse.x * 2.5;
        lightObjects[0].position.y = 5 + mouse.y * 2.5;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointerenter', onPointerEnter);
      dom.removeEventListener('pointerleave', onPointerLeave);
      dom.removeEventListener('click', handleClick);

      geo.dispose();
      mat.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
      renderer.dispose();
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
    };
  }, [
    shape,
    preset,
    speed,
    distortion,
    interactive,
    wireframe,
    showHalos,
    showParticles,
    showFireflies,
    magneticCursor,
    autoRotate,
    autoRotateSpeed,
    onClick,
  ]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full select-none ${className}`}
      data-hovered={isHovered}
    />
  );
}

export default LiquidOrb;
