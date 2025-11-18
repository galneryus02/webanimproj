export const handleCollisions = (
  square: Square,
  circles: Circle[],
  restitution: number,
  isDragging: boolean
) => {
  const sqCenterX = square.x + square.size / 2
  const sqCenterY = square.y + square.size / 2
  const sqRadius = square.size / 2

  circles.forEach((c) => {
    const dx = sqCenterX - c.x
    const dy = sqCenterY - c.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const minDist = c.r + sqRadius

    if (dist < minDist) {
      // Corrección absoluta de penetración
      const nx = dx / dist
      const ny = dy / dist
      const overlap = minDist - dist

      // Empujar cuadrado fuera del círculo
      square.x += nx * overlap
      square.y += ny * overlap

      // Rebote vectorial
      const dot = square.vx * nx + square.vy * ny
      square.vx -= 2 * dot * nx
      square.vy -= 2 * dot * ny
      square.vx *= restitution
      square.vy *= restitution

      // Empujar círculo
      c.vx += square.vx * 0.5
      c.vy += square.vy * 0.5

      // Deformación contenida
      const force = Math.abs(dot)
      if (force > 5) {
        const maxDeform = 0.3
        c.scaleX = Math.min(1 + force * 0.03, 1 + maxDeform)
        c.scaleY = Math.max(1 - force * 0.03, 1 - maxDeform)
      }

      // Corrección adicional: evitar tunneling
      if (!isDragging) {
        // Reposicionar cuadrado justo en el borde
        const correctedDist = c.r + sqRadius
        square.x = c.x + nx * correctedDist - square.size / 2
        square.y = c.y + ny * correctedDist - square.size / 2
      }
    }

    // Interacción al arrastrar (sin colisión)
    if (isDragging && dist < minDist + 50) {
      c.vx += (dx / dist) * -0.5
      c.vy += (dy / dist) * -0.5
    }
  })
}
