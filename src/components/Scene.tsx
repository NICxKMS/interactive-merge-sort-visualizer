import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
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
      <Canvas>
        {/*
           CAMERA: Initial position to see both layers.
           Bars are at Z=10, Tree at Z=-15.
           Camera at Z=50 ensures we see both.
           Elevated Y=20 gives a nice overview.
        */}
        <PerspectiveCamera makeDefault position={[0, 20, 50]} fov={45} />

        <Suspense fallback={null}>
          {/* LIGHTING */}
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight
            position={[10, 20, 10]}
            intensity={2}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-20, 0, -10]} intensity={0.5} color="#bc13fe" distance={50} />
          <pointLight position={[20, 0, -10]} intensity={0.5} color="#00f3ff" distance={50} />

          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          <ParticleField />

          {currentFrame && (
            <>
              {/* BAR CHART: FOREGROUND (Z=10) */}
              <group position={[0, -10, 15]}>
                 <BarChart3D
                    array={currentFrame.array}
                    comparingIndices={currentFrame.comparingIndices}
                    sortedIndices={currentFrame.sortedIndices}
                    activeIndices={[]}
                  />
              </group>

              {/* TREE CHART: BACKGROUND WALL (Z=-15) */}
              <group position={[0, 5, -15]}>
                 <TreeViz3D
                  nodes={currentFrame.treeNodes}
                  activeNodeId={currentFrame.activeNodeId}
                />
              </group>
            </>
          )}

          {/* CONTROLS: Improved settings */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={100}
            maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking from underground
            target={[0, 0, 0]} // Rotate around center
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
