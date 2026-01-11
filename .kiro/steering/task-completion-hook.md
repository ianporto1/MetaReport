# Acionamento de Hook ao Completar Tarefas

## Objetivo

Garantir que o agent hook "Auto Commit por Task" seja acionado automaticamente ao final de cada tarefa completada.

## Regra Principal

Ao finalizar qualquer tarefa que envolva alterações de código, o agente DEVE permitir que o hook `emoji-commit-convention` seja executado para criar commits automáticos.

---

## Diretrizes Obrigatórias

### 1️⃣ Finalização Clara de Tarefas

- Ao completar uma tarefa, finalize a execução de forma limpa
- Não inicie novas tarefas sem concluir a atual
- O hook `agentStop` será acionado automaticamente ao parar

### 2️⃣ Preparação para o Hook

Antes de finalizar uma tarefa:
- Certifique-se de que todos os arquivos foram salvos
- Verifique se não há erros de sintaxe pendentes
- Confirme que as alterações estão prontas para commit

### 3️⃣ Convenção de Commits (Referência)

O hook seguirá esta convenção de emojis:
- ✨ `feat`: Nova funcionalidade
- 🐛 `fix`: Correção de bug
- 📝 `docs`: Documentação
- 💄 `style`: Estilo/formatação
- ♻️ `refactor`: Refatoração
- 🧪 `test`: Testes
- 🔧 `chore`: Manutenção

### 4️⃣ Quando o Hook é Acionado

O hook `emoji-commit-convention` é acionado:
- Automaticamente quando o agente para (`agentStop`)
- Após qualquer tarefa que modifique arquivos
- Independente do tipo de alteração realizada

---

## Resultado Esperado

- Commits automáticos e padronizados
- Histórico de git organizado
- Rastreabilidade de alterações por tarefa
