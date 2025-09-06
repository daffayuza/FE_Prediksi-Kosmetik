import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type PredictionData = {
  index: number;
  aktual: number;
  prediksi: number;
};

export function EvaluationChart({ data }: { data: PredictionData[] }) {
  return (
    <div
      className="w-full min-h-96 h-100 p-6 rounded-2xl shadow"
      style={{
        backgroundColor: 'rgba(250, 248, 245, 0.95)',
        border: '1px solid rgba(123, 156, 199, 0.2)',
      }}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Grafik Perbandingan Hasil Prediksi vs Aktual</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" label={{ value: 'Data Index', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'Nilai', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => Math.round(value).toString()} />
          <Tooltip formatter={(value) => Math.round(Number(value)).toString()} />
          <Legend />
          <Line type="monotone" dataKey="aktual" stroke="#2563eb" strokeWidth={3} name="Aktual" />
          <Line type="monotone" dataKey="prediksi" stroke="#f59e0b" strokeWidth={3} name="Prediksi" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
