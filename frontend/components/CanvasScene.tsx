// Dentro de la definición del cuadrado
const square = {
  x: canvas.width / 2 - 40,
  y: canvas.height / 2 - 40,
  size: 80,
  vx: 0,
  vy: 0,
  gravity: 0.3,
  friction: 0.98,
  scaleX: 1,
  scaleY: 1,
}

// Dentro de la definición de los círculos
const circles = Array.from({ length: 10 }, (_, i) => ({
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

// En la colisión con círculos
if (dist < minDist) {
  const nx = dx / dist
  const ny = dy / dist
  const overlap = minDist - dist

  // Corrección absoluta de penetración
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

  // Deformación por presión (achatar)
  const force = Math.abs(dot)
  if (force > 5) {
    square.scaleX = 1 + force * 0.05
    square.scaleY = 1 - force * 0.05
    c.scaleX = 1 + force * 0.03
    c.scaleY = 1 - force * 0.03
  }
}

// En el dibujo del cuadrado
ctx.save()
ctx.translate(square.x + square.size / 2, square.y + square.size / 2)
ctx.scale(square.scaleX, square.scaleY)
ctx.fillStyle = '#ff0055'
ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size)
ctx.restore()

// En el dibujo de los círculos
ctx.save()
ctx.translate(c.x, c.y)
ctx.scale(c.scaleX, c.scaleY)
ctx.beginPath()
ctx.arc(0, 0, c.r, 0, Math.PI * 2)
ctx.fillStyle = c.color
ctx.fill()
ctx.restore()

// Recuperación gradual de forma
square.scaleX += (1 - square.scaleX) * 0.1
square.scaleY += (1 - square.scaleY) * 0.1
circles.forEach((c) => {
  c.scaleX += (1 - c.scaleX) * 0.1
  c.scaleY += (1 - c.scaleY) * 0.1
})
