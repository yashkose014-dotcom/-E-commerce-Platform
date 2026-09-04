export const required = (value, field) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    const error = new Error(`${field} is required`)
    error.status = 400
    throw error
  }
  return value
}

export const positiveInt = (value, field) => {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) {
    const error = new Error(`${field} must be a positive integer`)
    error.status = 400
    throw error
  }
  return n
}

export const money = (value, field = 'Amount') => {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) {
    const error = new Error(`${field} must be a valid non-negative number`)
    error.status = 400
    throw error
  }
  return Math.round(n * 100) / 100
}
