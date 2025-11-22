import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { ParticleField } from './ParticleField';
import { BarChart3D } from './SortViz/BarChart3D';
import { TreeViz3D } from './SortViz/TreeViz3D';
import { useSortingStore } from '../store/sortingStore';

export const Scene = () => {
  const { history, currentStep } = useSortingStore();
  const currentFrame = history[currentStep];

  return (
    <div className="absolute inset-0 z-0 bg-cyber-bg">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bc13fe" />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ParticleField />

          {currentFrame && (
            <>
              <BarChart3D
                array={currentFrame.array}
                comparingIndices={currentFrame.comparingIndices}
                sortedIndices={currentFrame.sortedIndices}
                activeIndices={[]}
              />
              <TreeViz3D
                nodes={currentFrame.treeNodes}
                activeNodeId={currentFrame.activeNodeId}
              />
            </>
          )}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
