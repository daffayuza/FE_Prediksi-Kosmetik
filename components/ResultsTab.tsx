import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3 } from "lucide-react"
import type { RegressionModel } from "@/types"

interface ResultsTabProps {
  model: RegressionModel | null
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ model }) => {
  if (!model) {
    return (
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          Silakan latih model terlebih dahulu di tab "Data Training" untuk melihat hasil analisis.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Akurasi Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{(model.rSquared * 100).toFixed(1)}%</div>
              <p className="text-sm text-gray-600">R-squared Score</p>
              <div className="mt-2">
                <Badge variant={model.rSquared > 0.8 ? "default" : model.rSquared > 0.6 ? "secondary" : "destructive"}>
                  {model.rSquared > 0.8 ? "Sangat Baik" : model.rSquared > 0.6 ? "Baik" : "Perlu Perbaikan"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rata-rata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{model.mae.toFixed(1)}</div>
              <p className="text-sm text-gray-600">MAE (unit)</p>
              <div className="mt-2">
                <Badge variant={model.mae < 5 ? "default" : model.mae < 10 ? "secondary" : "destructive"}>
                  {model.mae < 5 ? "Sangat Akurat" : model.mae < 10 ? "Akurat" : "Kurang Akurat"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Persentase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{model.mape.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">MAPE</p>
              <div className="mt-2">
                <Badge variant={model.mape < 10 ? "default" : model.mape < 20 ? "secondary" : "destructive"}>
                  {model.mape < 10 ? "Excellent" : model.mape < 20 ? "Good" : "Fair"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interpretasi Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Pengaruh Pengunjung</h4>
              <p className="text-sm text-blue-700 mt-1">
                Setiap penambahan 1 pengunjung akan meningkatkan penjualan sebesar{" "}
                <strong>{model.coefficients[0].toFixed(4)} unit</strong>
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Pengaruh Tayangan</h4>
              <p className="text-sm text-green-700 mt-1">
                Setiap penambahan 1 tayangan halaman akan meningkatkan penjualan sebesar{" "}
                <strong>{model.coefficients[1].toFixed(4)} unit</strong>
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Pengaruh Pesanan</h4>
              <p className="text-sm text-purple-700 mt-1">
                Setiap penambahan 1 pesanan akan meningkatkan penjualan sebesar{" "}
                <strong>{model.coefficients[2].toFixed(4)} unit</strong>
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900">Persamaan Regresi</h4>
            <p className="font-mono text-sm bg-white p-3 rounded border mt-2">
              Unit Terjual = {model.intercept.toFixed(2)} + {model.coefficients[0].toFixed(4)} × Pengunjung +{" "}
              {model.coefficients[1].toFixed(4)} × Tayangan + {model.coefficients[2].toFixed(4)} × Pesanan
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-900">Kesimpulan Evaluasi</h4>
            <p className="text-sm text-yellow-800 mt-1">
              Model dapat menjelaskan <strong>{(model.rSquared * 100).toFixed(2)}%</strong> dari variasi dalam data
              penjualan dengan rata-rata error <strong>{model.mae.toFixed(1)} unit</strong> atau{" "}
              <strong>{model.mape.toFixed(1)}%</strong>.
              {model.rSquared > 0.8 && model.mape < 10
                ? " Model memiliki performa yang sangat baik untuk prediksi."
                : model.rSquared > 0.6 && model.mape < 20
                  ? " Model memiliki performa yang baik untuk prediksi."
                  : " Model mungkin perlu lebih banyak data atau variabel tambahan untuk meningkatkan akurasi."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
