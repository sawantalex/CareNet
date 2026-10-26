import * as THREE from 'three';

/**
 * Procedural Futuristic AI Aeromedical Rotorcraft / Emergency Aircraft
 * Features:
 * - Sleek carbon-composite fuselage with metallic gold diagnostic livery
 * - Glassmorphic cockpit canopy with HUD reflections
 * - Dual spinning counter-rotating main rotors with high-speed motion blur disc
 * - Enclosed ducted tail rotor (fenestron) & angled stabilizers
 * - Authentic aviation lighting (port red, starboard green, flashing white strobe, amber beacon)
 * - Emblazoned glowing emergency medical cross insignias
 * - Underside medical scanning gimbal with dynamic golden laser beam & volumetric cone
 * - Real-time golden telemetry data particle trail
 */
export class MedicalAircraft {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.isDark = options.isDark !== false;
    this.scale = options.scale || 0.72;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Initial hidden state
    this.group.visible = false;
    this.group.scale.set(this.scale, this.scale, this.scale);

    this.goldColor = new THREE.Color(this.isDark ? 0xd8b472 : 0xb8860b);
    this.lightGoldColor = new THREE.Color(0xf5d282);
    this.carbonColor = new THREE.Color(0x0e141e);
    this.canopyColor = new THREE.Color(0x0ea5e9);

    this.materials = [];
    this.scanningActive = false;
    this.scanTarget = new THREE.Vector3(0, 0, 0);
    this.scanIntensity = 0;
    this.opacity = 1.0;

    this.buildAirframe();
    this.buildRotors();
    this.buildAvionicsAndLighting();
    this.buildMedicalInsignia();
    this.buildScanningGimbal();
    this.buildDataTrail();
  }

  registerMaterial(mat) {
    this.materials.push(mat);
    return mat;
  }

  buildAirframe() {
    this.airframeGroup = new THREE.Group();
    this.group.add(this.airframeGroup);

    // 1. Main Fuselage Cabin (Aerodynamic contoured hull)
    const cabinGeom = new THREE.CylinderGeometry(2.4, 3.4, 15, 16);
    const cabinMat = this.registerMaterial(new THREE.MeshStandardMaterial({
      color: this.carbonColor,
      roughness: 0.35,
      metalness: 0.85,
      transparent: true,
      opacity: 1.0
    }));
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.rotation.x = Math.PI / 2;
    this.airframeGroup.add(cabin);

    // 2. Streamlined Forward Cockpit Nose
    const noseGeom = new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const nose = new THREE.Mesh(noseGeom, cabinMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 7.5;
    this.airframeGroup.add(nose);

    // 3. Cockpit Canopy Glass (High-gloss tinted medical HUD glass)
    const canopyGeom = new THREE.SphereGeometry(2.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.3);
    const canopyMat = this.registerMaterial(new THREE.MeshPhysicalMaterial({
      color: this.canopyColor,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75,
      transmission: 0.5,
      ior: 1.45
    }));
    const canopy = new THREE.Mesh(canopyGeom, canopyMat);
    canopy.rotation.x = -Math.PI / 2.2;
    canopy.position.set(0, 0.8, 6.2);
    canopy.scale.set(0.95, 1.35, 1.15);
    this.airframeGroup.add(canopy);

    // 4. Gold Architectural Accent Trim Ribbons
    const trimMat = this.registerMaterial(new THREE.MeshStandardMaterial({
      color: this.goldColor,
      roughness: 0.2,
      metalness: 0.95,
      emissive: this.goldColor,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 1.0
    }));

    const ribGeom = new THREE.TorusGeometry(3.1, 0.18, 8, 24);
    const rib1 = new THREE.Mesh(ribGeom, trimMat);
    rib1.position.z = 1.5;
    this.airframeGroup.add(rib1);

    const rib2 = new THREE.Mesh(ribGeom, trimMat);
    rib2.position.z = -3.5;
    rib2.scale.set(0.9, 0.9, 1);
    this.airframeGroup.add(rib2);

    // 5. Tail Boom (Tapered structural boom)
    const boomGeom = new THREE.CylinderGeometry(0.8, 2.0, 16, 12);
    const boom = new THREE.Mesh(boomGeom, cabinMat);
    boom.rotation.x = Math.PI / 2;
    boom.position.set(0, 0.6, -14.5);
    this.airframeGroup.add(boom);

    // 6. Angled Dual V-Stabilizer Tail Fins
    const finGeom = new THREE.BoxGeometry(0.25, 5.5, 3.2);
    const leftFin = new THREE.Mesh(finGeom, cabinMat);
    leftFin.position.set(-1.8, 2.5, -21.5);
    leftFin.rotation.z = Math.PI / 6;
    this.airframeGroup.add(leftFin);

    const rightFin = new THREE.Mesh(finGeom, cabinMat);
    rightFin.position.set(1.8, 2.5, -21.5);
    rightFin.rotation.z = -Math.PI / 6;
    this.airframeGroup.add(rightFin);

    // Gold tip caps on vertical fins
    const tipGeom = new THREE.BoxGeometry(0.28, 0.9, 3.25);
    const leftTip = new THREE.Mesh(tipGeom, trimMat);
    leftTip.position.set(-2.8, 4.8, -21.5);
    this.airframeGroup.add(leftTip);

    const rightTip = new THREE.Mesh(tipGeom, trimMat);
    rightTip.position.set(2.8, 4.8, -21.5);
    this.airframeGroup.add(rightTip);

    // 7. Side Sponsons / Life-Support Avionics Pods
    const sponsonGeom = new THREE.CylinderGeometry(0.9, 1.3, 8.5, 12);
    const leftSponson = new THREE.Mesh(sponsonGeom, cabinMat);
    leftSponson.rotation.x = Math.PI / 2;
    leftSponson.position.set(-3.5, -0.6, 1.0);
    this.airframeGroup.add(leftSponson);

    const rightSponson = new THREE.Mesh(sponsonGeom, cabinMat);
    rightSponson.rotation.x = Math.PI / 2;
    rightSponson.position.set(3.5, -0.6, 1.0);
    this.airframeGroup.add(rightSponson);
  }

  buildRotors() {
    this.rotorMast = new THREE.Group();
    this.rotorMast.position.set(0, 3.2, 1.5);
    this.group.add(this.rotorMast);

    const mastGeom = new THREE.CylinderGeometry(0.45, 0.55, 1.8, 12);
    const metalMat = this.registerMaterial(new THREE.MeshStandardMaterial({
      color: 0x556070,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 1.0
    }));
    const mast = new THREE.Mesh(mastGeom, metalMat);
    this.rotorMast.add(mast);

    // 1. Rotating Blade Assembly (Upper main rotor)
    this.mainRotorGroup = new THREE.Group();
    this.mainRotorGroup.position.set(0, 1.0, 0);
    this.rotorMast.add(this.mainRotorGroup);

    const bladeGeom = new THREE.BoxGeometry(19.0, 0.12, 0.9);
    const bladeMat = this.registerMaterial(new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.95
    }));
    const blade1 = new THREE.Mesh(bladeGeom, bladeMat);
    this.mainRotorGroup.add(blade1);

    const blade2 = new THREE.Mesh(bladeGeom, bladeMat);
    blade2.rotation.y = Math.PI / 2;
    this.mainRotorGroup.add(blade2);

    // 2. High-Speed Rotor Motion Blur Disc
    const blurGeom = new THREE.RingGeometry(1.2, 10.0, 36);
    const blurMat = this.registerMaterial(new THREE.MeshBasicMaterial({
      color: this.goldColor,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    const blurDisc = new THREE.Mesh(blurGeom, blurMat);
    blurDisc.rotation.x = Math.PI / 2;
    this.mainRotorGroup.add(blurDisc);

    // 3. Enclosed Ducted Tail Rotor (Fenestron)
    this.tailFanGroup = new THREE.Group();
    this.tailFanGroup.position.set(0, 1.6, -21.8);
    this.group.add(this.tailFanGroup);

    const shroudGeom = new THREE.TorusGeometry(1.5, 0.3, 8, 24);
    const shroud = new THREE.Mesh(shroudGeom, metalMat);
    shroud.rotation.y = Math.PI / 2;
    this.tailFanGroup.add(shroud);

    this.tailBlades = new THREE.Group();
    const fanBladeGeom = new THREE.BoxGeometry(0.1, 2.6, 0.4);
    for (let i = 0; i < 4; i++) {
      const fb = new THREE.Mesh(fanBladeGeom, bladeMat);
      fb.rotation.x = (i / 4) * Math.PI;
      this.tailBlades.add(fb);
    }
    this.tailFanGroup.add(this.tailBlades);
  }

  buildAvionicsAndLighting() {
    // 1. Port Navigation Beacon (Red, left sponson tip)
    const navRedMat = this.registerMaterial(new THREE.MeshBasicMaterial({ color: 0xff2b4f }));
    const navRed = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), navRedMat);
    navRed.position.set(-4.2, -0.6, 5.0);
    this.group.add(navRed);

    // 2. Starboard Navigation Beacon (Emerald green, right sponson tip)
    const navGreenMat = this.registerMaterial(new THREE.MeshBasicMaterial({ color: 0x00f076 }));
    const navGreen = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), navGreenMat);
    navGreen.position.set(4.2, -0.6, 5.0);
    this.group.add(navGreen);

    // 3. Diamond White Flashing Tail Strobe
    this.strobeMat = this.registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0 }));
    this.tailStrobe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), this.strobeMat);
    this.tailStrobe.position.set(0, 4.8, -22.5);
    this.group.add(this.tailStrobe);

    // 4. Amber Anti-Collision Beacon (Top mast & belly)
    this.beaconMat = this.registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffb300, transparent: true, opacity: 1.0 }));
    const topBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), this.beaconMat);
    topBeacon.position.set(0, 4.4, 1.5);
    this.group.add(topBeacon);

    const bellyBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), this.beaconMat);
    bellyBeacon.position.set(0, -3.2, 1.0);
    this.group.add(bellyBeacon);
  }

  buildMedicalInsignia() {
    // Glowing medical emergency cross (+) emblazoned on port and starboard sides
    const crossMat = this.registerMaterial(new THREE.MeshBasicMaterial({
      color: 0xfff0c8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    }));

    // Create '+' geometry: horizontal bar and vertical bar
    const createCross = () => {
      const g = new THREE.Group();
      const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.65, 0.15), crossMat);
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.0, 0.15), crossMat);
      g.add(hBar);
      g.add(vBar);
      return g;
    };

    const leftCross = createCross();
    leftCross.position.set(-3.52, 0.2, 0.5);
    leftCross.rotation.y = -Math.PI / 2;
    this.group.add(leftCross);

    const rightCross = createCross();
    rightCross.position.set(3.52, 0.2, 0.5);
    rightCross.rotation.y = Math.PI / 2;
    this.group.add(rightCross);
  }

  buildScanningGimbal() {
    this.gimbalGroup = new THREE.Group();
    this.gimbalGroup.position.set(0, -2.8, 5.5);
    this.group.add(this.gimbalGroup);

    // Sensor ball
    const sensorGeom = new THREE.SphereGeometry(1.0, 12, 12);
    const sensorMat = this.registerMaterial(new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.9,
      roughness: 0.2
    }));
    const sensorBall = new THREE.Mesh(sensorGeom, sensorMat);
    this.gimbalGroup.add(sensorBall);

    // Forward laser lens
    const lensGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 12);
    const lensMat = this.registerMaterial(new THREE.MeshBasicMaterial({
      color: this.lightGoldColor,
      blending: THREE.AdditiveBlending
    }));
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.8;
    this.gimbalGroup.add(lens);

    // Volumetric Scanning Laser Beam (points to the 3D heart)
    // Constructed using a dynamic cylinder with pivot at aircraft emitter
    this.beamGroup = new THREE.Group();
    this.scene.add(this.beamGroup); // Added to scene so it spans world space cleanly
    this.beamGroup.visible = false;

    // Laser core line
    const beamLineGeom = new THREE.CylinderGeometry(0.3, 0.8, 1, 8, 1, true);
    this.beamCoreMat = this.registerMaterial(new THREE.MeshBasicMaterial({
      color: 0xfff5dd,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    this.beamCore = new THREE.Mesh(beamLineGeom, this.beamCoreMat);
    this.beamGroup.add(this.beamCore);

    // Soft Volumetric Cone Fan
    const coneGeom = new THREE.ConeGeometry(8.5, 1, 16, 1, true);
    this.coneMat = this.registerMaterial(new THREE.MeshBasicMaterial({
      color: this.goldColor,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    this.coneMesh = new THREE.Mesh(coneGeom, this.coneMat);
    this.beamGroup.add(this.coneMesh);
  }

  buildDataTrail() {
    // Golden telemetry data ribbon trailing the aircraft
    this.trailCount = 36;
    const positions = new Float32Array(this.trailCount * 3);
    const alphas = new Float32Array(this.trailCount);

    this.trailHistory = [];
    for (let i = 0; i < this.trailCount; i++) {
      this.trailHistory.push(new THREE.Vector3(0, 0, 0));
      alphas[i] = 1.0 - (i / this.trailCount);
    }

    this.trailGeom = new THREE.BufferGeometry();
    this.trailGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.trailMat = this.registerMaterial(new THREE.PointsMaterial({
      color: this.lightGoldColor,
      size: 3.2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));

    this.trailPoints = new THREE.Points(this.trailGeom, this.trailMat);
    this.scene.add(this.trailPoints);
  }

  setScanning(active, targetVector, intensity = 1.0) {
    this.scanningActive = active;
    if (targetVector) {
      this.scanTarget.copy(targetVector);
    }
    this.scanIntensity = active ? intensity : 0;
  }

  setOpacity(val) {
    this.opacity = Math.max(0, Math.min(1, val));
    for (let i = 0; i < this.materials.length; i++) {
      if (this.materials[i].transparent) {
        this.materials[i].opacity = this.materials[i].userData.baseOpacity !== undefined
          ? this.materials[i].userData.baseOpacity * this.opacity
          : this.opacity;
      }
    }
    this.group.visible = this.opacity > 0.01;
  }

  update(time, delta = 0.016) {
    // 1. High-Speed Rotor Rotations
    this.mainRotorGroup.rotation.y += delta * 32.0;
    this.tailBlades.rotation.x += delta * 45.0;

    // 2. Realistic Navigation Strobes (1.0s cycle)
    const strobeTime = (time % 1.0);
    // Double flash at top of second
    const isFlashing = (strobeTime < 0.07) || (strobeTime > 0.14 && strobeTime < 0.21);
    this.strobeMat.opacity = isFlashing ? 1.0 : 0.08;

    // Amber beacon slow pulse
    this.beaconMat.opacity = 0.35 + Math.sin(time * 6.0) * 0.65;

    // 3. Telemetry Data Trail Update
    if (this.group.visible && this.opacity > 0.2) {
      // World position of tail
      const tailWorldPos = new THREE.Vector3(0, 1.2, -18);
      tailWorldPos.applyMatrix4(this.group.matrixWorld);

      this.trailHistory.unshift(tailWorldPos.clone());
      if (this.trailHistory.length > this.trailCount) {
        this.trailHistory.pop();
      }

      const posArr = this.trailGeom.attributes.position.array;
      for (let i = 0; i < this.trailHistory.length; i++) {
        posArr[i * 3] = this.trailHistory[i].x;
        posArr[i * 3 + 1] = this.trailHistory[i].y;
        posArr[i * 3 + 2] = this.trailHistory[i].z;
      }
      this.trailGeom.attributes.position.needsUpdate = true;
      this.trailMat.opacity = 0.45 * this.opacity;
    } else {
      this.trailMat.opacity = 0;
    }

    // 4. Volumetric Scanning Laser Beam to Heart Target
    if (this.scanningActive && this.group.visible) {
      this.beamGroup.visible = true;

      const emitterPos = new THREE.Vector3();
      this.gimbalGroup.getWorldPosition(emitterPos);

      // Distance and orientation vector
      const sub = new THREE.Vector3().subVectors(this.scanTarget, emitterPos);
      const distance = sub.length();
      const midPoint = new THREE.Vector3().addVectors(emitterPos, this.scanTarget).multiplyScalar(0.5);

      // Position beam midpoint
      this.beamCore.position.copy(midPoint);
      this.beamCore.scale.set(1, distance, 1);
      this.beamCore.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sub.clone().normalize());

      // Volumetric scan cone
      this.coneMesh.position.copy(midPoint);
      this.coneMesh.scale.set(1, distance, 1);
      this.coneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sub.clone().normalize());

      // Scanning sweep pulsation
      const beamPulse = 0.65 + Math.sin(time * 18.0) * 0.35;
      this.beamCoreMat.opacity = 0.85 * this.scanIntensity * beamPulse;
      this.coneMat.opacity = 0.18 * this.scanIntensity * beamPulse;
    } else {
      this.beamGroup.visible = false;
      this.beamCoreMat.opacity = 0;
      this.coneMat.opacity = 0;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.scene.remove(this.beamGroup);
    this.scene.remove(this.trailPoints);

    for (let i = 0; i < this.materials.length; i++) {
      this.materials[i].dispose();
    }
    if (this.trailGeom) this.trailGeom.dispose();
  }
}
