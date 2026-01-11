# Supabase como Banco de Dados Padrão

## Objetivo

Garantir que todas as operações de banco de dados utilizem o Supabase como backend, aproveitando seus recursos de Postgres, autenticação, storage e real-time.

## Regra Principal

Sempre que uma funcionalidade precisar de persistência de dados, autenticação ou storage, utilize o Supabase.

---

## Diretrizes Obrigatórias

### 1️⃣ Usar MCP do Supabase

- Utilize as ferramentas do MCP `supabase` para operações de banco
- Para DDL (criar tabelas, índices, etc): use `apply_migration`
- Para queries de dados: use `execute_sql`
- Sempre gere tipos TypeScript após alterações no schema

### 2️⃣ Migrations são obrigatórias

- Toda alteração de schema DEVE ser feita via migration
- Nunca altere o banco diretamente sem migration
- Nomes de migration em snake_case descritivo

```sql
-- Exemplo: create_campaigns_table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3️⃣ Row Level Security (RLS)

- Sempre habilite RLS em tabelas com dados de usuários
- Crie policies apropriadas para cada operação
- Verifique advisories de segurança após criar tabelas

### 4️⃣ Estrutura de arquivos para DB

```
/db
  /queries
    getCampaigns.js
    saveCampaign.js
    deleteReport.js
  /types
    database.types.ts
```

### 5️⃣ Cliente Supabase

- Use o cliente oficial `@supabase/supabase-js`
- Armazene credenciais em variáveis de ambiente
- Nunca exponha a service_role key no frontend

```javascript
// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 6️⃣ Verificações obrigatórias

Antes de finalizar alterações no banco:
- Rodar `get_advisors` para verificar segurança
- Gerar tipos TypeScript atualizados
- Documentar a migration no código

---

## Recursos do Supabase a considerar

| Necessidade | Recurso Supabase |
|-------------|------------------|
| Persistência | Postgres Database |
| Autenticação | Supabase Auth |
| Arquivos | Supabase Storage |
| Tempo real | Realtime Subscriptions |
| APIs | Edge Functions |

## Resultado Esperado

- Banco de dados gerenciado e escalável
- Segurança via RLS
- Tipos TypeScript sincronizados
- Migrations versionadas e rastreáveis
