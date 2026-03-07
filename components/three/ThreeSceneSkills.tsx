'use client';
import { useEffect, useRef } from 'react';

export default function ThreeSceneSkills() {
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
      camera.position.z = 5; // Слегка отодвинем камеру

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const layers: { points: any; speed: number; }[] = [];

      // Функция для создания слоя частиц
      function createParticleLayer(count: number, size: number, colors: number[], speed: number, depth: number) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const particleColors = new Float32Array(count * 3);

        const colorObjects = colors.map(c => new THREE.Color(c));

        for (let i = 0; i < count; i++) {
          // Распределяем частицы по краям, оставляя центр свободным
          let x, y, z;
          do {
            x = (Math.random() - 0.5) * 12; // Шире диапазон по X
            y = (Math.random() - 0.5) * 8;  // Шире диапазон по Y
            z = (Math.random() - 0.5) * depth;
          } while (Math.abs(x) < 3.5 && Math.abs(y) < 2.5); // Зазор в центре

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
          size: size,
          vertexColors: true,
          transparent: true,
          opacity: 0.7 + Math.random() * 0.3, // Небольшая рандомизация opacity
          blending: THREE.AdditiveBlending, // Для красивого свечения
          depthWrite: false, // Чтобы частицы не перекрывали друг друга некорректно
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        return { points, speed };
      }

      // Цвета для разных слоев
      const colorPalette1 = [0x8b5cf6, 0xa855f7, 0xc084fc]; // Фиолетовые оттенки
      const colorPalette2 = [0x22d3ee, 0x06b6d4, 0x38bdf8]; // Сине-бирюзовые оттенки

      // Слои частиц
      layers.push(createParticleLayer(2000, 0.02, colorPalette1, 0.03, 3)); // Дальний фон, очень мелкие
      layers.push(createParticleLayer(1500, 0.03, colorPalette2, 0.05, 2)); // Средний фон, мелкие
      layers.push(createParticleLayer(1000, 0.04, colorPalette1, 0.07, 1)); // Ближний фон, чуть крупнее
      layers.push(createParticleLayer(500,  0.05, colorPalette2, 0.09, 0.5)); // Очень близкий фон, еще крупнее

      // Мышь для интерактивности
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Resize
      const handleResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      // Анимация
      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        layers.forEach(layer => {
          layer.points.rotation.y = elapsed * layer.speed * 0.5;
          layer.points.rotation.x = elapsed * layer.speed * 0.3;
          layer.points.position.x = Math.sin(elapsed * layer.speed * 0.7) * 0.2; //небольшое боковое смещение
          layer.points.position.y = Math.cos(elapsed * layer.speed * 0.6) * 0.2; // И вертикальное
        });

        camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };

      animate();

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (mount && renderer.domElement) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        layers.forEach(layer => layer.points.geometry.dispose());
      };
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
    />
  );
}