'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DEFAULT_HUBS, DEFAULT_ARC_PAIRS } from '../../data/globeData';
import { reverseGeocode, getOfflineCountryEstimate } from '../../data/countryLookup';

/**
 * Converts geographic latitude and longitude (in degrees) to 3D Cartesian coordinates
 * on a sphere of radius R, matching Three.js equirectangular UV mapping.
 */
function latLngToVec3(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Converts 3D Cartesian coordinates on a sphere of radius R back to
 * geographic latitude and longitude (in degrees).
 */
function vec3ToLatLng(p, radius = 1) {
  const phi = Math.acos(Math.max(-1, Math.min(1, p.y / radius)));
  const lat = 90 - (phi * 180 / Math.PI);
  const theta = Math.atan2(p.z, -p.x);
  let lon = (theta * 180 / Math.PI) - 180;
  while (lon < -180) lon += 360;
  while (lon > 180) lon -= 360;
  return {
    lat: Number(lat.toFixed(2)),
    lon: Number(lon.toFixed(2)),
  };
}

// Convert NASA / Three.js specular map (white ocean, black land) to roughnessMap (shiny ocean, matte land)
function createRoughnessTexture(specularImg) {
  const canvas = document.createElement('canvas');
  canvas.width = specularImg.width || 1024;
  canvas.height = specularImg.height || 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(specularImg, 0, 0, canvas.width, canvas.height);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const spec = d[i]; // high in ocean (~255), low in land (~0)
    const isOcean = spec > 90;
    const rough = isOcean ? 45 : 220; // 45 shiny ocean, 220 matte land
    d[i] = rough;
    d[i + 1] = rough;
    d[i + 2] = rough;
    d[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function RealisticGlobe({
  className = '',
  textureUrl = '/textures/earth_atmos_2048.jpg',
  normalMapUrl = '/textures/earth_normal_2048.jpg',
  specularMapUrl = '/textures/earth_specular_2048.jpg',
  cloudsUrl = '/textures/earth_clouds_1024.png',
  hubs = DEFAULT_HUBS,
  arcPairs = DEFAULT_ARC_PAIRS,
  autoRotate = true,
  autoRotateSpeed = 0.6,
  enableZoom = true,
  zoomDistance = 3.8, // Default viewing distance
  targetHub = null, // Focused hub object { lat, lon } or index for fly-to zoom
  cinematicFlyIn = true, // Initial dramatic deep-space zoom fly-in
  arcColor = 0xffb703,
  pulseColor = 0xffe08a,
  showClouds = true,
  showArcs = true,
  showStars = false, // Disabled by default to remove dark void background
  onHubClick = null,
  onHubHover = null,
  onLocationSelect = null,
}) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const targetCamPosRef = useRef(null);
  const targetHubRef = useRef(targetHub);
  const onHubClickRef = useRef(onHubClick);
  const onHubHoverRef = useRef(onHubHover);
  const onLocationSelectRef = useRef(onLocationSelect);
  const activeHoveredRef = useRef(null);
  const tooltipRef = useRef(null);
  const selectedPinRef = useRef(null);
  const clickPinGroupRef = useRef(null);
  const selectedLocationRef = useRef(null);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  const [hoveredHub, setHoveredHub] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    targetHubRef.current = targetHub;
  }, [targetHub]);

  useEffect(() => {
    onHubClickRef.current = onHubClick;
  }, [onHubClick]);

  useEffect(() => {
    onHubHoverRef.current = onHubHover;
  }, [onHubHover]);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Allow dynamic programmatic zoom & focus changes from props
  useEffect(() => {
    if (!cameraRef.current) return;
    if (targetHub && typeof targetHub.lat === 'number' && typeof targetHub.lon === 'number') {
      const dir = latLngToVec3(targetHub.lat, targetHub.lon, 1).normalize();
      const distance = Math.max(1.85, Math.min(zoomDistance, 2.5)); // Close inspection distance
      targetCamPosRef.current = dir.clone().multiplyScalar(distance);
    } else if (zoomDistance) {
      // Zoom in or out along current viewing vector
      const currentDir = cameraRef.current.position.clone().normalize();
      targetCamPosRef.current = currentDir.multiplyScalar(zoomDistance);
    }
  }, [zoomDistance, targetHub]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ---- WebGL Renderer with ACES Filmic Tone Mapping ------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cameraRef.current = camera;

    // Initial position: start far back in deep space if cinematic fly-in is active
    const startDistance = cinematicFlyIn ? 10.5 : zoomDistance;
    camera.position.set(0, 0, startDistance);

    const R = 1;

    // ---- Real Earth Texture & PBR Surface Relief ----------------------
    const texLoader = new THREE.TextureLoader();

    // 1. Satellite Day Map
    const earthMap = texLoader.load(textureUrl);
    earthMap.colorSpace = THREE.SRGBColorSpace;

    // 2. Normal / Relief Map for mountains and topography
    let normalMap = null;
    if (normalMapUrl) {
      normalMap = texLoader.load(normalMapUrl);
    }

    const planetGeo = new THREE.SphereGeometry(R, 96, 96);
    const planetMat = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: normalMap || undefined,
      normalScale: normalMap ? new THREE.Vector2(0.85, 0.85) : undefined,
      roughness: 0.65,
      metalness: 0.1,
    });

    // 3. Specular to Roughness conversion for realistic ocean gloss vs matte land
    let roughnessTex = null;
    if (specularMapUrl) {
      const specImg = new Image();
      specImg.crossOrigin = 'anonymous';
      specImg.onload = () => {
        roughnessTex = createRoughnessTexture(specImg);
        if (roughnessTex && planetMat) {
          planetMat.roughnessMap = roughnessTex;
          planetMat.roughness = 1.0;
          planetMat.needsUpdate = true;
        }
      };
      specImg.src = specularMapUrl;
    }

    const planet = new THREE.Mesh(planetGeo, planetMat);
    scene.add(planet);

    // ---- Real Atmospheric Cloud Layer ---------------------------------
    let clouds = null;
    let cloudTex = null;
    if (showClouds && cloudsUrl) {
      cloudTex = texLoader.load(cloudsUrl);
      const cloudGeo = new THREE.SphereGeometry(R * 1.014, 96, 96);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        roughness: 1,
      });
      clouds = new THREE.Mesh(cloudGeo, cloudMat);
      scene.add(clouds);
    }

    // ---- Connection Arcs & Traveling Light Pulses ---------------------
    const arcCurves = [];
    const pulses = [];
    const arcGroup = new THREE.Group();
    const markerHitboxes = [];
    const markerGroups = [];

    if (showArcs && hubs && hubs.length > 0) {
      arcPairs.forEach(([a, b], i) => {
        if (!hubs[a] || !hubs[b]) return;
        const p1 = latLngToVec3(hubs[a].lat, hubs[a].lon, R);
        const p2 = latLngToVec3(hubs[b].lat, hubs[b].lon, R);
        const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.35);
        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        arcCurves.push(curve);

        const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.0035, 6, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: arcColor,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        });
        arcGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

        const pulseGeo = new THREE.SphereGeometry(0.014, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: pulseColor,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.userData.phase = i / arcPairs.length;
        arcGroup.add(pulse);
        pulses.push(pulse);
      });

      // Interactive Hub markers
      hubs.forEach((h, idx) => {
        const pos = latLngToVec3(h.lat, h.lon, R * 1.002);
        const markerGroup = new THREE.Group();
        markerGroup.position.copy(pos);

        // Core dot
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.014, 12, 12),
          new THREE.MeshBasicMaterial({ color: pulseColor })
        );
        markerGroup.add(dot);

        // Subtle outer pulse beacon ring
        const ringGeo = new THREE.RingGeometry(0.018, 0.026, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: pulseColor,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.lookAt(pos.clone().multiplyScalar(2));
        markerGroup.add(ring);

        // Generous invisible hit sphere for effortless hover targeting (visible: true with opacity 0 so raycaster intersects it)
        const hitSphereGeo = new THREE.SphereGeometry(0.065, 12, 12);
        const hitSphereMat = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const hitSphere = new THREE.Mesh(hitSphereGeo, hitSphereMat);
        markerGroup.add(hitSphere);

        markerGroup.userData = { hub: h, index: idx, ring, dot };
        arcGroup.add(markerGroup);
        markerHitboxes.push(hitSphere, dot, ring);
        markerGroups.push(markerGroup);
      });

      scene.add(arcGroup);
    }

    // ---- 3D Click Pin & Radar Pulse for Selected Country / Location -----
    const clickPinGroup = new THREE.Group();
    clickPinGroup.visible = false;
    clickPinGroupRef.current = clickPinGroup;

    const pinDotGeo = new THREE.SphereGeometry(0.016, 16, 16);
    const pinDotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pinDot = new THREE.Mesh(pinDotGeo, pinDotMat);
    clickPinGroup.add(pinDot);

    const pinRingGeo = new THREE.RingGeometry(0.022, 0.038, 32);
    const pinRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const pinRing = new THREE.Mesh(pinRingGeo, pinRingMat);
    clickPinGroup.add(pinRing);
    scene.add(clickPinGroup);

    // ---- 3D Starfield Backdrop (Optional) ------------------------------
    let stars = null;
    if (showStars) {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 900;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 32 + Math.random() * 24;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = r * Math.cos(phi);
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, sizeAttenuation: true })
      );
      scene.add(stars);
    }

    // ---- Balanced Lighting (Gently light shaded side so it works beautifully on light backgrounds) ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 1.25);
    sun.position.set(5, 3, 4);
    scene.add(sun);
    const fillLight = new THREE.DirectionalLight(0xb8d9f8, 0.35);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // ---- OrbitControls with Inertia & Zoom Limits ---------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = enableZoom;
    controls.zoomSpeed = 0.85;
    controls.minDistance = 1.35; // Allows zooming very close to continents & cities
    controls.maxDistance = 10.0; // Deep space zoom limit
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.rotateSpeed = 0.5;

    let resumeTimer;
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
      targetCamPosRef.current = null; // User manual drag overrides programmatic target
      activeHoveredRef.current = null;
      setHoveredHub(null);
      clearTimeout(resumeTimer);
    });
    controls.addEventListener('end', () => {
      if (autoRotate && !targetHubRef.current) {
        resumeTimer = setTimeout(() => {
          controls.autoRotate = true;
        }, 1600);
      }
    });

    // ---- Raycasting: Hover & Click Detection --------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function updateHover(clientX, clientY) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(markerHitboxes, false);
      let found = null;

      for (const hit of intersects) {
        const parent = hit.object.parent;
        if (parent && parent.userData?.hub) {
          const worldPos = new THREE.Vector3();
          parent.getWorldPosition(worldPos);
          const normal = worldPos.clone().normalize();
          const viewDir = camera.position.clone().sub(worldPos).normalize();
          // Ensure city is on the visible front hemisphere of Earth
          if (normal.dot(viewDir) > 0.02) {
            const screenPos = worldPos.clone().project(camera);
            const sx = (screenPos.x * 0.5 + 0.5) * rect.width;
            const sy = (-screenPos.y * 0.5 + 0.5) * rect.height;
            found = {
              hub: parent.userData.hub,
              index: parent.userData.index,
              marker: parent,
              x: sx,
              y: sy,
            };
            break;
          }
        }
      }

      activeHoveredRef.current = found;
      setHoveredHub(found ? { hub: found.hub, index: found.index, x: found.x, y: found.y } : null);
      if (tooltipRef.current && found) {
        tooltipRef.current.style.left = `${found.x}px`;
        tooltipRef.current.style.top = `${found.y}px`;
      }
      renderer.domElement.style.cursor = found ? 'pointer' : 'grab';
      onHubHoverRef.current?.(found ? found.hub : null, found ? found.index : null);
    }

    function onPointerMove(e) {
      updateHover(e.clientX, e.clientY);
    }

    function onPointerDown(e) {
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    }

    function onPointerLeave() {
      activeHoveredRef.current = null;
      setHoveredHub(null);
      renderer.domElement.style.cursor = 'grab';
      onHubHoverRef.current?.(null, null);
    }

    async function onPointerClick(e) {
      if (!container) return;
      // If pointer moved more than 7px, it was a drag to rotate, not a click
      const distMoved = Math.hypot(
        e.clientX - pointerDownPosRef.current.x,
        e.clientY - pointerDownPosRef.current.y
      );
      if (distMoved > 7) return;

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // 1. Check if clicked an existing hub marker
      const hubHits = raycaster.intersectObjects(markerHitboxes, false);
      let hitHub = null;
      for (const hit of hubHits) {
        const parent = hit.object.parent;
        if (parent && parent.userData?.hub) {
          hitHub = parent.userData.hub;
          break;
        }
      }

      let targetLat, targetLon;
      let worldPos;

      if (hitHub) {
        targetLat = hitHub.lat;
        targetLon = hitHub.lon;
        worldPos = latLngToVec3(targetLat, targetLon, R * 1.003);
        onHubClickRef.current?.(hitHub);
      } else {
        // 2. Raycast against the Earth sphere
        const planetHits = raycaster.intersectObject(planet, false);
        if (planetHits.length === 0) return;

        const hitPoint = planetHits[0].point;
        const coords = vec3ToLatLng(hitPoint, R);
        targetLat = coords.lat;
        targetLon = coords.lon;
        worldPos = latLngToVec3(targetLat, targetLon, R * 1.003);
      }

      // Position the 3D pin on the Earth
      clickPinGroup.position.copy(worldPos);
      pinRing.lookAt(worldPos.clone().multiplyScalar(2));
      clickPinGroup.visible = true;

      // Screen coordinates for initial display
      const screenPos = worldPos.clone().project(camera);
      const sx = (screenPos.x * 0.5 + 0.5) * rect.width;
      const sy = (-screenPos.y * 0.5 + 0.5) * rect.height;

      // Instant offline estimate so UI responds in 0ms!
      const initialEstimate = getOfflineCountryEstimate(targetLat, targetLon);
      const initialLocation = {
        lat: targetLat,
        lon: targetLon,
        countryName: hitHub ? hitHub.name : initialEstimate.countryName,
        countryCode: initialEstimate.countryCode,
        region: hitHub ? 'City Hub' : initialEstimate.continent,
        continent: initialEstimate.continent,
        isOcean: initialEstimate.isOcean,
        flag: initialEstimate.flag,
        flagUrl: initialEstimate.countryCode ? `https://flagcdn.com/w80/${initialEstimate.countryCode.toLowerCase()}.png` : null,
        worldPos,
        x: sx,
        y: sy,
        loading: true,
      };

      selectedLocationRef.current = initialLocation;
      setSelectedLocation(initialLocation);
      onLocationSelectRef.current?.(initialLocation);

      // Refine with high-precision reverse geocoding
      try {
        const refined = await reverseGeocode(targetLat, targetLon);
        const updated = {
          ...refined,
          worldPos,
          x: sx,
          y: sy,
          loading: false,
        };
        if (
          selectedLocationRef.current?.lat === targetLat &&
          selectedLocationRef.current?.lon === targetLon
        ) {
          selectedLocationRef.current = updated;
          setSelectedLocation(updated);
          onLocationSelectRef.current?.(updated);
        }
      } catch {
        // Safe: initial estimate is already displayed
      }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onPointerClick);

    // ---- ResizeObserver (Edge-to-Edge Responsive) ---------------------
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

    // ---- Animation & Cinematic Zoom-In Loop ----------------------------
    let elapsedFlyIn = 0;
    let isFlyInDone = !cinematicFlyIn;
    let raf;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      // 1. Initial Cinematic Deep Space Fly-In Effect
      if (!isFlyInDone) {
        elapsedFlyIn += dt;
        const progress = Math.min(1, elapsedFlyIn / 2.0);
        // Smooth quintic ease-out for dramatic decelerating approach
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentDist = 10.5 - (10.5 - zoomDistance) * easeOut;

        const currentDir = camera.position.clone().normalize();
        camera.position.copy(currentDir.multiplyScalar(currentDist));

        if (progress >= 1) {
          isFlyInDone = true;
        }
      }

      // 2. Programmatic Fly-To / Zoom Interpolation (e.g. City Target or Zoom Buttons)
      if (targetCamPosRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.06);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.02) {
          targetCamPosRef.current = null;
        }
      }

      // 3. Clouds drift
      if (clouds) {
        clouds.rotation.y += dt * 0.025; // Parallax drift
      }

      // 4. Arc traveling photon pulses
      pulses.forEach((pulse, i) => {
        if (!arcCurves[i]) return;
        const tt = (t * 0.16 + pulse.userData.phase) % 1;
        pulse.position.copy(arcCurves[i].getPointAt(tt));
        if (pulse.material) {
          pulse.material.opacity = 0.4 + 0.6 * Math.sin(tt * Math.PI);
        }
      });

      // 5. Keep Hover Tooltip tracking city position in real-time as globe spins
      if (activeHoveredRef.current?.marker) {
        const worldPos = new THREE.Vector3();
        activeHoveredRef.current.marker.getWorldPosition(worldPos);
        const normal = worldPos.clone().normalize();
        const viewDir = camera.position.clone().sub(worldPos).normalize();
        if (normal.dot(viewDir) > 0.02) {
          const screenPos = worldPos.clone().project(camera);
          const rect = container.getBoundingClientRect();
          const sx = (screenPos.x * 0.5 + 0.5) * rect.width;
          const sy = (-screenPos.y * 0.5 + 0.5) * rect.height;
          if (tooltipRef.current) {
            tooltipRef.current.style.left = `${sx}px`;
            tooltipRef.current.style.top = `${sy}px`;
          }
        } else {
          // Rotated to the back of the planet: hide tooltip
          activeHoveredRef.current = null;
          setHoveredHub(null);
        }
      }

      // 6. Highlight hovered city beacon ring & dot
      markerGroups.forEach((m) => {
        const isHovered = activeHoveredRef.current?.index === m.userData.index;
        if (m.userData.ring) {
          const targetScale = isHovered ? 1.85 : 1.0;
          m.userData.ring.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);
        }
        if (m.userData.dot) {
          const targetScale = isHovered ? 1.4 : 1.0;
          m.userData.dot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);
        }
      });

      // 7. Pulse 3D Click Pin radar ring
      if (clickPinGroup.visible) {
        const pScale = 1.0 + 0.35 * Math.sin(t * 4);
        pinRing.scale.set(pScale, pScale, pScale);
        pinRingMat.opacity = 0.5 + 0.45 * Math.cos(t * 4);
      }

      // 8. Keep Country Card pinned onto clicked coordinates in real-time
      if (selectedLocationRef.current?.worldPos && selectedPinRef.current) {
        const worldPos = selectedLocationRef.current.worldPos;
        const normal = worldPos.clone().normalize();
        const viewDir = camera.position.clone().sub(worldPos).normalize();
        if (normal.dot(viewDir) > 0.02) {
          const screenPos = worldPos.clone().project(camera);
          const rect = container.getBoundingClientRect();
          const sx = (screenPos.x * 0.5 + 0.5) * rect.width;
          const sy = (-screenPos.y * 0.5 + 0.5) * rect.height;
          selectedPinRef.current.style.display = 'block';
          selectedPinRef.current.style.left = `${sx}px`;
          selectedPinRef.current.style.top = `${sy}px`;
        } else {
          selectedPinRef.current.style.display = 'none';
        }
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onPointerClick);
      controls.dispose();

      pinDotGeo.dispose();
      pinDotMat.dispose();
      pinRingGeo.dispose();
      pinRingMat.dispose();

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              if (m.map) m.map.dispose();
              if (m.normalMap) m.normalMap.dispose();
              if (m.roughnessMap) m.roughnessMap.dispose();
              m.dispose();
            });
          } else {
            if (obj.material.map) obj.material.map.dispose();
            if (obj.material.normalMap) obj.material.normalMap.dispose();
            if (obj.material.roughnessMap) obj.material.roughnessMap.dispose();
            obj.material.dispose();
          }
        }
      });

      if (roughnessTex) roughnessTex.dispose();
      if (earthMap) earthMap.dispose();
      if (normalMap) normalMap.dispose();
      if (cloudTex) cloudTex.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [
    textureUrl,
    normalMapUrl,
    specularMapUrl,
    cloudsUrl,
    hubs,
    arcPairs,
    autoRotate,
    autoRotateSpeed,
    enableZoom,
    zoomDistance,
    cinematicFlyIn,
    arcColor,
    pulseColor,
    showClouds,
    showArcs,
    showStars,
  ]);

  return (
    <div ref={mountRef} className={`relative w-full h-full ${className}`}>
      {/* Floating City Hover Tooltip */}
      {hoveredHub && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full pb-3.5 select-none animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${hoveredHub.x}px`, top: `${hoveredHub.y}px` }}
        >
          <div className="glass-fluid-card flex items-center gap-2.5 px-3.5 py-2 rounded-xl shadow-2xl whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-ping" />
            <div className="flex flex-col">
              <span className="text-xs font-bold font-heading leading-tight text-white tracking-wide drop-shadow-sm">
                {hoveredHub.hub.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-300 leading-tight">
                {Math.abs(hoveredHub.hub.lat)}°{hoveredHub.hub.lat >= 0 ? 'N' : 'S'}, {Math.abs(hoveredHub.hub.lon)}°{hoveredHub.hub.lon >= 0 ? 'E' : 'W'}
              </span>
            </div>
          </div>
          {/* Subtle downward caret arrow */}
          <div className="w-2.5 h-2.5 rotate-45 bg-slate-900/80 backdrop-blur-md border-r border-b border-white/25 mx-auto -mt-1 shadow-xs" />
        </div>
      )}

      {/* Floating Clicked Country & Location Card with Fluid Glass styling */}
      {selectedLocation && (
        <div
          ref={selectedPinRef}
          className="absolute z-40 -translate-x-1/2 -translate-y-full pb-3.5 select-none animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${selectedLocation.x}px`, top: `${selectedLocation.y}px` }}
        >
          <div className="glass-fluid-card relative overflow-hidden flex flex-col gap-2.5 p-3 rounded-2xl min-w-[220px] max-w-[290px] shadow-2xl">
            {/* Ambient fluid liquid blobs beneath frosted glass */}
            <div className="pointer-events-none absolute -top-8 -left-8 w-28 h-28 rounded-full bg-cyan-400/25 blur-xl animate-fluid-blob" />
            <div className="pointer-events-none absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-indigo-500/30 blur-xl animate-fluid-blob-delay" />
            <div className="pointer-events-none absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-teal-300/20 blur-lg animate-fluid-blob" />

            {/* Specular top light edge */}
            <div className="pointer-events-none absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Country Name Fluid Glass Capsule Header */}
            <div className="glass-fluid-header relative z-10 overflow-hidden rounded-xl p-2.5">
              {/* Animated fluid sheen sweep */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-fluid-sheen" />
              {/* Internal micro specular streak */}
              <div className="pointer-events-none absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

              <div className="flex items-center justify-between gap-2.5 relative z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedLocation.flagUrl ? (
                    <div className="relative shrink-0 rounded-md overflow-hidden p-[1.5px] bg-gradient-to-b from-white/60 via-white/20 to-transparent shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                      <img
                        src={selectedLocation.flagUrl}
                        alt={selectedLocation.countryName}
                        className="w-7 h-4.5 object-cover rounded-[4px]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : null}
                  <span className="text-xl leading-none shrink-0 drop-shadow-md">
                    {selectedLocation.flag || '🌐'}
                  </span>
                  <span className="text-sm font-bold font-heading text-white tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {selectedLocation.countryName}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(null);
                    selectedLocationRef.current = null;
                    if (clickPinGroupRef.current) clickPinGroupRef.current.visible = false;
                  }}
                  className="w-5 h-5 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0 text-xs shadow-xs"
                  title="Dismiss location"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Region / Sub-division / Ocean info */}
            <div className="relative z-10 flex items-center justify-between px-1 text-[11px] font-mono text-zinc-200">
              <span className="truncate flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                {selectedLocation.isOcean ? 'Ocean Waters' : selectedLocation.region || selectedLocation.continent || 'Territory'}
              </span>
              {selectedLocation.countryCode && (
                <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-bold text-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  {selectedLocation.countryCode}
                </span>
              )}
            </div>

            {/* Geographic Coordinates */}
            <div className="relative z-10 flex items-center justify-between px-1 text-[10px] font-mono text-cyan-300/90 pt-1.5 border-t border-white/15">
              <span className="text-zinc-400 text-[10px]">Position</span>
              <span className="font-semibold tracking-tight text-cyan-300">
                {Math.abs(selectedLocation.lat)}°{selectedLocation.lat >= 0 ? 'N' : 'S'},{' '}
                {Math.abs(selectedLocation.lon)}°{selectedLocation.lon >= 0 ? 'E' : 'W'}
              </span>
            </div>
          </div>

          {/* Downward pointer caret arrow with matching fluid glass look */}
          <div className="w-3 h-3 rotate-45 bg-slate-900/80 backdrop-blur-xl border-r border-b border-white/30 mx-auto -mt-1.5 shadow-lg" />
        </div>
      )}
    </div>
  );
}

export default RealisticGlobe;
