export interface DataPoint {
  id: number
  visitors: number
  pageViews: number
  orders: number
  unitsSold: number
}

export interface TestData {
  id: number
  visitors: number
  pageViews: number
  orders: number
  unitsSold: number
  predictedUnits?: number
}

export interface RegressionModel {
  coefficients: number[]
  intercept: number
  rSquared?: number
  mse?: number
  mae?: number
  mape?: number
  updatedAt?: string;
}

export interface PredictionInput {
  visitors: string
  pageViews: string
  orders: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
