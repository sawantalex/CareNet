import * as THREE from 'three';

/**
 * Creates a soft glowing circular point sprite texture using an offscreen canvas.
 * This guarantees ultra-crisp, anti-aliased luxury nodes without expensive shader passes.
 */
function createNodeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(245, 220, 150, 0.95)');
  gradient.addColorStop(0.45, 'rgba(216, 180, 114, 0.6)');
  gradient.addColorStop(0.75, 'rgba(216, 180, 114, 0.15)');
  gradient.addColorStop(1, 'rgba(216, 180, 114, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * NeuralNetwork:
 * Generates an organic 3D network of diagnostic nodes with dynamic pulsing brightness
 * and real-time distance-based synaptic connection lines.
 */
export class NeuralNetwork {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.nodeCount = options.nodeCount || 60;
    this.radius = options.radius || 76;
    this.isDark = options.isDark !== false;
    this.goldHex = this.isDark ? 0xd8b472 : 0xb8860b;
    this.lightGoldHex = this.isDark ? 0xe5c180 : 0xd4af37;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.nodeData = [];
    this.nodeTexture = createNodeTexture();

    this.initNodes();
    this.initLines();
  }

  initNodes() {
    // Generate organic 3D distribution around spherical shell with controlled clustering
    const positions = new Float32Array(this.nodeCount * 3);
    const colors = new Float32Array(this.nodeCount * 3);

    const baseColor = new THREE.Color(this.goldHex);
    const brightColor = new THREE.Color(this.lightGoldHex);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < this.nodeCount; i++) {
      // Golden spiral sphere distribution with organic jitter
      const phi = Math.acos(-1 + (2 * i) / this.nodeCount);
      const theta = Math.sqrt(this.nodeCount * Math.PI) * phi;

      // Organic radial displacement
      const r = this.radius * (0.82 + Math.random() * 0.36);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // 10% are key diagnostic hubs (brighter, pulse more prominently)
      const isHub = i % 8 === 0;

      const mixColor = isHub ? whiteColor : (Math.random() > 0.4 ? brightColor : baseColor);
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;

      this.nodeData.push({
        basePos: new THREE.Vector3(x, y, z),
        currentPos: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12
        ),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.9 + Math.random() * 1.4,
        isHub,
        baseColor: mixColor.clone()
      });
    }

    this.nodeGeometry = new THREE.BufferGeometry();
    this.nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.nodeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.nodeMaterial = new THREE.PointsMaterial({
      size: 5.2,
      map: this.nodeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(this.nodeGeometry, this.nodeMaterial);
    this.group.add(this.points);
  }

  initLines() {
    // Maximum possible connections between nodes
    const maxConnections = this.nodeCount * 4;
    this.linePositions = new Float32Array(maxConnections * 2 * 3);
    this.lineColors = new Float32Array(maxConnections * 2 * 3);

    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.lineGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    this.lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.lines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.group.add(this.lines);
  }

  update(time, delta = 0.016) {
    const positions = this.nodeGeometry.attributes.position.array;
    const colors = this.nodeGeometry.attributes.color.array;

    // 1. Update node positions with gentle floating drift and pulsing brightness
    for (let i = 0; i < this.nodeCount; i++) {
      const data = this.nodeData[i];

      // Subtle organic floating oscillation around base position
      const floatAmp = 2.4;
      const xOffset = Math.sin(time * 0.8 + data.phase) * floatAmp;
      const yOffset = Math.cos(time * 0.7 + data.phase * 1.2) * floatAmp;
      const zOffset = Math.sin(time * 0.9 + data.phase * 0.8) * floatAmp;

      data.currentPos.x = data.basePos.x + xOffset;
      data.currentPos.y = data.basePos.y + yOffset;
      data.currentPos.z = data.basePos.z + zOffset;

      positions[i * 3] = data.currentPos.x;
      positions[i * 3 + 1] = data.currentPos.y;
      positions[i * 3 + 2] = data.currentPos.z;

      // Pulsing brightness: idle -> subtle glow -> slightly brighter -> fade
      const pulse = 0.55 + 0.45 * Math.sin(time * data.pulseSpeed + data.phase);
      const intensity = data.isHub ? 0.7 + 0.3 * pulse : 0.4 + 0.6 * pulse;

      colors[i * 3] = data.baseColor.r * intensity;
      colors[i * 3 + 1] = data.baseColor.g * intensity;
      colors[i * 3 + 2] = data.baseColor.b * intensity;
    }

    this.nodeGeometry.attributes.position.needsUpdate = true;
    this.nodeGeometry.attributes.color.needsUpdate = true;

    // 2. Compute dynamic synaptic connections based on current proximity
    let lineIndex = 0;
    const maxDistance = 38;
    const maxConnections = this.nodeCount * 4;

    const baseColor = new THREE.Color(this.goldHex);

    for (let i = 0; i < this.nodeCount; i++) {
      for (let j = i + 1; j < this.nodeCount; j++) {
        if (lineIndex / 6 >= maxConnections) break;

        const p1 = this.nodeData[i].currentPos;
        const p2 = this.nodeData[j].currentPos;
        const dist = p1.distanceTo(p2);

        if (dist < maxDistance) {
          // Opacity falls off gracefully with distance
          const alpha = (1 - dist / maxDistance) * 0.38;

          // Point A
          this.linePositions[lineIndex] = p1.x;
          this.linePositions[lineIndex + 1] = p1.y;
          this.linePositions[lineIndex + 2] = p1.z;

          this.lineColors[lineIndex] = baseColor.r * alpha;
          this.lineColors[lineIndex + 1] = baseColor.g * alpha;
          this.lineColors[lineIndex + 2] = baseColor.b * alpha;

          // Point B
          this.linePositions[lineIndex + 3] = p2.x;
          this.linePositions[lineIndex + 4] = p2.y;
          this.linePositions[lineIndex + 5] = p2.z;

          this.lineColors[lineIndex + 3] = baseColor.r * alpha;
          this.lineColors[lineIndex + 4] = baseColor.g * alpha;
          this.lineColors[lineIndex + 5] = baseColor.b * alpha;

          lineIndex += 6;
        }
      }
    }

    // Clear unused line vertices
    for (let k = lineIndex; k < this.linePositions.length; k++) {
      this.linePositions[k] = 0;
      this.lineColors[k] = 0;
    }

    this.lineGeometry.setDrawRange(0, lineIndex / 3);
    this.lineGeometry.attributes.position.needsUpdate = true;
    this.lineGeometry.attributes.color.needsUpdate = true;
  }

  dispose() {
    if (this.nodeGeometry) this.nodeGeometry.dispose();
    if (this.nodeMaterial) this.nodeMaterial.dispose();
    if (this.lineGeometry) this.lineGeometry.dispose();
    if (this.lineMaterial) this.lineMaterial.dispose();
    if (this.nodeTexture) this.nodeTexture.dispose();
    if (this.group && this.scene) this.scene.remove(this.group);
  }
}
