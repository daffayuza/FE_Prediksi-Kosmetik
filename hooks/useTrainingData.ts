import { useEffect, useState } from "react";
import axios from "axios";
import type { DataPoint } from "@/types";

export function useTrainingData() {
  const [trainingData, setTrainingData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/training-data", {
        withCredentials: true
      });
      const mappedData: DataPoint[] = res.data.map((item: any) => ({
        id: item.id,
        visitors: item.pengunjung,
        pageViews: item.tayangan,
        orders: item.pesanan,
        unitsSold: item.terjual,
      }));
      setTrainingData(mappedData);
    } catch (err) {
      setError("Gagal mengambil data training");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus semua data latih?");
    if (!confirm) return;
  
    try {
      await axios.delete("http://localhost:5000/train/delete-all", {
        withCredentials: true
      });
      alert("Semua data latih berhasil dihapus.");
      fetchTrainingData(); // Refresh data di frontend
    } catch (err: any) {
      alert("Gagal menghapus data latih: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  return { trainingData, setTrainingData, isLoading, error, refetch: fetchTrainingData, handleDeleteAll };
}
