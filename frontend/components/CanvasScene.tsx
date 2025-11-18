'use client'
import { useEffect, useRef } from 'react'
import '../styles/canvas.css'
import { Square, Circle } from '../types/shapes'
import { updateSquare, handleSquareBounds, updateCircles, handleCollisions } from '../lib/physics'
import { drawBackground, drawSquare, drawCircles } from '../lib/render'
import { registerEvents } from '../lib/events'

export default function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const restitution = 0.8

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let raf: number | null = null
    let isDragging = false
    let offset = { x: 0, y: 0 }
    let lastPos = { x: 0, y: 0 }

    const square: Square = {
      x: canvas.width / 2 - 40,
      y: canvas.height / 2 - 40,
      size: 80,
      vx: 0,
      vy: 0,
      gravity: 0.3,
      friction: 0.98,
    }

    const circles: Circle[] = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 30 + Math.random() * 20,
      color: `hsl(${i * 36}, 70%, 60%)`,
      vx: 0,
      vy: 0,
      friction: 0.95,
      scaleX: 1,
      scaleY: 1,
    }))

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      drawBackground(ctx, W, H)
      updateCircles(circles, W, H, restitution)
      updateSquare(square, isDragging)
      handleSquareBounds(square, W, H, restitution)
      handleCollisions(square, circles, restitution, isDragging)

      drawCircles(ctx, circles)
      drawSquare(ctx, square)

      raf = requestAnimationFrame(draw)
    }

    const cleanupEvents = registerEvents(canvas, square,
      (dragging) => { isDragging = dragging },
      (o) => { offset = o },
      (p) => { lastPos = p }
    )

    raf = requestAnimationFrame(draw)

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      cleanupEvents()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="canvas-scene" />
}
