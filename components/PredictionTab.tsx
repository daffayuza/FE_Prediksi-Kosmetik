'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, BarChart3, TrendingUp, RotateCcw } from 'lucide-react';
import { RegressionModel, PredictionInput } from '@/types';
import { usePredict } from '@/hooks/usePredict';

interface PredictionTabProps {
  model: RegressionModel | null;
}

export const PredictionTab: React.FC<PredictionTabProps> = ({ model }) => {
  const [predictionInput, setPredictionInput] = useState<PredictionInput>({
    visitors: '',
    pageViews: '',
    orders: '',
  });

  const [multiplier, setMultiplier] = useState('1');
  const [originalInput, setOriginalInput] = useState<PredictionInput>({
    visitors: '',
    pageViews: '',
    orders: '',
  });
  const [showTrafficMultiplier, setShowTrafficMultiplier] = useState(false);

  const { hasil, predict } = usePredict();
  const [loading, setLoading] = useState(false);

  // Function to apply multiplier
  const applyMultiplier = () => {
    if (!originalInput.visitors) {
      // Save original input first time
      setOriginalInput({ ...predictionInput });
    }

    const mult = parseFloat(multiplier);
    if (isNaN(mult) || mult <= 0) {
      alert('Faktor kali lipat harus berupa angka positif');
      return;
    }

    const baseData = originalInput.visitors ? originalInput : predictionInput;
    
    setPredictionInput({
      visitors: Math.round(parseFloat(baseData.visitors) * mult).toString(),
      pageViews: Math.round(parseFloat(baseData.pageViews) * mult).toString(),
      orders: Math.round(parseFloat(baseData.orders) * mult).toString(),
    });
  };

  // Function to reset to original
  const resetToOriginal = () => {
    if (originalInput.visitors) {
      setPredictionInput({ ...originalInput });
      setMultiplier('1');
    }
  };

  const handlePrediction = async () => {
    const { visitors, pageViews, orders } = predictionInput;
    if (!visitors || !pageViews || !orders) {
      alert('Semua field harus diisi');
      return;
    }

    setLoading(true);
    await predict({
      pengunjung: visitors,
      tayangan: pageViews,
      pesanan: orders,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(250, 248, 245, 0.95)',
            border: '1px solid rgba(123, 156, 199, 0.2)',
          }}>
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
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTrafficMultiplier(!showTrafficMultiplier)}
                >
                  <TrendingUp className="h-4 w-4 mr-2 " />
                  {showTrafficMultiplier ? 'Sembunyikan' : 'Simulasi Peningkatan Traffic'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="pred-visitors">Jumlah Pengunjung</Label>
                  <Input 
                    id="pred-visitors" 
                    type="number" 
                    placeholder="contoh: 400" 
                    value={predictionInput.visitors} 
                    onChange={(e) => setPredictionInput({ ...predictionInput, visitors: e.target.value })} 
                  />
                </div>
                <div>
                  <Label htmlFor="pred-pageViews">Tayangan Halaman</Label>
                  <Input 
                    id="pred-pageViews" 
                    type="number" 
                    placeholder="contoh: 1700" 
                    value={predictionInput.pageViews} 
                    onChange={(e) => setPredictionInput({ ...predictionInput, pageViews: e.target.value })} 
                  />
                </div>
                <div>
                  <Label htmlFor="pred-orders">Jumlah Pesanan</Label>
                  <Input 
                    id="pred-orders" 
                    type="number" 
                    placeholder="contoh: 55" 
                    value={predictionInput.orders} 
                    onChange={(e) => setPredictionInput({ ...predictionInput, orders: e.target.value })} 
                  />
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
                    <Input
                      id="multiplier"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="1"
                      value={multiplier}
                      onChange={(e) => setMultiplier(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Contoh: 3 = semua data inputan x 3</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={applyMultiplier}
                      className="w-full bg-[#8aa471] text-white hover:shadow-lg hover:bg-[#6b8156] transition-all duration-200"
                      disabled={!predictionInput.visitors || !predictionInput.pageViews || !predictionInput.orders}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Terapkan Skenario
                    </Button>
                    
                    <Button 
                      onClick={resetToOriginal} 
                      variant="outline" 
                      className="w-full"
                      disabled={!originalInput.visitors}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Skenario
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handlePrediction} className="w-full" disabled={loading}>
            <Calculator className="h-4 w-4 mr-2" />
            {loading ? 'Memproses...' : 'Buat Prediksi'}
          </Button>

          {hasil !== null && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hasil Prediksi</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">{hasil} unit</div>
                <p className="text-gray-600">Prediksi jumlah unit barang yang akan terjual</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
