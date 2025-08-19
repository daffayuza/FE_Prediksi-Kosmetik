import { useState } from "react"
import axios from "axios"

export function usePredict() {
  const [hasil, setHasil] = useState<number | null>(null)

  const predict = async (data: {
    pengunjung: string
    tayangan: string
    pesanan: string
  }): Promise<number | null> => {
    const formData = new FormData()
    formData.append("pengunjung", data.pengunjung)
    formData.append("tayangan", data.tayangan)
    formData.append("pesanan", data.pesanan)

    try {
      const res = await axios.post("http://localhost:5000/predict", formData)
      setHasil(res.data.prediksi_terjual)
      return res.data.prediksi_terjual
    } catch (err: any) {
      alert("Gagal prediksi: " + (err.response?.data?.error || err.message))
      return null
    }
  }

  return { hasil, predict }
}
