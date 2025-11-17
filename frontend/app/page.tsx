'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const backendUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/ping'
        : 'https://backend-j1yt.onrender.com/ping'

    axios
      .get(backendUrl)
      .then((res) => {
        setMessage(res.data.message || 'Respuesta sin mensaje')
      })
      .catch(() => {
        setMessage('Error al conectar con el backend')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main style={{ padding: '2rem', fontSize: '1.5rem' }}>
      <h1>Web Animada de Ejemplo</h1>
      <p>{loading ? 'Cargando...' : message}</p>
    </main>
  )
}
