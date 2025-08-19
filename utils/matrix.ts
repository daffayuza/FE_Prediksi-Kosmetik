export const transpose = (matrix: number[][]): number[][] => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]))
}

export const multiply = (a: number[][], b: number[][]): number[][] => {
  const result = Array(a.length)
    .fill(null)
    .map(() => Array(b[0].length).fill(0))
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < b.length; k++) {
        result[i][j] += a[i][k] * b[k][j]
      }
    }
  }
  return result
}

export const multiplyVector = (matrix: number[][], vector: number[]): number[] => {
  return matrix.map((row) => row.reduce((sum, val, i) => sum + val * vector[i], 0))
}

export const inverse = (matrix: number[][]): number[][] => {
  const n = matrix.length
  const identity = Array(n)
    .fill(null)
    .map((_, i) =>
      Array(n)
        .fill(null)
        .map((_, j) => (i === j ? 1 : 0)),
    )

  const augmented = matrix.map((row, i) => [...row, ...identity[i]])

  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    let maxRow = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k
      }
    }
    ;[augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i]
      for (let j = i; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j]
      }
    }
  }

  // Back substitution
  for (let i = n - 1; i >= 0; i--) {
    for (let k = i - 1; k >= 0; k--) {
      const factor = augmented[k][i] / augmented[i][i]
      for (let j = 0; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j]
      }
    }
  }

  // Normalize
  for (let i = 0; i < n; i++) {
    const divisor = augmented[i][i]
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= divisor
    }
  }

  return augmented.map((row) => row.slice(n))
}
