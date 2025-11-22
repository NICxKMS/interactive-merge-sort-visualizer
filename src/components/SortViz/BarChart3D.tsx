import { useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface BarChart3DProps {
  array: number[];
  comparingIndices: number[];
  sortedIndices: number[];
  activeIndices: number[]; // Just to handle highlight if needed
}

export const BarChart3D = ({ array, comparingIndices, sortedIndices }: BarChart3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate layout
  const width = array.length * 1.2;
  const startX = -width / 2;

  return (
    <group ref={groupRef} position={[0, -5, 0]}>
      {array.map((value, index) => {
        const isComparing = comparingIndices.includes(index);
        const isSorted = sortedIndices.includes(index);

        // Color Logic
        let color = "#4aadff"; // Default blue
        if (isComparing) color = "#ff5a4e"; // Red comparing
        if (isSorted) color = "#3eef8b"; // Green sorted

        // Height scaling
        const height = value * 0.2;

        return (
          <group key={index} position={[startX + index * 1.2, height / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.8}
                emissive={isComparing ? color : "#000000"}
                emissiveIntensity={isComparing ? 0.5 : 0}
              />
            </mesh>
            {/* Value Label on Top */}
            {array.length < 32 && (
              <Text
                position={[0, height / 2 + 0.5, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {value}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
};
