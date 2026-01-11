export interface MetaApiError {
  code: number
  message: string
  type: string
}

export function handleMetaApiError(error: MetaApiError): string {
  switch (error.code) {
    case 190:
      return 'Token inválido. Por favor, reconecte sua conta Meta.'
    case 4:
      return 'Limite de requisições atingido. Tente novamente em alguns minutos.'
    case 100:
      return 'Parâmetro inválido na requisição.'
    case 200:
      return 'Permissão negada. Por favor, reconecte com as permissões corretas.'
    default:
      return error.message || 'Erro ao comunicar com a API do Meta.'
  }
}
