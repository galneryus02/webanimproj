'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [status, setStatus] = useState("Cargando...")

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/ping")
      .then(res => setStatus(res.data.message))
      .catch(() => setStatus("Error conectando con FastAPI"))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-pink-500 text-white"
    >
      <h1 className="text-4xl font-bold mb-3">Web Animada de Ejemplo</h1>
      <p className="text-lg">{status}</p>
    </motion.div>
  )
}
