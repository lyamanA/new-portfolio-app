'use client';
import { useEffect, useRef } from 'react';

export default function ThreeSceneProjects() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initScene();
    document.head.appendChild(script);

    let animationId: number;
    let renderer: any;

    function initScene() {
      const THREE = (window as any).THREE;
      const mount = mountRef.current;
      if (!mount) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Растягиваем canvas на всю высоту mount
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      const layers: { points: any; speed: number }[] = [];

      function createParticleLayer(count: number, size: number, colors: number[], speed: number, depth: number) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const particleColors = new Float32Array(count * 3);
        const colorObjects = colors.map((c: number) => new THREE.Color(c));

        for (let i = 0; i < count; i++) {
          let x, y, z;
          do {
            x = (Math.random() - 0.5) * 16;
            y = (Math.random() - 0.5) * 20; // высокий диапазон по Y
            z = (Math.random() - 0.5) * depth;
          } while (Math.abs(x) < 4.5 && Math.abs(y) < 3.5);

          positions[i * 3]     = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          const c = colorObjects[Math.floor(Math.random() * colorObjects.length)];
          particleColors[i * 3]     = c.r;
          particleColors[i * 3 + 1] = c.g;
          particleColors[i * 3 + 2] = c.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const material = new THREE.PointsMaterial({
          size,
          vertexColors: true,
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        return { points, speed };
      }

      const p1 = [0x8b5cf6, 0xa855f7, 0xc084fc];
      const p2 = [0x22d3ee, 0x06b6d4, 0x38bdf8];

      layers.push(createParticleLayer(2000, 0.015, p1, 0.02, 3));
      layers.push(createParticleLayer(1200, 0.025, p2, 0.04, 2));
      layers.push(createParticleLayer(800,  0.035, p1, 0.06, 1));
      layers.push(createParticleLayer(400,  0.050, p2, 0.08, 0.5));

      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', handleMouseMove);

      // ResizeObserver — следит за реальной высотой контейнера
      const resizeObserver = new ResizeObserver(() => {
        if (!mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(mount);

      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        layers.forEach(layer => {
          layer.points.rotation.y = elapsed * layer.speed * 0.4;
          layer.points.rotation.x = elapsed * layer.speed * 0.2;
          layer.points.position.x = Math.sin(elapsed * layer.speed * 0.5) * 0.1;
          layer.points.position.y = Math.cos(elapsed * layer.speed * 0.4) * 0.1;
        });

        camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        resizeObserver.disconnect();
        cancelAnimationFrame(animationId);
        if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
        renderer.dispose();
        layers.forEach(l => l.points.geometry.dispose());
      };
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0 }}
      className="pointer-events-none"
    />
  );
}