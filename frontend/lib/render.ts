import { Square, Circle } from '../types/shapes'

export const drawBackground = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
  const gradient = ctx.createLinearGradient(0, 0, W, H)
  gradient.addColorStop(0, '#141414')
  gradient.addColorStop(1, '#2b2b2b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, W, H)
}

export const drawSquare = (ctx: CanvasRenderingContext2D, square: Square) => {
  ctx.fillStyle = '#ff0055'
  ctx.fillRect(square.x, square.y, square.size, square.size)
}

export const drawCircles = (ctx: CanvasRenderingContext2D, circles: Circle[]) => {
  circles.forEach((c) => {
    ctx.save()
    ctx.translate(c.x, c.y)
    ctx.scale(c.scaleX, c.scaleY)
    ctx.beginPath()
    ctx.arc(0, 0, c.r, 0, Math.PI * 2)
    ctx.fillStyle = c.color
    ctx.fill()
    ctx.restore()
  })
}
