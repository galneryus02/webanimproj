'use client'
import { useEffect, useRef, useState } from 'react'
import '../styles/canvas.css'

export default function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let t = 0
    let raf: number | null = null

    const square = {
      x: canvas.width / 2 - 40,
      y: canvas.height / 2 - 40,
      size: 80,
      vx: 0,
      vy: 0,
      gravity: 0.3,
      friction: 0.98,
    }

    const circles = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 30 + Math.random() * 20,
      color: `hsl(${i * 36}, 70%, 60%)`,
    }))

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Fondo
      const gradient = ctx.createLinearGradient(0, 0, W, H)
      gradient.addColorStop(0, '#141414')
      gradient.addColorStop(1, '#2b2b2b')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, W, H)

      // Círculos flotantes
      circles.forEach((c) => {
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
        ctx.fillStyle = c.color
        ctx.fill()
      })

      // Física del cuadrado
      if (!isDragging) {
        square.vy += square.gravity
        square.vx *= square.friction
        square.vy *= square.friction
        square.x += square.vx
        square.y += square.vy

        // Rebote contra bordes
        if (square.x < 0 || square.x + square.size > W) {
          square.vx *= -1
          square.x = Math.max(0, Math.min(square.x, W - square.size))
        }
        if (square.y < 0 || square.y + square.size > H) {
          square.vy *= -1
          square.y = Math.max(0, Math.min(square.y, H - square.size))
        }
      }

      // Dibujo del cuadrado
      ctx.fillStyle = '#ff0055'
      ctx.fillRect(square.x, square.y, square.size, square.size)

      t += 0.02
      raf = requestAnimationFrame(draw)
    }

    const isInsideSquare = (x: number, y: number) =>
      x >= square.x &&
      x <= square.x + square.size &&
      y >= square.y &&
      y <= square.y + square.size

    canvas.addEventListener('mousedown', (e) => {
      if (isInsideSquare(e.clientX, e.clientY)) {
        setIsDragging(true)
        setOffset({
          x: e.clientX - square.x,
          y: e.clientY - square.y,
        })
        square.vx = 0
        square.vy = 0
      }
    })

    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        square.x = e.clientX - offset.x
        square.y = e.clientY - offset.y
      }
    })

    canvas.addEventListener('mouseup', () => {
      setIsDragging(false)
    })

    raf = requestAnimationFrame(draw)

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [isDragging, offset])

  return <canvas ref={canvasRef} className="canvas-scene" />
}
