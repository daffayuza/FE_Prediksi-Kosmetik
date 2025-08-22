"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import { TrainingDataTab } from "@/components/TrainingDataTab"
import { TestingDataTab } from "@/components/TestingDataTab"
import { PredictionTab } from "@/components/PredictionTab"
import { ResultsTab } from "@/components/ResultsTab"
import { useRegression } from "@/hooks/useRegression"
import type { DataPoint, TestData, RegressionModel } from "@/types"

export default function SalesPredictionSystem() {
  const [trainingData, setTrainingData] = useState<DataPoint[]>([])
  const [testData, setTestData] = useState<TestData[]>([])
  const [evaluationResults, setEvaluationResults] = useState<TestData[]>([])
  const [model, setModel] = useState<RegressionModel | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const { isTraining, trainModel, evaluateModel, makePrediction } = useRegression()

  useEffect(() => {
    if (model && testData.length > 0) {
      setIsEvaluating(true)
      evaluateModel(model, testData).then((results) => {
        setEvaluationResults(results)
        setIsEvaluating(false)
      })
    } else {
      setEvaluationResults([])
    }
  }, [testData, model])

  const handleTrainModel = async () => {
    const trainedModel = await trainModel(trainingData)
    if (trainedModel) {
      setModel(trainedModel)
      if (testData.length > 0) {
        setIsEvaluating(true)
        const results = await evaluateModel(trainedModel, testData)
        setEvaluationResults(results)
        setIsEvaluating(false)
      }
      alert("Model berhasil dilatih!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"> 
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Sistem Prediksi Penjualan
          </h1>
          <p className="text-gray-600">
            Prediksi jumlah unit barang terjual pada Toko Lulu Cosmetic menggunakan Regresi Linear
          </p>
        </div>

        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="training">Data Training</TabsTrigger>
            <TabsTrigger value="testing">Evaluasi Model</TabsTrigger>
            <TabsTrigger value="prediction">Prediksi</TabsTrigger>
            {/* <TabsTrigger value="results">Hasil Analisis</TabsTrigger> */}
          </TabsList>

          <TabsContent value="training">
            <TrainingDataTab
              trainingData={trainingData}
              setTrainingData={setTrainingData}
              model={model}
              isTraining={isTraining}
              onTrainModel={handleTrainModel}
            />
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

          <TabsContent value="results">
            <ResultsTab model={model} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
