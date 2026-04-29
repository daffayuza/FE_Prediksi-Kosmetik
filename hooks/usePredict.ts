import { useEffect, useState } from "react";
import axios from "axios";

export function usePredict() {
  const [hasil, setHasil] = useState<number | null>(null);
  const [totalProfit, setTotalProfit] = useState<number | null>(null);
  const [profitPerUnit, setProfitPerUnit] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const predict = async (data: {
    pengunjung: string;
    tayangan: string;
    pesanan: string;
  }) => {
    const formData = new FormData();
    formData.append("pengunjung", data.pengunjung);
    formData.append("tayangan", data.tayangan);
    formData.append("pesanan", data.pesanan);

    try {
      // Prediksi jumlah unit
      const res = await axios.post("http://localhost:5000/predict", formData, {
        withCredentials: true,
      });
      const prediksi = res.data.prediksi_terjual;
      setHasil(prediksi);

      // Ambil profit per unit
      const profitRes = await axios.get("http://localhost:5000/profit", {
        withCredentials: true,
      });
      const profitValue = profitRes.data.profit_per_unit || 0;
      setProfitPerUnit(profitValue);

      // Hitung total
      const total = prediksi * profitValue;
      setTotalProfit(total);

      // Simpan ke database
      await axios.post(
        "http://localhost:5000/save_prediction",
        {
          visitors: Number(data.pengunjung),
          page_views: Number(data.tayangan),
          orders: Number(data.pesanan),
          predicted_units: prediksi,
          profit_per_unit: profitValue,
          total_profit: total,
        },
        { withCredentials: true }
      );

      fetchHistory();
      return { prediksi, totalProfit: total };
    } catch (err: any) {
      alert("Gagal prediksi: " + (err.response?.data?.error || err.message));
      return { prediksi: null, totalProfit: null };
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/prediction_history', {
        withCredentials: true,
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Gagal mengambil riwayat prediksi:', err);
    }
  };

  const handleDeleteAll = async () => {
    const confirm = window.confirm('Apakah Anda yakin ingin menghapus semua data history prediksi?');
    if (!confirm) return;

    try {
      await axios.delete('http://localhost:5000/predictHistory/delete-all', {
        withCredentials: true,
      });
      alert('Semua data latih berhasil dihapus.');
      fetchHistory(); // Refresh data di frontend
    } catch (err: any) {
      alert('Gagal menghapus data latih: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [])


  return { hasil, totalProfit, profitPerUnit, predict, history, handleDeleteAll };
}