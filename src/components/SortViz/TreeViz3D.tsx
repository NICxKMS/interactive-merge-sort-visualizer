import { useRef } from 'react';
import { Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { TreeNode } from '../../algorithms/mergeSortGenerator';

interface TreeViz3DProps {
  nodes: TreeNode[];
  activeNodeId: string | null;
}

export const TreeViz3D = ({ nodes, activeNodeId }: TreeViz3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const divideNodes = nodes.filter(n => n.type !== 'merge');
  const mergeNodes = nodes.filter(n => n.type === 'merge');

  return (
    <group ref={groupRef}>
      {/* DIVIDE TREE CONNECTIONS */}
      {divideNodes.map((node) => {
        const parent = divideNodes.find(n => n.id === node.parentId);
        if (!parent) return null;

        return (
           <Line
            key={`line-${node.id}`}
            points={[
              [parent.x, parent.y, 0],
              [node.x, node.y, 0]
            ]}
            color="#94a3b8"
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        );
      })}

      {/* MERGE CONNECTIONS */}
      {mergeNodes.map(node => {
         const divideNode = divideNodes.find(d => d.depth === node.depth && Math.abs(d.x - node.x) < 0.1);
         if (!divideNode) return null;

         const divideChildren = divideNodes.filter(d => d.parentId === divideNode.id);

         const mergeSources = mergeNodes.filter(m =>
            divideChildren.some(dc => dc.depth === m.depth && Math.abs(dc.x - m.x) < 0.1)
         );

         return (
            <group key={`merge-lines-${node.id}`}>
                {mergeSources.map(source => (
                    <Line
                        key={`link-${node.id}-${source.id}`}
                        points={[
                            [node.x, node.y, 0],
                            [source.x, source.y, 0]
                        ]}
                        color="#4ade80"
                        lineWidth={2}
                        transparent
                        opacity={0.6}
                    />
                ))}
                {/* Optional: Link Divide Node to Merge Node to show correspondence */}
                <Line
                    points={[
                        [divideNode.x, divideNode.y, 0],
                        [node.x, node.y, 0]
                    ]}
                    color="#ffffff"
                    lineWidth={0.5}
                    dashed
                    dashSize={0.5}
                    gapSize={0.5}
                    opacity={0.1}
                />
            </group>
         );
      })}

      {/* NODES */}
      {nodes.map((node) => {
        const isActive = node.id === activeNodeId;
        const isDivide = node.type === 'divide';
        const isMerge = node.type === 'merge';
        const isLeaf = node.type === 'leaf';

        let color = "#ffffff";
        let scale = 0.6;

        if (isDivide) color = "#f87171";
        if (isMerge) color = "#4ade80";
        if (isLeaf) color = "#facc15";
        if (isActive) {
            color = "#00f3ff";
            scale = 0.9;
        }

        const position = new THREE.Vector3(node.x, node.y, 0);

        return (
          <group key={node.id} position={position}>
            <mesh>
              <sphereGeometry args={[scale, 32, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 0.8 : 0.2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Label - Using Billboard to fix "text not visible" */}
            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false}
            >
                {/* Background for text readability */}
                <mesh position={[0, 0, scale + 0.1]}>
                    <planeGeometry args={[2.5, 1]} />
                    <meshBasicMaterial color="black" transparent opacity={0.6} />
                </mesh>
                <Text
                    position={[0, 0, scale + 0.2]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="black"
                >
                    {node.values.length <= 4 ? `[${node.values.join(',')}]` : `[${node.values.length}]`}
                </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
};
