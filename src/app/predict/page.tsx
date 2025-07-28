"use client";

import { useState, FormEvent } from "react";
import { usePredict } from "@/hooks/usePredict";
import { Input } from "@/components/ui/input";

export default function PredictPage() {
  const [pengunjung, setPengunjung] = useState("");
  const [tayangan, setTayangan] = useState("");
  const [pesanan, setPesanan] = useState("");
  const { hasil, predict } = usePredict();

  const handlePredict = (e: FormEvent) => {
    e.preventDefault();
    predict({ pengunjung, tayangan, pesanan });
  };

  return (
    <div className="max-w-xl p-12 ml-28">
      <h1 className="text-2xl font-bold mb-4">Prediksi Jumlah Terjual</h1>
      <form onSubmit={handlePredict} className="space-y-4">
        <Input
          type="number"
          placeholder="Jumlah Pengunjung"
          value={pengunjung}
          onChange={(e) => setPengunjung(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-lg"
        />
        <Input
          type="number"
          placeholder="Tayangan Halaman"
          value={tayangan}
          onChange={(e) => setTayangan(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
          required
        />
        <Input
          type="number"
          placeholder="Jumlah Pesanan"
          value={pesanan}
          onChange={(e) => setPesanan(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
          required
        />
        <button
          className="cursor-pointer hidden md:block bg-[#69CF95] font-bold hover:shadow-none shadow-black border-2 border-black px-7 py-3 w-fit rounded-md duration-100 translate-x-0 translate-y-0 hover:translate-x-0.5 hover:translate-y-0.5"
        >
          Prediksi
        </button>
      </form>

      {hasil !== null && (
        <p className="mt-4 text-lg font-semibold">
          Prediksi Terjual: <span className="text-blue-600">{hasil}</span>
        </p>
      )}
    </div>
  );
}
