'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, PointerLockControls } from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import Link from 'next/link';
import styles from './zoo.module.css';
import * as THREE from 'three';

// Meta data for SEO
export const metadata = {
  title: '3D Zoo Simulator - Animal Explorer',
  description: 'Experience our interactive 3D Zoo! Walk around in first-person view, pet animals, and learn fun facts about lions, elephants, penguins, giraffes, and frogs in this immersive virtual zoo environment.',
};

// Navigation component
const Navigation = () => (
  <nav className={styles.zooNav}>
    <Link href="/" className={styles.zooNavLink}>← Back to Home</Link>
    <h1 className={styles.zooTitle}>Animal Zoo Simulator</h1>
    <div className={styles.controls}>
      <p>Move: WASD / Arrow Keys</p>
      <p>Look: Mouse</p>
      <p>Pet Animal: Left Click</p>
    </div>
  </nav>
);

// Ground plane
function Ground(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4CAF50" />
    </mesh>
  );
}

// Player movement with first person controls
function Player({ setNearbyAnimal }) {
  const { camera } = useThree();
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 1.5, 5],
    args: [0.5, 1.8, 0.5],
    type: 'Dynamic',
    linearDamping: 0.95,
    fixedRotation: true,
  }));
  
  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 1.5, 5]);
  const isJumping = useRef(false);
  const moveDirection = useRef({ forward: 0, right: 0 });
  
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => {
      position.current = p;
      
      // Update camera position
      camera.position.set(p[0], p[1] + 0.8, p[2]);
    });
  }, [api.velocity, api.position, camera]);
  
  useFrame(() => {
    // Check if near ground to allow jumping
    if (position.current[1] < 1.6) {
      isJumping.current = false;
    }
    
    // Apply movement based on camera direction
    if (moveDirection.current.forward !== 0 || moveDirection.current.right !== 0) {
      // Get camera direction vectors
      const cameraDirection = new THREE.Vector3();
      const cameraRight = new THREE.Vector3();
      
      // Get forward direction (Z axis) in world space
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0; // Keep movement horizontal
      cameraDirection.normalize();
      
      // Get right direction (X axis) in world space
      cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
      cameraRight.y = 0; // Keep movement horizontal
      cameraRight.normalize();
      
      // Calculate velocity based on input directions
      const moveZ = cameraDirection.multiplyScalar(moveDirection.current.forward * 5);
      const moveX = cameraRight.multiplyScalar(moveDirection.current.right * 5);
      
      // Combine directions and apply velocity
      const finalVelocity = new THREE.Vector3()
        .add(moveZ)
        .add(moveX)
        .normalize()
        .multiplyScalar(5); // Speed multiplier
      
      api.velocity.set(finalVelocity.x, velocity.current[1], finalVelocity.z);
    }
    
    // Check for nearby animals (simplified)
    if (Math.random() < 0.005) {
      const randomAnimalIndex = Math.floor(Math.random() * 5);
      const animalNames = ['Lion', 'Elephant', 'Penguin', 'Giraffe', 'Frog'];
      setNearbyAnimal(animalNames[randomAnimalIndex]);
      setTimeout(() => setNearbyAnimal(null), 3000);
    }
  });
  
  // Handle key controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Forward/backward
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        moveDirection.current.forward = 1;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        moveDirection.current.forward = -1;
      }
      // Left/right
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        moveDirection.current.right = -1;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        moveDirection.current.right = 1;
      }
      // Jump - only if not already jumping
      if (e.code === 'Space' && !isJumping.current && position.current[1] < 1.6) {
        isJumping.current = true;
        api.velocity.set(velocity.current[0], 6, velocity.current[2]);
      }
    };
    
    const handleKeyUp = (e) => {
      // Stop movement when key is released
      if (['KeyW', 'ArrowUp'].includes(e.code) && moveDirection.current.forward > 0) {
        moveDirection.current.forward = 0;
      }
      if (['KeyS', 'ArrowDown'].includes(e.code) && moveDirection.current.forward < 0) {
        moveDirection.current.forward = 0;
      }
      if (['KeyA', 'ArrowLeft'].includes(e.code) && moveDirection.current.right < 0) {
        moveDirection.current.right = 0;
      }
      if (['KeyD', 'ArrowRight'].includes(e.code) && moveDirection.current.right > 0) {
        moveDirection.current.right = 0;
      }
      
      // If no keys are pressed, stop horizontal movement
      if (moveDirection.current.forward === 0 && moveDirection.current.right === 0) {
        api.velocity.set(0, velocity.current[1], 0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [api]);
  
  return (
    <mesh ref={ref} visible={false}>
      <boxGeometry args={[0.5, 1.8, 0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

// Simple animal component
function Animal({ position, name, color, scale = 1, onClick }) {
  const [ref, api] = useBox(() => ({ 
    mass: 1, 
    position, 
    args: [scale, scale, scale]
  }));
  
  const [hovered, setHovered] = useState(false);
  const [petted, setPetted] = useState(false);
  
  const handlePet = () => {
    setPetted(true);
    // Animate the animal when petted
    api.velocity.set(0, 3, 0);
    setTimeout(() => setPetted(false), 1000);
    if (onClick) onClick(name);
  };
  
  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      onClick={handlePet}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={petted ? [scale * 1.2, scale * 0.8, scale * 1.2] : [scale, scale, scale]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#FFC107' : color} />
    </mesh>
  );
}

// Zoo enclosures (fence)
function Enclosure({ position, size }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[size[0], 1, size[1]]} />
      <meshStandardMaterial color="#8D6E63" />
    </mesh>
  );
}

// Welcome sign component (without text)
function WelcomeSign() {
  return (
    <mesh position={[0, 10, -15]}>
      <boxGeometry args={[10, 2, 0.2]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}

// Main Zoo Scene
function ZooScene({ setMessage, setDisplayLabels }) {
  // Define animals
  const animals = [
    { name: 'Lion', color: '#FFD166', position: [-5, 0.5, -5], scale: 1.2 },
    { name: 'Elephant', color: '#118AB2', position: [5, 0.5, -8], scale: 1.5 },
    { name: 'Penguin', color: '#073B4C', position: [0, 0.5, -10], scale: 0.8 },
    { name: 'Giraffe', color: '#EF476F', position: [8, 0.5, -3], scale: 1.7 },
    { name: 'Frog', color: '#06D6A0', position: [-8, 0.5, -2], scale: 0.6 }
  ];
  
  const [nearbyAnimal, setNearbyAnimal] = useState(null);
  
  useEffect(() => {
    // Pass animal data for HTML labels
    setDisplayLabels(animals);
    
    if (nearbyAnimal) {
      setMessage(`You're near a ${nearbyAnimal}! Click to pet it.`);
    } else {
      setMessage('Walk around to find animals!');
    }
  }, [nearbyAnimal, setMessage, setDisplayLabels, animals]);
  
  const handlePet = (name) => {
    setMessage(`You petted the ${name}! They look happy.`);
    setTimeout(() => {
      setMessage('Walk around to find more animals!');
    }, 2000);
  };
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      
      <Physics>
        <Ground />
        <Player setNearbyAnimal={setNearbyAnimal} />
        
        {animals.map((animal, index) => (
          <Animal 
            key={index} 
            name={animal.name} 
            color={animal.color} 
            position={animal.position} 
            scale={animal.scale} 
            onClick={handlePet}
          />
        ))}
        
        {/* Zoo enclosures/fences */}
        <Enclosure position={[0, 0.5, -15]} size={[30, 0.5]} />
        <Enclosure position={[0, 0.5, 5]} size={[30, 0.5]} />
        <Enclosure position={[-15, 0.5, -5]} size={[0.5, 20]} />
        <Enclosure position={[15, 0.5, -5]} size={[0.5, 20]} />
      </Physics>
      
      <WelcomeSign />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={200} depth={50} count={1000} factor={4} saturation={0} />
    </>
  );
}

// Player message display
function MessageOverlay({ message }) {
  return (
    <div className={styles.messageOverlay}>
      {message}
    </div>
  );
}

// Instructions modal
function Instructions({ onClose }) {
  return (
    <div className={styles.instructionsModal}>
      <div className={styles.instructionsContent}>
        <h2>How to Play</h2>
        <ul>
          <li>Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move around</li>
          <li>Use your <strong>mouse</strong> to look around</li>
          <li>Press <strong>Space</strong> to jump</li>
          <li><strong>Left Click</strong> on animals to pet them</li>
          <li>Try to find and pet all the animals in the zoo!</li>
        </ul>
        <button className={styles.startButton} onClick={onClose}>Start Exploring!</button>
      </div>
    </div>
  );
}

// Main Component
export default function ZooPage() {
  const [message, setMessage] = useState('Welcome to the Zoo! Walk around to find animals.');
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [displayLabels, setDisplayLabels] = useState([]);
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={styles.zooContainer}>
      <Navigation />
      
      {loading ? (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Zoo Experience...</p>
        </div>
      ) : (
        <>
          {showInstructions && (
            <Instructions onClose={() => setShowInstructions(false)} />
          )}
          
          <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 75 }} className={styles.zooCanvas}>
            <Suspense fallback={null}>
              <ZooScene 
                setMessage={setMessage} 
                setDisplayLabels={setDisplayLabels}
              />
              <PointerLockControls />
            </Suspense>
          </Canvas>
          
          {/* HTML-based animal labels outside of canvas */}
          <div className={styles.animalLabelsContainer}>
            {displayLabels.map((animal, index) => (
              <div 
                key={index}
                className={styles.animalLabel}
                style={{
                  left: `calc(50% + ${animal.position[0] * 20}px)`,
                  top: `calc(50% - ${animal.position[2] * 20}px)`
                }}
              >
                {animal.name}
              </div>
            ))}
          </div>
          
          {/* HTML-based welcome sign */}
          <div className={styles.welcomeSign}>
            Welcome to the 3D Zoo!
          </div>
          
          <MessageOverlay message={message} />
          
          <div className={styles.zooControls}>
            <button className={styles.zooButton}>Feed Animals</button>
            <button className={styles.zooButton}>Take Photo</button>
            <button className={styles.zooButton} onClick={() => setShowInstructions(true)}>Help</button>
          </div>
        </>
      )}
    </div>
  );
} 