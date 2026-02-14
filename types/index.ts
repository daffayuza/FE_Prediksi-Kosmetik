export interface DataPoint {
  id: number
  year: number
  month: number
  visitors: number
  pageViews: number
  orders: number
  unitsSold: number
}

export interface Product {
  id: number
  name: string
  kode: string
  created_at: string
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
  tahun: string;
  bulan: string;
  visitors: string
  pageViews: string
  orders: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
