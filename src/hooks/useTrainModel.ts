import { useState } from "react";
import axios from "axios";

export function useTrainModel() {
  const [message, setMessage] = useState("");
  const [metrics, setMetrics] = useState<null | {
    jumlah_data_latih: number;
    r2_score: number;
    mae: number;
    mse: number;
    intercept: number;
    b1: number;
    b2: number;
    b3: number;
  }>(null);

  const trainModel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/train", formData);
      setMessage(res.data.message);
      setMetrics(res.data);
    } catch (err: any) {
      alert("Gagal melatih model: " + (err.response?.data?.error || err.message));
    }
  };

  return { message, metrics, trainModel };
}
