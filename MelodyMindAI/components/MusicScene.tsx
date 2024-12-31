'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, Environment } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import { useTheme } from '@/contexts/ThemeContext'
import * as THREE from 'three'

function MusicNote({ position, color }: { position: [number, number, number], color: string }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)

  useFrame((state) => {
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
  })

  return (
    <motion.mesh
      ref={mesh}
      position={position}
      scale={hovered ? 1.2 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={color} />
    </motion.mesh>
  )
}

function Logo() {
  const { nodes } = useGLTF('/assets/3d/duck.glb')
  const { theme } = useTheme()

  return (
    <motion.group
      scale={0.5}
      animate={{ rotateY: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      <mesh geometry={nodes.Duck.geometry}>
        <meshStandardMaterial color={theme === 'dark' ? '#FFA500' : '#FFD700'} />
      </mesh>
    </motion.group>
  )
}

function Scene() {
  const { theme } = useTheme()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Logo />
      <MusicNote position={[-1, 0, 0]} color={theme === 'dark' ? '#FF69B4' : '#FF1493'} />
      <MusicNote position={[1, 0, 0]} color={theme === 'dark' ? '#00CED1' : '#008B8B'} />
      <MusicNote position={[0, 1, 0]} color={theme === 'dark' ? '#9370DB' : '#8A2BE2'} />
      <Text
        position={[0, -1, 0]}
        fontSize={0.5}
        color={theme === 'dark' ? '#FFFFFF' : '#000000'}
      >
        MelodyMind AI
      </Text>
      <OrbitControls enableZoom={false} />
      <Environment preset="sunset" />
    </>
  )
}

export function MusicScene() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}

