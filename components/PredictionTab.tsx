'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, BarChart3, TrendingUp, RotateCcw } from 'lucide-react';
import { RegressionModel, PredictionInput, Product } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePredict } from '@/hooks/usePredict';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BULAN_LABEL, BULAN_OPTIONS, tampilkanBulan } from '@/utils/bulanOptions';
import { Trash2 } from 'lucide-react';

interface PredictionTabProps {
  products: Product[];
  selectedProductId: number | null;
}

export const PredictionTab: React.FC<PredictionTabProps> = ({ products, selectedProductId }) => {
  const [predictionInput, setPredictionInput] = useState<PredictionInput>({
    tahun: '',
    bulan: '',
    visitors: '',
    pageViews: '',
    orders: '',
  });

  const [multiplier, setMultiplier] = useState('1');
  const [baseInput, setBaseInput] = useState<PredictionInput | null>(null);
  const [showTrafficMultiplier, setShowTrafficMultiplier] = useState(false);
  const [loading, setLoading] = useState(false);

  const { hasil, history, predict, deleteAllHistory } = usePredict(selectedProductId);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Function to apply multiplier
  const applyMultiplier = () => {
    const m = Number(multiplier);
    if (isNaN(m) || m <= 0) {
      alert('Faktor kali lipat harus angka positif');
      return;
    }

    if (!baseInput) setBaseInput(predictionInput);

    const src = baseInput ?? predictionInput;

    setPredictionInput({
      ...src,
      visitors: Math.round(Number(src.visitors) * m).toString(),
      pageViews: Math.round(Number(src.pageViews) * m).toString(),
      orders: Math.round(Number(src.orders) * m).toString(),
    });
  };

  const resetMultiplier = () => {
    if (baseInput) {
      setPredictionInput(baseInput);
      setBaseInput(null);
      setMultiplier('1');
    }
  };

  const handlePrediction = async () => {
    const { tahun, bulan, visitors, pageViews, orders } = predictionInput;
    if (!visitors || !pageViews || !orders) {
      alert('Semua field harus diisi');
      return;
    }

    setLoading(true);
    await predict({
      tahun: Number(tahun),
      bulan: Number(bulan),
      pengunjung: visitors,
      tayangan: pageViews,
      pesanan: orders,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card
        className="shadow-lg border-0 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(250, 248, 245, 0.95)',
          border: '1px solid rgba(123, 156, 199, 0.2)',
        }}
      >
        <CardHeader>
          <CardTitle>Prediksi Unit Barang Terjual</CardTitle>
          <CardDescription>Masukkan data untuk memprediksi jumlah unit barang yang akan terjual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Content - Side by Side Layout */}
          <div className={`grid ${showTrafficMultiplier ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {/* Left Side - Input Variables */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Data Input</h3>
                <Button variant="outline" size="sm" onClick={() => setShowTrafficMultiplier(!showTrafficMultiplier)}>
                  <TrendingUp className="h-4 w-4 mr-2 " />
                  {showTrafficMultiplier ? 'Sembunyikan' : 'Simulasi Peningkatan Traffic'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tahun</Label>
                  <Input type="number" placeholder="contoh: 2025" value={predictionInput.tahun} onChange={(e) => setPredictionInput({ ...predictionInput, tahun: e.target.value })} />
                </div>
                <div>
                  <Label>Bulan</Label>
                  <Select value={predictionInput.bulan} onValueChange={(value) => setPredictionInput({ ...predictionInput, bulan: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {BULAN_OPTIONS.map((bulan) => (
                        <SelectItem key={bulan.value} value={String(bulan.value)}>
                          {bulan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="pred-visitors">Jumlah Pengunjung</Label>
                  <Input id="pred-visitors" type="number" placeholder="contoh: 400" value={predictionInput.visitors} onChange={(e) => setPredictionInput({ ...predictionInput, visitors: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="pred-pageViews">Jumlah Tayangan Halaman</Label>
                  <Input id="pred-pageViews" type="number" placeholder="contoh: 1700" value={predictionInput.pageViews} onChange={(e) => setPredictionInput({ ...predictionInput, pageViews: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="pred-orders">Jumlah Pesanan</Label>
                  <Input id="pred-orders" type="number" placeholder="contoh: 55" value={predictionInput.orders} onChange={(e) => setPredictionInput({ ...predictionInput, orders: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Right Side - Traffic Multiplier (Only shown when toggled) */}
            {showTrafficMultiplier && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900">Simulasi Peningkatan Traffic</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="multiplier">Faktor Kali Lipat</Label>
                    <Input id="multiplier" type="number" step="0.1" min="0.1" placeholder="1" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">Contoh: 3 = semua data inputan x 3</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={applyMultiplier}
                      className="w-full bg-[#00275A] hover:bg-[#011d43] text-white hover:shadow-lg transition-all duration-200"
                      disabled={!predictionInput.visitors || !predictionInput.pageViews || !predictionInput.orders}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Terapkan Skenario
                    </Button>

                    <Button
                      onClick={resetMultiplier}
                      variant="default"
                      className="w-full bg-[#FE7512] text-white hover:shadow-lg hover:bg-[#F66802] transition-all duration-200"
                      // disabled={!originalInput.visitors}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Skenario
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handlePrediction} className="w-full bg-[#00275A] hover:bg-[#011d43]" disabled={loading || !predictionInput.visitors || !predictionInput.pageViews || !predictionInput.orders}>
            <Calculator className="h-4 w-4 mr-2" />
            {loading ? 'Memproses...' : 'Buat Prediksi'}
          </Button>

          {hasil !== null && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hasil Prediksi - {BULAN_LABEL[hasil.bulan]} {hasil.tahun}</h3>
                <div className="text-4xl font-bold text-[#F66802] mb-2">{hasil.hasil} unit</div>
                <p className="text-gray-600">untuk produk:</p>
                <p className="font-medium text-lg">{selectedProduct?.name}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card
        className="shadow-lg border-0 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(250, 248, 245, 0.95)',
          border: '1px solid rgba(123, 156, 199, 0.2)',
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span> Riwayat Hasil Prediksi Produk <span className='text-[#F66802] italic'>{selectedProduct?.name} </span> <span className='text-base'>({history.length} data)</span></span>
            {history.length > 0 && (
              <Button onClick={deleteAllHistory} className="bg-[#F66802] shadow-md hover:bg-[#DA4E00] transition-all duration-200 border border-white">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Semua Data
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: '#00275A' }}>
                  <TableHead style={{ color: 'white' }}>No</TableHead>
                  <TableHead style={{ color: 'white' }}>Tahun</TableHead>
                  <TableHead style={{ color: 'white' }}>Bulan</TableHead>
                  <TableHead style={{ color: 'white' }}>Pengunjung</TableHead>
                  <TableHead style={{ color: 'white' }}>Tayangan Halaman</TableHead>
                  <TableHead style={{ color: 'white' }}>Pesanan</TableHead>
                  <TableHead style={{ color: 'white' }}>Prediksi Unit Terjual</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.tahun}</TableCell>
                    <TableCell>{tampilkanBulan(item.bulan)}</TableCell>
                    <TableCell>{item.pengunjung}</TableCell>
                    <TableCell>{item.tayangan}</TableCell>
                    <TableCell>{item.pesanan}</TableCell>
                    <TableCell className="font-semibold">{item.predicted_terjual}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
