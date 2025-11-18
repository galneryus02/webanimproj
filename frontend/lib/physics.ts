// /lib/physics.ts
import { Square, Circle } from '../types/shapes'

export const updateSquare = (square: Square, isDragging: boolean) => {
  if (!isDragging) {
    square.vy += square.gravity
    square.vx *= square.friction
    square.vy *= square.friction
    square.x += square.vx
    square.y += square.vy
  }
}

export const handleSquareBounds = (square: Square, W: number, H: number, restitution: number) => {
  if (square.x < 0 || square.x + square.size > W) {
    square.vx *= -restitution
    square.x = Math.max(0, Math.min(square.x, W - square.size))
  }
  if (square.y < 0 || square.y + square.size > H) {
    square.vy *= -restitution
    square.y = Math.max(0, Math.min(square.y, H - square.size))
  }
}

export const updateCircles = (circles: Circle[], W: number, H: number, restitution: number) => {
  circles.forEach((c) => {
    c.x += c.vx
    c.y += c.vy
    c.vx *= c.friction
    c.vy *= c.friction

    // Rebote contra bordes
    if (c.x - c.r < 0 || c.x + c.r > W) {
      c.vx *= -restitution
      c.x = Math.max(c.r, Math.min(c.x, W - c.r))
    }
    if (c.y - c.r < 0 || c.y + c.r > H) {
      c.vy *= -restitution
      c.y = Math.max(c.r, Math.min(c.y, H - c.r))
    }

    // Recuperación gradual de forma
    c.scaleX += (1 - c.scaleX) * 0.1
    c.scaleY += (1 - c.scaleY) * 0.1
  })
}

/**
 * Colisión sólida Square vs Circle:
 * - Corrección absoluta de penetración
 * - Rebote vectorial con restitución
 * - Reposicionamiento en el borde para evitar tunneling
 * - Ajuste anti-“magnetismo” (contacto visual más real)
 */
export const handleCollisions = (
  square: Square,
  circles: Circle[],
  restitution: number,
  isDragging: boolean
) => {
  const sqRadius = square.size / 2

  circles.forEach((c) => {
    const sqCenterX = square.x + sqRadius
    const sqCenterY = square.y + sqRadius

    const dx = sqCenterX - c.x
    const dy = sqCenterY - c.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Ajuste anti-magnetismo: retrasa ligeramente el umbral
    const minDist = c.r + sqRadius - 2

    if (dist > 0 && dist < minDist) {
      const nx = dx / dist
      const ny = dy / dist
      const overlap = minDist - dist

      // Empujar cuadrado fuera del círculo (corrección de penetración)
      square.x += nx * overlap
      square.y += ny * overlap

      // Rebote vectorial con restitución
      const dot = square.vx * nx + square.vy * ny
      square.vx -= 2 * dot * nx
      square.vy -= 2 * dot * ny
      square.vx *= restitution
      square.vy *= restitution

      // Transferencia parcial de impulso al círculo
      c.vx += square.vx * 0.5
      c.vy += square.vy * 0.5

      // Deformación contenida del círculo
      const force = Math.abs(dot)
      if (force > 5) {
        const maxDeform = 0.3
        c.scaleX = Math.min(1 + force * 0.03, 1 + maxDeform)
        c.scaleY = Math.max(1 - force * 0.03, 1 - maxDeform)
      }

      // Evitar tunneling: clavar en el borde físico cuando no hay drag
      if (!isDragging) {
        const correctedDist = c.r + sqRadius
        const edgeX = c.x + nx * correctedDist
        const edgeY = c.y + ny * correctedDist
        square.x = edgeX - sqRadius
        square.y = edgeY - sqRadius
      }
    }

    // Interacción al arrastrar (sin colisión): empuje suave
    if (isDragging && dist > 0 && dist < minDist + 50) {
      c.vx += (dx / dist) * -0.5
      c.vy += (dy / dist) * -0.5
    }
  })
}
