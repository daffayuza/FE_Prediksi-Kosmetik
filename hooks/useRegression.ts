"use client"

import { useState } from "react"
import type { DataPoint, TestData, RegressionModel } from "@/types"
import { transpose, multiply, multiplyVector, inverse } from "@/utils/matrix"

export function useRegression() {
  const [model, setModel] = useState<RegressionModel | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const trainModel = async (trainingData: DataPoint[]) => {
    if (trainingData.length < 4) {
      alert("Minimal 4 data training diperlukan untuk regresi linear")
      return null
    }

    setIsTraining(true)

    // Simulate training delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const n = trainingData.length
    const X = trainingData.map((d) => [1, d.visitors, d.pageViews, d.orders])
    const y = trainingData.map((d) => d.unitsSold)

    // Calculate coefficients using normal equation
    const XT = transpose(X)
    const XTX = multiply(XT, X)
    const XTXInv = inverse(XTX)
    const XTy = multiplyVector(XT, y)
    const coefficients = multiplyVector(XTXInv, XTy)

    const intercept = coefficients[0]
    const coefs = coefficients.slice(1)

    // Calculate predictions for training data
    const trainingPredictions = X.map((row) => intercept + row[1] * coefs[0] + row[2] * coefs[1] + row[3] * coefs[2])

    // Calculate R-squared and MSE for training data
    const yMean = y.reduce((sum, val) => sum + val, 0) / n
    const ssTotal = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0)
    const ssResidual = y.reduce((sum, val, i) => sum + Math.pow(val - trainingPredictions[i], 2), 0)
    const rSquared = 1 - ssResidual / ssTotal
    const mse = ssResidual / n

    // Calculate MAE and MAPE for training data
    const mae = y.reduce((sum, val, i) => sum + Math.abs(val - trainingPredictions[i]), 0) / n
    const mape =
      y.reduce((sum, val, i) => {
        if (val !== 0) {
          return sum + Math.abs((val - trainingPredictions[i]) / val) * 100
        }
        return sum
      }, 0) / n

    const newModel: RegressionModel = {
      coefficients: coefs,
      intercept,
      rSquared,
      mse,
      mae,
      mape,
    }

    setModel(newModel)
    setIsTraining(false)
    return newModel
  }

  const evaluateModel = async (trainedModel: RegressionModel, testData: TestData[]) => {
    setIsEvaluating(true)

    // Simulate evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const testPredictions = testData.map((test) => {
      const predicted = Math.round(
        trainedModel.intercept +
          test.visitors * trainedModel.coefficients[0] +
          test.pageViews * trainedModel.coefficients[1] +
          test.orders * trainedModel.coefficients[2],
      )

      return {
        ...test,
        predictedUnits: predicted,
      }
    })

    // Calculate evaluation metrics on test data
    const actualValues = testData.map((d) => d.unitsSold)
    const predictedValues = testPredictions.map((d) => d.predictedUnits!)

    const testMean = actualValues.reduce((sum, val) => sum + val, 0) / actualValues.length
    const testSSTotal = actualValues.reduce((sum, val) => sum + Math.pow(val - testMean, 2), 0)
    const testSSResidual = actualValues.reduce((sum, val, i) => sum + Math.pow(val - predictedValues[i], 2), 0)
    const testRSquared = 1 - testSSResidual / testSSTotal
    const testMSE = testSSResidual / actualValues.length
    const testMAE =
      actualValues.reduce((sum, val, i) => sum + Math.abs(val - predictedValues[i]), 0) / actualValues.length
    const testMAPE =
      actualValues.reduce((sum, val, i) => {
        if (val !== 0) {
          return sum + Math.abs((val - predictedValues[i]) / val) * 100
        }
        return sum
      }, 0) / actualValues.length

    // Update model with test evaluation metrics
    const updatedModel = {
      ...trainedModel,
      rSquared: testRSquared,
      mse: testMSE,
      mae: testMAE,
      mape: testMAPE,
    }

    setModel(updatedModel)
    setIsEvaluating(false)

    return testPredictions
  }

  const makePrediction = (visitors: number, pageViews: number, orders: number) => {
    if (!model) return null

    return Math.round(
      model.intercept +
        visitors * model.coefficients[0] +
        pageViews * model.coefficients[1] +
        orders * model.coefficients[2],
    )
  }

  return {
    model,
    isTraining,
    isEvaluating,
    trainModel,
    evaluateModel,
    makePrediction,
  }
}
