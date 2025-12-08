import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Float, Octahedron, Box, Torus, Line, Stars, Sparkles, Trail, Environment, Billboard, Image } from '@react-three/drei';
import * as THREE from 'three';
import * as ReactRouterDOM from 'react-router-dom';
import { Project } from '../types';

const { useNavigate } = ReactRouterDOM;

// --- Types ---

interface PortfolioSceneProps {
  projects: Project[];
}

interface NodePosition {
  vec: THREE.Vector3;
  id: number;
}

// --- Constants ---

const VIBRANT_COLORS = [
    "#00f3ff", // Cyan
    "#ff00aa", // Magenta
    "#ccff00", // Neon Lime
    "#ffaa00", // Bright Orange
    "#bc13fe", // Electric Purple
    "#00ff99", // Spring Green
];

// --- Helpers ---

// Generate positions based on a Fibonacci Sphere (Nature's distribution) + Randomness
const generateNeuralPositions = (count: number, radius: number): NodePosition[] => {
  const positions: NodePosition[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    // Standard Fibonacci Sphere calculation
    const y = 1 - (i / (Math.max(1, count - 1))) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = 2 * Math.PI * i / goldenRatio;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    // Add organic jitter/noise to make it look like a grown organism, not a math grid
    const jitter = 2.0; 
    const vec = new THREE.Vector3(
      x * radius + (Math.random() - 0.5) * jitter,
      y * radius + (Math.random() - 0.5) * jitter,
      z * radius + (Math.random() - 0.5) * jitter
    );

    positions.push({ vec, id: i });
  }
  return positions;
};

// --- Components ---

const ShootingStar = () => {
    const ref = useRef<THREE.Mesh>(null);
    const [isActive, setIsActive] = useState(false);
    const [startPos] = useState(() => new THREE.Vector3());
    const [endPos] = useState(() => new THREE.Vector3());
    const nextSpawn = useRef(3); // Start first one quickly (3s)
    
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        
        // Spawn logic
        if (!isActive && time > nextSpawn.current) {
            // Calculate random start/end on a large sphere
            const r = 70;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            startPos.setFromSphericalCoords(r, phi, theta);
            // End position: somewhat opposite hemisphere to ensure it crosses the view
            endPos.setFromSphericalCoords(r, phi + Math.PI + (Math.random() - 0.5), theta + Math.PI + (Math.random() - 0.5));
            
            setIsActive(true);
            if (ref.current) {
                ref.current.position.copy(startPos);
                ref.current.scale.set(1,1,1);
            }
            
            // Schedule next spawn (30s +/- 5s)
            nextSpawn.current = time + 30 + (Math.random() * 10 - 5);
        }

        if (isActive && ref.current) {
            const dir = new THREE.Vector3().subVectors(endPos, startPos).normalize();
            const distTotal = startPos.distanceTo(endPos);
            const distCurrent = ref.current.position.distanceTo(startPos);
            
            // Movement Speed
            const moveSpeed = 40 * delta;
            ref.current.position.add(dir.multiplyScalar(moveSpeed));
            
            // Rotation
            ref.current.rotation.x += delta * 4;
            ref.current.rotation.y += delta * 2;

            // Check if finished
            if (distCurrent >= distTotal) {
                setIsActive(false);
                ref.current.scale.set(0,0,0); // Hide
            }
        }
    });

    return (
        <group>
            <Trail 
                width={isActive ? 6 : 0} 
                length={12} 
                color={new THREE.Color("#00f3ff")} 
                attenuation={(t) => t * t}
            >
                <mesh ref={ref} scale={[0,0,0]}>
                    <dodecahedronGeometry args={[0.4, 0]} />
                    <meshStandardMaterial color="#ffffff" emissive="#00f3ff" emissiveIntensity={2} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
    );
};

const DataCrystal = ({ 
  project, 
  position, 
  color,
  onHover, 
  isNeighbor 
}: { 
  project: Project; 
  position: THREE.Vector3; 
  color: string;
  onHover: (hovering: boolean, vec?: THREE.Vector3) => void;
  isNeighbor: boolean;
}) => {
  const navigate = useNavigate();
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Safe fallback for image
  const textureUrl = project.imageUrl || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  
  useFrame((state) => {
    if (!groupRef.current || !crystalRef.current || !ringRef.current) return;

    // Floating animation
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire group slowly
    groupRef.current.rotation.y += 0.002;
    
    // Rotate the outer crystal
    crystalRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    crystalRef.current.rotation.z = Math.cos(time * 0.3) * 0.2;

    // Rotate the ring (faster)
    ringRef.current.rotation.x += 0.01;
    ringRef.current.rotation.y += 0.015;

    // Scale logic
    const targetScale = hovered ? 1.2 : (isNeighbor ? 1.1 : 1.0);
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group 
            ref={groupRef}
            onClick={() => navigate(`/portfolio/${project.id}`)}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                document.body.style.cursor = 'pointer';
                onHover(true, position);
            }}
            onPointerOut={(e) => {
                setHovered(false);
                document.body.style.cursor = 'auto';
                onHover(false);
            }}
        >
          {/* 1. The Core Device (Crystal Base) */}
          <group>
              {/* Outer Glass Shell */}
              <Octahedron ref={crystalRef} args={[1, 0]}>
                 <meshPhysicalMaterial 
                    color={hovered ? "#ffffff" : color}
                    transmission={0.6}
                    opacity={1}
                    metalness={0.2}
                    roughness={0}
                    thickness={2}
                    clearcoat={1}
                    envMapIntensity={2}
                 />
              </Octahedron>

              {/* Inner Power Core */}
              <Octahedron args={[0.5, 0]}>
                <meshBasicMaterial color={color} wireframe />
              </Octahedron>
              
              {/* Orbiting Energy Ring */}
              <group ref={ringRef}>
                 <Torus args={[1.5, 0.03, 16, 100]}>
                    <meshBasicMaterial color={color} toneMapped={false} />
                 </Torus>
              </group>
          </group>

          {/* 2. Connection Beam (Holographic projection stream) */}
           <mesh position={[0, 1.2, 0]}>
             <cylinderGeometry args={[0.04, 0.1, 1.8, 8]} />
             <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>

          {/* 3. Holographic Display Screen (Billboard) */}
          {/* Billboard ensures the screen always faces the camera for visibility */}
          <Billboard position={[0, 2.2, 0]}>
             {/* The Image - 16:9 Aspect Ratio */}
             <Image 
                url={textureUrl}
                scale={[3, 1.69]} 
                transparent
                opacity={hovered ? 1 : 0.85}
                toneMapped={false}
             />
             
             {/* Tech Frame Background */}
             <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[3.2, 1.9]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.7} />
             </mesh>
             
             {/* Wireframe Outline */}
             <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[3.1, 1.8]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
             </mesh>

             {/* Corner Accents for Sci-Fi look */}
             <group position={[0, 0, 0.03]}>
                <Box args={[0.2, 0.05, 0.05]} position={[-1.55, 0.9, 0]}><meshBasicMaterial color={color}/></Box>
                <Box args={[0.05, 0.2, 0.05]} position={[-1.55, 0.9, 0]}><meshBasicMaterial color={color}/></Box>
                
                <Box args={[0.2, 0.05, 0.05]} position={[1.55, -0.9, 0]}><meshBasicMaterial color={color}/></Box>
                <Box args={[0.05, 0.2, 0.05]} position={[1.55, -0.9, 0]}><meshBasicMaterial color={color}/></Box>
             </group>
          </Billboard>

          {/* Label UI */}
          <Html position={[0, -1.8, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
             <div className={`
                transition-all duration-300 transform
                ${hovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-2'}
                bg-black/80 backdrop-blur-md border border-[${color}]/50 p-3 rounded-lg text-center min-w-[180px] shadow-[0_0_15px_${color}40]
             `}>
                <h3 className="text-white font-display text-lg tracking-wider m-0">{project.title}</h3>
                <span className="font-code text-xs uppercase block mt-1" style={{ color: color }}>{project.category}</span>
             </div>
          </Html>
        </group>
      </Float>
    </group>
  );
};

// Draws lines between close nodes to simulate synapses
const NeuralConnections = ({ positions, activeNodePos }: { positions: NodePosition[], activeNodePos: THREE.Vector3 | null }) => {
    const connections = useMemo(() => {
        const lines: { start: THREE.Vector3; end: THREE.Vector3; distance: number; id: string }[] = [];
        const threshold = 8; // Max distance to connect

        // Connect each node to its closest neighbors (max 3 connections per node to keep it clean)
        positions.forEach((nodeA, i) => {
            // Find distances to all other nodes
            const distances = positions
                .map((nodeB, j) => {
                    if (i === j) return null;
                    return {
                        vec: nodeB.vec,
                        dist: nodeA.vec.distanceTo(nodeB.vec)
                    };
                })
                .filter(item => item !== null && item.dist < threshold)
                // Sort by closest
                .sort((a, b) => (a?.dist || 0) - (b?.dist || 0))
                .slice(0, 3); // Take top 3 closest

            distances.forEach(target => {
                if (target) {
                    // Create unique ID for the pair to avoid duplicate lines drawing twice
                    const id = [i, positions.findIndex(p => p.vec === target.vec)].sort().join('-');
                    if (!lines.find(l => l.id === id)) {
                         lines.push({ start: nodeA.vec, end: target.vec, distance: target.dist, id });
                    }
                }
            });
        });
        return lines;
    }, [positions]);

    return (
        <group>
            {connections.map((line) => {
                // Determine if this line is connected to the active node
                const isActive = activeNodePos && (line.start.equals(activeNodePos) || line.end.equals(activeNodePos));
                
                return (
                    <Line
                        key={line.id}
                        points={[line.start, line.end]}
                        color={isActive ? "#ffffff" : "#444444"}
                        lineWidth={isActive ? 2 : 1}
                        transparent
                        opacity={isActive ? 0.6 : 0.1}
                    />
                );
            })}
        </group>
    );
};

const LoadingFallback = () => (
    <Html center>
        <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white font-code text-sm animate-pulse tracking-widest">INITIALIZING UNIVERSE...</div>
        </div>
    </Html>
);

export const PortfolioScene: React.FC<PortfolioSceneProps> = ({ projects }) => {
  // Generate stable positions once
  const positions = useMemo(() => generateNeuralPositions(projects.length, 9), [projects.length]);
  
  // Track which node is hovered to highlight neighbors
  const [activeNode, setActiveNode] = useState<THREE.Vector3 | null>(null);

  // Helper to determine if a node is a neighbor of the active node
  const isNeighbor = (pos: THREE.Vector3) => {
      if (!activeNode) return false;
      const dist = pos.distanceTo(activeNode);
      return dist < 8.1 && dist > 0.1; // Must match threshold in NeuralConnections
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-[#050505] radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 24], fov: 45 }}>
        {/* Important: Set background for transmission shaders to work correctly */}
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={<LoadingFallback />}>
            {/* Environment map is required for MeshPhysicalMaterial/glass reflections */}
            <Environment preset="city" />

            {/* Camera Controls */}
            <OrbitControls 
                enablePan={false}
                enableZoom={true} 
                enableRotate={true}
                autoRotate={!activeNode} // Stop rotation when interacting
                autoRotateSpeed={0.3}
                minDistance={10}
                maxDistance={50}
                zoomSpeed={0.8}
            />
            
            {/* Cinematic Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[20, 20, 20]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-20, -20, -20]} intensity={1} color="#4A90E2" />
            
            {/* Environment Particles */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={0.5} />
            <Sparkles count={100} scale={20} size={4} speed={0.4} opacity={0.5} color="#ffffff" />
            
            {/* Background Animations */}
            <ShootingStar />

            {/* The Neural Web */}
            <group>
                <NeuralConnections positions={positions} activeNodePos={activeNode} />
                
                {projects.map((project, i) => (
                    <DataCrystal 
                        key={project.id} 
                        project={project} 
                        position={positions[i].vec} 
                        color={VIBRANT_COLORS[i % VIBRANT_COLORS.length]}
                        onHover={(hovering, vec) => setActiveNode(hovering && vec ? vec : null)}
                        isNeighbor={isNeighbor(positions[i].vec)}
                    />
                ))}
            </group>

        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute bottom-8 left-0 right-0 pointer-events-none flex flex-col items-center justify-center opacity-80">
        <p className="font-code text-xs text-[#A1A1AA] tracking-[0.3em] uppercase mb-2 text-shadow-glow">Explore The Network</p>
        <div className="w-px h-12 bg-gradient-to-t from-[#E50914] to-transparent"></div>
      </div>
    </div>
  );
};