import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { NeuralNetwork } from './NeuralNetwork';
import { MedicalSignal } from './MedicalSignal';
import { FloatingParticles } from './FloatingParticles';

const CareNet3D = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect reduced motion preference for accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine responsive sizing & complexity
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const baseRadius = isMobile ? 54 : (isTablet ? 66 : 76);
    const nodeCount = isMobile ? 28 : (isTablet ? 46 : 64);
    const particleCount = isMobile ? 25 : (isTablet ? 45 : 70);

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 180 : 210);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const isDark = theme !== 'light';
    const ambientLight = new THREE.AmbientLight(0xfff8ee, isDark ? 0.45 : 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(isDark ? 0xd8b472 : 0xb8860b, 1.2);
    dirLight.position.set(60, 90, 80);
    scene.add(dirLight);

    const centerPointLight = new THREE.PointLight(isDark ? 0xe5c180 : 0xd4af37, 0.85, 220);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    // 3. Main Sphere Hierarchy
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Instantiate modular 3D intelligence subsystems
    const neuralNetwork = new NeuralNetwork(sphereGroup, {
      nodeCount,
      radius: baseRadius,
      isDark
    });

    const medicalSignal = new MedicalSignal(sphereGroup, {
      radius: baseRadius,
      isDark
    });

    const floatingParticles = new FloatingParticles(sphereGroup, {
      count: particleCount,
      minRadius: baseRadius * 1.15,
      maxRadius: baseRadius * 2.1,
      isDark
    });

    // 4. Interactive Mouse Coordinates with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1
      const nx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      targetRotY = nx * 0.28;
      targetRotX = -ny * 0.18;
      targetCamX = nx * 12;
      targetCamY = -ny * 8;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetCamX = 0;
      targetCamY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 5. Scroll Interaction
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 900;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. IntersectionObserver for battery/GPU optimization (pauses loop when out of viewport)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 8. Main 60 FPS RequestAnimationFrame Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause rendering when scrolled past hero to maintain peak performance

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous elegant rotation
        sphereGroup.rotation.y += 0.0016;

        // Subtle floating movement
        sphereGroup.position.y = Math.sin(time * 0.85) * 3.5;

        // Gentle breathing pulsation
        const breath = 1.0 + Math.sin(time * 0.75) * 0.022;
        sphereGroup.scale.set(breath, breath, breath);

        // Smooth mouse tilt interpolation
        sphereGroup.rotation.y += (targetRotY - (sphereGroup.rotation.y % (Math.PI * 2))) * 0.05;
        sphereGroup.rotation.x += (targetRotX - sphereGroup.rotation.x) * 0.05;

        // Camera parallax interpolation
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;

        // Subtle scroll interpolation (shifts sphere backward/upward gracefully on scroll)
        const scrollOffset = Math.min(scrollY, 400);
        sphereGroup.position.z = -scrollOffset * 0.15;
      }

      camera.lookAt(0, 0, 0);

      // Pulse the central light subtly
      centerPointLight.intensity = 0.8 + Math.sin(time * 1.5) * 0.2;

      // Update modular subsystems
      neuralNetwork.update(time, delta);
      medicalSignal.update(time, delta);
      floatingParticles.update(time, delta);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup on Unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      cancelAnimationFrame(animationFrameId);

      neuralNetwork.dispose();
      medicalSignal.dispose();
      floatingParticles.dispose();

      scene.remove(ambientLight);
      scene.remove(dirLight);
      scene.remove(centerPointLight);
      ambientLight.dispose();
      dirLight.dispose();
      centerPointLight.dispose();

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="carenet-3d-wrapper"
      style={{
        position: 'absolute',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '960px',
        height: '560px',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
        overflow: 'visible',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Soft ethereal ambient radial glow backing the 3D sphere */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 180, 114, 0.14) 0%, rgba(216, 180, 114, 0.04) 45%, transparent 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
    </div>
  );
};

export default CareNet3D;
