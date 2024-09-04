'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"

interface TankProps {
  terrain: number[]
  canvasWidth: number
  canvasHeight: number
}

const TANK_WIDTH = 40
const TANK_HEIGHT = 20
const MOVE_SPEED = 7

export function TankComponent({ terrain, canvasWidth, canvasHeight }: TankProps) {
  const [tank1Position, setTank1Position] = useState(TANK_WIDTH)
  const [tank2Position, setTank2Position] = useState(canvasWidth - TANK_WIDTH)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && terrain.length > 0 && canvasWidth > 0 && canvasHeight > 0) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTanks(ctx)
      }
    }
  }, [tank1Position, tank2Position, terrain, canvasWidth, canvasHeight])

  const drawTanks = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw Tank 1
    drawTank(ctx, tank1Position, getTankY(tank1Position), '#FF0000')

    // Draw Tank 2
    drawTank(ctx, tank2Position, getTankY(tank2Position), '#0000FF')
  }

  const drawTank = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.fillStyle = color
    ctx.fillRect(x - TANK_WIDTH / 2, y - TANK_HEIGHT, TANK_WIDTH, TANK_HEIGHT)
    
    // Draw cannon
    ctx.beginPath()
    ctx.moveTo(x, y - TANK_HEIGHT)
    ctx.lineTo(x, y - TANK_HEIGHT - 15)
    ctx.strokeStyle = color
    ctx.lineWidth = 5
    ctx.stroke()
  }

  const getTankY = (x: number) => {
    const index = Math.floor(x)
    if (index >= 0 && index < terrain.length) {
      return canvasHeight - terrain[index]
    }
    return canvasHeight
  }

  const moveTank = (tankNumber: number, direction: 'left' | 'right') => {
    const setTankPosition = tankNumber === 1 ? setTank1Position : setTank2Position
    const currentPosition = tankNumber === 1 ? tank1Position : tank2Position
    const moveAmount = direction === 'left' ? -MOVE_SPEED : MOVE_SPEED

    setTankPosition((prevPos) => {
      const newPos = prevPos + moveAmount
      if (newPos >= TANK_WIDTH / 2 && newPos <= canvasWidth - TANK_WIDTH / 2) {
        return newPos
      }
      return prevPos
    })
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="absolute bottom-4 left-4 space-x-2">
        <Button onClick={() => moveTank(1, 'left')}>Tank 1 Left</Button>
        <Button onClick={() => moveTank(1, 'right')}>Tank 1 Right</Button>
      </div>
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button onClick={() => moveTank(2, 'left')}>Tank 2 Left</Button>
        <Button onClick={() => moveTank(2, 'right')}>Tank 2 Right</Button>
      </div>
    </>
  )
}