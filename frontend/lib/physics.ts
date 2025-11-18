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

    if (c.x - c.r < 0 || c.x + c.r > W) {
      c.vx *= -restitution
      c.x = Math.max(c.r, Math.min(c.x, W - c.r))
    }
    if (c.y - c.r < 0 || c.y + c.r > H) {
      c.vy *= -restitution
      c.y = Math.max(c.r, Math.min(c.y, H - c.r))
    }

    // Recuperación gradual
    c.scaleX += (1 - c.scaleX) * 0.1
    c.scaleY += (1 - c.scaleY) * 0.1
  })
}

export const handleCollisions = (
  square: Square,
  circles: Circle[],
  restitution: number,
  isDragging: boolean
) => {
  circles.forEach((c) => {
    const dx = (square.x + square.size / 2) - c.x
    const dy = (square.y + square.size / 2) - c.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const minDist = c.r + square.size / 2

    if (dist < minDist) {
      const nx = dx / dist
      const ny = dy / dist
      const overlap = minDist - dist

      square.x += nx * overlap
      square.y += ny * overlap

      const dot = square.vx * nx + square.vy * ny
      square.vx -= 2 * dot * nx
      square.vy -= 2 * dot * ny
      square.vx *= restitution
      square.vy *= restitution

      c.vx += square.vx * 0.5
      c.vy += square.vy * 0.5

      const force = Math.abs(dot)
      if (force > 5) {
        const maxDeform = 0.3
        c.scaleX = Math.min(1 + force * 0.03, 1 + maxDeform)
        c.scaleY = Math.max(1 - force * 0.03, 1 - maxDeform)
      }
    }

    if (isDragging && dist < minDist + 50) {
      c.vx += (dx / dist) * -0.5
      c.vy += (dy / dist) * -0.5
    }
  })
}
