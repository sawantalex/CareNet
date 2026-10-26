import * as THREE from 'three';

/**
 * Procedural 3D Translucent Anatomical Cardiac Engine
 * Features:
 * - Parametric 3D cardiac ventricle/atria geometry with smooth normals
 * - Glassmorphic gold material shell + wireframe holographic matrix overlay
 * - Organic physiological "lub-dub" double-pulse cardiac cycle
 * - Concentric diagnostic scanning reticle rings
 * - Reactive cardiac bio-scanning wave shockwaves
 */
export class MedicalHeart {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.scale = options.scale || 1.15;
    this.isDark = options.isDark !== false;
    this.goldHex = this.isDark ? 0xd8b472 : 0xb8860b;
    this.lightGoldHex = this.isDark ? 0xf5d282 : 0xd4af37;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.scanningIntensity = 0;
    this.revealIntensity = 0;

    this.initHeartGeometry();
    this.initInternalNucleus();
    this.initScanningReticles();
    this.initScanningWaves();
  }

  initHeartGeometry() {
    const uSteps = 42;
    const vSteps = 42;
    const positions = [];
    const indices = [];

    for (let j = 0; j <= vSteps; j++) {
      const v = (j / vSteps) * Math.PI;
      const sinV = Math.sin(v);
      const cosV = Math.cos(v);

      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * Math.PI * 2;
        const sinU = Math.sin(u);
        const cosU = Math.cos(u);

        // Parametric 3D Heart Surface Equations
        const x = 16 * Math.pow(sinU, 3) * sinV;
        const y = (13 * cosU - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) * sinV;
        const z = 8.5 * cosV;

        // Normalize and scale to fit diagnostic core
        const scaleFactor = 1.65 * this.scale;
        positions.push(x * scaleFactor * 0.95, y * scaleFactor, z * scaleFactor * 0.85);
      }
    }

    for (let j = 0; j < vSteps; j++) {
      for (let i = 0; i < uSteps; i++) {
        const a = j * (uSteps + 1) + i;
        const b = (j + 1) * (uSteps + 1) + i;
        const c = (j + 1) * (uSteps + 1) + (i + 1);
        const d = j * (uSteps + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.heartGeometry = new THREE.BufferGeometry();
    this.heartGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.heartGeometry.setIndex(indices);
    this.heartGeometry.computeVertexNormals();

    // 1. Translucent Glassmorphic Outer Shell
    this.heartMaterial = new THREE.MeshStandardMaterial({
      color: this.goldHex,
      emissive: 0x3d2706,
      emissiveIntensity: 0.45,
      roughness: 0.18,
      metalness: 0.75,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.heartMesh = new THREE.Mesh(this.heartGeometry, this.heartMaterial);
    // Center heart pivot
    this.heartMesh.position.set(0, -2, 0);
    this.group.add(this.heartMesh);

    // 2. Holographic Matrix Wireframe Overlay
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: this.lightGoldHex,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.wireframeMesh = new THREE.Mesh(this.heartGeometry, this.wireframeMaterial);
    this.wireframeMesh.position.set(0, -2, 0);
    this.wireframeMesh.scale.set(1.02, 1.02, 1.02);
    this.group.add(this.wireframeMesh);
  }

  initInternalNucleus() {
    // Internal bio-luminescent cardiac pacemaker nucleus
    const nucleusGeom = new THREE.IcosahedronGeometry(7 * this.scale, 2);
    this.nucleusMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe8aa,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.nucleusMesh = new THREE.Mesh(nucleusGeom, this.nucleusMaterial);
    this.nucleusMesh.position.set(0, 0, 0);
    this.group.add(this.nucleusMesh);

    // Dynamic internal point light radiating through translucent heart muscle
    this.heartLight = new THREE.PointLight(0xf5d282, 1.2, 90);
    this.heartLight.position.set(0, 0, 0);
    this.group.add(this.heartLight);
  }

  initScanningReticles() {
    this.reticlesGroup = new THREE.Group();
    this.group.add(this.reticlesGroup);

    // Dual rotating diagnostic rings with tick/degree markings
    const ringGeom1 = new THREE.RingGeometry(32 * this.scale, 33 * this.scale, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: this.goldHex,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.reticle1 = new THREE.Mesh(ringGeom1, ringMat1);
    this.reticle1.rotation.x = Math.PI / 2.3;
    this.reticlesGroup.add(this.reticle1);

    const ringGeom2 = new THREE.RingGeometry(36 * this.scale, 36.8 * this.scale, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: this.lightGoldHex,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.reticle2 = new THREE.Mesh(ringGeom2, ringMat2);
    this.reticle2.rotation.y = Math.PI / 3.5;
    this.reticle2.rotation.z = Math.PI / 6;
    this.reticlesGroup.add(this.reticle2);
  }

  initScanningWaves() {
    // Expanding spherical wavefronts emitted when scanned by the aircraft
    this.waves = [];
    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
      const geom = new THREE.RingGeometry(18 * this.scale, 19.5 * this.scale, 48);
      const mat = new THREE.MeshBasicMaterial({
        color: this.lightGoldHex,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = Math.PI / 2;
      this.group.add(mesh);
      this.waves.push({
        mesh,
        mat,
        phase: (i / waveCount) * Math.PI * 2,
        speed: 1.8 + i * 0.4
      });
    }
  }

  setScanning(isScanning, intensity = 1.0) {
    this.scanningIntensity = isScanning ? intensity : 0;
  }

  setReveal(isRevealed, intensity = 1.0) {
    this.revealIntensity = isRevealed ? intensity : 0;
  }

  update(time, delta = 0.016) {
    // 1. Organic "lub-dub" cardiac rhythm
    // Base cycle = 1.1s (normal resting ~65 BPM)
    // When being scanned by the aircraft, heart rate accelerates slightly to ~80 BPM (0.85s cycle)
    const cycleDuration = this.scanningIntensity > 0 ? 0.85 : 1.15;
    const cycleTime = (time % cycleDuration) / cycleDuration;

    let cardiacScale = 1.0;
    let systolicPulse = 0;

    if (cycleTime < 0.12) {
      // Lub: Atrial / Ventricular initial contraction
      const t = cycleTime / 0.12;
      systolicPulse = Math.sin(t * Math.PI) * 0.14;
      cardiacScale = 1.0 + systolicPulse;
    } else if (cycleTime >= 0.12 && cycleTime < 0.20) {
      // Brief mid-relaxation interval
      cardiacScale = 1.02;
    } else if (cycleTime >= 0.20 && cycleTime < 0.35) {
      // Dub: Strong ventricular contraction peak
      const t = (cycleTime - 0.20) / 0.15;
      systolicPulse = Math.sin(t * Math.PI) * 0.22;
      cardiacScale = 1.0 + systolicPulse;
    } else {
      // Diastolic rest & refill
      const t = (cycleTime - 0.35) / 0.65;
      cardiacScale = 1.0 + Math.sin(t * Math.PI) * 0.02;
    }

    // Boost scale during reveal surge
    const surge = this.revealIntensity * 0.08 + this.scanningIntensity * 0.05;
    const finalScale = (cardiacScale + surge);
    this.heartMesh.scale.set(finalScale, finalScale, finalScale);
    this.wireframeMesh.scale.set(finalScale * 1.02, finalScale * 1.02, finalScale * 1.02);

    // 2. Dynamic Illumination
    const baseEmissive = 0.45 + (systolicPulse * 0.85);
    const scanEmissive = this.scanningIntensity * 0.8;
    const revealEmissive = this.revealIntensity * 1.2;
    this.heartMaterial.emissiveIntensity = baseEmissive + scanEmissive + revealEmissive;
    this.wireframeMaterial.opacity = 0.22 + (this.scanningIntensity * 0.35) + (this.revealIntensity * 0.45);

    this.heartLight.intensity = (1.2 + systolicPulse * 2.5) + (this.scanningIntensity * 2.0) + (this.revealIntensity * 3.5);

    // 3. Nucleus Rotation & Pulse
    this.nucleusMesh.rotation.y += delta * 1.2;
    this.nucleusMesh.rotation.x += delta * 0.8;
    const nScale = (1.0 + systolicPulse * 0.5) * (1.0 + this.revealIntensity * 0.3);
    this.nucleusMesh.scale.set(nScale, nScale, nScale);

    // 4. Reticles Rotation
    this.reticle1.rotation.z += delta * 0.4;
    this.reticle2.rotation.z -= delta * 0.35;

    // 5. Scanning Waves Animation
    if (this.scanningIntensity > 0 || this.revealIntensity > 0) {
      const activeIntensity = Math.max(this.scanningIntensity, this.revealIntensity);
      for (let i = 0; i < this.waves.length; i++) {
        const w = this.waves[i];
        const progress = ((time * w.speed + w.phase) % (Math.PI * 2)) / (Math.PI * 2);
        const waveR = (1.0 + progress * 2.2) * (30 * this.scale);
        w.mesh.scale.set(waveR / (18 * this.scale), waveR / (18 * this.scale), 1);
        w.mat.opacity = Math.sin(progress * Math.PI) * 0.55 * activeIntensity;
      }
    } else {
      for (let i = 0; i < this.waves.length; i++) {
        this.waves[i].mat.opacity = 0;
      }
    }

    // 6. Gentle Ambient Float
    this.group.rotation.y += delta * 0.2;
  }

  dispose() {
    if (this.heartGeometry) this.heartGeometry.dispose();
    if (this.heartMaterial) this.heartMaterial.dispose();
    if (this.wireframeMaterial) this.wireframeMaterial.dispose();
    if (this.nucleusMaterial) this.nucleusMaterial.dispose();
    for (let i = 0; i < this.waves.length; i++) {
      this.waves[i].mesh.geometry.dispose();
      this.waves[i].mat.dispose();
    }
  }
}
