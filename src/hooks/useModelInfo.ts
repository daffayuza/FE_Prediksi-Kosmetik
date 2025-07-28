import { useEffect, useState } from "react";
import axios from "axios";

export function useModelInfo() {
  const [info, setInfo] = useState<null | {
    jumlah_data: number;
    intercept: number;
    b1: number;
    b2: number;
    b3: number;
    updated_at: string;
  }>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/model-info")
      .then(res => setInfo(res.data))
      .catch(err => console.error("Gagal mengambil info model", err));
  }, []);

  return { info };
}
