'use client'
import { useEffect, useRef } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let t = 0

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1a1a1a')
      gradient.addColorStop(1, '#333')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Círculos flotantes
      for (let i = 0; i < 10; i++) {
        const x = canvas.width / 2 + Math.sin(t + i) * 200
        const y = canvas.height / 2 + Math.cos(t + i * 1.5) * 200
        const radius = 30 + Math.sin(t + i * 0.5) * 10

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${(t * 50 + i * 36) % 360}, 70%, 60%)`
        ctx.fill()
      }

      // Rectángulo pulsante
      const rectSize = 100 + Math.sin(t * 2) * 20
      ctx.fillStyle = '#ff0055'
      ctx.fillRect(canvas.width / 2 - rectSize / 2, canvas.height / 2 - rectSize / 2, rectSize, rectSize)

      t += 0.02
      requestAnimationFrame(draw)
    }

    draw()
  }, [])

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </main>
  )
}
