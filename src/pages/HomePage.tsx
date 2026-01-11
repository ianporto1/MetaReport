import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import './HomePage.css'

export function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>MetaReport</h1>
        <p>Relatórios automáticos para suas campanhas Meta Ads</p>
      </header>

      <main className="home-content">
        {loading ? (
          <p>Carregando...</p>
        ) : user ? (
          <div className="home-actions">
            <Link to="/dashboard" className="home-btn primary">
              Ir para Dashboard
            </Link>
            <Link to="/reports" className="home-btn secondary">
              Ver Relatórios
            </Link>
          </div>
        ) : (
          <div className="home-actions">
            <Link to="/login" className="home-btn primary">
              Fazer Login
            </Link>
          </div>
        )}
      </main>

      <section className="home-features">
        <h2>Funcionalidades</h2>
        <ul>
          <li>Conexão OAuth com Meta Ads</li>
          <li>Relatórios automáticos de campanhas</li>
          <li>Exportação em PDF e CSV</li>
          <li>Comparação de períodos</li>
          <li>Dashboard com gráficos</li>
        </ul>
      </section>
    </div>
  )
}
