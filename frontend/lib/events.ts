import { Square } from '../types/shapes'

export const registerEvents = (
  canvas: HTMLCanvasElement,
  square: Square,
  setDragging: (dragging: boolean) => void,
  setOffset: (offset: { x: number; y: number }) => void,
  setLastPos: (pos: { x: number; y: number }) => void
) => {
  const isInsideSquare = (x: number, y: number) =>
    x >= square.x &&
    x <= square.x + square.size &&
    y >= square.y &&
    y <= square.y + square.size

  const onMouseDown = (e: MouseEvent) => {
    if (isInsideSquare(e.clientX, e.clientY)) {
      setDragging(true)
      setOffset({ x: e.clientX - square.x, y: e.clientY - square.y })
      setLastPos({ x: square.x, y: square.y })
      square.vx = 0
      square.vy = 0
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if ((square as any).isDragging) {
      square.x = e.clientX - (square as any).offset.x
      square.y = e.clientY - (square as any).offset.y
      square.vx = square.x - (square as any).lastPos.x
      square.vy = square.y - (square as any).lastPos.y
      setLastPos({ x: square.x, y: square.y })
    }
  }

  const onMouseUp = () => setDragging(false)

  const getTouchPos = (e: TouchEvent) => {
    const touch = e.touches[0]
    return { x: touch.clientX, y: touch.clientY }
  }

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    const pos = getTouchPos(e)
    if (isInsideSquare(pos.x, pos.y)) {
      setDragging(true)
      setOffset({ x: pos.x - square.x, y: pos.y - square.y })
      setLastPos({ x: square.x, y: square.y })
      square.vx = 0
      square.vy = 0
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    if ((square as any).isDragging) {
      const pos = getTouchPos(e)
      square.x = pos.x - (square as any).offset.x
      square.y = pos.y - (square as any).offset.y
      square.vx = square.x - (square as any).lastPos.x
      square.vy = square.y - (square as any).lastPos.y
      setLastPos({ x: square.x, y: square.y })
    }
  }

  const onTouchEnd = () => setDragging(false)

  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.add
