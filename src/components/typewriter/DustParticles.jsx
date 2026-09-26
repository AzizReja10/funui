import { useEffect, useRef } from "react";
import * as THREE from "three";

export function DustParticles({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / (height || 1), 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc9a227,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let raf;
    const mouse = { x: 0, y: 0 };

    function handleMouseMove(e) {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / (rect.width || 1) - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / (rect.height || 1) - 0.5) * 2;
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      const pos = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        pos.array[i * 3 + 1] += 0.0025;
        if (pos.array[i * 3 + 1] > 8) pos.array[i * 3 + 1] = -8;
      }
      pos.needsUpdate = true;

      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 1 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    function handleResize() {
      const w = mount.clientWidth || 400;
      const h = mount.clientHeight || 500;
      camera.aspect = w / (h || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
