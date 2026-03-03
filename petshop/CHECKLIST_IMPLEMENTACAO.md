# 📋 CHECKLIST DE IMPLEMENTAÇÃO - PASSO A PASSO

## 🚨 FASE 1: SEGURANÇA CRÍTICA (Semana 1-2)

### Sprint 1.1: Autenticação com JWT

**Objetivo:** Migrar de localStorage CNPJ para JWT com HttpOnly cookies

**Backend (C#/.NET) - TODO:**

- [ ] Implementar endpoint `POST /api/Autenticacao/Login` com JWT
- [ ] Retornar JWT em HttpOnly cookie (não em response body)
- [ ] Implementar endpoint `POST /api/Autenticacao/Logout`
- [ ] Adicionar middleware de validação JWT
- [ ] Implementar refresh token strategy
- [ ] Hash de senhas com bcrypt
- [ ] Rate limiting em login (max 5 tentativas/15min)

**Frontend:**

- [ ] Criar `src/utils/validadores.js` com `validarCnpj()`, `validarSenha()`
- [ ] Refatorar `src/services/autenticacaoService.js` (novo arquivo)
  - [ ] Remover importação de `auth.js`
  - [ ] Implementar `fazerLogin()` e `fazerLogout()`
- [ ] Refatorar `src/store/useGlobalStore.js`
  - [ ] Remover localStorage.setItem/getItem
  - [ ] Adicionar computed `estaAutenticado`, `tokenExpirou`
  - [ ] Adicionar método `desautenticar()`
- [ ] Refatorar `src/services/apiClient.js`
  - [ ] Adicionar `withCredentials: true`
  - [ ] Implementar CSRF token header
  - [ ] Interceptador para 401 redirect `/login`
- [ ] Refatorar `src/main.js`
  - [ ] Remover event listener `unload`
- [ ] Refatorar `src/pages/LoginPage.vue`
  - [ ] Usar nova `autenticacaoService.fazerLogin()`
  - [ ] Remover manipulação de localStorage
- [ ] Testes:
  - [ ] Testar login com credenciais válidas
  - [ ] Testar login com credenciais inválidas
  - [ ] Testar logout e limpeza de estado
  - [ ] Testar redirecionamento ao expirar token

**Arquivos a criar:**

```
src/utils/
  ├── validadores.js (novo)
  ├── erroHandler.js (novo)
  └── sanitizar.js (novo)

src/services/
  ├── autenticacaoService.js (novo)
  └── apiClient.js (refatorar)

src/composables/
  └── useAutenticacao.js (novo)
```

**Commits:**

```bash
git commit -m "refactor: implementar autenticação JWT com HttpOnly cookies"
git commit -m "refactor: adicionar validadores centralizados"
git commit -m "refactor: implementar tratamento de erro API"
```

---

### Sprint 1.2: Validação de Entrada

**Objetivo:** Implementar validação robusta e sanitização

**Frontend:**

- [ ] Criar `src/utils/validadores.js` (já listado acima)
  - [ ] `validarCnpj(cnpj)` - validação de CNPJ
  - [ ] `validarSenha(senha)` - validação força senha
  - [ ] `validarEmail(email)` - validação email
  - [ ] `validarTelefone(telefone)` - se necessário
  - [ ] `validarUrl(url)` - se necessário
- [ ] Criar `src/utils/sanitizar.js`
  - [ ] `sanitizarHtml(entrada)` - previne XSS
  - [ ] `sanitizarTexto(entrada)` - remove caracteres perigosos
- [ ] Criar `src/composables/useFormulario.js`
  - [ ] Validação reativa de campos
  - [ ] Rastreamento de erros
- [ ] Refatorar componentes com formulários:
  - [ ] `src/pages/LoginPage.vue`
  - [ ] `src/pages/Configuracoes/PetShopDados.vue`
  - [ ] `src/pages/Configuracoes/PetShopServico.vue`
  - [ ] Outros formulários conforme necessário

**Testes:**

- [ ] Testar validação CNPJ (válido e inválido)
- [ ] Testar validação senha (requisitos de força)
- [ ] Testar sanitização contra XSS
- [ ] Testar formulário bloqueia submit com erro de validação

**Commits:**

```bash
git commit -m "feat: adicionar validadores centralizados"
git commit -m "feat: adicionar funções de sanitização"
git commit -m "feat: criar composable useFormulario"
git commit -m "refactor: atualizar LoginPage com validação"
```

---

### Sprint 1.3: Proteção CSRF

**Objetivo:** Adicionar CSRF tokens em requisições

**Backend:**

- [ ] Gerar CSRF token único por sessão
- [ ] Validar CSRF token em requisições POST/PUT/DELETE
- [ ] Retornar token em cookie ou meta tag HTML

**Frontend:**

- [ ] Adicionar meta tag CSRF no `public/index.html`
  ```html
  <meta name="csrf-token" content="" />
  ```
- [ ] Refatorar `src/services/apiClient.js`
  - [ ] Ler CSRF token do meta tag
  - [ ] Adicionar header `X-CSRF-Token` em requisições
- [ ] Adicionar testes de CSRF

**Commits:**

```bash
git commit -m "feat: adicionar proteção CSRF com tokens"
```

---

## 🔧 FASE 2: REFATORAÇÃO ARQUITETURA SOLID (Semana 3-4)

### Sprint 2.1: Factory Pattern em Services

**Objetivo:** Remover ~70 linhas de código duplicado

**Frontend:**

- [ ] Criar `src/services/baseService.js`
  - [ ] Classe `CRUDService` genérica
  - [ ] Métodos: `listar()`, `obter()`, `criar()`, `atualizar()`, `deletar()`
- [ ] Refatorar `src/services/empresaService.js`
  - [ ] Estender `CRUDService`
  - [ ] Remover funções com padrão Promise wrapper
  - [ ] Manter apenas métodos específicos
- [ ] Refatorar `src/services/parametroService.js`
- [ ] Refatorar `src/services/agendaService.js`
- [ ] Refatorar outros services

**Testes:**

- [ ] Testar CRUDService genericamente
- [ ] Testar cada service específico

**Commits:**

```bash
git commit -m "refactor: criar baseService com factory CRUD"
git commit -m "refactor: atualizar empresaService com factory"
git commit -m "refactor: remover Promise wrapper desnecessário"
```

---

### Sprint 2.2: Separação de Responsabilidades

**Objetivo:** Implementar SRP completo

**Frontend:**

- [ ] Refatorar `src/middlewares/carregarDadosDoMenu.js`
  - [ ] Criar `src/composables/useAutenticacao.js` (já iniciado em Fase 1)
  - [ ] Criar `src/composables/useCarregamentoDados.js`
  - [ ] Middleware chama composables, não faz lógica
- [ ] Criar `src/composables/useDebounce.js`
- [ ] Criar `src/composables/useThrottle.js`
- [ ] Refatorar componentes que fazem múltiplas responsabilidades

**Testes:**

- [ ] Testar cada composable isoladamente
- [ ] Testar middleware com composables

**Commits:**

```bash
git commit -m "refactor: criar composable useCarregamentoDados"
git commit -m "refactor: implementar debounce e throttle"
git commit -m "refactor: separar responsabilidades em composables"
```

---

### Sprint 2.3: Tratamento Centralizado de Erros

**Objetivo:** Implementar error handler global

**Frontend:**

- [ ] Criar `src/utils/erroHandler.js` (já listado em Fase 1)
  - [ ] Classe `ErroApp`
  - [ ] Função `tratarErroApi()`
  - [ ] Classe `LoggerErro`
- [ ] Criar `src/composables/useErro.js`
  - [ ] Centraliza captura e tratamento de erros
- [ ] Refatorar `src/services/apiClient.js`
  - [ ] Interceptador de erro chama `tratarErroApi()`
- [ ] Refatorar todos os componentes com try/catch
  - [ ] Usar `useErro()` composable
  - [ ] Remover tratamento de erro inline

**Testes:**

- [ ] Testar tratamento de 401, 403, 404, 500
- [ ] Testar timeout
- [ ] Testar erro de rede
- [ ] Testar logging de erros

**Commits:**

```bash
git commit -m "feat: criar centralizador de erros"
git commit -m "refactor: atualizar apiClient com erro handler"
git commit -m "refactor: atualizar componentes com useErro"
```

---

### Sprint 2.4: Refatoração State Management

**Objetivo:** Melhorar clarity e remover side effects

**Frontend:**

- [ ] Refatorar `src/store/useGlobalStore.js`
  - [ ] Renomear métodos confusos (`retornoObjParametro` → `obterParametro`)
  - [ ] Agrupar actions por contexto
  - [ ] Adicionar computed properties
  - [ ] Separar side effects (localStorage) do estado

**Testes:**

- [ ] Testar cada action de forma isolada
- [ ] Testar computed properties
- [ ] Testar sincronização de estado

**Commits:**

```bash
git commit -m "refactor: reorganizar store Pinia com padrões claros"
git commit -m "refactor: renomear métodos store para consistência"
```

---

## ⚡ FASE 3: PERFORMANCE (Semana 5)

### Sprint 3.1: Cache de Requisições

**Objetivo:** Evitar requisições desnecessárias

**Frontend:**

- [ ] Criar `src/composables/useCache.js`
  - [ ] Cache com TTL (time-to-live)
  - [ ] Métodos: `obter()`, `salvar()`, `limpar()`
- [ ] Aplicar cache em serviços:
  - [ ] `empresaService.buscarEmpresa()` - cache 5 min
  - [ ] `parametroService.buscarParametro()` - cache 10 min
  - [ ] Dados que mudam frequentemente: sem cache

**Testes:**

- [ ] Testar retorno de cache
- [ ] Testar expiração de cache
- [ ] Testar limpeza manual de cache

**Commits:**

```bash
git commit -m "feat: implementar cache com TTL"
git commit -m "refactor: adicionar cache em empresaService"
```

---

### Sprint 3.2: Lazy Loading e Paginação

**Objetivo:** Melhorar tempo de carregamento

**Frontend:**

- [ ] Implementar paginação em listagens
  - [ ] `src/pages/AgendaPage.vue` - paginar agendamentos
  - [ ] Adicionar cursor-based ou offset pagination
- [ ] Implementar lazy loading de componentes
  - [ ] Componentes pesados carregam sob demanda
- [ ] Otimizar bundle size
  - [ ] Analisar com `webpack-bundle-analyzer`
  - [ ] Remover dependências não usadas

**Testes:**

- [ ] Testar paginação (primeira, próxima, anterior, última página)
- [ ] Testar lazy loading de componentes

**Commits:**

```bash
git commit -m "feat: adicionar paginação em AgendaPage"
git commit -m "refactor: implementar lazy loading de componentes"
```

---

### Sprint 3.3: SignalR com Cache

**Objetivo:** Otimizar real-time sem overload

**Frontend:**

- [ ] Refatorar `src/composables/useSignalR.js`
  - [ ] Usar cache para dados recebidos
  - [ ] Debounce de atualizações da UI
  - [ ] Reconectar inteligentemente

**Commits:**

```bash
git commit -m "refactor: otimizar SignalR com cache e debounce"
```

---

## ✅ FASE 4: QUALIDADE E TESTES (Semana 6-7)

### Sprint 4.1: Setup Vitest

**Objetivo:** Configurar framework de testes

**Frontend:**

- [ ] Instalar Vitest
  ```bash
  npm install --save-dev vitest @vue/test-utils jsdom
  ```
- [ ] Criar `vitest.config.js`
- [ ] Criar `src/__tests__/setup.js`
- [ ] Configurar cobertura de testes

**Commits:**

```bash
git commit -m "chore: configurar Vitest"
```

---

### Sprint 4.2: Testes Unitários

**Objetivo:** 80%+ cobertura

**Frontend:**

- [ ] Testes para services:
  - [ ] `src/services/__tests__/baseService.test.js`
  - [ ] `src/services/__tests__/empresaService.test.js`
  - [ ] `src/services/__tests__/autenticacaoService.test.js`
- [ ] Testes para composables:
  - [ ] `src/composables/__tests__/useAutenticacao.test.js`
  - [ ] `src/composables/__tests__/useFormulario.test.js`
  - [ ] `src/composables/__tests__/useDebounce.test.js`
  - [ ] `src/composables/__tests__/useCache.test.js`
- [ ] Testes para utils:
  - [ ] `src/utils/__tests__/validadores.test.js`
  - [ ] `src/utils/__tests__/erroHandler.test.js`

**Commits:**

```bash
git commit -m "test: adicionar testes para services"
git commit -m "test: adicionar testes para composables"
git commit -m "test: adicionar testes para utils"
```

---

### Sprint 4.3: Testes de Integração

**Objetivo:** Testar fluxos completos

**Frontend:**

- [ ] Testes de fluxo de autenticação
  - [ ] Login com sucesso
  - [ ] Login com erro
  - [ ] Logout
  - [ ] Token expirado
- [ ] Testes de fluxo de formulário
  - [ ] Preenchimento, validação, submit
- [ ] Testes de componentes principais:
  - [ ] `LoginPage.vue`
  - [ ] `DashboardPage.vue`

**Commits:**

```bash
git commit -m "test: adicionar testes de integração para autenticação"
git commit -m "test: adicionar testes de integração para formulários"
```

---

### Sprint 4.4: E2E Tests (Opcional)

**Objetivo:** Testar fluxos completos de usuário

**Frontend:**

- [ ] Instalar Playwright ou Cypress
- [ ] Criar testes E2E para principais fluxos:
  - [ ] Login → Dashboard → Logout
  - [ ] Criar/editar agendamento
  - [ ] Configurar empresa

**Commits:**

```bash
git commit -m "test: adicionar testes E2E com Playwright"
```

---

## 🧹 FASE 5: LIMPEZA E DOCUMENTAÇÃO (Semana 8)

### Sprint 5.1: Remover Código Antigo

**Objetivo:** Limpar repositório

**Frontend:**

- [ ] Remover código comentado em todos os arquivos
- [ ] Remover `src/auth.js` (migrado para `useAutenticacao`)
- [ ] Remover dependências não usadas
- [ ] Atualizar `.gitignore`:
  ```
  .env
  .env.*.local
  node_modules/
  dist/
  .vscode/
  ```

**Commits:**

```bash
git commit -m "chore: remover código comentado e obsoleto"
git commit -m "chore: atualizar gitignore"
```

---

### Sprint 5.2: Consolidar CSS

**Objetivo:** Sistema de design consistente

**Frontend:**

- [ ] Consolidar variáveis CSS em `src/style/variables.css`
- [ ] Usar CSS custom properties em todos os arquivos
- [ ] Remover duplicação de estilos
- [ ] Reorganizar em: variables, componentes, utilitários, layout

**Commits:**

```bash
git commit -m "refactor: consolidar CSS com system design"
```

---

### Sprint 5.3: Documentação

**Objetivo:** Documentar padrões e decisões

**Frontend:**

- [ ] Criar `docs/ARQUITETURA.md`
- [ ] Criar `docs/PADROES.md`
- [ ] Criar `docs/COMO_DESENVOLVER.md`
- [ ] Adicionar comments JSDoc em funções críticas
- [ ] Atualizar README.md

**Commits:**

```bash
git commit -m "docs: adicionar documentação de arquitetura"
git commit -m "docs: adicionar guia de padrões de desenvolvimento"
```

---

### Sprint 5.4: Storybook (Opcional)

**Objetivo:** Documentar componentes interativamente

**Frontend:**

- [ ] Instalar Storybook para Vue 3
- [ ] Criar histórias para componentes principais
- [ ] Deploy Storybook em ambiente estático

**Commits:**

```bash
git commit -m "feat: adicionar Storybook para componentes"
```

---

## 📊 MONITORAMENTO DE PROGRESSO

### Spreadsheet de Tracking

| Sprint | Objetivo    | Status | Issues | PRs | Commits |
| ------ | ----------- | ------ | ------ | --- | ------- |
| 1.1    | Auth JWT    | 🔴     | -      | -   | -       |
| 1.2    | Validação   | 🔴     | -      | -   | -       |
| 1.3    | CSRF        | 🔴     | -      | -   | -       |
| 2.1    | Factory     | 🔴     | -      | -   | -       |
| 2.2    | SRP         | 🔴     | -      | -   | -       |
| 2.3    | Erros       | 🔴     | -      | -   | -       |
| 2.4    | Store       | 🔴     | -      | -   | -       |
| 3.1    | Cache       | 🔴     | -      | -   | -       |
| 3.2    | Perf        | 🔴     | -      | -   | -       |
| 3.3    | SignalR     | 🔴     | -      | -   | -       |
| 4.1    | Vitest      | 🔴     | -      | -   | -       |
| 4.2    | Unit Tests  | 🔴     | -      | -   | -       |
| 4.3    | Integration | 🔴     | -      | -   | -       |
| 5.1    | Cleanup     | 🔴     | -      | -   | -       |
| 5.2    | CSS         | 🔴     | -      | -   | -       |
| 5.3    | Docs        | 🔴     | -      | -   | -       |

---

## ✨ RESULTADO ESPERADO

Após completar todas as fases:

✅ **Segurança:** JWT + HTTPS + Validação + CSRF
✅ **SOLID:** SRP, OCP, DRY implementados
✅ **Performance:** Cache, lazy loading, paginação
✅ **Qualidade:** 80%+ cobertura de testes
✅ **Manutenibilidade:** Código limpo, documentado
✅ **Confiança:** Deploy com CI/CD automático

---

**Próximo passo:** Começar com Sprint 1.1 (Autenticação JWT)
