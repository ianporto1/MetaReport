import { calculateBackoffDelay } from './calculateBackoffDelay'

const MAX_RETRIES = 3

interface RetryOptions {
  maxRetries?: number
  shouldRetry?: (error: unknown) => boolean
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? MAX_RETRIES
  const shouldRetry = options.shouldRetry ?? isRateLimitError
  
  let lastError: unknown
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }
      
      const delay = calculateBackoffDelay(attempt)
      await sleep(delay)
    }
  }
  
  throw lastError
}

function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as { code: number }).code === 4
  }
  return false
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
