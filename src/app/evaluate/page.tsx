"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";

type EvaluationResult = {
  r2_score: number;
  mae: number;
  mse: number;
  message: string;
};

type EvaluationHistory = {
  id: number;
  r2_score: number;
  mae: number;
  mse: number;
  created_at: string;
};

export default function EvaluatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<EvaluationHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleEvaluate = async () => {
    if (!file) {
      alert("Silakan pilih file testing terlebih dahulu");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/evaluate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);

      // Fetch history setelah evaluasi berhasil
      fetchHistory();
    } catch (err: any) {
      alert("Gagal evaluasi: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/evaluation-history");
      setHistory(res.data);
    } catch (err: any) {
      console.error("Gagal mengambil riwayat evaluasi:", err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Evaluasi Model</h1>

      <div className="mb-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border p-2 w-full"
        />
        <button
          onClick={handleEvaluate}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Evaluasi Model"}
        </button>
      </div>

      {result && (
        <div className="border p-4 rounded bg-gray-100 mb-6">
          <p className="font-semibold text-green-600">{result.message}</p>
          <p>R² Score: {result.r2_score}</p>
          <p>MAE: {result.mae}</p>
          <p>MSE: {result.mse}</p>
        </div>
      )}

      <h2 className="text-lg font-bold mb-2">Riwayat Evaluasi</h2>
      <button
        onClick={fetchHistory}
        className="mb-3 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        Refresh
      </button>

      <div className="border rounded p-4 bg-white">
        {history.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat evaluasi.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">R²</th>
                <th className="border p-2">MAE</th>
                <th className="border p-2">MSE</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="border p-2">{h.created_at}</td>
                  <td className="border p-2">{h.r2_score}</td>
                  <td className="border p-2">{h.mae}</td>
                  <td className="border p-2">{h.mse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
