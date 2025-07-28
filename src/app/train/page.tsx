"use client";

import { useState, ChangeEvent } from "react";
import { useTrainModel } from "@/hooks/useTrainModel";
import { Input } from "@/components/ui/input";

export default function TrainPage() {
  const [file, setFile] = useState<File | null>(null);
  const { trainModel, message, metrics } = useTrainModel();

  const handleTrain = () => {
    if (!file) {
      alert("Silakan pilih file Excel terlebih dahulu.");
      return;
    }
    trainModel(file);
  };

  return (
    <div className="max-w-xl mx-auto p-12 ml-28">
      <h1 className="text-2xl font-bold mb-4">Latih Model Prediksi</h1>

      <div className="flex flex-col gap-6">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) setFile(e.target.files[0]);
          }}
        />
        <button
          onClick={handleTrain}
          className="cursor-pointer hidden md:block bg-blue-300 font-bold hover:shadow-none shadow-black border-2 border-black px-4 py-2 w-fit rounded-md duration-100 translate-x-0 translate-y-0 hover:translate-x-0.5 hover:translate-y-0.5"
        >
          Latih Model
        </button>
      </div>

      {message && <p className="text-green-600">{message}</p>}

      {metrics && (
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Jumlah Data Latih:</strong> {metrics.jumlah_data_latih}</p>
          <p><strong>R² Score:</strong> {metrics.r2_score}</p>
          <p><strong>MAE:</strong> {metrics.mae}</p>
          <p><strong>MSE:</strong> {metrics.mse}</p>
          <p className="mt-2 font-semibold">Koefisien Regresi:</p>
          <ul className="ml-4 list-disc">
            <li>Intercept (β₀): {metrics.intercept}</li>
            <li>β₁ (Pengunjung): {metrics.b1}</li>
            <li>β₂ (Tayangan): {metrics.b2}</li>
            <li>β₃ (Pesanan): {metrics.b3}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
