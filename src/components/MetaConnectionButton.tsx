import { useState } from 'react'
import type { MetaAccount } from '@/types'
import './MetaConnectionButton.css'

interface MetaConnectionButtonProps {
  onConnected?: (account: MetaAccount) => void
  onError?: (error: string) => void
  isConnected?: boolean
}

export function MetaConnectionButton({ onConnected: _onConnected, onError, isConnected = false }: MetaConnectionButtonProps) {
  void _onConnected // Reserved for future use after OAuth callback
  const [isLoading, setIsLoading] = useState(false)

  async function handleConnect() {
    setIsLoading(true)
    
    try {
      // Redirect to OAuth endpoint
      window.location.href = '/api/auth/meta'
    } catch (error) {
      setIsLoading(false)
      onError?.(error instanceof Error ? error.message : 'Erro ao conectar')
    }
  }

  if (isConnected) {
    return (
      <div className="meta-connection connected">
        <span className="status-icon">✓</span>
        <span>Conta Meta conectada</span>
      </div>
    )
  }

  return (
    <button 
      className="meta-connection-button"
      onClick={handleConnect}
      disabled={isLoading}
    >
      {isLoading ? (
        'Conectando...'
      ) : (
        <>
          <svg className="facebook-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Conectar Facebook
        </>
      )}
    </button>
  )
}
