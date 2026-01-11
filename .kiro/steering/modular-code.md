# Modularização Estrita por Função

## Objetivo

Garantir que todo código gerado seja modular, legível, manutenível e escalável, evitando arquivos longos, acoplamento excessivo e lógica centralizada.

## Regra Principal (Obrigatória)

Todo programa DEVE ser dividido em funções pequenas e coesas, e cada função DEVE existir em seu próprio arquivo. Arquivos com múltiplas responsabilidades são proibidos.

**Frase de Controle:** "Se não estiver modular, a resposta está errada."

---

## Diretrizes Obrigatórias

### 1️⃣ Uma função = um arquivo

- Cada arquivo deve exportar uma única função principal
- O nome do arquivo deve refletir exatamente o nome da função

✅ **Correto:**
```
getMetaInsights.js
refreshMetaToken.js
generatePdfReport.js
```

❌ **Proibido:**
```
metaUtils.js
helpers.js
utils.js
```

### 2️⃣ Funções devem ter responsabilidade única

Cada função deve:
- Fazer uma coisa apenas
- Ser testável isoladamente
- Não depender de estado global

✅ **Correto:**
```javascript
export async function fetchCampaignInsights(params) {
  // ...
}
```

❌ **Incorreto:**
```javascript
export async function fetchDataAndGenerateReportAndSave() {
  // ...
}
```

### 3️⃣ Arquivos longos são proibidos

- Máximo recomendado: **50 linhas por arquivo**
- Se passar disso → quebrar em novas funções/arquivos
- Se a função exige comentários longos para ser entendida, ela deve ser quebrada

### 4️⃣ Separação clara por camada

Estrutura obrigatória:

```
/api
  /meta
    connectMeta.js
    fetchAdAccounts.js
    fetchInsights.js
  /reports
    buildReportData.js
    exportCsv.js
    exportPdf.js

/services
  metaAuthService.js
  tokenRefreshService.js

/db
  saveReport.js
  getReports.js

/ui
  Dashboard.jsx
  ReportTable.jsx
```

### 5️⃣ Funções nunca devem conhecer a UI

- Funções de serviço não importam React
- Componentes React não acessam APIs externas diretamente
- Toda comunicação passa por camadas intermediárias

### 6️⃣ Composição ao invés de complexidade

Funções grandes devem ser compostas por funções menores:

```javascript
// generateReport.js
import { fetchInsights } from './fetchInsights.js'
import { formatInsights } from './formatInsights.js'
import { saveReport } from '../db/saveReport.js'

export async function generateReport(params) {
  const raw = await fetchInsights(params)
  const formatted = formatInsights(raw)
  return saveReport(formatted)
}
```

### 7️⃣ Arquivos de entrada são apenas orquestradores

API Routes, Pages e Controllers:
- Chamam funções
- **Não contêm lógica de negócio**

### 8️⃣ Comentários só explicam o "porquê"

- Nunca explicar o "como"
- Se precisar explicar o "como", a função está grande demais

### 9️⃣ Proibição explícita

🚫 É proibido:
- Arquivos `utils.js`, `helpers.js`, `common.js`
- Funções com múltiplos efeitos colaterais
- Copiar e colar lógica
- Componentes React com lógica de negócio pesada

### 🔟 Regra de Revisão Automática

Antes de gerar código, perguntar:

> "Esse código poderia ser quebrado em funções menores, cada uma em seu próprio arquivo?"

Se a resposta for **sim**, a divisão é **obrigatória**.

---

## Resultado Esperado

- Código limpo
- Arquitetura escalável
- Fácil manutenção
- Ideal para SaaS B2B
- Apropriado para crescimento sem refatorações traumáticas
