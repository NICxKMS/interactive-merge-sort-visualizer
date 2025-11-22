import { useRef } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface BarChart3DProps {
  array: number[];
  comparingIndices: number[];
  sortedIndices: number[];
  activeIndices: number[];
}

export const BarChart3D = ({ array, comparingIndices, sortedIndices }: BarChart3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Match the spacing from Generator
  const spacing = 1.4;
  const width = array.length * spacing;
  // Centering logic must match getXPos in generator:
  // (centerIndex * spacing) - (width / 2) + (spacing / 2)
  // index 0: (0 * 1.4) - (W/2) + 0.7
  const startX = -width / 2 + (spacing / 2);

  return (
    <group ref={groupRef}>
      {array.map((value, index) => {
        const isComparing = comparingIndices.includes(index);
        const isSorted = sortedIndices.includes(index);

        // High Contrast Colors
        let color = "#3b82f6"; // Bright Blue
        let emissiveColor = "#1d4ed8";
        let emissiveIntensity = 0.2;

        if (isComparing) {
          color = "#ef4444"; // Bright Red
          emissiveColor = "#ff0000";
          emissiveIntensity = 1.5;
        } else if (isSorted) {
          color = "#22c55e"; // Bright Green
          emissiveColor = "#4ade80";
          emissiveIntensity = 0.5;
        }

        // Height scaling (Ensure visibility)
        const height = Math.max(1, value * 0.25);

        return (
          <group key={index} position={[startX + index * spacing, height / 2, 0]}>
            <RoundedBox args={[0.9, height, 0.9]} radius={0.1} smoothness={4}>
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.6}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </RoundedBox>

            {/* Value Label on Top */}
            {array.length < 32 && (
              <Text
                position={[0, height / 2 + 0.8, 0]}
                fontSize={0.6}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="black"
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
