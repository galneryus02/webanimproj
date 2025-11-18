'use client'
import { useEffect, useRef } from 'react'
import '../styles/canvas.css'

export default function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

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

    const isInsideSquare = (x: number, y: number) =>
      x >= square.x &&
      x <= square.x + square.size &&
      y >= square.y &&
      y <= square.y + square.size

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
      if (!isDraggingRef.current) {
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

        // Colisión con círculos
        circles.forEach((c) => {
          const dx = (square.x + square.size / 2) - c.x
          const dy = (square.y + square.size / 2) - c.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = c.r + square.size / 2

          if (dist < minDist) {
            // Rebote simple: invertir velocidad
            square.vx *= -1
            square.vy *= -1
            // Empujar fuera del círculo
            const angle = Math.atan2(dy, dx)
            square.x = c.x + Math.cos(angle) * minDist - square.size / 2
            square.y = c.y + Math.sin(angle) * minDist - square.size / 2
          }
        })
      }

      // Dibujo del cuadrado
      ctx.fillStyle = '#ff0055'
      ctx.fillRect(square.x, square.y, square.size, square.size)

      raf = requestAnimationFrame(draw)
    }

    // Listeners
    const onMouseDown = (e: MouseEvent) => {
      if (isInsideSquare(e.clientX, e.clientY)) {
        isDraggingRef.current = true
        offsetRef.current = {
          x: e.clientX - square.x,
          y: e.clientY - square.y,
        }
        square.vx = 0
        square.vy = 0
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        square.x = e.clientX - offsetRef.current.x
        square.y = e.clientY - offsetRef.current.y
      }
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)

    raf = requestAnimationFrame(draw)

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return <canvas ref={canvasRef} className="canvas-scene" />
}
