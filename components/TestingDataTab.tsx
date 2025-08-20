'use client';

import type React from 'react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, BarChart3, Trash2, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from './Pagination';

// Types untuk evaluasi (sesuaikan dengan backend response)
interface EvaluationMetrics {
  r2_score: number;
  mae: number;
  mse: number;
  mape: number;
}

interface EvaluationResponse {
  message: string;
  jumlah_data_test: number;
    evaluasi: EvaluationMetrics;
}

interface TestingDataTabProps {
  testData: any[];
  setTestData: (data: any[]) => void;
  model: any;
  setModel?: (model: any) => void;
  isEvaluating: boolean;
  setIsEvaluating: (val: boolean) => void;
  evaluationResults: any[];
  setEvaluationResults: (data: any[]) => void;
}

export const TestingDataTab: React.FC<TestingDataTabProps> = ({ testData, setTestData, model, setModel, isEvaluating, setIsEvaluating, evaluationResults, setEvaluationResults }) => {
  const testingFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetrics | null>(null);
  const { currentPage, paginatedData, onPageChange, totalItems, itemsPerPage } = usePagination(testData, 10);
  const [error, setError] = useState<string>('');

  // Load data testing dari backend saat komponen dimount
  useEffect(() => {
    loadTestingDataFromBackend();
    loadLatestEvaluation();
  }, []);

  const loadTestingDataFromBackend = async () => {
    try {
      const response = await axios.get('http://localhost:5000/testing-data');
      const backendData = response.data;

      // Convert backend data format ke format yang digunakan parent
      const convertedData = backendData.map((item: any) => ({
        id: item.id,
        visitors: item.pengunjung,
        pageViews: item.tayangan,
        orders: item.pesanan,
        unitsSold: item.terjual,
        predictedUnits: item.prediksi,
        created_at: item.created_at,
      }));

      setTestData(convertedData);
    } catch (error) {
      console.error('Error loading testing data:', error);
    }
  };

  const loadLatestEvaluation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/latest-evaluation');
      setEvaluationMetrics(response.data.evaluasi);
    } catch (error) {
      // Tidak ada evaluasi atau error lainnya
      console.log('No evaluation available');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Silakan pilih file Excel (.xlsx atau .xls)');
        setFile(null);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!file) {
      setError('Silakan upload file Excel terlebih dahulu');
      return;
    }

    // if (!model) {
    //   setError('Model belum tersedia. Lakukan training terlebih dahulu.');
    //   return;
    // }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsEvaluating(true);
      setError('');

      const response = await axios.post<EvaluationResponse>('http://localhost:5000/evaluate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set metrics evaluasi
      setEvaluationMetrics(response.data.evaluasi);

      // Reload data testing dari backend
      await loadTestingDataFromBackend();

      // Reset file input
      setFile(null);
      if (testingFileRef.current) {
        testingFileRef.current.value = '';
      }

      // setCurrentPage(1); // Reset ke halaman pertama
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Terjadi kesalahan saat evaluasi';
      setError(errorMessage);
      console.error('Evaluation error:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const clearTestingData = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus semua data testing?')) {
      return;
    }

    try {
      await axios.delete('http://localhost:5000/clear-data?type=testing');
      setTestData([]);
      setEvaluationResults([]);
      setEvaluationMetrics(null);
      // setCurrentPage(1);
    } catch (error: any) {
      setError('Gagal menghapus data testing');
    }
  };

  const getR2ScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getR2ScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Sangat Baik';
    if (score >= 0.6) return 'Baik';
    if (score >= 0.4) return 'Cukup';
    return 'Kurang';
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="space-y-6">
      {/* Upload dan Evaluasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Evaluasi Model dengan Data Testing
          </CardTitle>
          <CardDescription>Upload file Excel (.xlsx/.xls) dengan adanya kolom: pengunjung, tayangan, pesanan, terjual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button onClick={() => testingFileRef.current?.click()} className="flex-1" disabled={isEvaluating}>
              <Upload className="h-4 w-4 mr-2" />
              {file ? `File: ${file.name}` : 'Upload File Excel Testing'}
            </Button>

            <Button onClick={handleEvaluate} disabled={!file || isEvaluating} variant="default" className={`w-full md:w-auto ${file ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
              {isEvaluating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Evaluasi Berlangsung...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Evaluasi Model
                </>
              )}
            </Button>

            {/* {testData.length > 0 && (
              <Button onClick={clearTestingData} variant="outline" size="default" disabled={isEvaluating}>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Data
              </Button>
            )} */}
          </div>

          <input ref={testingFileRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />

          {file && (
            <div className="p-3 bg-blue-50 rounded-lg border">
              <p className="text-sm text-blue-700">
                File siap untuk evaluasi: <strong>{file.name}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics Evaluasi */}
      {evaluationMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Evaluasi Model</CardTitle>
            <CardDescription>Metrik performa model pada data testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{(evaluationMetrics.r2_score * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600 mb-2">R² Score</div>
                <Badge className={getR2ScoreColor(evaluationMetrics.r2_score)}>{getR2ScoreLabel(evaluationMetrics.r2_score)}</Badge>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{evaluationMetrics.mae.toFixed(2)}</div>
                <div className="text-sm text-gray-600">MAE</div>
                <div className="text-xs text-gray-500">Mean Absolute Error</div>
              </div>

              {/* <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{evaluationMetrics.mse.toFixed(2)}</div>
                <div className="text-sm text-gray-600">MSE</div>
                <div className="text-xs text-gray-500">Mean Squared Error</div>
              </div> */}

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{(evaluationMetrics.mape * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">MAPE</div>
                <div className="text-xs text-gray-500">Mean Absolute Percentage Error</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Testing dengan Prediksi */}
      {testData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Data Testing & Prediksi ({testData.length} data)</span>
              {/* <Button onClick={loadTestingDataFromBackend} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button> */}
            </CardTitle>
            <CardDescription>Perbandingan nilai aktual vs prediksi model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Pengunjung</TableHead>
                    <TableHead>Tayangan</TableHead>
                    <TableHead>Pesanan</TableHead>
                    <TableHead className="font-semibold">Aktual</TableHead>
                    <TableHead className="font-semibold">Prediksi</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Error %</TableHead>
                    <TableHead>Akurasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((data, index) => {
                    const error = Math.abs(data.unitsSold - (data.predictedUnits || 0));
                    const errorPercent = data.unitsSold !== 0 ? (error / data.unitsSold) * 100 : 0;
                    const accuracy = Math.max(0, 100 - errorPercent);

                    return (
                      <TableRow key={data.id}>
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell>{data.visitors?.toLocaleString()}</TableCell>
                        <TableCell>{data.pageViews?.toLocaleString()}</TableCell>
                        <TableCell>{data.orders?.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold text-blue-600">{data.unitsSold?.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold text-green-600">{data.predictedUnits?.toFixed(0) || '-'}</TableCell>
                        <TableCell className="text-red-600">{error.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={errorPercent <= 10 ? 'default' : errorPercent <= 25 ? 'secondary' : 'destructive'}>{errorPercent.toFixed(1)}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={accuracy >= 90 ? 'default' : accuracy >= 75 ? 'secondary' : 'outline'}>{accuracy.toFixed(1)}%</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />
          </CardContent>
        </Card>
      )}

      {/* State kosong */}
      {testData.length === 0 && !isEvaluating && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data testing</h3>
            <p className="text-gray-500 mb-6">Upload file Excel untuk melakukan evaluasi model</p>
            <Button onClick={() => testingFileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File Excel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
