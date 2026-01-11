export function calculateTokenExpiration(expiresInSeconds: number): Date {
  return new Date(Date.now() + expiresInSeconds * 1000)
}
