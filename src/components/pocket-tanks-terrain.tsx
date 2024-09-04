'use client'

import React, { useRef, useEffect, useState } from 'react'
import { TankComponent } from './Tankcomponent'

export function PocketTanksTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [terrain, setTerrain] = useState<number[]>([])
  const [averageHeight, setAverageHeight] = useState<number>(0.2)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Generate terrain similar to Pocket Tanks
  const generateTerrain = () => {
    const newTerrain = []
    const width = canvasSize.width
    const height = canvasSize.height
    const segments = 10
    const segmentWidth = width / segments

    let prevHeight = Math.random() * (height * 0.3) + (height * averageHeight * 0.8)

    for (let s = 0; s <= segments; s++) {
      const randomFactor = Math.random()
      
      let newHeight
      if (randomFactor < 0.3) {
        newHeight = prevHeight + (Math.random() * height * 0.1)
      } else if (randomFactor < 0.6) {
        newHeight = prevHeight - (Math.random() * height * 0.1)
      } else {
        newHeight = height * averageHeight + (Math.random() - 0.5) * height * 0.2
      }

      newHeight = Math.max(height * 0.2, Math.min(newHeight, height * 0.8))

      for (let i = 0; i < segmentWidth; i++) {
        const t = i / segmentWidth
        const y = prevHeight * (1 - t) + newHeight * t + (Math.random() - 0.5) * 5
        newTerrain.push(Math.max(height * 0.1, Math.min(y, height * 0.9)))
      }

      prevHeight = newHeight
    }

    setTerrain(newTerrain)
  }

  // Draw terrain and sky on canvas
  const drawTerrain = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    // Draw sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
    skyGradient.addColorStop(0, '#87CEEB')
    skyGradient.addColorStop(1, '#E0F6FF')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, width, height)

    // Draw terrain
    ctx.beginPath()
    ctx.moveTo(0, height)
    for (let i = 0; i < terrain.length; i++) {
      ctx.lineTo(i, height - terrain[i])
    }
    ctx.lineTo(width, height)
    ctx.closePath()

    // Create terrain gradient (green colors)
    const terrainGradient = ctx.createLinearGradient(0, 0, 0, height)
    terrainGradient.addColorStop(0, '#228B22')  // Forest Green
    terrainGradient.addColorStop(1, '#32CD32')  // Lime Green

    ctx.fillStyle = terrainGradient
    ctx.fill()

    // Add terrain outline
    ctx.strokeStyle = '#006400'  // Dark Green
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Damage terrain at a specific point
  const damageTerrain = (x: number, y: number) => {
    const newTerrain = [...terrain]
    const radius = 30
    const impact = 40
    for (let i = Math.max(0, x - radius); i < Math.min(terrain.length, x + radius); i++) {
      const distance = Math.sqrt((x - i) ** 2 + (y - (canvasSize.height - terrain[i])) ** 2)
      if (distance < radius) {
        const reduction = impact * (1 - distance / radius)
        newTerrain[i] = Math.max(0, terrain[i] - reduction)
      }
    }
    setTerrain(newTerrain)
  }

  // Handle canvas click for damaging terrain
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      damageTerrain(x, y)
    }
  }

  // Initialize terrain and set up canvas
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      generateTerrain()
    }
  }, [canvasSize, averageHeight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && terrain.length > 0) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTerrain(ctx)
      }
    }
  }, [terrain])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 cursor-crosshair"
      />
      {terrain.length > 0 && (
        <TankComponent
          terrain={terrain}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
        />
      )}
    </div>
  )
}