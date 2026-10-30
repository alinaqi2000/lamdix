"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float, Center } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

function shapeFromPath(d: string) {
  const loader = new SVGLoader();
  const svg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  return SVGLoader.createShapes(svg.paths[0])[0];
}

function LambdaMesh() {
  const group = useRef<THREE.Group>(null);
  const { whiteGeo, tealGeo } = useMemo(() => {
    const opts: THREE.ExtrudeGeometryOptions = {
      depth: 42, bevelEnabled: true, bevelThickness: 6, bevelSize: 5, bevelSegments: 6, curveSegments: 24,
    };
    const w = new THREE.ExtrudeGeometry(shapeFromPath("M29 0H80C109 0 126 15 138 42L157 96L54 272H0L110 96L96 59Q92 29 70 29H29Z"), opts);
    const t = new THREE.ExtrudeGeometry(shapeFromPath("M165 114L211 234C222 259 245 240 242 223C240 211 234 204 224 202C256 195 282 223 277 249C273 278 238 289 210 278C190 273 181 256 175 240L139 167Z"), opts);
    const box = new THREE.Box3()
      .setFromBufferAttribute(w.attributes.position as THREE.BufferAttribute)
      .union(new THREE.Box3().setFromBufferAttribute(t.attributes.position as THREE.BufferAttribute));
    const c = box.getCenter(new THREE.Vector3());
    w.translate(-c.x, -c.y, -c.z);
    t.translate(-c.x, -c.y, -c.z);
    return { whiteGeo: w, tealGeo: t };
  }, []);
  const t = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    t.current += delta;
    group.current.rotation.y = Math.sin(t.current * 0.35) * 0.35 + state.pointer.x * 0.15;
    group.current.rotation.x = Math.sin(t.current * 0.22) * 0.1 - state.pointer.y * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.7}>
      <group ref={group} scale={[1, -1, 1]}>
        <mesh geometry={whiteGeo}>
          <meshPhysicalMaterial color="#f4f1ea" metalness={0.1} roughness={0.25} clearcoat={1} clearcoatRoughness={0.2} />
        </mesh>
        <mesh geometry={tealGeo}>
          <meshPhysicalMaterial
            color="#26c9bb"
            emissive="#0d5c55"
            emissiveIntensity={0.55}
            metalness={0.15}
            roughness={0.18}
            transmission={0.35}
            thickness={30}
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

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(360);
    for (let i = 0; i < 120; i++) {
      const r = 190 + Math.random() * 150;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 260;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.03; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={2.2} color="#26c9bb" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 520], fov: 40 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[140, 220, 160]} intensity={1.2} />
        <Center scale={1.15}>
          <LambdaMesh />
        </Center>
        <Particles />
        <Environment resolution={64}>
          <Lightformer intensity={3.2} position={[0, 4, 5]} scale={[10, 4, 1]} />
          <Lightformer intensity={1.6} color="#ffffff" position={[2, 2, 6]} scale={[4, 4, 1]} />
          <Lightformer intensity={1.4} color="#26c9bb" position={[-4, -1, 4]} scale={[3, 8, 1]} />
          <Lightformer intensity={0.9} position={[5, -2, 3]} scale={[2, 6, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
