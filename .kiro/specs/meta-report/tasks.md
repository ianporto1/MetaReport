# Implementation Plan: MetaReport

## Overview

Implementação do MetaReport seguindo arquitetura serverless com React + Vite no frontend, Vercel Functions no backend e Supabase para autenticação e banco de dados. O desenvolvimento será incremental, começando pela infraestrutura e avançando para funcionalidades de negócio.

## Tasks

- [x] 1. Setup do projeto e infraestrutura base
  - [x] 1.1 Criar projeto React com Vite e TypeScript
    - Configurar Vite com React e TypeScript
    - Instalar dependências: react-router-dom, @supabase/supabase-js, recharts, fast-check
    - Configurar estrutura de pastas (src/components, src/services, src/types, src/api)
    - _Requirements: 8.1_

  - [x] 1.2 Configurar Supabase e criar schema do banco
    - Criar tabelas: users, meta_accounts, reports
    - Configurar Row Level Security (RLS)
    - Criar tipos TypeScript a partir do schema
    - _Requirements: 7.4, 8.2_

  - [x] 1.3 Configurar estrutura de API routes (Vercel Functions)
    - Criar estrutura em /api com endpoints placeholder
    - Configurar variáveis de ambiente (.env.local)
    - _Requirements: 8.1_

- [-] 2. Implementar autenticação com Supabase
  - [x] 2.1 Criar AuthContext e hooks de autenticação
    - Implementar AuthProvider com estado de sessão
    - Criar hooks useAuth para acesso ao contexto
    - Implementar signIn, signOut e verificação de sessão
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Criar componentes de UI para autenticação
    - Criar LoginPage com formulário email/senha
    - Criar ProtectedRoute para rotas autenticadas
    - Implementar redirecionamento após login/logout
    - _Requirements: 1.1, 1.3_

  - [-] 2.3 Escrever testes unitários para autenticação
    - Testar validação de credenciais
    - Testar estado de sessão
    - _Requirements: 1.1, 1.2_

- [ ] 3. Implementar serviço de criptografia de tokens
  - [ ] 3.1 Criar TokenService para encrypt/decrypt
    - Implementar criptografia AES-256-GCM
    - Usar variável de ambiente para chave de criptografia
    - _Requirements: 2.2, 8.2_

  - [ ] 3.2 Escrever property test para criptografia de tokens
    - **Property 2: Token Encryption Round-Trip**
    - **Validates: Requirements 2.2, 8.2**

- [ ] 4. Implementar conexão OAuth com Meta
  - [ ] 4.1 Criar endpoint /api/auth/meta para iniciar OAuth
    - Gerar URL de autorização com scopes ads_read e business_management
    - Implementar state parameter para segurança CSRF
    - _Requirements: 2.1_

  - [ ] 4.2 Escrever property test para URL OAuth
    - **Property 1: OAuth URL Permission Integrity**
    - **Validates: Requirements 2.1**

  - [ ] 4.3 Criar endpoint /api/auth/meta/callback para processar OAuth
    - Trocar code por access_token
    - Criptografar e armazenar token no Supabase
    - Calcular e armazenar token_expiration
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ] 4.4 Criar componente MetaConnectionButton
    - Botão "Conectar Facebook" que inicia fluxo OAuth
    - Exibir estado de conexão (conectado/desconectado)
    - Tratar erros e cancelamentos
    - _Requirements: 2.1, 2.3, 2.5_

  - [ ] 4.5 Escrever property test para status de conexão
    - **Property 3: Connected Account Status**
    - **Validates: Requirements 2.5**

- [ ] 5. Checkpoint - Validar autenticação e OAuth
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implementar listagem de contas de anúncios
  - [ ] 6.1 Criar MetaApiService para chamadas à Graph API
    - Implementar getAdAccounts usando /me/adaccounts
    - Implementar tratamento de erros da API
    - _Requirements: 3.1, 4.4_

  - [ ] 6.2 Criar endpoint /api/meta/accounts
    - Buscar contas usando MetaApiService
    - Retornar lista formatada de AdAccount
    - _Requirements: 3.1_

  - [ ] 6.3 Criar componente AccountSelector
    - Listar contas disponíveis
    - Permitir seleção de uma conta
    - Persistir seleção no Supabase
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 6.4 Escrever property test para persistência de conta
    - **Property 4: Account Selection Persistence**
    - **Validates: Requirements 3.3**

- [ ] 7. Implementar coleta de insights de campanhas
  - [ ] 7.1 Estender MetaApiService com getCampaigns e getInsights
    - Implementar chamada a /act_{id}/campaigns
    - Implementar chamada a /act_{id}/insights com métricas
    - Extrair: impressions, clicks, cpc, cpm, spend, ctr
    - _Requirements: 4.1, 4.2_

  - [ ] 7.2 Escrever property test para completude de campos
    - **Property 5: Insight Field Completeness**
    - **Validates: Requirements 4.2**

  - [ ] 7.3 Implementar filtro por período
    - Adicionar parâmetros time_range na chamada de insights
    - Validar formato de datas
    - _Requirements: 4.3_

  - [ ] 7.4 Escrever property test para filtro de datas
    - **Property 6: Date Range Filter Accuracy**
    - **Validates: Requirements 4.3**

  - [ ] 7.5 Implementar retry com exponential backoff
    - Criar função de retry para rate limiting
    - Implementar delay exponencial (baseDelay * 2^attempt)
    - Máximo de 3 tentativas
    - _Requirements: 4.5_

  - [ ] 7.6 Escrever property test para exponential backoff
    - **Property 7: Exponential Backoff Retry**
    - **Validates: Requirements 4.5**

  - [ ] 7.7 Criar endpoint /api/meta/insights
    - Receber accountId, startDate, endDate
    - Retornar CampaignInsight[] formatado
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8. Implementar serviço de cache
  - [ ] 8.1 Criar CacheService com get/set/invalidate
    - Usar Map em memória para MVP (pode evoluir para Redis)
    - Implementar TTL para expiração
    - _Requirements: 8.5_

  - [ ] 8.2 Escrever property test para consistência de cache
    - **Property 15: Cache Hit Consistency**
    - **Validates: Requirements 8.5**

- [ ] 9. Checkpoint - Validar integração com Meta API
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implementar geração de relatórios
  - [ ] 10.1 Criar ReportService com lógica de geração
    - Consolidar insights por campanha
    - Calcular totais agregados
    - Gerar breakdown diário
    - _Requirements: 5.1, 5.2_

  - [ ] 10.2 Escrever property test para consolidação por campanha
    - **Property 8: Campaign Consolidation**
    - **Validates: Requirements 5.1**

  - [ ] 10.3 Escrever property test para breakdown diário
    - **Property 9: Daily Breakdown Presence**
    - **Validates: Requirements 5.2**

  - [ ] 10.4 Implementar comparação de períodos
    - Calcular métricas para período de comparação
    - Calcular percentual de variação
    - _Requirements: 5.3_

  - [ ] 10.5 Escrever property test para cálculo de comparação
    - **Property 10: Period Comparison Calculation**
    - **Validates: Requirements 5.3**

  - [ ] 10.6 Implementar persistência de relatórios
    - Salvar relatório como JSONB no Supabase
    - Incluir timestamp de criação
    - _Requirements: 5.4, 7.4_

  - [ ] 10.7 Escrever property test para persistência round-trip
    - **Property 11: Report Persistence Round-Trip**
    - **Validates: Requirements 5.4, 7.3, 7.4**

  - [ ] 10.8 Criar endpoint /api/reports/generate
    - Receber parâmetros de período
    - Gerar e persistir relatório
    - Retornar relatório completo
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11. Implementar histórico de relatórios
  - [ ] 11.1 Criar endpoint GET /api/reports
    - Listar relatórios do usuário
    - Retornar metadata (datas, timestamp)
    - _Requirements: 7.1, 7.2_

  - [ ] 11.2 Escrever property test para metadata do histórico
    - **Property 14: Report History Metadata**
    - **Validates: Requirements 7.2**

  - [ ] 11.3 Criar endpoint GET /api/reports/:id
    - Buscar relatório por ID
    - Retornar dados completos
    - _Requirements: 7.3_

- [ ] 12. Implementar exportação de relatórios
  - [ ] 12.1 Implementar exportação PDF
    - Usar biblioteca pdfkit ou jspdf
    - Formatar relatório com métricas e gráficos
    - _Requirements: 6.1_

  - [ ] 12.2 Escrever property test para completude do PDF
    - **Property 12: PDF Export Completeness**
    - **Validates: Requirements 6.1**

  - [ ] 12.3 Implementar exportação CSV
    - Gerar CSV com dados tabulares
    - Incluir headers e todas as métricas
    - _Requirements: 6.2_

  - [ ] 12.4 Escrever property test para CSV round-trip
    - **Property 13: CSV Export Round-Trip**
    - **Validates: Requirements 6.2**

  - [ ] 12.5 Criar endpoint GET /api/reports/:id/export
    - Aceitar query param format=pdf|csv
    - Retornar arquivo para download
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 13. Checkpoint - Validar geração e exportação de relatórios
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implementar Dashboard UI
  - [ ] 14.1 Criar componente DateRangePicker
    - Seletor de data inicial e final
    - Opção para período de comparação
    - _Requirements: 4.3, 5.3_

  - [ ] 14.2 Criar componente MetricsCards
    - Cards com métricas principais (impressões, cliques, gasto, etc.)
    - Indicadores de variação percentual
    - _Requirements: 5.1, 5.3_

  - [ ] 14.3 Criar componente CampaignChart
    - Gráfico de barras/linhas com Recharts
    - Visualização por campanha
    - _Requirements: 5.5_

  - [ ] 14.4 Criar componente DailyChart
    - Gráfico de linha com breakdown diário
    - _Requirements: 5.2_

  - [ ] 14.5 Criar página Dashboard principal
    - Integrar todos os componentes
    - Conectar com API de insights e relatórios
    - _Requirements: 5.1, 5.2, 5.5_

- [ ] 15. Implementar página de histórico de relatórios
  - [ ] 15.1 Criar componente ReportList
    - Listar relatórios com data e período
    - Link para visualização detalhada
    - _Requirements: 7.1, 7.2_

  - [ ] 15.2 Criar página ReportDetail
    - Exibir relatório completo
    - Botões de exportação PDF/CSV
    - _Requirements: 7.3, 6.1, 6.2_

- [ ] 16. Checkpoint final - Validar aplicação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Todas as tasks são obrigatórias, incluindo testes unitários e property-based tests
- Cada task referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Property tests validam propriedades universais de corretude
- Unit tests validam exemplos específicos e edge cases
