import { useState, useEffect } from 'react'
import type { AdAccount } from '@/types'
import './AccountSelector.css'

interface AccountSelectorProps {
  onSelect: (account: AdAccount) => void
  onError?: (error: string) => void
}

export function AccountSelector({ onSelect, onError }: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<AdAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadAccounts() {
      try {
        const response = await fetch('/api/meta/accounts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Falha ao carregar contas')
        }
        
        const data = await response.json()
        setAccounts(data.accounts)
        
        if (data.accounts.length === 0) {
          onError?.('Nenhuma conta de anúncios encontrada')
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Erro ao carregar contas')
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [onError])

  function handleSelect(account: AdAccount) {
    setSelectedId(account.id)
    onSelect(account)
  }

  if (loading) {
    return <div className="account-selector loading">Carregando contas...</div>
  }

  if (accounts.length === 0) {
    return (
      <div className="account-selector empty">
        Nenhuma conta de anúncios disponível
      </div>
    )
  }

  return (
    <div className="account-selector">
      <h3>Selecione uma conta de anúncios</h3>
      <ul className="account-list">
        {accounts.map(account => (
          <li 
            key={account.id}
            className={`account-item ${selectedId === account.id ? 'selected' : ''}`}
            onClick={() => handleSelect(account)}
          >
            <span className="account-name">{account.name}</span>
            <span className="account-meta">{account.currency} • {account.timezone}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
