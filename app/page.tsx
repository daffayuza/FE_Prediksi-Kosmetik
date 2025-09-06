'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp } from 'lucide-react';
import { TrainingDataTab } from '@/components/TrainingDataTab';
import { TestingDataTab } from '@/components/TestingDataTab';
import { PredictionTab } from '@/components/PredictionTab';
import { useRegression } from '@/hooks/useRegression';
import type { DataPoint, TestData, RegressionModel } from '@/types';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function SalesPredictionSystem() {
  const [trainingData, setTrainingData] = useState<DataPoint[]>([]);
  const [testData, setTestData] = useState<TestData[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<TestData[]>([]);
  const [model, setModel] = useState<RegressionModel | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const { isTraining, trainModel, evaluateModel, makePrediction } = useRegression();

  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (model && testData.length > 0) {
      setIsEvaluating(true);
      evaluateModel(model, testData).then((results) => {
        setEvaluationResults(results);
        setIsEvaluating(false);
      });
    } else {
      setEvaluationResults([]);
    }
  }, [testData, model]);

  const handleTrainModel = async () => {
    const trainedModel = await trainModel(trainingData);
    if (trainedModel) {
      setModel(trainedModel);
      if (testData.length > 0) {
        setIsEvaluating(true);
        const results = await evaluateModel(trainedModel, testData);
        setEvaluationResults(results);
        setIsEvaluating(false);
      }
      alert('Model berhasil dilatih!');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });

      localStorage.removeItem('isAuthenticated');

      router.push('/login');

      alert('Logout berhasil');
    } catch (error: any) {
      alert('Gagal logout: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
      style={{
        background: `linear-gradient(135deg, #7B9CC7 0%, #c7b9d4 50%, #e8ddd4 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-between p-6 rounded-xl" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)', backdropFilter: 'blur(10px)' }}>
          <div></div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              Sistem Prediksi Penjualan
            </h1>
            <p className="text-gray-600">Prediksi jumlah unit barang terjual pada Toko Lulu Cosmetic menggunakan Regresi Linear</p>
          </div>

          <div className='flex justify-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full ml-4">
                  <Avatar className="h-12 w-12 shadown-lg">
                    {/* <AvatarImage src="https://cdna.artstation.com/p/assets/images/images/020/118/278/large/tp-graphics-logo-core-day-1-alison-cosmetics-01.jpg?1566433091" alt="Admin" /> */}
                    <AvatarFallback className="bg-[#7B9CC7] text-white font-semibold">A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">Lulu Cosmetic</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="training">Training Model</TabsTrigger>
            <TabsTrigger value="testing">Evaluasi Model</TabsTrigger>
            <TabsTrigger value="prediction">Prediksi</TabsTrigger>
          </TabsList>

          <TabsContent value="training">
            <TrainingDataTab trainingData={trainingData} setTrainingData={setTrainingData} model={model} isTraining={isTraining} onTrainModel={handleTrainModel} />
          </TabsContent>

          <TabsContent value="testing">
            <TestingDataTab
              testData={testData}
              setTestData={setTestData}
              model={model}
              // setModel={setModel}
              isEvaluating={isEvaluating}
              setIsEvaluating={setIsEvaluating}
              evaluationResults={evaluationResults}
              setEvaluationResults={setEvaluationResults}
            />
          </TabsContent>

          <TabsContent value="prediction">
            <PredictionTab model={model} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
