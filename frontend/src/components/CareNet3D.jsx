import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { NeuralNetwork } from './NeuralNetwork';
import { MedicalSignal } from './MedicalSignal';
import { FloatingParticles } from './FloatingParticles';
import { MedicalHeart } from './MedicalHeart';
import { MedicalAircraft } from './MedicalAircraft';
import { HolographicSequence } from './HolographicSequence';

const CareNet3D = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  // Throttled HUD state for ultra-smooth UI overlay rendering
  const [hudState, setHudState] = useState({
    step: 0,
    active: false,
    statusBadge: '',
    telemetryText: '',
    revealMode: 'NONE',
    aircraftScreenX: -999,
    aircraftScreenY: -999,
    aircraftVisible: false
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect reduced motion preference for accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine responsive sizing & complexity
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 580;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const baseRadius = isMobile ? 54 : (isTablet ? 66 : 76);
    const nodeCount = isMobile ? 26 : (isTablet ? 42 : 58);
    const particleCount = isMobile ? 22 : (isTablet ? 38 : 55);

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1200);
    camera.position.set(0, 0, isMobile ? 190 : 210);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. High-End Medical Diagnostic Lighting
    const isDark = theme !== 'light';
    const ambientLight = new THREE.AmbientLight(0xfff8ee, isDark ? 0.55 : 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(isDark ? 0xd8b472 : 0xb8860b, 1.4);
    dirLight.position.set(80, 110, 90);
    scene.add(dirLight);

    const centerPointLight = new THREE.PointLight(isDark ? 0xe5c180 : 0xd4af37, 1.0, 240);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    // 3. Central Intelligence Group (Neural Network + Cardiac Core)
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Subsystem 1: 3D Translucent Anatomical Heart Engine
    const medicalHeart = new MedicalHeart(sphereGroup, {
      isDark,
      scale: isMobile ? 0.82 : 1.12
    });

    // Subsystem 2: Neural Diagnostic Nodes & Synapses
    const neuralNetwork = new NeuralNetwork(sphereGroup, {
      nodeCount,
      radius: baseRadius,
      isDark
    });

    // Subsystem 3: ECG Rhythm Orbit & Diagnostic Rings
    const medicalSignal = new MedicalSignal(sphereGroup, {
      radius: baseRadius,
      isDark
    });

    // Subsystem 4: Floating Atmospheric Medical Particles
    const floatingParticles = new FloatingParticles(sphereGroup, {
      count: particleCount,
      minRadius: baseRadius * 1.15,
      maxRadius: baseRadius * 2.1,
      isDark
    });

    // Subsystem 5: Procedural Futuristic Medical Helicopter / Aircraft
    const medicalAircraft = new MedicalAircraft(scene, {
      isDark,
      scale: isMobile ? 0.55 : 0.72
    });

    // Subsystem 6: Cinematic 5-Step Holographic Sequence Coordinator
    const holographicSequence = new HolographicSequence(
      scene,
      camera,
      medicalHeart,
      medicalAircraft,
      { isDark }
    );

    // 4. Interactive Mouse Coordinates with smooth lerp
    let targetRotX = 0;
    let targetRotY = 0;
    let targetCamX = 0;
    let targetCamY = 0;
    let normMouseX = 0;
    let normMouseY = 0;

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1
      normMouseX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      normMouseY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      targetRotY = normMouseX * 0.24;
      targetRotX = -normMouseY * 0.16;
      targetCamX = normMouseX * 10;
      targetCamY = -normMouseY * 7;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetCamX = 0;
      targetCamY = 0;
      normMouseX = 0;
      normMouseY = 0;
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
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. IntersectionObserver for GPU/Battery efficiency
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

    // 8. Main 60 FPS Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    let lastHudSync = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause rendering when scrolled away

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous elegant rotation
        sphereGroup.rotation.y += 0.0014;

        // Subtle floating movement
        sphereGroup.position.y = Math.sin(time * 0.8) * 3.0;

        // Smooth mouse tilt interpolation
        sphereGroup.rotation.y += (targetRotY - (sphereGroup.rotation.y % (Math.PI * 2))) * 0.05;
        sphereGroup.rotation.x += (targetRotX - sphereGroup.rotation.x) * 0.05;

        // Camera parallax interpolation
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;

        // Scroll parallax interpolation
        const scrollOffset = Math.min(scrollY, 400);
        sphereGroup.position.z = -scrollOffset * 0.12;
      }

      camera.lookAt(0, 0, 0);

      // Central diagnostic light pulsation
      centerPointLight.intensity = 1.0 + Math.sin(time * 1.5) * 0.25;

      // Update Subsystems
      neuralNetwork.update(time, delta);
      medicalSignal.update(time, delta);
      floatingParticles.update(time, delta);
      medicalHeart.update(time, delta);
      medicalAircraft.update(time, delta);

      // Update Cinematic Holographic Sequence
      const currentWidth = container.clientWidth || 960;
      const currentHeight = container.clientHeight || 580;
      holographicSequence.update(
        time,
        delta,
        currentWidth,
        currentHeight,
        { x: normMouseX, y: normMouseY }
      );

      // Throttled HUD state sync to React (approx 20 FPS for silky UI with near-zero overhead)
      const now = performance.now();
      if (now - lastHudSync > 48) {
        lastHudSync = now;
        const curState = holographicSequence.getState();
        setHudState((prev) => {
          // Only update if relevant values changed
          if (
            prev.step !== curState.step ||
            prev.revealMode !== curState.revealMode ||
            prev.statusBadge !== curState.statusBadge ||
            prev.telemetryText !== curState.telemetryText ||
            prev.aircraftVisible !== curState.aircraftVisible ||
            Math.abs(prev.aircraftScreenX - curState.aircraftScreenX) > 2.5 ||
            Math.abs(prev.aircraftScreenY - curState.aircraftScreenY) > 2.5
          ) {
            return { ...curState };
          }
          return prev;
        });
      }

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
      medicalHeart.dispose();
      medicalAircraft.dispose();
      holographicSequence.dispose();

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
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1020px',
        height: '600px',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
        overflow: 'visible',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Soft ethereal ambient radial glow backing the 3D sphere & heart */}
      <div
        style={{
          position: 'absolute',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 180, 114, 0.16) 0%, rgba(216, 180, 114, 0.04) 50%, transparent 72%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      {/* Floating 3D Aircraft Tracking HUD Tag */}
      {hudState.aircraftVisible && hudState.statusBadge && (
        <div
          className="carenet-hud-tag"
          style={{
            left: `${hudState.aircraftScreenX}px`,
            top: `${hudState.aircraftScreenY}px`,
            opacity: hudState.aircraftVisible ? 1 : 0
          }}
        >
          <div className="hud-badge-header">
            <span className={`hud-dot ${hudState.step === 3 ? 'scanning' : ''}`}></span>
            <span>{hudState.statusBadge}</span>
          </div>
          {hudState.telemetryText && (
            <div className="hud-telemetry">{hudState.telemetryText}</div>
          )}
        </div>
      )}

      {/* STEP 4: Major Surprise Reveal Cards around the 3D Heart */}
      {hudState.revealMode !== 'NONE' && (
        <div className="holographic-reveal-container">
          {hudState.revealMode === 'HEART' ? (
            <div className="holographic-reveal-box reveal-heart">
              <div className="holo-tag">
                <span>✦ CLASSIFICATION PIPELINE 01 ✦</span>
              </div>
              <h2 className="holo-title">HEART RISK PREDICTION SYSTEM</h2>
              <div className="holo-sub">
                Real-Time Cardiovascular Neural Assessment & Biomarker Analysis
              </div>
            </div>
          ) : (
            <div className="holographic-reveal-box reveal-medical">
              <div className="holo-tag">
                <span>✦ CLASSIFICATION PIPELINE 02 ✦</span>
              </div>
              <h2 className="holo-title">MEDICAL DIAGNOSIS</h2>
              <div className="holo-sub">
                NLP Multi-Symptom Pattern Matching & Clinical Inference
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareNet3D;
