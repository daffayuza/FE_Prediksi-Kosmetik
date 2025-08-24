'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, BarChart3, Trash2, RefreshCw } from 'lucide-react';
import { Pagination } from './Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTrainingData } from '@/hooks/useTrainingData';
import { useModelInfo } from '@/hooks/useModelInfo';
import type { DataPoint, RegressionModel } from '@/types';
import axios from 'axios';

interface TrainingDataTabProps {
  trainingData: DataPoint[];
  setTrainingData: (data: DataPoint[]) => void;
  model: RegressionModel | null;
  isTraining: boolean;
  onTrainModel: () => Promise<void>;
}

export const TrainingDataTab: React.FC<TrainingDataTabProps> = ({ isTraining }) => {
  const trainingFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { trainingData, refetch, handleDeleteAll } = useTrainingData();
  const { currentPage, paginatedData, onPageChange, totalItems, itemsPerPage } = usePagination(trainingData, 10);
  const { modelInfo, refetchModelInfo } = useModelInfo();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFile(selectedFile);
      } else {
        alert('Silakan pilih file Excel (.xlsx atau .xls)');
      }
    }
  };

  const handleTrainModel = async () => {
    if (!file) {
      alert('Silakan pilih file Excel terlebih dahulu');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/train', formData, {
        withCredentials: true, // ✅ bawa session cookie
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await refetch();
      await refetchModelInfo();
      setFile(null); // ✅ Reset file setelah training
      alert('Model berhasil dilatih. Data latih diperbarui.');
    } catch (error: any) {
      alert('Gagal melatih model: ' + (error.response?.data?.error || error.message));
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="space-y-6">
      {/* Upload & Train Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Data Training</CardTitle>
          <CardDescription>Gunakan file Excel (.xlsx/.xls) dengan adanya kolom: pengunjung, tayangan, pesanan, terjual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-start md:items-center">
            <Button onClick={() => trainingFileRef.current?.click()} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {file ? `File: ${file.name}` : 'Upload Data Training'}
            </Button>
            <input ref={trainingFileRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />

            {/* <Button onClick={handleTrainModel} disabled={!file || isTraining} className={`w-full md:w-auto ${file ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
              <BarChart3 className="h-5 w-5 mr-2" />
              {isTraining ? 'Melatih...' : 'Latih Model'}
            </Button> */}

            <Button onClick={handleTrainModel} disabled={!file || isTraining} variant="default" className={`w-full md:w-auto ${file ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
              {isTraining ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Melatih...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Latih Model
                </>
              )}
            </Button>
          </div>
          {file && (
            <div className="p-3 bg-blue-50 rounded-lg border">
              <p className="text-sm text-blue-700">
                File siap untuk latih: <strong>{file.name}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Parameters */}
      {modelInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Parameter Model</CardTitle>
            <CardDescription>Koefisien dan persamaan regresi dari hasil pelatihan model.</CardDescription>
            <CardDescription>Terakhir diperbarui: {modelInfo.updated_at}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Intercept (β₀):</span>
                  <Badge variant="secondary">{modelInfo.intercept.toFixed(4)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Koef. Pengunjung (β₁):</span>
                  <Badge variant="secondary">{modelInfo.b1.toFixed(4)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Koef. Tayangan (β₂):</span>
                  <Badge variant="secondary">{modelInfo.b2.toFixed(4)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Koef. Pesanan (β₃):</span>
                  <Badge variant="secondary">{modelInfo.b3.toFixed(4)}</Badge>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Persamaan Regresi</h4>
                <p className="font-mono text-xs bg-white p-3 rounded border">
                  y = {modelInfo.intercept.toFixed(2)} + {modelInfo.b1.toFixed(4)}x₁ + {modelInfo.b2.toFixed(4)}x₂ + {modelInfo.b3.toFixed(4)}x₃
                </p>
                <p className="text-xs text-gray-600 mt-2">x₁ = Pengunjung, x₂ = Tayangan, x₃ = Pesanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Training Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span> Data Training ({trainingData.length} data)</span>
            {trainingData.length > 0 && (
              <Button onClick={handleDeleteAll} variant="outline" size="sm">
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
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Pengunjung</TableHead>
                  <TableHead>Tayangan Halaman</TableHead>
                  <TableHead>Pesanan</TableHead>
                  <TableHead>Unit Terjual</TableHead>
                  {/* <TableHead>Aksi</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{data.visitors.toLocaleString()}</TableCell>
                    <TableCell>{data.pageViews.toLocaleString()}</TableCell>
                    <TableCell>{data.orders}</TableCell>
                    <TableCell className="font-semibold">{data.unitsSold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />
        </CardContent>
      </Card>
    </div>
  );
};
