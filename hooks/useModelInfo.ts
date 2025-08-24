'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export function useModelInfo() {
  const [modelInfo, setModelInfo] = useState<{
    intercept: number
    b1: number
    b2: number
    b3: number
    updated_at: string
  } | null>(null)

  const fetchModelInfo = async () => {
    try {
      const res = await axios.get('http://localhost:5000/model-info', {
        withCredentials: true
      });
      setModelInfo(res.data)
    } catch (err) {
      console.error('Gagal memuat model info:', err)
    }
  }

  useEffect(() => {
    fetchModelInfo()
  }, [])

  return { modelInfo, refetchModelInfo: fetchModelInfo }
}
