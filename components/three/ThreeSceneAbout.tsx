'use client';
import { useEffect, useRef } from 'react';

export default function ThreeSceneAbout() {
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
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const count = 800; 
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
     

      const colorA = new THREE.Color(0x8b5cf6); // purple
      const colorB = new THREE.Color(0x22d3ee); // cyan
      const colorC = new THREE.Color(0xa855f7); // another purple shade

      for (let i = 0; i < count; i++) {
        // Размещаем частицы только по краям — избегаем центр
        let x, y;
        do {
          x = (Math.random() - 0.5) * 10;
          y = (Math.random() - 0.5) * 8;
        } while (Math.abs(x) < 2.8 && Math.abs(y) < 2.2); // Центр остается более свободным

        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3; // Небольшая глубина

        // Более плавный градиент цветов, смешивая три цвета
        const distToCenter = Math.sqrt(x * x + y * y);
        let c;
        if (distToCenter < 2.5) { // Ближе к центру - больше фиолетового
          c = colorA.clone().lerp(colorC, distToCenter / 2.5);
        } else { // Дальше от центра - больше бирюзового
          c = colorC.clone().lerp(colorB, (distToCenter - 2.5) / 2.5);
        }
        
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05, 
        vertexColors: true,
        transparent: true,
        opacity: 0.7, // прозрачность
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Мышь для интерактивности (очень тонкой)
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Очень медленное, плавное вращение
        points.rotation.y = elapsed * 0.02; // Медленное вращение по Y
        points.rotation.x = elapsed * 0.01; // Еще более медленное вращение по X

        // Камера следует за мышью, очень-очень тонко
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.01;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
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
      className="w-full h-full absolute inset-0 pointer-events-none"
    />
  );
}