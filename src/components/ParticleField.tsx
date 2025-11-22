import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleField = () => {
  const count = 2000;
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = Math.random() * 100;
      const speed = Math.random() * 0.01 + 0.005;
      const x = Math.random() * 100 - 50;
      const y = Math.random() * 100 - 50;
      const z = Math.random() * 100 - 50;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      const { speed, x, y, z } = particle;

      // Interactive movement based on mouse
      // We can use state.mouse.x / y which are normalized -1 to 1
      const mouseX = state.mouse.x * 20;
      const mouseY = state.mouse.y * 20;

      // Subtle floating + mouse reaction
      const t = state.clock.getElapsedTime();

      dummy.position.set(
        x + Math.sin(t * speed + x) * 2 + (mouseX * 0.1),
        y + Math.cos(t * speed + y) * 2 + (mouseY * 0.1),
        z + Math.sin(t * speed + z) * 2
      );

      const scale = (Math.sin(t * 2 + i) + 2) * 0.05;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      if (mesh.current) {
          mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (mesh.current) {
        mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#00f3ff" transparent opacity={0.4} />
      </instancedMesh>
    </>
  );
};
