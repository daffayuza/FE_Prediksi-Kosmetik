import { useEffect, useState } from 'react';
import axios from 'axios';

export interface PredictionInput {
  tahun: number;
  bulan: number;
  pengunjung: string;
  tayangan: string;
  pesanan: string;
}

export interface PredictionHistory {
  id: number;
  tahun: number;
  bulan: number;
  pengunjung: number;
  tayangan: number;
  pesanan: number;
  predicted_terjual: number;
}

export function usePredict(productId: number | null) {
  const [hasil, setHasil] = useState<{
    hasil: number;
    tahun: number;
    bulan: number;
  } | null>(null);

  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     FETCH RIWAYAT PREDIKSI
     ======================= */
  const fetchHistory = async () => {
    if (!productId) {
      setHistory([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/predictions/${productId}`, { withCredentials: true });
      setHistory(res.data);
    } catch (err) {
      console.error('Gagal mengambil riwayat prediksi', err);
    }
  };

  /* =======================
     PREDIKSI
     ======================= */
  const predict = async (data: PredictionInput): Promise<number | null> => {
    if (!productId) {
      alert('Pilih produk terlebih dahulu!');
      return null;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('product_id', productId.toString());
    formData.append('tahun', data.tahun.toString());
    formData.append('bulan', data.bulan.toString());
    formData.append('pengunjung', data.pengunjung);
    formData.append('tayangan', data.tayangan);
    formData.append('pesanan', data.pesanan);

    try {
      const res = await axios.post('http://localhost:5000/predict', formData, { withCredentials: true });

      const result = res.data.data;

      setHasil({
        tahun: result.tahun,
        bulan: result.bulan,
        hasil: result.predicted_terjual,
      });

      // 🔥 AUTO REFRESH RIWAYAT
      await fetchHistory();

      return result.predicted_terjual;
    } catch (err: any) {
      alert('Gagal prediksi: ' + (err.response?.data?.error || err.message));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllHistory = async () => {
    if (!productId) {
      alert('Pilih produk terlebih dahulu!');
      return;
    }

    const confirmDelete = confirm('Yakin ingin menghapus SEMUA riwayat prediksi untuk produk ini?');

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/predictions/${productId}`, { withCredentials: true });

      // 🔥 Bersihkan state
      setHistory([]);
      setHasil(null);
    } catch (err: any) {
      alert('Gagal menghapus riwayat: ' + (err.response?.data?.error || err.message));
    }
  };

  /* =======================
     AUTO FETCH SAAT PRODUK BERUBAH
     ======================= */
  useEffect(() => {
    fetchHistory();
  }, [productId]);

  return {
    hasil,
    history,
    loading,
    predict,
    refreshHistory: fetchHistory,
    deleteAllHistory
  };
}
