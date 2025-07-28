"use client";

import { useModelInfo } from "@/hooks/useModelInfo";

export default function DashboardPage() {
  const { info } = useModelInfo();

  return (
    <div className="max-w-2xl mx-auto p-12 ml-28">
      <h1 className="text-2xl font-bold mb-6">Dashboard Prediksi</h1>

      {info ? (
        <div className="bg-[#FFD700] shadow-black p-6 rounded border w-xl">
          <p className="text-xl font-semibold mb-2">📊 Statistik Model Terakhir</p>
          <p><strong>Jumlah Data Terlatih:</strong> {info.jumlah_data}</p>
          <p><strong>Diperbarui:</strong> {info.updated_at}</p>
          <div className="mt-4">
            <p className="font-semibold mb-2">Koefisien Regresi:</p>
            <ul className="list-disc ml-5 text-sm">
              <li>Intercept (β₀): {info.intercept}</li>
              <li>β₁ (Pengunjung): {info.b1}</li>
              <li>β₂ (Tayangan): {info.b2}</li>
              <li>β₃ (Pesanan): {info.b3}</li>
            </ul>
          </div>
        </div>
      ) : (
        <p>Memuat data...</p>
      )}
    </div>
  );
}
