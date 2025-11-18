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
