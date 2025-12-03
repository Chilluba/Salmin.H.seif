import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html, OrbitControls, Stars, Float, useTexture, Box, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

// --- Types & Helpers ---
interface PortfolioSceneProps {
  projects: Project[];
}

// Separate component for the textured box to handle useTexture hook safely
const ProjectMesh = ({ imageUrl, hovered }: { imageUrl: string, hovered: boolean }) => {
    // 1x1 Transparent Pixel as fallback if URL is empty
    const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const urlToLoad = imageUrl || placeholder;

    const texture = useTexture(urlToLoad);
    
    // Configure texture settings
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return (
        <Box args={[1.5, 1.5, 1.5]}>
            <meshStandardMaterial 
                map={texture} 
                color="white" 
                roughness={0.2}
                metalness={0.1}
            />
        </Box>
    );
};

const ProjectNode: React.FC<{ project: Project; position: [number, number, number] }> = ({ project, position }) => {
  const navigate = useNavigate();
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Generate random "satellite" voxels
  const satellites = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.02 + 0.01
    }));
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation for the main cluster
      meshRef.current.rotation.y += 0.005;
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    setHovered(true);
  };
  
  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    setHovered(false);
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
      <group 
        ref={meshRef} 
        onClick={() => navigate(`/portfolio/${project.id}`)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Main Voxel Cube - Loaded via Suspense in parent */}
        <ProjectMesh imageUrl={project.imageUrl} hovered={hovered} />
        
        {/* Wireframe Outline for Tech Feel */}
        <Box args={[1.6, 1.6, 1.6]}>
            <meshBasicMaterial wireframe color={hovered ? "#e63946" : "#27272A"} transparent opacity={0.3} />
        </Box>

        {/* Satellite Voxels */}
        {satellites.map((sat, i) => (
          <Box key={i} args={[sat.scale, sat.scale, sat.scale]} position={sat.position}>
             <meshStandardMaterial color={i % 2 === 0 ? "#e63946" : "#F5F7FA"} emissive={i % 2 === 0 ? "#e63946" : "#000000"} emissiveIntensity={0.5} />
          </Box>
        ))}

        {/* Text Label */}
        <Html position={[0, -2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className={`
                px-3 py-1 rounded bg-black/80 border border-[#27272A] backdrop-blur-sm text-center min-w-[150px]
                transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-70'}
            `}>
                <p className="font-display text-white text-lg tracking-wider whitespace-nowrap">{project.title}</p>
                <p className="font-code text-xs text-[#E50914] uppercase">{project.category}</p>
            </div>
        </Html>
      </group>
    </Float>
  );
};

// Procedurally generate positions in a spiral/random cloud
const generatePositions = (count: number, radius: number = 8) => {
    const positions: [number, number, number][] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < count; i++) {
        // Fibonacci Sphere distribution for even spread
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = 2 * Math.PI * i / goldenRatio; // Golden angle increment
        
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        
        positions.push([x * radius, y * radius, z * radius]);
    }
    return positions;
};

const LoadingFallback = () => (
    <Html center>
        <div className="text-white font-code animate-pulse">Initializing Universe...</div>
    </Html>
);

export const PortfolioScene: React.FC<PortfolioSceneProps> = ({ projects }) => {
  const positions = useMemo(() => generatePositions(projects.length, 6), [projects.length]);

  return (
    <div className="w-full h-full absolute inset-0 bg-[#050505]">
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={<LoadingFallback />}>
            <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={50} />
            <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
                minDistance={5}
                maxDistance={30}
            />
            
            {/* Environment */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4040ff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff4040" />
            
            {/* Project Nodes */}
            {projects.map((project, index) => (
            <ProjectNode 
                key={project.id} 
                project={project} 
                position={positions[index]} 
            />
            ))}
        </Suspense>
      </Canvas>
      
      {/* UI Overlay for instruction */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none text-center opacity-60">
        <p className="font-code text-xs text-white mb-1">DRAG TO EXPLORE • CLICK TO VIEW</p>
        <div className="w-1 h-8 bg-gradient-to-t from-white to-transparent mx-auto"></div>
      </div>
    </div>
  );
};