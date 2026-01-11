# Requirements Document

## Introduction

MetaReport é um aplicativo web B2B que conecta à conta de anúncios do Facebook (Meta Ads) via OAuth e gera relatórios automáticos, claros e exportáveis sobre o desempenho das campanhas. O sistema facilita a análise para empresários, agências e gestores de tráfego, resolvendo a complexidade do Ads Manager e eliminando a necessidade de relatórios manuais.

## Glossary

- **User**: Pessoa autenticada no sistema (empresário, gestor de tráfego ou agência)
- **Meta_Account**: Conta de anúncios do Facebook/Meta conectada via OAuth
- **Campaign**: Campanha de anúncios dentro de uma Meta_Account
- **Report**: Documento gerado contendo métricas de performance das campanhas
- **Insight**: Métrica de performance coletada da API do Meta (impressões, cliques, CPC, etc.)
- **Access_Token**: Token OAuth armazenado de forma segura para acesso à API do Meta
- **Dashboard**: Interface visual que exibe métricas e gráficos de performance
- **Auth_System**: Sistema de autenticação via Supabase Auth

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to authenticate using email and password, so that I can securely access my reports and connected accounts.

#### Acceptance Criteria

1. WHEN a user submits valid email and password credentials, THE Auth_System SHALL authenticate the user and create a persistent session
2. WHEN a user submits invalid credentials, THE Auth_System SHALL display an error message and prevent access
3. WHEN an authenticated user clicks logout, THE Auth_System SHALL terminate the session and redirect to the login page
4. WHILE a user has an active session, THE Auth_System SHALL maintain authentication state across page refreshes
5. IF a session expires, THEN THE Auth_System SHALL redirect the user to the login page

### Requirement 2: Meta OAuth Connection

**User Story:** As a user, I want to connect my Meta Ads account via OAuth, so that the system can access my campaign data.

#### Acceptance Criteria

1. WHEN a user clicks "Connect Facebook", THE Auth_System SHALL initiate the Meta OAuth flow with ads_read and business_management permissions
2. WHEN the OAuth flow completes successfully, THE Auth_System SHALL securely store the encrypted access_token
3. WHEN the OAuth flow fails or is cancelled, THE Auth_System SHALL display an appropriate error message
4. IF an access_token expires, THEN THE Auth_System SHALL attempt automatic token refresh
5. WHEN a user has a valid access_token, THE Meta_Account SHALL be marked as connected

### Requirement 3: Ad Account Selection

**User Story:** As a user, I want to select which ad account to use, so that I can generate reports for the correct business.

#### Acceptance Criteria

1. WHEN a user completes OAuth connection, THE System SHALL fetch and display all available ad accounts from /me/adaccounts
2. WHEN multiple ad accounts exist, THE System SHALL allow the user to select one account
3. WHEN a user selects an ad account, THE System SHALL store the meta_account_id and account name
4. IF no ad accounts are found, THEN THE System SHALL display a message indicating no accounts available

### Requirement 4: Campaign Data Collection

**User Story:** As a user, I want to view my campaigns and their metrics, so that I can understand my advertising performance.

#### Acceptance Criteria

1. WHEN a user has a connected Meta_Account, THE System SHALL fetch campaigns from /act_{ad_account_id}/campaigns
2. WHEN fetching campaign insights, THE System SHALL collect: impressions, clicks, CPC, CPM, spend, and CTR
3. WHEN a user specifies a date range, THE System SHALL filter insights to that period
4. IF the Meta API returns an error, THEN THE System SHALL display a user-friendly error message
5. IF rate limiting occurs, THEN THE System SHALL implement retry logic with exponential backoff

### Requirement 5: Report Generation

**User Story:** As a user, I want to generate consolidated reports, so that I can analyze and share campaign performance.

#### Acceptance Criteria

1. WHEN a user requests a report, THE System SHALL generate a consolidated view by campaign
2. WHEN generating a report, THE System SHALL include daily breakdown of metrics
3. WHEN a user selects two periods, THE System SHALL generate a comparative report
4. WHEN a report is generated, THE System SHALL persist it to the database with timestamp
5. THE Dashboard SHALL display metrics using charts and visual representations

### Requirement 6: Report Export

**User Story:** As a user, I want to export reports in PDF and CSV formats, so that I can share them with clients and partners.

#### Acceptance Criteria

1. WHEN a user clicks "Export PDF", THE System SHALL generate a formatted PDF document with all report data
2. WHEN a user clicks "Export CSV", THE System SHALL generate a CSV file with tabular metric data
3. WHEN export completes, THE System SHALL trigger a file download in the browser
4. IF export fails, THEN THE System SHALL display an error message and allow retry

### Requirement 7: Report History

**User Story:** As a user, I want to access previously generated reports, so that I can review historical performance.

#### Acceptance Criteria

1. WHEN a user accesses the reports section, THE System SHALL display a list of previously generated reports
2. WHEN viewing report history, THE System SHALL show report date range and creation timestamp
3. WHEN a user selects a historical report, THE System SHALL display the full report data
4. THE System SHALL store report data as JSONB for flexible querying

### Requirement 8: Performance and Security

**User Story:** As a system administrator, I want the application to be performant and secure, so that users have a reliable experience.

#### Acceptance Criteria

1. WHEN generating reports with average data volume, THE System SHALL respond within 2 seconds
2. THE System SHALL encrypt all access_tokens before storing in the database
3. THE System SHALL comply with Meta's data usage policies
4. THE System SHALL implement LGPD compliance for user data handling
5. WHILE processing API requests, THE System SHALL implement caching to reduce Meta API calls
