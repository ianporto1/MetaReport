# Convenção de Commits com Emojis

Todos os projetos seguem um padrão de commits com emojis para facilitar a identificação visual do objetivo de cada commit.

## Fluxo de Commits

### Antes de Modificar Código
Crie um commit explicando:
- O que irá fazer
- Qual objetivo/resultado esperado
- Use o Specification Pattern para definir as regras de validação de aceitação da mudança

### Após Finalizar as Mudanças
Crie outro commit confirmando:
- Que atingiu o objetivo/resultado
- A técnica utilizada para chegar no objetivo

## Formato da Mensagem de Commit

Inicie todo commit com a data e hora atual:
```
[YYYY-mm-dd HH:mm] <emoji> <tipo>: <descrição>
```

## Tabela de Emojis

| Emoji | Código               | Tipo       | Descrição                       |
| ----- | -------------------- | ---------- | ------------------------------- |
| ✨    | `:sparkles:`         | `feat`     | Nova funcionalidade             |
| 🐛    | `:bug:`              | `fix`      | Correção de bug                 |
| 📝    | `:memo:`             | `docs`     | Documentação                    |
| 🎨    | `:art:`              | `style`    | Formatação, estilos ou UI       |
| ♻️    | `:recycle:`          | `refactor` | Refatoração de código           |
| ⚡️   | `:zap:`              | `perf`     | Melhorias de performance        |
| ✅    | `:white_check_mark:` | `test`     | Testes                          |
| 🔧    | `:wrench:`           | `chore`    | Configurações, tarefas de build |
| 🚀    | `:rocket:`           | `deploy`   | Deploy ou release               |
| 🔥    | `:fire:`             | `remove`   | Remoção de código/arquivos      |
| 🔒    | `:lock:`             | `security` | Segurança                       |

## Exemplos

### Commit de Início (antes de modificar)
```
[2026-01-11 14:30] 📝 docs: Iniciando implementação do módulo de autenticação

Objetivo: Criar sistema de login com JWT
Resultado esperado: Usuários poderão se autenticar e receber token válido

Critérios de Aceitação (Specification Pattern):
- Token deve expirar em 24h
- Senha deve ter mínimo 8 caracteres
- Email deve ser único no sistema
```

### Commit de Conclusão (após finalizar)
```
[2026-01-11 16:45] ✨ feat: Módulo de autenticação implementado com sucesso

Técnica utilizada: JWT com refresh token
- Implementado middleware de validação
- Criado serviço de hash com bcrypt
- Todos os critérios de aceitação foram atendidos
```
