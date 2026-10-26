import * as THREE from 'three';

/**
 * Generates an authentic clinical ECG / cardiac rhythm waveform on an orbital path around the sphere.
 * Follows P wave -> PR interval -> QRS spike -> ST segment -> T wave.
 */
function generateECGPoints(radius = 80, segments = 180) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Normalized 0 -> 1 along the circumference
    const t = (i / segments);

    let deviation = 0;
    // ECG pulse pattern repeats across one half of the orbit, baseline on the other
    if (t >= 0.15 && t <= 0.45) {
      const u = (t - 0.15) / 0.30; // normalized 0..1 in heartbeat region
      if (u >= 0.10 && u < 0.22) {
        // P-wave (smooth gentle rise)
        deviation = Math.sin((u - 0.10) / 0.12 * Math.PI) * 4.5;
      } else if (u >= 0.32 && u < 0.37) {
        // Q-drop
        deviation = -Math.sin((u - 0.32) / 0.05 * Math.PI) * 3.5;
      } else if (u >= 0.37 && u < 0.45) {
        // R-spike (sharp peak)
        deviation = Math.sin((u - 0.37) / 0.08 * Math.PI) * 16.0;
      } else if (u >= 0.45 && u < 0.50) {
        // S-drop
        deviation = -Math.sin((u - 0.45) / 0.05 * Math.PI) * 5.0;
      } else if (u >= 0.65 && u < 0.82) {
        // T-wave (smooth rounded peak)
        deviation = Math.sin((u - 0.65) / 0.17 * Math.PI) * 6.5;
      }
    }

    const currentR = radius + deviation;
    // Slightly inclined circular orbit (22 degrees)
    const x = currentR * Math.cos(angle);
    const y = currentR * Math.sin(angle) * Math.sin(THREE.MathUtils.degToRad(22));
    const z = currentR * Math.sin(angle) * Math.cos(THREE.MathUtils.degToRad(22));

    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

/**
 * MedicalSignal:
 * Adds high-precision medical & diagnostic AI cues:
 * - 3D Cardiac ECG rhythm orbit with an active diagnostic data pulse point
 * - Dual holographic scanning reticle rings
 * - Inner faceted biomarker nucleus core
 */
export class MedicalSignal {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.radius = options.radius || 76;
    this.isDark = options.isDark !== false;
    this.goldHex = this.isDark ? 0xd8b472 : 0xb8860b;
    this.lightGoldHex = this.isDark ? 0xe5c180 : 0xd4af37;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.initECGWave();
    this.initPulseBeacon();
    this.initScanningRings();
    this.initBiomarkerCore();
  }

  initECGWave() {
    this.ecgPoints = generateECGPoints(this.radius * 1.05, 180);
    const geometry = new THREE.BufferGeometry().setFromPoints(this.ecgPoints);

    const material = new THREE.LineBasicMaterial({
      color: this.goldHex,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.ecgLine = new THREE.Line(geometry, material);
    this.group.add(this.ecgLine);
  }

  initPulseBeacon() {
    // Glowing diagnostic data point that travels continuously along the ECG waveform
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, '#f5d282');
    grad.addColorStop(0.55, 'rgba(216, 180, 114, 0.7)');
    grad.addColorStop(1, 'rgba(216, 180, 114, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    this.beaconTexture = new THREE.CanvasTexture(canvas);

    const beaconGeo = new THREE.BufferGeometry();
    beaconGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));

    this.beaconMat = new THREE.PointsMaterial({
      size: 9.0,
      map: this.beaconTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.beacon = new THREE.Points(beaconGeo, this.beaconMat);
    this.group.add(this.beacon);
  }

  initScanningRings() {
    this.ringsGroup = new THREE.Group();
    this.group.add(this.ringsGroup);

    // Ring 1: Latitude diagnostic scanner ring
    const ring1Geo = new THREE.RingGeometry(this.radius * 0.98, this.radius * 1.01, 72);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: this.lightGoldHex,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI / 3;
    this.ring1.rotation.y = Math.PI / 8;
    this.ringsGroup.add(this.ring1);

    // Ring 2: Polar orbital ring with subtle sensor tick markers
    const ring2Points = [];
    const segments = 64;
    const r2 = this.radius * 1.12;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      ring2Points.push(new THREE.Vector3(r2 * Math.cos(a), 0, r2 * Math.sin(a)));
    }
    const ring2Geo = new THREE.BufferGeometry().setFromPoints(ring2Points);
    const ring2Mat = new THREE.LineBasicMaterial({
      color: this.goldHex,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    this.ring2 = new THREE.Line(ring2Geo, ring2Mat);
    this.ring2.rotation.x = -Math.PI / 4;
    this.ring2.rotation.z = Math.PI / 6;
    this.ringsGroup.add(this.ring2);
  }

  initBiomarkerCore() {
    // Inner faceted nucleus representing AI clinical data processing core
    const coreGeo = new THREE.IcosahedronGeometry(this.radius * 0.42, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: this.goldHex,
      wireframe: true,
      transparent: true,
      opacity: 0.10,
      blending: THREE.AdditiveBlending
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);
  }

  update(time, delta = 0.016) {
    // 1. Move pulse beacon along ECG trajectory
    if (this.ecgPoints && this.ecgPoints.length > 0) {
      // Speed: completes orbit every ~4.5 seconds (calm healthy cardiac rhythm)
      const loopTime = 4.5;
      const progress = (time % loopTime) / loopTime;
      const pointIndex = Math.floor(progress * (this.ecgPoints.length - 1));
      const pt = this.ecgPoints[pointIndex];

      if (pt) {
        const posArray = this.beacon.geometry.attributes.position.array;
        posArray[0] = pt.x;
        posArray[1] = pt.y;
        posArray[2] = pt.z;
        this.beacon.geometry.attributes.position.needsUpdate = true;

        // Subtle beacon pulse size
        this.beaconMat.size = 7.5 + Math.sin(time * 5.0) * 2.0;
      }
    }

    // 2. Slow counter-rotation of diagnostic scanner rings
    if (this.ring1) {
      this.ring1.rotation.z += 0.0022;
    }
    if (this.ring2) {
      this.ring2.rotation.y -= 0.0018;
    }

    // 3. Inner core gentle breathing & counter-rotation
    if (this.coreMesh) {
      this.coreMesh.rotation.y -= 0.0035;
      this.coreMesh.rotation.x += 0.0015;
      const breath = 1.0 + Math.sin(time * 1.2) * 0.04;
      this.coreMesh.scale.set(breath, breath, breath);
    }
  }

  dispose() {
    if (this.ecgLine && this.ecgLine.geometry) this.ecgLine.geometry.dispose();
    if (this.ecgLine && this.ecgLine.material) this.ecgLine.material.dispose();
    if (this.beacon && this.beacon.geometry) this.beacon.geometry.dispose();
    if (this.beaconMat) this.beaconMat.dispose();
    if (this.beaconTexture) this.beaconTexture.dispose();
    if (this.ring1 && this.ring1.geometry) this.ring1.geometry.dispose();
    if (this.ring1 && this.ring1.material) this.ring1.material.dispose();
    if (this.ring2 && this.ring2.geometry) this.ring2.geometry.dispose();
    if (this.ring2 && this.ring2.material) this.ring2.material.dispose();
    if (this.coreMesh && this.coreMesh.geometry) this.coreMesh.geometry.dispose();
    if (this.coreMesh && this.coreMesh.material) this.coreMesh.material.dispose();
    if (this.group && this.scene) this.scene.remove(this.group);
  }
}
