import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';

// Shader para o corpo fluido
const FluidShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.5, 0.7, 0.9),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vec3 pos = position;
      pos.y += sin(pos.x * 10.0 + uTime) * 0.1;
      pos.x += cos(pos.y * 10.0 + uTime) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec3 uColor;
    uniform float uTime;

    void main() {
      vec3 color = uColor;
      color += sin(vPosition.x * 10.0 + uTime) * 0.1;
      color += cos(vPosition.y * 10.0 + uTime) * 0.1;
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Estendemos o FluidShaderMaterial para que o Three.js o reconheça
extend({ FluidShaderMaterial });

function Creature() {
  const mesh = useRef();
  const fluidMaterial = useRef();

  useFrame(({ clock }) => {
    mesh.current.rotation.y = Math.sin(clock.getElapsedTime()) * 0.1;
    fluidMaterial.current.uTime = clock.getElapsedTime();
  });

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    config: { mass: 3, tension: 400, friction: 30, precision: 0.001 },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      set({ scale: [1 + Math.random() * 0.1, 1 + Math.random() * 0.1, 1 + Math.random() * 0.1] });
    }, 2000);
    return () => clearInterval(interval);
  }, [set]);

  return (
    <a.group {...spring}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 64, 64]} />
        <fluidShaderMaterial ref={fluidMaterial} />
      </mesh>
      <Sparkles count={200} scale={3} size={6} speed={0.4} />
      <Mouth />
    </a.group>
  );
}

function Mouth() {
  const mesh = useRef();

  useFrame(({ clock }) => {
    mesh.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.1);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 1]} rotation={[0, Math.PI, 0]}>
      <torusGeometry args={[0.2, 0.05, 16, 100]} />
      <meshBasicMaterial color="#ffffff" />
      <pointLight color="#ffffff" intensity={1} distance={0.5} />
    </mesh>
  );
}

function Scene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Creature />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;