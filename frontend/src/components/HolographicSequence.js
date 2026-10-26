import * as THREE from 'three';

/**
 * HolographicSequence:
 * Orchestrates the complete cinematic 5-step AI Medical Air Transport & Diagnostic Core sequence:
 * STEP 1 (0-7s): Aircraft Appears in distance ("AI MEDICAL RESPONSE")
 * STEP 2 (7-13s): Medical Data Activation ("CONNECTING..." -> "PATIENT DATA RECEIVED") + Data stream particles
 * STEP 3 (13-16s): Aircraft Scans 3D Heart ("AI CARDIAC ANALYSIS" -> "ANALYZING HEART RISK...")
 * STEP 4 (16-21s): Major Surprise Reveal ("HEART RISK PREDICTION SYSTEM" -> "MEDICAL DIAGNOSIS")
 * STEP 5 (21-25s): Aircraft Departure (banks, accelerates into background, trails fade)
 * (25-28s): Ambient resting pause before automatic seamless repeat
 */
export class HolographicSequence {
  constructor(scene, camera, medicalHeart, medicalAircraft, options = {}) {
    this.scene = scene;
    this.camera = camera;
    this.heart = medicalHeart;
    this.aircraft = medicalAircraft;
    this.isDark = options.isDark !== false;

    // Loop cycle duration (approx 27.5s + small organic jitter)
    this.cycleDuration = 27.5;
    this.elapsed = 0;
    this.jitter = (Math.random() - 0.5) * 0.8;

    // Sequence state values
    this.state = {
      step: 0,
      active: false,
      statusBadge: '',
      telemetryText: '',
      revealMode: 'NONE', // 'NONE' | 'HEART' | 'MEDICAL'
      aircraftScreenX: -999,
      aircraftScreenY: -999,
      aircraftVisible: false
    };

    this.initFlightPath();
    this.initDataStream();
  }

  initFlightPath() {
    // 3D Waypoints for the Catmull-Rom flight trajectory
    // Ensures the aircraft enters from upper-right background, arcs gracefully toward the
    // diagnostic core flank (safely clear of center hero text), hovers to scan, and departs.
    this.waypoints = [
      new THREE.Vector3(210, 85, -170), // Entry point (distant upper-right)
      new THREE.Vector3(145, 65, -95),  // Descending approach
      new THREE.Vector3(88, 44, -25),   // Approach flank
      new THREE.Vector3(56, 32, 28),    // Telemetry transmission zone
      new THREE.Vector3(48, 28, 38),    // Scanning hover point
      new THREE.Vector3(52, 33, 34),    // Reveal observation hover
      new THREE.Vector3(32, 46, 12),    // Breakaway climb
      new THREE.Vector3(-75, 78, -85),  // Departure bank
      new THREE.Vector3(-240, 115, -230) // Far distant exit
    ];

    this.curve = new THREE.CatmullRomCurve3(this.waypoints, false, 'catmullrom', 0.45);
  }

  initDataStream() {
    // Glowing golden telemetry data packets streaming from the aircraft into the 3D heart
    this.streamCount = 55;
    this.streamParticles = [];
    const positions = new Float32Array(this.streamCount * 3);
    const colors = new Float32Array(this.streamCount * 3);

    const gold = new THREE.Color(0xf5d282);
    const brightWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < this.streamCount; i++) {
      const col = Math.random() > 0.35 ? gold : brightWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      this.streamParticles.push({
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.45,
        curveOffset: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 14
        ),
        active: false
      });
    }

    this.streamGeom = new THREE.BufferGeometry();
    this.streamGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.streamGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.streamMat = new THREE.PointsMaterial({
      size: 3.8,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.streamMesh = new THREE.Points(this.streamGeom, this.streamMat);
    this.scene.add(this.streamMesh);
  }

  update(time, delta, containerWidth, containerHeight, mouseCoords = { x: 0, y: 0 }) {
    this.elapsed += delta;
    if (this.elapsed >= (this.cycleDuration + this.jitter)) {
      this.elapsed = 0;
      this.jitter = (Math.random() - 0.5) * 0.8;
    }

    const t = this.elapsed;

    // Reset temporary intensities
    let scanActive = false;
    let revealMode = 'NONE';
    let heartScanIntensity = 0;
    let heartRevealIntensity = 0;
    let streamActive = false;
    let aircraftOpacity = 0;

    // --- STEP 1: Ambient (0-4s) & Aircraft Appearance (4-7s) ---
    if (t < 4.0) {
      this.state.step = 0;
      this.state.statusBadge = '';
      this.state.telemetryText = '';
      this.state.active = false;
      this.aircraft.setOpacity(0);
    } else if (t >= 4.0 && t < 7.5) {
      this.state.step = 1;
      this.state.active = true;
      this.state.statusBadge = '✦ AI MEDICAL RESPONSE';
      this.state.telemetryText = 'EVAC-01 • INBOUND EN ROUTE';

      // Flight progression along entry leg (0.0 to 0.22 along spline)
      const u = (t - 4.0) / 3.5;
      const progress = u * 0.22;
      aircraftOpacity = Math.min(1.0, u * 1.5);

      this.positionAircraftOnCurve(progress, mouseCoords);
    }
    // --- STEP 2: Medical Data Activation (7.5-13.0s) ---
    else if (t >= 7.5 && t < 13.0) {
      this.state.step = 2;
      this.state.active = true;
      aircraftOpacity = 1.0;
      streamActive = true;

      if (t < 10.0) {
        this.state.statusBadge = 'AI DATA LINK ACTIVE';
        this.state.telemetryText = 'CONNECTING TO DIAGNOSTIC ENGINE...';
      } else {
        this.state.statusBadge = 'TELEMETRY SYNCED';
        this.state.telemetryText = 'PATIENT DATA RECEIVED [AES-256]';
      }

      // Approach path (0.22 to 0.48 along spline)
      const u = (t - 7.5) / 5.5;
      const progress = 0.22 + u * 0.26;
      this.positionAircraftOnCurve(progress, mouseCoords);
    }
    // --- STEP 3: Aircraft Scans the Heart (13.0-16.5s) ---
    else if (t >= 13.0 && t < 16.5) {
      this.state.step = 3;
      this.state.active = true;
      aircraftOpacity = 1.0;
      scanActive = true;
      streamActive = true;

      const scanSubTime = t - 13.0;
      if (scanSubTime < 1.8) {
        this.state.statusBadge = 'AI CARDIAC ANALYSIS';
        this.state.telemetryText = 'INITIALIZING MULTI-SPECTRAL SCAN...';
      } else {
        this.state.statusBadge = 'CARDIAC TELEMETRY';
        this.state.telemetryText = 'ANALYZING HEART RISK & BIOMARKERS...';
      }

      // Hover / orbital scan arc (0.48 to 0.54)
      const u = scanSubTime / 3.5;
      const progress = 0.48 + u * 0.06;
      this.positionAircraftOnCurve(progress, mouseCoords, true);

      // Trigger cardiac scan response
      heartScanIntensity = Math.min(1.0, scanSubTime * 1.2);
    }
    // --- STEP 4: Major Surprise Reveal (16.5-21.5s) ---
    else if (t >= 16.5 && t < 21.5) {
      this.state.step = 4;
      this.state.active = true;
      aircraftOpacity = 1.0;
      heartRevealIntensity = 1.0;

      if (t < 19.0) {
        revealMode = 'HEART';
        this.state.statusBadge = '✦ NEURAL ASSESSMENT COMPLETE';
        this.state.telemetryText = 'CARDIOVASCULAR TELEMETRY DECODED';
      } else {
        revealMode = 'MEDICAL';
        this.state.statusBadge = '✦ CLINICAL INFERENCE ACTIVE';
        this.state.telemetryText = 'MULTI-DISEASE DIAGNOSTIC ACTIVE';
      }

      // Holding pattern observation hover (0.54 to 0.60)
      const u = (t - 16.5) / 5.0;
      const progress = 0.54 + u * 0.06;
      this.positionAircraftOnCurve(progress, mouseCoords, true);
    }
    // --- STEP 5: Aircraft Departure (21.5-25.5s) ---
    else if (t >= 21.5 && t < 25.5) {
      this.state.step = 5;
      this.state.active = true;
      this.state.statusBadge = 'MISSION COMPLETE';
      this.state.telemetryText = 'RETURNING TO AMBIENT SURVEILLANCE';

      // Acceleration out into distant background (0.60 to 1.0)
      const u = (t - 21.5) / 4.0;
      const progress = 0.60 + Math.pow(u, 1.35) * 0.40;
      aircraftOpacity = Math.max(0, 1.0 - Math.pow(u, 1.5));

      this.positionAircraftOnCurve(progress, mouseCoords);
    }
    // --- Ambient Cooldown (25.5-28s) ---
    else {
      this.state.step = 0;
      this.state.active = false;
      this.state.statusBadge = '';
      this.state.telemetryText = '';
      aircraftOpacity = 0;
    }

    // Apply Opacity & Scan
    this.aircraft.setOpacity(aircraftOpacity);
    this.aircraft.setScanning(scanActive, new THREE.Vector3(0, -2, 0), heartScanIntensity);

    // Apply Heart State
    this.heart.setScanning(scanActive, heartScanIntensity);
    this.heart.setReveal(revealMode !== 'NONE', heartRevealIntensity);
    this.state.revealMode = revealMode;

    // Update Data Stream Particles
    this.updateDataStream(delta, streamActive);

    // Project aircraft position to 2D screen coordinates for HUD tracking pill
    if (aircraftOpacity > 0.1 && containerWidth > 0 && containerHeight > 0) {
      const worldPos = new THREE.Vector3();
      this.aircraft.group.getWorldPosition(worldPos);

      // Elevated tag position above aircraft cockpit
      worldPos.y += 14;

      const screenPos = worldPos.clone().project(this.camera);
      this.state.aircraftScreenX = ((screenPos.x + 1) * 0.5) * containerWidth;
      this.state.aircraftScreenY = ((-screenPos.y + 1) * 0.5) * containerHeight;
      this.state.aircraftVisible = screenPos.z < 1.0;
    } else {
      this.state.aircraftVisible = false;
    }
  }

  positionAircraftOnCurve(progress, mouseCoords, isHovering = false) {
    const clampedU = Math.max(0, Math.min(1, progress));
    const point = this.curve.getPoint(clampedU);

    // Look slightly ahead on spline to calculate flight tangent orientation
    const aheadU = Math.min(1.0, clampedU + 0.015);
    const aheadPoint = this.curve.getPoint(aheadU);
    const tangent = new THREE.Vector3().subVectors(aheadPoint, point).normalize();

    // Mouse influence (gentle reactive shift)
    const mx = (mouseCoords?.x || 0) * 12.0;
    const my = (mouseCoords?.y || 0) * 8.0;

    // Gentle hover bobbing
    const bob = isHovering ? Math.sin(this.elapsed * 3.5) * 1.5 : 0;

    this.aircraft.group.position.set(
      point.x + mx,
      point.y + my + bob,
      point.z
    );

    // Align aircraft forward direction with flight path tangent
    if (tangent.lengthSq() > 0.001) {
      const targetLook = new THREE.Vector3().addVectors(this.aircraft.group.position, tangent);
      this.aircraft.group.lookAt(targetLook);

      // Natural banking into turns
      const lateralTurn = -tangent.x * 0.35;
      const mouseBank = (mouseCoords?.x || 0) * 0.18;
      this.aircraft.airframeGroup.rotation.z = lateralTurn + mouseBank;

      // Pitch angle
      const forwardPitch = isHovering ? 0.08 : (tangent.y * 0.45);
      this.aircraft.airframeGroup.rotation.x = forwardPitch;
    }
  }

  updateDataStream(delta, active) {
    const positions = this.streamGeom.attributes.position.array;

    if (active && this.aircraft.group.visible) {
      const emitterPos = new THREE.Vector3();
      this.aircraft.group.getWorldPosition(emitterPos);
      const heartPos = new THREE.Vector3(0, -2, 0);

      this.streamMat.opacity = Math.min(0.75, this.streamMat.opacity + delta * 2.5);

      for (let i = 0; i < this.streamCount; i++) {
        const p = this.streamParticles[i];
        p.progress += delta * p.speed;
        if (p.progress > 1.0) {
          p.progress = 0;
        }

        const u = p.progress;
        // Bezier interpolation from aircraft to heart
        const midPoint = new THREE.Vector3()
          .lerpVectors(emitterPos, heartPos, 0.5)
          .add(p.curveOffset);

        const currentPos = new THREE.Vector3()
          .lerpVectors(
            new THREE.Vector3().lerpVectors(emitterPos, midPoint, u),
            new THREE.Vector3().lerpVectors(midPoint, heartPos, u),
            u
          );

        positions[i * 3] = currentPos.x;
        positions[i * 3 + 1] = currentPos.y;
        positions[i * 3 + 2] = currentPos.z;
      }
      this.streamGeom.attributes.position.needsUpdate = true;
    } else {
      this.streamMat.opacity = Math.max(0, this.streamMat.opacity - delta * 3.0);
    }
  }

  getState() {
    return this.state;
  }

  dispose() {
    this.scene.remove(this.streamMesh);
    if (this.streamGeom) this.streamGeom.dispose();
    if (this.streamMat) this.streamMat.dispose();
  }
}
