'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function useModelInfo(productId: number | null) {
  const [modelInfo, setModelInfo] = useState<{
    intercept: number;
    b1: number;
    b2: number;
    b3: number;
    updated_at: string;
  } | null>(null);

  const fetchModelInfo = async () => {
    if (!productId) {
      setModelInfo(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/model-info?product_id=${productId}`, {
        withCredentials: true,
      });
      setModelInfo(res.data);
    } catch (err) {
      setModelInfo(null);
      console.error('Gagal memuat model info:', err);
    }
  };

  useEffect(() => {
    fetchModelInfo();
  }, [productId]);

  return { modelInfo, refetchModelInfo: fetchModelInfo };
}
