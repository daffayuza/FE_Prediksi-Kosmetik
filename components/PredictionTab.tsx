"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, BarChart3 } from "lucide-react"
import { RegressionModel, PredictionInput } from "@/types"
import { usePredict } from "@/hooks/usePredict"

interface PredictionTabProps {
  model: RegressionModel | null
}

export const PredictionTab: React.FC<PredictionTabProps> = ({ model }) => {
  const [predictionInput, setPredictionInput] = useState<PredictionInput>({
    visitors: "",
    pageViews: "",
    orders: "",
  })

  const { hasil, predict } = usePredict()
  const [loading, setLoading] = useState(false)

  const handlePrediction = async () => {
    // if (!model) {
    //   alert("Silakan latih model terlebih dahulu")
    //   return
    // }

    const { visitors, pageViews, orders } = predictionInput
    if (!visitors || !pageViews || !orders) {
      alert("Semua field harus diisi")
      return
    }

    setLoading(true)
    await predict({
      pengunjung: visitors,
      tayangan: pageViews,
      pesanan: orders,
    })
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prediksi Unit Barang Terjual</CardTitle>
          <CardDescription>Masukkan data untuk memprediksi jumlah unit barang yang akan terjual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pred-visitors">Jumlah Pengunjung</Label>
              <Input
                id="pred-visitors"
                type="number"
                placeholder="1100"
                value={predictionInput.visitors}
                onChange={(e) => setPredictionInput({ ...predictionInput, visitors: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pred-pageViews">Tayangan Halaman</Label>
              <Input
                id="pred-pageViews"
                type="number"
                placeholder="2800"
                value={predictionInput.pageViews}
                onChange={(e) => setPredictionInput({ ...predictionInput, pageViews: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pred-orders">Jumlah Pesanan</Label>
              <Input
                id="pred-orders"
                type="number"
                placeholder="55"
                value={predictionInput.orders}
                onChange={(e) => setPredictionInput({ ...predictionInput, orders: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handlePrediction} className="w-full" disabled={ loading}>
            <Calculator className="h-4 w-4 mr-2" />
            {loading ? "Memproses..." : "Buat Prediksi"}
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

          {!model && (
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                Silakan latih model terlebih dahulu di tab "Data Training" untuk membuat prediksi.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
