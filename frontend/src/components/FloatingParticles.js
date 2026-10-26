import * as THREE from 'three';

/**
 * FloatingParticles:
 * Soft ambient diagnostic data specks orbiting the intelligence sphere to add
 * cinematic depth and subtle atmospheric motion.
 */
export class FloatingParticles {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.count = options.count || 70;
    this.minRadius = options.minRadius || 85;
    this.maxRadius = options.maxRadius || 170;
    this.isDark = options.isDark !== false;
    this.goldHex = this.isDark ? 0xd8b472 : 0xb8860b;
    this.lightGoldHex = this.isDark ? 0xe5c180 : 0xd4af37;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.initParticles();
  }

  initParticles() {
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    this.particleData = [];

    const gold = new THREE.Color(this.goldHex);
    const lightGold = new THREE.Color(this.lightGoldHex);

    for (let i = 0; i < this.count; i++) {
      const radius = this.minRadius + Math.random() * (this.maxRadius - this.minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const col = Math.random() > 0.4 ? lightGold : gold;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      this.particleData.push({
        radius,
        theta,
        phi,
        orbitSpeed: (0.0008 + Math.random() * 0.0014) * (Math.random() > 0.5 ? 1 : -1),
        bobSpeed: 0.8 + Math.random() * 1.2,
        bobPhase: Math.random() * Math.PI * 2,
        bobAmp: 2.0 + Math.random() * 3.5
      });
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.group.add(this.points);
  }

  update(time, delta = 0.016) {
    const positions = this.geometry.attributes.position.array;

    for (let i = 0; i < this.count; i++) {
      const p = this.particleData[i];
      p.theta += p.orbitSpeed;

      const yBob = Math.sin(time * p.bobSpeed + p.bobPhase) * p.bobAmp;

      const x = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
      const y = p.radius * Math.sin(p.phi) * Math.sin(p.theta) + yBob;
      const z = p.radius * Math.cos(p.phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.group && this.scene) this.scene.remove(this.group);
  }
}
