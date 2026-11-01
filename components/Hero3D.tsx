"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment, Lightformer, Float, Center, ContactShadows,
  PerformanceMonitor, AdaptiveDpr,
} from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

type Ctrl = {
  dragging: boolean;
  yaw: number; pitch: number; vyaw: number; vpitch: number;
  hoverX: number; hoverY: number; hoverOn: boolean;
  mag: number;           // damped hover strength 0..1
  idle: number;          // time since release
  intro: number;         // seconds since mount
  split: number;         // -1 idle, else 0..1 progress
  shock: number;         // particle impulse to consume
  heroH: number;
};

const clamp = THREE.MathUtils.clamp;
const damp = THREE.MathUtils.damp;
const eoc = (x: number) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const eio = (x: number) => { const c = clamp(x, 0, 1); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };

function shapeFromPath(d: string) {
  const loader = new SVGLoader();
  const svg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  return SVGLoader.createShapes(svg.paths[0])[0];
}

const WHITE_D = "M29 0H80C109 0 126 15 138 42L157 96L54 272H0L110 96L96 59Q92 29 70 29H29Z";
const TEAL_D = "M165 114L211 234C222 259 245 240 242 223C240 211 234 204 224 202C256 195 282 223 277 249C273 278 238 289 210 278C190 273 181 256 175 240L139 167Z";

function LambdaMesh({ ctrl, mobile }: { ctrl: React.MutableRefObject<Ctrl>; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const white = useRef<THREE.Mesh>(null);
  const teal = useRef<THREE.Mesh>(null);
  const tealMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const whiteMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const t = useRef(0);

  const { whiteGeo, tealGeo } = useMemo(() => {
    const opts: THREE.ExtrudeGeometryOptions = {
      depth: 42, bevelEnabled: true, bevelThickness: 6, bevelSize: 5, bevelSegments: 6, curveSegments: 24,
    };
    // SVG paths are y-down: flip the geometry once so no group transform can undo it.
    // Negative scale inverts winding — swap each triangle's verts 1<->2 before recomputing normals.
    const flipY = (g: THREE.ExtrudeGeometry) => {
      g.scale(1, -1, 1);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i += 3) {
        for (let c = 0; c < 3; c++) {
          const a = p.getComponent(i + 1, c);
          p.setComponent(i + 1, c, p.getComponent(i + 2, c));
          p.setComponent(i + 2, c, a);
        }
      }
      g.computeVertexNormals();
    };
    const w = new THREE.ExtrudeGeometry(shapeFromPath(WHITE_D), opts);
    const tg = new THREE.ExtrudeGeometry(shapeFromPath(TEAL_D), opts);
    flipY(w);
    flipY(tg);
    const box = new THREE.Box3()
      .setFromBufferAttribute(w.attributes.position as THREE.BufferAttribute)
      .union(new THREE.Box3().setFromBufferAttribute(tg.attributes.position as THREE.BufferAttribute));
    const c = box.getCenter(new THREE.Vector3());
    w.translate(-c.x, -c.y, -c.z);
    tg.translate(-c.x, -c.y, -c.z);
    return { whiteGeo: w, tealGeo: tg };
  }, []);

  useFrame((_, delta) => {
    const c = ctrl.current;
    if (!group.current || !white.current || !teal.current) return;
    const dt = Math.min(delta, 0.05);
    t.current += dt;
    c.intro += dt;

    // --- intro assembly: fly together (~1.0s) then a 360° spin (~0.4s) ---
    const a = eoc(c.intro / 1.0);
    const spin = eio((c.intro - 1.0) / 0.4) * Math.PI * 2;
    white.current.position.set(-170 * (1 - a), 120 * (1 - a), -28 * (1 - a));
    teal.current.position.set(170 * (1 - a), -120 * (1 - a), 28 * (1 - a));
    const sc = 0.7 + 0.3 * a;
    white.current.scale.setScalar(sc);
    teal.current.scale.setScalar(sc);
    white.current.rotation.z = -0.5 * (1 - a);
    teal.current.rotation.z = 0.5 * (1 - a);
    const op = c.intro < 1.0 ? a : 1;
    if (whiteMat.current) { whiteMat.current.transparent = c.intro < 1.0; whiteMat.current.opacity = op; }
    if (tealMat.current) { tealMat.current.transparent = c.intro < 1.15; tealMat.current.opacity = op; }

    // --- split & reassemble (1.1s round trip): sideways/diagonal, small Z ---
    let sep = 0;
    if (c.split >= 0) {
      c.split += dt / 1.1;
      if (c.split >= 1) c.split = -1;
      else sep = Math.sin(Math.PI * Math.min(c.split, 1));
    }
    white.current.position.z += 28 * sep;
    white.current.position.x += -70 * sep;
    white.current.position.y += 70 * sep;
    teal.current.position.z += -28 * sep;
    teal.current.position.x += 70 * sep;
    teal.current.position.y += -70 * sep;
    white.current.rotation.z += 0.12 * sep;
    teal.current.rotation.z += -0.12 * sep;

    // --- hover magnet strength ---
    c.mag = damp(c.mag, c.hoverOn && !c.dragging ? 1 : 0, 5, dt);

    // --- drag inertia + ease back to sway after idle ---
    if (!c.dragging) {
      c.idle += dt;
      c.yaw += c.vyaw * dt;
      c.pitch = clamp(c.pitch + c.vpitch * dt, -0.5, 0.5);
      c.vyaw = damp(c.vyaw, 0, 2.2, dt);
      c.vpitch = damp(c.vpitch, 0, 2.2, dt);
      if (c.idle > 1.5) {
        c.yaw = damp(c.yaw, 0, 1.4, dt);
        c.pitch = damp(c.pitch, 0, 1.4, dt);
      }
    }

    // --- scroll-linked tilt / rise / shrink ---
    const sp = c.heroH > 0 ? clamp(window.scrollY / c.heroH, 0, 1) : 0;
    group.current.position.y = 30 * sp;
    group.current.scale.setScalar(1 - 0.1 * sp);

    // --- compose rotation: resting sway + intro spin + drag + hover lean + scroll tilt ---
    const swayY = Math.sin(t.current * 0.35) * 0.22;
    const swayX = Math.sin(t.current * 0.22) * 0.06;
    group.current.rotation.y = swayY + spin + c.yaw + c.mag * c.hoverX * 0.16;
    group.current.rotation.x = swayX + c.pitch + sp * 0.5 - c.mag * c.hoverY * 0.1;

    // --- tail glow rises on hover / click ---
    if (tealMat.current) tealMat.current.emissiveIntensity = 0.55 + c.mag * 0.55 + sep * 0.9;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.7}>
      <group ref={group}>
        <mesh ref={white} geometry={whiteGeo}>
          <meshPhysicalMaterial ref={whiteMat} color="#f4f1ea" metalness={0.1} roughness={0.25} clearcoat={1} clearcoatRoughness={0.2} />
        </mesh>
        <mesh ref={teal} geometry={tealGeo}>
          <meshPhysicalMaterial
            ref={tealMat}
            color="#26c9bb"
            emissive="#0d5c55"
            emissiveIntensity={0.55}
            metalness={0.15}
            roughness={0.18}
            transmission={mobile ? 0 : 0.35}
            thickness={mobile ? 0 : 30}
            attenuationColor="#26c9bb"
            attenuationDistance={90}
            clearcoat={1}
            clearcoatRoughness={0.12}
            ior={1.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Rings({ ctrl }: { ctrl: React.MutableRefObject<Ctrl> }) {
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const sat = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    const c = ctrl.current;
    const dt = Math.min(delta, 0.05);
    t.current += dt * (1 + c.mag * 1.6);
    if (g1.current) g1.current.rotation.z = t.current * 0.3;
    if (g2.current) g2.current.rotation.z = -t.current * 0.22;
    if (sat.current) {
      const th = t.current * 0.9;
      sat.current.position.set(Math.cos(th) * 168, Math.sin(th) * 168, 0);
    }
  });
  return (
    <>
      <group ref={g1} rotation={[Math.PI / 3, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[168, 0.8, 8, 96]} />
          <meshBasicMaterial color="#26c9bb" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh ref={sat}>
          <sphereGeometry args={[4, 16, 16]} />
          <meshBasicMaterial color="#8fe8de" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <group ref={g2} rotation={[-Math.PI / 4, -0.5, 0.3]}>
        <mesh>
          <torusGeometry args={[192, 0.6, 8, 96]} />
          <meshBasicMaterial color="#f4f1ea" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

function ShockRing({ ctrl }: { ctrl: React.MutableRefObject<Ctrl> }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const c = ctrl.current;
    if (!ref.current || !mat.current) return;
    const on = c.split >= 0;
    ref.current.visible = on;
    if (on) {
      const p = Math.min(c.split, 1);
      const s = 30 + p * 280;
      ref.current.scale.set(s, s, 1);
      mat.current.opacity = 0.5 * (1 - p);
    }
  });
  return (
    <mesh ref={ref} visible={false}>
      <ringGeometry args={[0.94, 1, 96]} />
      <meshBasicMaterial ref={mat} color="#26c9bb" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Halo({ ctrl }: { ctrl: React.MutableRefObject<Ctrl> }) {
  const mat = useRef<THREE.SpriteMaterial>(null);
  const t = useRef(0);
  const tex = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const x = cv.getContext("2d")!;
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(38,201,187,0.55)");
    g.addColorStop(0.45, "rgba(38,201,187,0.16)");
    g.addColorStop(1, "rgba(38,201,187,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    const tt = new THREE.CanvasTexture(cv);
    return tt;
  }, []);
  useFrame((_, delta) => {
    const c = ctrl.current;
    t.current += Math.min(delta, 0.05);
    if (!mat.current) return;
    const sep = c.split >= 0 ? Math.sin(Math.PI * Math.min(c.split, 1)) : 0;
    mat.current.opacity = 0.4 + 0.06 * Math.sin(t.current * 1.3) + c.mag * 0.22 + sep * 0.35;
  });
  return (
    <sprite position={[0, 0, -160]} scale={[420, 420, 1]}>
      <spriteMaterial ref={mat} map={tex} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

function Particles({ ctrl, count }: { ctrl: React.MutableRefObject<Ctrl>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, homes, vels } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pha = new Float32Array(count);
    const teal = new THREE.Color("#26c9bb"), paper = new THREE.Color("#f4f1ea"), tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 190 + Math.random() * 170;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = Math.cos(a) * Math.sin(b) * r;
      pos[i * 3 + 1] = Math.cos(b) * r * 0.8;
      pos[i * 3 + 2] = Math.sin(a) * Math.sin(b) * r * 0.4;
      tmp.copy(Math.random() < 0.6 ? teal : paper).multiplyScalar(0.5 + Math.random() * 0.6);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
      pha[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(pha, 1));
    return { geo, homes: pos, vels: new Float32Array(count * 3) };
  }, [count]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: 3.0 } },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aPhase;
      uniform float uTime;
      uniform float uSize;
      varying float vA;
      varying vec3 vC;
      void main() {
        vC = aColor;
        vA = 0.5 + 0.5 * sin(uTime * 2.0 + aPhase * 6.2831);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * (0.6 + 0.9 * vA) * (320.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA;
      varying vec3 vC;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vC, vA * (1.0 - d * 2.0));
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  const v = useMemo(() => new THREE.Vector3(), []);
  const pw = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const c = ctrl.current;
    const dt = Math.min(delta, 0.05);
    mat.uniforms.uTime.value += dt;
    if (ref.current) ref.current.rotation.y += dt * 0.03;

    // pointer projected onto z=0 plane
    let px = 0, py = 0, active = false;
    if (c.hoverOn) {
      v.set(c.hoverX, c.hoverY, 0.5).unproject(state.camera).sub(state.camera.position).normalize();
      const tt = -state.camera.position.z / v.z;
      pw.copy(state.camera.position).addScaledVector(v, tt);
      px = pw.x; py = pw.y; active = true;
    }

    const attr = ref.current?.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    const R = 90;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // spring home
      vels[ix] += (homes[ix] - arr[ix]) * 4.5 * dt;
      vels[ix + 1] += (homes[ix + 1] - arr[ix + 1]) * 4.5 * dt;
      vels[ix + 2] += (homes[ix + 2] - arr[ix + 2]) * 4.5 * dt;
      // click shockwave impulse
      if (c.shock > 0) {
        const dx = arr[ix], dy = arr[ix + 1], dz = arr[ix + 2];
        const l = Math.hypot(dx, dy, dz) || 1;
        vels[ix] += (dx / l) * 220 * c.shock;
        vels[ix + 1] += (dy / l) * 220 * c.shock;
        vels[ix + 2] += (dz / l) * 220 * c.shock;
      }
      // cursor repulsion on z=0 plane
      if (active) {
        const dx = arr[ix] - px, dy = arr[ix + 1] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((R - d) / R) * 900 * dt;
          vels[ix] += (dx / d) * f;
          vels[ix + 1] += (dy / d) * f;
        }
      }
      const dk = Math.exp(-3.2 * dt);
      vels[ix] *= dk; vels[ix + 1] *= dk; vels[ix + 2] *= dk;
      arr[ix] += vels[ix] * dt * 60 * 0.016;
      arr[ix + 1] += vels[ix + 1] * dt * 60 * 0.016;
      arr[ix + 2] += vels[ix + 2] * dt * 60 * 0.016;
    }
    if (c.shock > 0) c.shock = 0;
    attr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// lambda bounding radius (~150 incl. bevel) must sit inside the frame w/ ~12% pad
const FIT_R = 150;
const FIT_PAD = 0.76; // ~12% padding on every side

function FitRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    if (!ref.current) return;
    const vp = state.viewport.getCurrentViewport(state.camera, v.set(0, 0, 0));
    ref.current.scale.setScalar((Math.min(vp.width, vp.height) * FIT_PAD) / (2 * FIT_R));
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ ctrl, mobile, count }: { ctrl: React.MutableRefObject<Ctrl>; mobile: boolean; count: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[140, 220, 160]} intensity={1.2} />
      <FitRig>
        <Center>
          <LambdaMesh ctrl={ctrl} mobile={mobile} />
        </Center>
        <Rings ctrl={ctrl} />
        <ShockRing ctrl={ctrl} />
      </FitRig>
      <Halo ctrl={ctrl} />
      <Particles ctrl={ctrl} count={count} />
      <ContactShadows position={[0, -180, 0]} opacity={0.35} scale={640} blur={2.2} far={240} frames={90} color="#04120f" />
      <Environment resolution={64}>
        <Lightformer intensity={3.2} position={[0, 4, 5]} scale={[10, 4, 1]} />
        <Lightformer intensity={1.6} color="#ffffff" position={[2, 2, 6]} scale={[4, 4, 1]} />
        <Lightformer intensity={1.4} color="#26c9bb" position={[-4, -1, 4]} scale={[3, 8, 1]} />
        <Lightformer intensity={0.9} position={[5, -2, 3]} scale={[2, 6, 1]} />
      </Environment>
    </>
  );
}

export function Hero3D({ running = true, onInteract }: { running?: boolean; onInteract?: () => void }) {
  const ctrl = useRef<Ctrl>({
    dragging: false, yaw: 0, pitch: 0, vyaw: 0, vpitch: 0,
    hoverX: 0, hoverY: 0, hoverOn: false, mag: 0,
    idle: 0, intro: 0, split: -1, shock: 0, heroH: 0,
  });
  const [grabbing, setGrabbing] = useState(false);
  const last = useRef({ x: 0, y: 0, t: 0, moved: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const mobile = useMemo(
    () => typeof matchMedia !== "undefined" && (matchMedia("(pointer: coarse)").matches || window.innerWidth < 768),
    []
  );

  const updateHover = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    ctrl.current.hoverX = ((e.clientX - r.left) / r.width) * 2 - 1;
    ctrl.current.hoverY = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ctrl.current.hoverOn = true;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    ctrl.current.dragging = true;
    ctrl.current.idle = 0;
    setGrabbing(true);
    last.current = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    onInteract?.();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    updateHover(e);
    const c = ctrl.current;
    if (!c.dragging) return;
    const l = last.current;
    const dx = e.clientX - l.x, dy = e.clientY - l.y;
    const dt = Math.max((performance.now() - l.t) / 1000, 0.008);
    c.yaw += dx * 0.01;
    c.pitch = clamp(c.pitch + dy * 0.006, -0.5, 0.5);
    c.vyaw = (dx * 0.01) / dt;
    c.vpitch = (dy * 0.006) / dt;
    l.moved += Math.abs(dx) + Math.abs(dy);
    l.x = e.clientX; l.y = e.clientY; l.t = performance.now();
  };

  const onPointerUp = () => {
    const c = ctrl.current;
    c.dragging = false;
    c.idle = 0;
    setGrabbing(false);
    if (last.current.moved < 6) {
      c.split = 0.0001;
      c.shock = 1;
      onInteract?.();
    }
  };

  return (
    <div
      ref={wrap}
      className={`hero3d${grabbing ? " grabbing" : ""}`}
      style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { ctrl.current.dragging = false; setGrabbing(false); }}
      onPointerEnter={updateHover}
      onPointerLeave={() => { ctrl.current.hoverOn = false; }}
    >
      <Canvas
        frameloop={running ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 520], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer:
            typeof location !== "undefined" && new URLSearchParams(location.search).get("glcapture") === "1",
        }}
        onCreated={() => {
          const hero = wrap.current?.closest(".hero");
          ctrl.current.heroH = hero instanceof HTMLElement ? hero.clientHeight : window.innerHeight;
        }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor>
            <AdaptiveDpr pixelated={false} />
          </PerformanceMonitor>
          <Scene ctrl={ctrl} mobile={mobile} count={mobile ? 250 : 500} />
        </Suspense>
      </Canvas>
    </div>
  );
}
