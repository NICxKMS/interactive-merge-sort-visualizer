import { useRef } from 'react';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { TreeNode } from '../../algorithms/mergeSortGenerator';

interface TreeViz3DProps {
  nodes: TreeNode[];
  activeNodeId: string | null;
}

export const TreeViz3D = ({ nodes, activeNodeId }: TreeViz3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // We need to calculate positions dynamically if not provided,
  // but our generator provides basic X/Y.
  // We will map them to 3D space.
  // Let's put the tree *behind* the bar chart or *above* it.

  return (
    <group ref={groupRef} position={[0, 10, -10]}>
      {nodes.map((node) => {
        const parent = nodes.find(n => n.id === node.parentId);

        const isActive = node.id === activeNodeId;
        const isDivide = node.type === 'divide';
        const isMerge = node.type === 'merge';
        const isLeaf = node.type === 'leaf';

        // Color Mapping
        let color = "#ffffff";
        if (isDivide) color = "#ff5a4e";
        if (isMerge) color = "#3eef8b";
        if (isLeaf) color = "#ffb52e";
        if (isActive) color = "#00f3ff"; // Highlight active

        const position = new THREE.Vector3(node.x ? node.x * 2 : 0, node.y ? node.y : 0, 0);

        return (
          <group key={node.id}>
            {/* Connection Line to Parent */}
            {parent && (
              <Line
                points={[
                  [parent.x ? parent.x * 2 : 0, parent.y ? parent.y : 0, 0],
                  [position.x, position.y, position.z]
                ]}
                color={color}
                lineWidth={1}
                transparent
                opacity={0.3}
              />
            )}

            {/* Node Visual */}
            <mesh position={position}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 0.8 : 0.2}
              />
            </mesh>

            {/* Label (only if few nodes to avoid clutter) */}
            <Text
              position={[position.x, position.y - 0.8, position.z]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="top"
            >
              {node.values.length <= 4 ? `[${node.values.join(',')}]` : `[${node.values.length}]`}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
