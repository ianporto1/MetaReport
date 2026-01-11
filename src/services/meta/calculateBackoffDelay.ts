const BASE_DELAY_MS = 1000

export function calculateBackoffDelay(attemptNumber: number): number {
  return BASE_DELAY_MS * Math.pow(2, attemptNumber)
}
