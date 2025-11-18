import { Square } from '../types/shapes'

export const registerEvents = (
  canvas: HTMLCanvasElement,
  square: Square,
  setDragging: (dragging: boolean) => void,
  setOffset: (offset: { x: number; y: number }) => void,
  setLastPos: (pos: { x: number; y: number }) => void
) => {
  let dragging = false
  let offset = { x: 0, y: 0 }
  let lastPos = { x: 0, y: 0 }

  const isInsideSquare = (x: number, y: number) =>
    x >= square.x &&
    x <= square.x + square.size &&
    y >= square.y &&
    y <= square.y + square.size

  // Mouse
  const onMouseDown = (e: MouseEvent) => {
    if (isInsideSquare(e.clientX, e.clientY)) {
      dragging = true
      setDragging(true)
      offset = { x: e.clientX - square.x, y: e.clientY - square.y }
      setOffset(offset)
      lastPos = { x: square.x, y: square.y }
      setLastPos(lastPos)
      square.vx = 0
      square.vy = 0
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      square.x = e.clientX - offset.x
      square.y = e.clientY - offset.y
      square.vx = square.x - lastPos.x
      square.vy = square.y - lastPos.y
      lastPos = { x: square.x, y: square.y }
      setLastPos(lastPos)
    }
  }

  const onMouseUp = () => {
    dragging = false
    setDragging(false)
  }

  // Touch helpers
  const getTouchPos = (e: TouchEvent) => {
    const touch = e.touches[0]
    return { x: touch.clientX, y: touch.clientY }
  }

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    const pos = getTouchPos(e)
    if (isInsideSquare(pos.x, pos.y)) {
      dragging = true
      setDragging(true)
      offset = { x: pos.x - square.x, y: pos.y - square.y }
      setOffset(offset)
      lastPos = { x: square.x, y: square.y }
      setLastPos(lastPos)
      square.vx = 0
      square.vy = 0
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    if (dragging) {
      const pos = getTouchPos(e)
      square.x = pos.x - offset.x
      square.y = pos.y - offset.y
      square.vx = square.x - lastPos.x
      square.vy = square.y - lastPos.y
      lastPos = { x: square.x, y: square.y }
      setLastPos(lastPos)
    }
  }

  const onTouchEnd = () => {
    dragging = false
    setDragging(false)
  }

  // Registrar eventos
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)

  canvas.addEventListener('touchstart', onTouchStart, { passive: false })
  canvas.addEventListener('touchmove', onTouchMove, { passive: false })
  canvas.addEventListener('touchend', onTouchEnd)

  // Cleanup
  return () => {
    canvas.removeEventListener('mousedown', onMouseDown)
    canvas.removeEventListener('mousemove', onMouseMove)
    canvas.removeEventListener('mouseup', onMouseUp)

    canvas.removeEventListener('touchstart', onTouchStart)
    canvas.removeEventListener('touchmove', onTouchMove)
    canvas.removeEventListener('touchend', onTouchEnd)
  }
}
