'use client'
import { useEffect, useRef } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Afirmación no-null en variables locales para que TypeScript no advierta en closures
    const canvasEl = canvasRef.current as HTMLCanvasElement
    if (!canvasEl) return

    const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    const setSize = () => {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    let t = 0
    let raf: number | null = null

    const draw = () => {
      const W = canvasEl.width
      const H = canvasEl.height

      // Fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, W, H)
      gradient.addColorStop(0, '#141414')
      gradient.addColorStop(1, '#2b2b2b')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, W, H)

      // Limpieza antes de dibujar el frame
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, W, H)

      // Círculos flotantes tipo “pop” cromático
      for (let i = 0; i < 12; i++) {
        const x = W / 2 + Math.sin(t + i * 0.6) * (W * 0.18)
        const y = H / 2 + Math.cos(t * 0.9 + i * 0.7) * (H * 0.18)
        const r = 28 + Math.sin(t * 1.3 + i * 0.4) * 10
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${(t * 60 + i * 32) % 360}, 70%, 60%)`
        ctx.fill()
      }

      // Rectángulo pulsante con sombra suave
      const rectSize = 110 + Math.sin(t * 2) * 22
      ctx.shadowColor = 'rgba(255, 0, 85, 0.35)'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#ff0055'
      ctx.fillRect(W / 2 - rectSize / 2, H / 2 - rectSize / 2, rectSize, rectSize)
      ctx.shadowBlur = 0

      // Ondas con líneas
      ctx.lineWidth = 2
      for (let j = 0; j < 4; j++) {
        ctx.strokeStyle = `hsla(${(t * 40 + j * 50) % 360}, 70%, 65%, 0.7)`
        ctx.beginPath()
        for (let x = 0; x <= W; x += 24) {
          const y = H * 0.75 + Math.sin(t * 1.2 + x * 0.01 + j) * 28
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      t += 0.02
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          background: '#0f0f0f',
        }}
      />
    </main>
  )
}
