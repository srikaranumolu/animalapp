'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Sky, 
  Stars, 
  PointerLockControls, 
  PerspectiveCamera,
  useAnimations,
  useGLTF,
  Html,
  useBVH
} from '@react-three/drei';
import { Physics, usePlane, useBox, useSphere, useCylinder } from '@react-three/cannon';
import Link from 'next/link';
import styles from './zoo.module.css';
import * as THREE from 'three';

// Navigation component
const Navigation = () => (
  <nav className={styles.zooNav}>
    <Link href="/" className={styles.zooNavLink}>← Back to Home</Link>
    <h1 className={styles.zooTitle}>Animal Petting Zoo</h1>
    <div className={styles.controls}>
      <p>Move: WASD / Arrow Keys</p>
      <p>Look: Mouse</p>
      <p>Pet Animal: Left Click</p>
    </div>
  </nav>
);

// Ground with grass texture
function Ground(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#8BC34A" />
      <gridHelper args={[100, 100, '#4CAF50', '#4CAF50']} position={[0, 0.01, 0]} />
    </mesh>
  );
}

// Third-person camera that follows the player
function ThirdPersonCamera({ target, distance = 5, height = 3 }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (target.current) {
      // Get the target position
      const targetPosition = new THREE.Vector3();
      target.current.getWorldPosition(targetPosition);
      
      // Calculate camera position based on target's position and orientation
      const offset = new THREE.Vector3(0, height, distance);
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(targetPosition).add(offset);
      
      // Update camera position smoothly
      camera.position.lerp(cameraPosition, 0.1);
      
      // Make camera look at target
      camera.lookAt(targetPosition);
    }
  });
  
  return null;
}

// Player with third-person controls
function Player({ setNearbyAnimal }) {
  const playerRef = useRef();
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 1, 10],
    args: [0.5, 1.8, 0.5],
    type: 'Dynamic',
    linearDamping: 0.9,
    fixedRotation: true,
  }));
  
  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 1, 10]);
  const isJumping = useRef(false);
  const moveDirection = useRef({ forward: 0, right: 0 });
  
  // Reference to the player model for camera following
  const playerModelRef = useRef();
  
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => {
      position.current = p;
      
      // Update player model position
      if (playerModelRef.current) {
        playerModelRef.current.position.set(p[0], p[1] - 0.9, p[2]);
      }
    });
  }, [api.velocity, api.position]);
  
  useFrame(() => {
    // Check if near ground to allow jumping
    if (position.current[1] < 1.6) {
      isJumping.current = false;
    }
    
    // Apply movement based on player orientation
    if (moveDirection.current.forward !== 0 || moveDirection.current.right !== 0) {
      // Movement direction
      const moveZ = moveDirection.current.forward * 5;
      const moveX = moveDirection.current.right * 5;
      
      // Apply velocity
      api.velocity.set(moveX, velocity.current[1], moveZ);
      
      // Rotate player model to face movement direction
      if (playerModelRef.current && (moveX !== 0 || moveZ !== 0)) {
        const angle = Math.atan2(moveX, moveZ);
        playerModelRef.current.rotation.y = angle;
      }
    }
    
    // Detect nearby animals
    const playerPos = new THREE.Vector3(position.current[0], position.current[1], position.current[2]);
    
    // This would be replaced with actual collision detection in a full implementation
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
        moveDirection.current.forward = -1; // Negative Z is forward
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        moveDirection.current.forward = 1; // Positive Z is backward
      }
      // Left/right
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        moveDirection.current.right = -1; // Negative X is left
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        moveDirection.current.right = 1; // Positive X is right
      }
      // Jump - only if not already jumping
      if (e.code === 'Space' && !isJumping.current && position.current[1] < 1.6) {
        isJumping.current = true;
        api.velocity.set(velocity.current[0], 8, velocity.current[2]);
      }
    };
    
    const handleKeyUp = (e) => {
      // Stop movement when key is released
      if (['KeyW', 'ArrowUp'].includes(e.code) && moveDirection.current.forward < 0) {
        moveDirection.current.forward = 0;
      }
      if (['KeyS', 'ArrowDown'].includes(e.code) && moveDirection.current.forward > 0) {
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
    <>
      <mesh ref={ref} visible={false}>
        <boxGeometry args={[0.5, 1.8, 0.5]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
      
      {/* Simple player model */}
      <group ref={playerModelRef} position={[0, 0.1, 10]}>
        {/* Body */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 1, 0.3]} />
          <meshStandardMaterial color="#3498DB" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#E0E0E0" />
        </mesh>
        {/* Arms */}
        <mesh position={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#3498DB" />
        </mesh>
        <mesh position={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#3498DB" />
        </mesh>
        {/* Legs */}
        <mesh position={[0.2, -0.65, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#2980B9" />
        </mesh>
        <mesh position={[-0.2, -0.65, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#2980B9" />
        </mesh>
      </group>
    </>
  );
}

// More detailed animal component with petting interaction
function Animal({ position, name, color, scale = 1, onClick }) {
  const [ref, api] = useBox(() => ({ 
    mass: 10, 
    position, 
    args: [scale * 1.5, scale, scale * 2],
    type: 'Static'
  }));
  
  const [hovered, setHovered] = useState(false);
  const [petted, setPetted] = useState(false);
  const [pettingCount, setPettingCount] = useState(0);
  const animalRef = useRef();
  
  // Petting animation
  useFrame(() => {
    if (petted && animalRef.current) {
      // Simple bounce animation
      animalRef.current.position.y = Math.sin(Date.now() * 0.01) * 0.1 + position[1];
      
      // Reset petting state after animation
      if (Date.now() % 1000 < 20) {
        setPetted(false);
      }
    }
  });
  
  const handlePet = () => {
    setPetted(true);
    setPettingCount(prev => prev + 1);
    
    // Play happy animation
    if (onClick) onClick(name, pettingCount + 1);
  };
  
  // Determine animal appearance based on type
  let animalColor = color;
  let animalShape = 'box';
  
  switch (name.toLowerCase()) {
    case 'lion':
      animalColor = '#FFD166';
      animalShape = 'lion';
      break;
    case 'elephant':
      animalColor = '#118AB2';
      animalShape = 'elephant';
      break;
    case 'penguin':
      animalColor = '#073B4C';
      animalShape = 'penguin';
      break;
    case 'giraffe':
      animalColor = '#EF476F';
      animalShape = 'giraffe';
      break;
    case 'frog':
      animalColor = '#06D6A0';
      animalShape = 'frog';
      break;
  }
  
  return (
    <group ref={animalRef}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onClick={handlePet}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={petted ? [scale * 1.05, scale * 0.95, scale * 1.05] : [scale, scale, scale]}
      >
        {animalShape === 'lion' && (
          <>
            {/* Lion body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.5, 1, 2]} />
              <meshStandardMaterial color={hovered ? '#FFECB3' : '#FFD166'} />
            </mesh>
            {/* Lion head */}
            <mesh position={[0, 0.7, 0.8]} castShadow>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color={hovered ? '#FFECB3' : '#FFD166'} />
            </mesh>
            {/* Lion mane */}
            <mesh position={[0, 0.7, 0.8]} castShadow>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color="#E65100" wireframe />
            </mesh>
          </>
        )}
        
        {animalShape === 'elephant' && (
          <>
            {/* Elephant body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.8, 1.5, 2.5]} />
              <meshStandardMaterial color={hovered ? '#B3E5FC' : '#118AB2'} />
            </mesh>
            {/* Elephant head */}
            <mesh position={[0, 0.6, 1]} castShadow>
              <boxGeometry args={[1.2, 1.2, 1]} />
              <meshStandardMaterial color={hovered ? '#B3E5FC' : '#118AB2'} />
            </mesh>
            {/* Elephant trunk */}
            <mesh position={[0, 0.2, 1.7]} castShadow>
              <cylinderGeometry args={[0.2, 0.1, 1.5, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color={hovered ? '#B3E5FC' : '#118AB2'} />
            </mesh>
          </>
        )}
        
        {animalShape === 'penguin' && (
          <>
            {/* Penguin body */}
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.4, 1.5, 16]} />
              <meshStandardMaterial color={hovered ? '#263238' : '#073B4C'} />
            </mesh>
            {/* Penguin belly */}
            <mesh position={[0, 0, 0.25]} castShadow>
              <cylinderGeometry args={[0.45, 0.35, 1.51, 16]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Penguin head */}
            <mesh position={[0, 1, 0]} castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color={hovered ? '#263238' : '#073B4C'} />
            </mesh>
          </>
        )}
        
        {animalShape === 'giraffe' && (
          <>
            {/* Giraffe body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1, 1, 2]} />
              <meshStandardMaterial color={hovered ? '#FFCDD2' : '#EF476F'} />
            </mesh>
            {/* Giraffe neck */}
            <mesh position={[0, 1.5, 0.5]} castShadow>
              <boxGeometry args={[0.4, 2, 0.4]} />
              <meshStandardMaterial color={hovered ? '#FFCDD2' : '#EF476F'} />
            </mesh>
            {/* Giraffe head */}
            <mesh position={[0, 2.8, 0.5]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.8]} />
              <meshStandardMaterial color={hovered ? '#FFCDD2' : '#EF476F'} />
            </mesh>
          </>
        )}
        
        {animalShape === 'frog' && (
          <>
            {/* Frog body */}
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color={hovered ? '#B2DFDB' : '#06D6A0'} />
            </mesh>
            {/* Frog head */}
            <mesh position={[0, 0.3, 0.7]} castShadow>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color={hovered ? '#B2DFDB' : '#06D6A0'} />
            </mesh>
            {/* Frog eyes */}
            <mesh position={[0.3, 0.5, 0.9]} castShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[-0.3, 0.5, 0.9]} castShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </>
        )}
        
        {/* Default animal if shape not specified */}
        {animalShape === 'box' && (
          <boxGeometry args={[1, 1, 1]} />
        )}
      </mesh>
      
      {/* Animal name label */}
      <Html position={[0, scale * 1.5, 0]} center>
        <div className={styles.animalLabel3D}>
          {name}
          {pettingCount > 0 && (
            <span className={styles.pettingCount}>
              ❤️ × {pettingCount}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

// Create a fence/cage for animals
function Cage({ position, width, depth, height = 2, color = '#8D6E63' }) {
  const thickness = 0.1;
  
  // Create fence posts and rails
  const posts = [];
  const rails = [];
  const postSpacing = 2;
  
  // Calculate the number of posts needed
  const numPostsWidth = Math.ceil(width / postSpacing) + 1;
  const numPostsDepth = Math.ceil(depth / postSpacing) + 1;
  
  // Create corner posts
  posts.push(
    { pos: [position[0] - width/2, position[1] + height/2, position[2] - depth/2] },
    { pos: [position[0] + width/2, position[1] + height/2, position[2] - depth/2] },
    { pos: [position[0] - width/2, position[1] + height/2, position[2] + depth/2] },
    { pos: [position[0] + width/2, position[1] + height/2, position[2] + depth/2] }
  );
  
  // Create rails connecting posts (frontside)
  for (let i = 0; i < 3; i++) {
    const railHeight = position[1] + (i + 1) * (height / 3);
    rails.push({
      pos: [position[0], railHeight, position[2] - depth/2],
      size: [width, thickness, thickness],
      rot: [0, 0, 0]
    });
  }
  
  // Create rails connecting posts (backside)
  for (let i = 0; i < 3; i++) {
    const railHeight = position[1] + (i + 1) * (height / 3);
    rails.push({
      pos: [position[0], railHeight, position[2] + depth/2],
      size: [width, thickness, thickness],
      rot: [0, 0, 0]
    });
  }
  
  // Create rails connecting posts (left side)
  for (let i = 0; i < 3; i++) {
    const railHeight = position[1] + (i + 1) * (height / 3);
    rails.push({
      pos: [position[0] - width/2, railHeight, position[2]],
      size: [thickness, thickness, depth],
      rot: [0, 0, 0]
    });
  }
  
  // Create rails connecting posts (right side)
  for (let i = 0; i < 3; i++) {
    const railHeight = position[1] + (i + 1) * (height / 3);
    rails.push({
      pos: [position[0] + width/2, railHeight, position[2]],
      size: [thickness, thickness, depth],
      rot: [0, 0, 0]
    });
  }
  
  return (
    <group>
      {/* Gate (front side opening) */}
      <mesh position={[position[0], position[1] + height/2, position[2] - depth/2]} castShadow>
        <boxGeometry args={[1.2, height, thickness]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Render posts */}
      {posts.map((post, index) => (
        <mesh key={`post-${index}`} position={post.pos} castShadow>
          <boxGeometry args={[thickness, height, thickness]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      ))}
      
      {/* Render rails */}
      {rails.map((rail, index) => (
        <mesh key={`rail-${index}`} position={rail.pos} rotation={rail.rot} castShadow>
          <boxGeometry args={rail.size} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      
      {/* Floor of the enclosure */}
      <mesh 
        position={[position[0], position[1] + 0.01, position[2]]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#90A955" />
      </mesh>
    </group>
  );
}

// Create a sign for each animal enclosure
function EnclosureSign({ position, animalName, animalFact }) {
  return (
    <group position={position}>
      {/* Sign post */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.1, 1.6, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Sign board */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#F9A825" />
      </mesh>
      
      {/* Sign content */}
      <Html position={[0, 1.7, 0.03]} center distanceFactor={10}>
        <div className={styles.signContent}>
          <h3>{animalName}</h3>
          <p>{animalFact}</p>
        </div>
      </Html>
    </group>
  );
}

// Create decorative trees
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Tree leaves */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
    </group>
  );
}

// Create a welcome sign for the zoo entrance
function WelcomeSign() {
  return (
    <group position={[0, 0, 15]}>
      {/* Sign structure */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[10, 2, 0.3]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Sign posts */}
      <mesh position={[-4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      <mesh position={[4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Sign text */}
      <Html position={[0, 3, 0.2]} center>
        <div className={styles.welcomeSignText}>
          <h1>Welcome to the Animal Petting Zoo!</h1>
          <p>Walk around and pet the animals to make them happy!</p>
        </div>
      </Html>
    </group>
  );
}

// Create a bench for visitors
function Bench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Bench seat */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 0.6]} />
        <meshStandardMaterial color="#A1887F" />
      </mesh>
      
      {/* Bench back */}
      <mesh position={[0, 1, -0.25]} castShadow>
        <boxGeometry args={[2, 0.8, 0.1]} />
        <meshStandardMaterial color="#A1887F" />
      </mesh>
      
      {/* Bench legs */}
      <mesh position={[-0.8, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.6]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0.8, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.6]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}

// Main Zoo Scene Component
function ZooScene({ setMessage, setDisplayLabels }) {
  // Define animals and their information
  const animals = [
    { 
      name: 'Lion', 
      color: '#FFD166', 
      position: [-12, 0, -5], 
      scale: 1.2,
      enclosureSize: [8, 8],
      enclosurePos: [-12, 0, -5],
      fact: 'Lions can sleep up to 20 hours a day!'
    },
    { 
      name: 'Elephant', 
      color: '#118AB2', 
      position: [12, 0, -5], 
      scale: 1.5,
      enclosureSize: [10, 8],
      enclosurePos: [12, 0, -5],
      fact: 'Elephants can recognize themselves in mirrors!'
    },
    { 
      name: 'Penguin', 
      color: '#073B4C', 
      position: [-12, 0, 7], 
      scale: 0.8,
      enclosureSize: [8, 8],
      enclosurePos: [-12, 0, 7],
      fact: 'Penguins can jump as high as 6 feet!'
    },
    { 
      name: 'Giraffe', 
      color: '#EF476F', 
      position: [12, 0, 7], 
      scale: 1.7,
      enclosureSize: [10, 8],
      enclosurePos: [12, 0, 7],
      fact: 'Giraffes only need to sleep 2 hours a day!' 
    },
    { 
      name: 'Frog', 
      color: '#06D6A0', 
      position: [0, 0, -12], 
      scale: 0.6,
      enclosureSize: [6, 6],
      enclosurePos: [0, 0, -12],
      fact: 'Some frogs can jump over 20 times their body length!'
    }
  ];
  
  // Track which animal is nearby and being petted
  const [nearbyAnimal, setNearbyAnimal] = useState(null);
  const [pettingMessage, setPettingMessage] = useState('');
  const playerRef = useRef();
  
  // Pass animal data for UI elements
  useEffect(() => {
    // Pass animal data for HTML labels
    setDisplayLabels(animals.map(animal => ({
      name: animal.name,
      position: animal.position
    })));
    
    // Update status message
    if (pettingMessage) {
      setMessage(pettingMessage);
    } else if (nearbyAnimal) {
      setMessage(`You're near a ${nearbyAnimal}! Click to pet it.`);
    } else {
      setMessage('Walk around to find and pet the animals!');
    }
  }, [nearbyAnimal, pettingMessage, setMessage, setDisplayLabels, animals]);
  
  // Handle animal petting interaction
  const handlePet = (name, petCount) => {
    // Set different messages based on pet count
    if (petCount < 3) {
      setPettingMessage(`You petted the ${name}! They seem to like it.`);
    } else if (petCount < 5) {
      setPettingMessage(`The ${name} is enjoying your pets! They look happy.`);
    } else {
      setPettingMessage(`The ${name} loves you! They're extremely happy!`);
    }
    
    // Clear message after a delay
    setTimeout(() => setPettingMessage(''), 3000);
  };
  
  // Tree and bench positions for decoration
  const treePositions = [
    [-5, 0, 15], [5, 0, 15], [-15, 0, 15], [15, 0, 15],
    [-20, 0, 0], [20, 0, 0], [-20, 0, -10], [20, 0, -10]
  ];
  
  const benchPositions = [
    { pos: [0, 0, 0], rot: [0, 0, 0] },
    { pos: [-6, 0, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [6, 0, 0], rot: [0, -Math.PI / 2, 0] }
  ];
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Environment */}
      <Sky sunPosition={[100, 10, 100]} />
      <fog attach="fog" args={['#e0f7fa', 30, 90]} />
      
      {/* Physics world */}
      <Physics>
        {/* Ground */}
        <Ground />
        
        {/* Player character with third-person camera */}
        <Player ref={playerRef} setNearbyAnimal={setNearbyAnimal} />
        <ThirdPersonCamera target={playerRef} distance={5} height={2} />
        
        {/* Zoo Welcome Sign */}
        <WelcomeSign />
        
        {/* Animal enclosures with animals */}
        {animals.map((animal, index) => (
          <group key={index}>
            {/* Enclosure/Cage */}
            <Cage 
              position={animal.enclosurePos} 
              width={animal.enclosureSize[0]} 
              depth={animal.enclosureSize[1]} 
              height={2}
            />
            
            {/* Animal */}
            <Animal 
              position={animal.position} 
              name={animal.name} 
              color={animal.color}
              scale={animal.scale}
              onClick={handlePet}
            />
            
            {/* Information Sign */}
            <EnclosureSign 
              position={[
                animal.enclosurePos[0], 
                0, 
                animal.enclosurePos[2] - animal.enclosureSize[1]/2 - 0.6
              ]} 
              animalName={animal.name} 
              animalFact={animal.fact}
            />
          </group>
        ))}
        
        {/* Decorative trees */}
        {treePositions.map((pos, index) => (
          <Tree key={`tree-${index}`} position={pos} scale={1 + Math.random() * 0.5} />
        ))}
        
        {/* Benches for visitors */}
        {benchPositions.map((bench, index) => (
          <Bench key={`bench-${index}`} position={bench.pos} rotation={bench.rot} />
        ))}
      </Physics>
    </>
  );
}

// Message overlay component that displays notifications
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
        <h2>Welcome to the Animal Petting Zoo!</h2>
        <ul>
          <li><strong>Move:</strong> Use WASD or Arrow Keys to walk around the zoo</li>
          <li><strong>Look:</strong> Move your mouse to look around</li>
          <li><strong>Pet Animals:</strong> Click on an animal to pet it</li>
          <li><strong>Goal:</strong> Visit each animal and make them happy by petting them</li>
        </ul>
        <p>Each animal has different reactions to being petted. Try to make all animals happy!</p>
        <button className={styles.startButton} onClick={onClose}>
          Start Exploring!
        </button>
      </div>
    </div>
  );
}

// Main Zoo Page Component
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
            </Suspense>
          </Canvas>
          
          {/* HTML-based messages */}
          {message && <MessageOverlay message={message} />}
          
          {/* Welcome sign HTML overlay */}
          <div className={styles.welcomeSign}>
            Welcome to the 3D Petting Zoo!
          </div>
          
          {/* Controls reminder */}
          <div className={styles.controlsReminder}>
            <p>WASD / Arrow Keys to move</p>
            <p>Click to pet animals</p>
          </div>
        </>
      )}
    </div>
  );
} 