import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type PredictionData = {
  index: number;
  aktual: number;
  prediksi: number;
};

export function EvaluationChart({ data }: { data: PredictionData[] }) {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Perbandingan Hasil Prediksi vs Aktual</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" label={{ value: "Data Index", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Nilai", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aktual" stroke="#2563eb" strokeWidth={3} name="Aktual" />
          <Line type="monotone" dataKey="prediksi" stroke="#f59e0b" strokeWidth={3} name="Prediksi" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
