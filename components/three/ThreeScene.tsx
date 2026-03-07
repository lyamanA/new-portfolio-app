'use client';
import { useEffect, useRef } from 'react';

export default function ThreeScene() {
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

      // Сцена
      const scene = new THREE.Scene();

      // Камера
      const camera = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 3;

      // Рендерер
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // ===== THREE.BufferGeometry + THREE.Points =====

      // 1. Создаём геометрию
      const geometry = new THREE.BufferGeometry();
      const count = 5000; // количество частиц

      // 2. Создаём массив позиций (x, y, z для каждой частицы)
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        // Позиции — случайно в пространстве от -5 до 5
        positions[i] = (Math.random() - 0.5) * 10;
        
        // Цвета — градиент от purple до cyan
        if (i % 3 === 0) colors[i] = Math.random() * 0.5 + 0.5;      // R
        if (i % 3 === 1) colors[i] = Math.random() * 0.3;             // G  
        if (i % 3 === 2) colors[i] = Math.random() * 0.5 + 0.5;      // B
      }

      // 3. Передаём атрибуты в геометрию
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // 4. Материал для частиц
      const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,  // используем наши цвета
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      // 5. Создаём Points объект
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Второй слой частиц — крупнее и ярче
      const geometry2 = new THREE.BufferGeometry();
      const count2 = 500;
      const positions2 = new Float32Array(count2 * 3);

      for (let i = 0; i < count2 * 3; i++) {
        positions2[i] = (Math.random() - 0.5) * 8;
      }

      geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));

      const material2 = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x22d3ee, // cyan
        transparent: true,
        opacity: 0.6,
      });

      const points2 = new THREE.Points(geometry2, material2);
      scene.add(points2);

      // Третий слой — фиолетовые крупные звёзды
      const geometry3 = new THREE.BufferGeometry();
      const count3 = 200;
      const positions3 = new Float32Array(count3 * 3);

      for (let i = 0; i < count3 * 3; i++) {
        positions3[i] = (Math.random() - 0.5) * 12;
      }

      geometry3.setAttribute('position', new THREE.BufferAttribute(positions3, 3));

      const material3 = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xa855f7, // purple
        transparent: true,
        opacity: 0.5,
      });

      const points3 = new THREE.Points(geometry3, material3);
      scene.add(points3);

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

        // Вращение всех слоёв с разной скоростью
        points.rotation.y = elapsed * 0.05;
        points.rotation.x = elapsed * 0.03;

        points2.rotation.y = -elapsed * 0.08;
        points2.rotation.x = elapsed * 0.04;

        points3.rotation.y = elapsed * 0.03;
        points3.rotation.z = elapsed * 0.02;

        // Камера следует за мышью
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
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
        geometry.dispose();
        geometry2.dispose();
        geometry3.dispose();
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