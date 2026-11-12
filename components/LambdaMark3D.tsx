"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

/* ------------------------------------------------------------------ */
/* Interactive 3D lambda mark — pinned over the .hero-mark DOM slot    */
/* ------------------------------------------------------------------ */

const WHITE_D = "M29 0H80C109 0 126 15 138 42L157 96L54 272H0L110 96L96 59Q92 29 70 29H29Z";
const TEAL_D = "M165 114L211 234C222 259 245 240 242 223C240 211 234 204 224 202C256 195 282 223 277 249C273 278 238 289 210 278C190 273 181 256 175 240L139 167Z";
const MARK_H = 300; // source svg path height in units

const pointer = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.vx += (x - pointer.px) * 8;
      pointer.vy += (y - pointer.py) * 8;
      pointer.px = pointer.x = x;
      pointer.py = pointer.y = y;
    },
    { passive: true }
  );
}

/* tiny procedural studio env → glossy chrome reflections */
function EnvSetup() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const g = c.getContext("2d")!;
    const base = g.createLinearGradient(0, 0, 0, 256);
    base.addColorStop(0, "#16222a");
    base.addColorStop(0.5, "#070d11");
    base.addColorStop(1, "#020407");
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 256);
    const blob = (x: number, y: number, rx: number, ry: number, color: string, a: number) => {
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = a;
      g.translate(x, y); g.scale(1, ry / rx);
      const r = g.createRadialGradient(0, 0, 0, 0, 0, rx);
      r.addColorStop(0, color); r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r;
      g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill();
      g.restore();
    };
    blob(350, 40, 210, 70, "rgba(210,240,245,1)", 0.95);
    blob(300, 60, 190, 14, "rgba(252,255,253,1)", 1);
    blob(150, 80, 150, 16, "rgba(56,225,209,1)", 0.95);
    blob(430, 100, 110, 42, "rgba(96,84,180,1)", 0.5);
    blob(90, 160, 120, 30, "rgba(160,200,205,1)", 0.4);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromEquirectangular(tex).texture;
    scene.environment = env;
    gl.toneMappingExposure = 1.3;
    return () => {
      scene.environment = null;
      env.dispose();
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function shapeFromPath(d: string) {
  const svg = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  return SVGLoader.createShapes(svg.paths[0])[0];
}

function Mark() {
  const group = useRef<THREE.Group>(null);
  const { whiteGeo, tealGeo } = useMemo(() => {
    const opts: THREE.ExtrudeGeometryOptions = {
      depth: 34, bevelEnabled: true, bevelThickness: 5, bevelSize: 4, bevelSegments: 5, curveSegments: 24,
    };
    const w = new THREE.ExtrudeGeometry(shapeFromPath(WHITE_D), opts);
    const t = new THREE.ExtrudeGeometry(shapeFromPath(TEAL_D), opts);
    const box = new THREE.Box3()
      .setFromBufferAttribute(w.attributes.position as THREE.BufferAttribute)
      .union(new THREE.Box3().setFromBufferAttribute(t.attributes.position as THREE.BufferAttribute));
    const c = box.getCenter(new THREE.Vector3());
    w.translate(-c.x, -c.y, -c.z);
    t.translate(-c.x, -c.y, -c.z);
    return { whiteGeo: w, tealGeo: t };
  }, []);

  const t = useRef(Math.random() * 10);
  const spin = useRef(0);
  const spinVel = useRef(0);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    t.current += delta;
    // fit to ~78% of the viewport height
    const h = state.viewport.getCurrentViewport(state.camera, new THREE.Vector3(0, 0, 0)).height;
    const sc = (h * 0.78) / MARK_H;
    g.scale.set(sc, -sc, sc);
    // pointer flicks add spin that decays — feels throwable
    spinVel.current += pointer.vx * 0.012;
    pointer.vx *= 0.6;
    pointer.vy *= 0.6;
    spinVel.current = THREE.MathUtils.clamp(spinVel.current, -0.35, 0.35) * Math.pow(0.06, delta);
    spin.current = THREE.MathUtils.clamp(spin.current + spinVel.current, -0.6, 0.6);
    // bounded sway + pointer follow — shows depth, never goes edge-on
    const targetYaw = THREE.MathUtils.clamp(
      Math.sin(t.current * 0.4) * 0.4 + pointer.x * 0.7 + spin.current,
      -1.05, 1.05
    );
    const targetPitch = Math.sin(t.current * 0.3) * 0.08 - pointer.y * 0.4 + pointer.vy * 0.02;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, THREE.MathUtils.clamp(targetPitch, -0.6, 0.6), 5, delta);
    g.rotation.z = Math.sin(t.current * 0.22) * 0.04;
    g.position.y = Math.sin(t.current * 0.8) * h * 0.015;
  });

  return (
    <group ref={group}>
      <mesh geometry={whiteGeo}>
        <meshPhysicalMaterial color="#f6f2ea" metalness={0.8} roughness={0.18} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={2.6} emissive="#3a3830" emissiveIntensity={0.35} />
      </mesh>
      <mesh geometry={tealGeo}>
        <meshPhysicalMaterial color="#26c9bb" metalness={0.8} roughness={0.16} clearcoat={1} envMapIntensity={2.6} emissive="#0d6e66" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function LambdaMark3D() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // pin the canvas over the .hero-mark DOM slot; reveal + hide the SVG fallback
  useEffect(() => {
    const wrap = wrapRef.current;
    const anchor = document.querySelector<HTMLElement>(".hero-mark");
    const host = wrap?.parentElement;
    if (!wrap || !anchor || !host) return;
    let raf = 0;
    const sync = () => {
      const r = anchor.getBoundingClientRect();
      const h = host.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.6;
      wrap.style.transform = `translate(${r.left - h.left + r.width / 2 - size / 2}px, ${r.top - h.top + r.height / 2 - size / 2}px)`;
      wrap.style.width = `${size}px`;
      wrap.style.height = `${size}px`;
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} className="lambda3d-canvas" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.2], fov: 35, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <EnvSetup />
          <ambientLight intensity={0.85} />
          <directionalLight position={[3, 4, 6]} intensity={2} color="#f2faf8" />
          <directionalLight position={[-3, 2, -4]} intensity={1.4} color="#bfe8e2" />
          <pointLight position={[-4, -2, 3]} intensity={5} color="#26c9bb" distance={20} />
          <Mark />
        </Suspense>
      </Canvas>
    </div>
  );
}
