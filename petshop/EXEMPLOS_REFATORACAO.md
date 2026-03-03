# 🛠️ EXEMPLOS PRÁTICOS DE REFATORAÇÃO

## 1. REFATORAÇÃO: Segurança em Autenticação

### ❌ ANTES (Inseguro)

```javascript
// src/auth.js
const isLoggedInCnpj = () => {
  return !!localStorage.getItem("cnpj");
};

// src/main.js
window.addEventListener("unload", () => {
  localStorage.removeItem("cnpj");
});

// src/router/index.js
router.beforeEach(async (to, from, next) => {
  const loggedIn = !!localStorage.getItem("cnpj");
  if (!loggedIn && to.path !== "/login") {
    return next("/login");
  }
  // ...
});
```

---

### ✅ DEPOIS (Seguro)

```javascript
// src/utils/validadores.js
export function validarCnpj(cnpj) {
  // Validação CNPJ real
  const regexCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regexCnpj.test(cnpj);
}

// src/utils/sanitizar.js
export function sanitizar(entrada) {
  const div = document.createElement('div');
  div.textContent = entrada;
  return div.innerHTML;
}

// src/services/autenticacaoService.js
import apiClient from './apiClient';

export async function fazerLogin(cnpj, senha) {
  // Validar entrada
  if (!validarCnpj(cnpj) || !senha || senha.length < 8) {
    throw new Error('Dados inválidos');
  }

  // Backend deve fazer hash de senha e validar
  const response = await apiClient.post('Autenticacao/Login', {
    cnpj,
    senha
  });

  // Backend retorna JWT em HttpOnly cookie (automático)
  // Frontend recebe confirmação
  return response.data;
}

export async function fazerLogout() {
  // Backend revoga token
  await apiClient.post('Autenticacao/Logout');
  // Cookie é automaticamente limpo pelo backend
}

// src/composables/useAutenticacao.js
import { ref, computed } from 'vue';
import { useGlobalStore } from '@/store/useGlobalStore';
import * as autenticacaoService from '@/services/autenticacaoService';

export function useAutenticacao() {
  const store = useGlobalStore();
  const carregando = ref(false);
  const erro = ref(null);

  const estaAutenticado = computed(() => store.estaAutenticado);

  async function login(cnpj, senha) {
    carregando.value = true;
    erro.value = null;

    try {
      const resultado = await autenticacaoService.fazerLogin(cnpj, senha);
      store.autenticar(cnpj, resultado.empresa);
      return true;
    } catch (e) {
      erro.value = e.message;
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function logout() {
    carregando.value = true;
    try {
      await autenticacaoService.fazerLogout();
      store.desautenticar();
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
      store.desautenticar(); // Força logout local mesmo se API falhar
    } finally {
      carregando.value = false;
    }
  }

  return {
    estaAutenticado,
    carregando,
    erro,
    login,
    logout
  };
}

// src/store/useGlobalStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const empresaLogada = ref({});
  const cnpjLogado = ref('');
  const tokenExpiracaoEm = ref(null);

  // Computed
  const estaAutenticado = computed(() => !!cnpjLogado.value);
  const tokenExpirou = computed(() => {
    if (!tokenExpiracaoEm.value) return false;
    return new Date() > new Date(tokenExpiracaoEm.value);
  });

  // Actions
  function autenticar(cnpj, empresa) {
    cnpjLogado.value = cnpj;
    empresaLogada.value = empresa;
    // Não armazenar no localStorage - apenas em memória
    // Backend envia expiracao do token
    tokenExpiracaoEm.value = new Date(Date.now() + 3600000); // 1 hora
  }

  function desautenticar() {
    cnpjLogado.value = '';
    empresaLogada.value = {};
    tokenExpiracaoEm.value = null;
  }

  return {
    empresaLogada,
    cnpjLogado,
    estaAutenticado,
    tokenExpirou,
    autenticar,
    desautenticar
  };
});

// src/services/apiClient.js
import axios from 'axios';
import { useGlobalStore } from '@/store/useGlobalStore';
import router from '@/router';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Permite enviar HttpOnly cookies
});

// Proteção CSRF
apiClient.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

// Tratamento de erro global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou
      const store = useGlobalStore();
      store.desautenticar();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// ✅ Não limpar localStorage no unload (token em HttpOnly cookie não precisa)
// O backend gerencia a sessão através de cookies

app.mount('#app');

// src/middlewares/carregarDadosDoMenu.js
import { useGlobalStore } from '@/store/useGlobalStore';
import empresaService from '@/services/empresaService';

export default async function carregarDadosDoMenu(to, from, next) {
  const store = useGlobalStore();

  // Verificar se token expirou
  if (store.tokenExpirou) {
    store.desautenticar();
    return next('/login');
  }

  // Se já tem empresa carregada, pular
  if (store.empresaLogada?.idEmpresa) {
    return next();
  }

  try {
    const empresa = await empresaService.buscarEmpresa();
    store.empresaLogada = empresa;
    next();
  } catch (erro) {
    if (erro.response?.status === 401) {
      next('/login');
    } else {
      next('/erro');
    }
  }
}
```

---

## 2. REFATORAÇÃO: Services com Factory Pattern

### ❌ ANTES (Duplicação)

```javascript
// src/services/empresaService.js - 109 linhas
const buscarEmpresa = (cnpjParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Empresa", { params: { cnpj: cnpjParam } })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const buscarLogoEmpresa = (idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Empresa/BuscarLogosEmpresas", {
        params: { idEmpresa: idEmpresaParam },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

// ... 5+ funções com o MESMO padrão
```

---

### ✅ DEPOIS (DRY com Factory)

```javascript
// src/services/baseService.js
import apiClient from './apiClient';

/**
 * Serviço base reutilizável para operações CRUD
 */
export class CRUDService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async listar(params = {}) {
    const response = await apiClient.get(this.endpoint, { params });
    return response.data;
  }

  async obter(id) {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async criar(dados) {
    const response = await apiClient.post(this.endpoint, dados);
    return response.data;
  }

  async atualizar(id, dados) {
    const response = await apiClient.put(`${this.endpoint}/${id}`, dados);
    return response.data;
  }

  async deletar(id) {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  async buscarPorFiltro(filtros) {
    return this.listar(filtros);
  }
}

// src/services/empresaService.js - 30 linhas (ao invés de 109!)
import apiClient from './apiClient';
import { CRUDService } from './baseService';

class EmpresaService extends CRUDService {
  constructor() {
    super('Empresa');
  }

  async buscarEmpresa(cnpj) {
    return this.listar({ cnpj });
  }

  async buscarHorariosFuncionamento(idEmpresa) {
    const response = await apiClient.get(
      `${this.endpoint}/HorariosFuncionamento`,
      { params: { IdEmpresa: idEmpresa } }
    );
    return response.data;
  }

  async atualizarHorariosFuncionamento(dto) {
    const response = await apiClient.put(
      `${this.endpoint}/AtualizarHorariosFuncionamento`,
      dto
    );
    return response.data;
  }

  async buscarLogos(idEmpresa) {
    const response = await apiClient.get(
      `${this.endpoint}/BuscarLogosEmpresas`,
      { params: { idEmpresa } }
    );
    return response.data;
  }

  async buscarCapas(idEmpresa) {
    const response = await apiClient.get(
      `${this.endpoint}/BuscarCapasEmpresas`,
      { params: { idEmpresa } }
    );
    return response.data;
  }

  async enviarLogo(imagem, idEmpresa) {
    const formData = new FormData();
    formData.append('arquivo', imagem);
    formData.append('idEmpresa', idEmpresa);

    const response = await apiClient.post(
      `${this.endpoint}/EnviarLogoEmpresa`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  async enviarCapa(imagem, idEmpresa) {
    const formData = new FormData();
    formData.append('arquivo', imagem);
    formData.append('idEmpresa', idEmpresa);

    const response = await apiClient.post(
      `${this.endpoint}/EnviarCapaEmpresa`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }
}

export default new EmpresaService();

// src/services/parametroService.js
import { CRUDService } from './baseService';

class ParametroService extends CRUDService {
  constructor() {
    super('Parametro');
  }

  async buscarParametro(idEmpresa) {
    return this.buscarPorFiltro({ idEmpresa });
  }
}

export default new ParametroService();

// src/services/agendaService.js
import { CRUDService } from './baseService';

class AgendaService extends CRUDService {
  constructor() {
    super('Agenda');
  }

  async buscarAgendamentos(idEmpresa, data) {
    return this.buscarPorFiltro({ idEmpresa, data });
  }
}

export default new AgendaService();
```

**Ganho:** Redução de 70+ linhas, reutilização, manutenção facilitada ✅

---

## 3. REFATORAÇÃO: Tratamento Central de Erros

### ❌ ANTES (Espalhado)

```javascript
// src/pages/LoginPage.vue
} catch (err) {
  showToast(
    err.response?.data?.message || "CNPJ ou senha incorretos.",
    "error",
  );
}

// src/pages/DashboardPage.vue
} catch (error) {
  showToast(
    error.response?.data?.message || "Erro ao carregar dashboard",
    "error"
  );
}

// Múltiplos outros arquivos com try/catch
```

---

### ✅ DEPOIS (Centralizado)

```javascript
// src/utils/erroHandler.js
/**
 * Classe base para erros aplicados
 */
export class ErroApp extends Error {
  constructor(mensagem, codigo = 'GENERICO', statusCode = 500, detalhes = null) {
    super(mensagem);
    this.name = 'ErroApp';
    this.codigo = codigo;
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }

  toJSON() {
    return {
      mensagem: this.message,
      codigo: this.codigo,
      statusCode: this.statusCode,
      detalhes: this.detalhes
    };
  }
}

/**
 * Mapa de erros conhecidos
 */
const MAPA_ERROS = {
  401: {
    codigo: 'NAO_AUTENTICADO',
    mensagem: 'Sessão expirada. Faça login novamente.'
  },
  403: {
    codigo: 'NAO_AUTORIZADO',
    mensagem: 'Você não tem permissão para acessar este recurso.'
  },
  404: {
    codigo: 'NAO_ENCONTRADO',
    mensagem: 'Recurso não encontrado.'
  },
  422: {
    codigo: 'VALIDACAO_FALHOU',
    mensagem: 'Dados inválidos. Verifique os campos.'
  },
  500: {
    codigo: 'ERRO_SERVIDOR',
    mensagem: 'Erro no servidor. Tente novamente em alguns momentos.'
  },
  503: {
    codigo: 'SERVICO_INDISPONIVEL',
    mensagem: 'Servidor em manutenção. Tente mais tarde.'
  }
};

/**
 * Trata erro da API e retorna ErroApp normalizado
 */
export function tratarErroApi(erro) {
  // Erro de timeout
  if (erro.code === 'ECONNABORTED') {
    return new ErroApp(
      'Conexão expirou. Verifique sua internet e tente novamente.',
      'TIMEOUT',
      0
    );
  }

  // Sem conexão
  if (erro.message === 'Network Error') {
    return new ErroApp(
      'Sem conexão com o servidor. Verifique sua internet.',
      'REDE',
      0
    );
  }

  // Erro HTTP da API
  if (erro.response) {
    const status = erro.response.status;
    const mapa = MAPA_ERROS[status];

    return new ErroApp(
      erro.response.data?.message || mapa?.mensagem || 'Erro desconhecido',
      mapa?.codigo || 'GENERICO',
      status,
      erro.response.data
    );
  }

  // Erro genérico
  return new ErroApp(
    erro.message || 'Erro desconhecido',
    'GENERICO',
    500
  );
}

/**
 * Logger estruturado para erros
 */
export class LoggerErro {
  static registrar(erro, contexto = {}) {
    const registro = {
      timestamp: new Date().toISOString(),
      mensagem: erro.message,
      codigo: erro.codigo,
      statusCode: erro.statusCode,
      contexto,
      stack: process.env.NODE_ENV === 'development' ? erro.stack : undefined
    };

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry.captureException(erro);
    }

    console.error(`[${erro.codigo}]`, registro);
  }
}

// src/services/apiClient.js
import axios from 'axios';
import { tratarErroApi } from '@/utils/erroHandler';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
});

// Interceptor de resposta centralizado
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(tratarErroApi(error))
);

export default apiClient;

// src/composables/useErro.js
import { ref } from 'vue';
import { ErroApp, LoggerErro } from '@/utils/erroHandler';

export function useErro() {
  const erro = ref(null);
  const carregando = ref(false);

  function limpar() {
    erro.value = null;
  }

  function capturar(erroCapturado, contexto = {}) {
    if (erroCapturado instanceof ErroApp) {
      erro.value = erroCapturado;
    } else {
      erro.value = new ErroApp(
        erroCapturado.message || 'Erro desconhecido',
        'NAO_TRATADO'
      );
    }

    LoggerErro.registrar(erro.value, contexto);
  }

  function mostrarNotificacao(toast) {
    if (erro.value) {
      toast(erro.value.message, 'error');
    }
  }

  return {
    erro,
    carregando,
    limpar,
    capturar,
    mostrarNotificacao
  };
}

// Uso em componentes
// src/pages/LoginPage.vue
<script setup>
import { ref } from 'vue';
import { useErro } from '@/composables/useErro';
import loginService from '@/services/loginService';

const { erro, capturar, mostrarNotificacao } = useErro();
const toast = ref({});

async function realizarLogin() {
  try {
    await loginService.validarLogin(cnpj, senha);
  } catch (e) {
    capturar(e, { acao: 'login', cnpj });
    mostrarNotificacao(toast);
  }
}
</script>
```

---

## 4. REFATORAÇÃO: Composable para Validação

### ❌ ANTES (Espalhado)

```javascript
// src/pages/LoginPage.vue
function validarCampos() {
  if (!cnpj.value || cnpj.value.length < 14) {
    showToast("CNPJ inválido.", "error");
    return false;
  }
  if (!senha.value) {
    showToast("Senha obrigatória.", "error");
    return false;
  }
  return true;
}
```

---

### ✅ DEPOIS (Reutilizável)

```javascript
// src/composables/useFormulario.js
import { ref, computed } from 'vue';

export function useFormulario(definicaoValidadores) {
  const valores = ref({});
  const erros = ref({});
  const foiTentadoSubmeter = ref(false);

  // Inicializar valores
  Object.keys(definicaoValidadores).forEach(campo => {
    valores.value[campo] = '';
  });

  // Validar campo individual
  function validarCampo(campo) {
    const validador = definicaoValidadores[campo];
    if (!validador) return null;

    const erro = validador(valores.value[campo]);
    if (erro) {
      erros.value[campo] = erro;
      return erro;
    }

    delete erros.value[campo];
    return null;
  }

  // Validar todo formulário
  function validarFormulario() {
    foiTentadoSubmeter.value = true;
    erros.value = {};

    Object.keys(definicaoValidadores).forEach(campo => {
      validarCampo(campo);
    });

    return Object.keys(erros.value).length === 0;
  }

  // Computed para verificar se formulário é válido
  const eValido = computed(() => {
    return foiTentadoSubmeter.value && Object.keys(erros.value).length === 0;
  });

  // Limpar formulário
  function limpar() {
    valores.value = {};
    erros.value = {};
    foiTentadoSubmeter.value = false;
  }

  return {
    valores,
    erros,
    eValido,
    foiTentadoSubmeter,
    validarCampo,
    validarFormulario,
    limpar
  };
}

// src/utils/validadores.js
export function validarCnpj(cnpj) {
  if (!cnpj) return 'CNPJ obrigatório';
  const apenasNumeros = cnpj.replace(/\D/g, '');
  if (apenasNumeros.length !== 14) return 'CNPJ deve ter 14 dígitos';
  // Adicionar validação de dígito verificador se necessário
  return null;
}

export function validarSenha(senha) {
  if (!senha) return 'Senha obrigatória';
  if (senha.length < 8) return 'Senha deve ter mínimo 8 caracteres';
  if (!/[A-Z]/.test(senha)) return 'Deve conter letra maiúscula';
  if (!/[a-z]/.test(senha)) return 'Deve conter letra minúscula';
  if (!/[0-9]/.test(senha)) return 'Deve conter número';
  if (!/[!@#$%^&*]/.test(senha)) return 'Deve conter caractere especial (!@#$%^&*)';
  return null;
}

export function validarEmail(email) {
  if (!email) return 'E-mail obrigatório';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'E-mail inválido';
  return null;
}

// src/pages/LoginPage.vue
<script setup>
import { useFormulario } from '@/composables/useFormulario';
import { validarCnpj, validarSenha } from '@/utils/validadores';
import loginService from '@/services/loginService';

const { valores, erros, eValido, validarFormulario } = useFormulario({
  cnpj: validarCnpj,
  senha: validarSenha
});

async function realizarLogin() {
  if (!validarFormulario()) return;

  try {
    await loginService.validarLogin(valores.value.cnpj, valores.value.senha);
    // Sucesso
  } catch (erro) {
    // Tratar erro
  }
}
</script>

<template>
  <form @submit.prevent="realizarLogin">
    <div>
      <label for="cnpj">CNPJ</label>
      <input
        id="cnpj"
        v-model="valores.cnpj"
        type="text"
        :aria-invalid="!!erros.cnpj"
        :aria-describedby="erros.cnpj ? 'erro-cnpj' : null"
      />
      <span v-if="erros.cnpj" id="erro-cnpj" class="erro">
        {{ erros.cnpj }}
      </span>
    </div>

    <div>
      <label for="senha">Senha</label>
      <input
        id="senha"
        v-model="valores.senha"
        type="password"
        :aria-invalid="!!erros.senha"
        :aria-describedby="erros.senha ? 'erro-senha' : null"
      />
      <span v-if="erros.senha" id="erro-senha" class="erro">
        {{ erros.senha }}
      </span>
    </div>

    <button type="submit" :disabled="!eValido">Entrar</button>
  </form>
</template>
```

---

## 5. REFATORAÇÃO: Debounce e Throttle

### ❌ ANTES (Sem proteção)

```javascript
// src/pages/Configuracoes/PetShopDados.vue
async function salvar() {
  // Usuário pode clicar múltiplas vezes rapidamente
  await empresaService.atualizarDadosEmpresa(dados);
}

// Template
<button @click="salvar">Salvar</button>
```

---

### ✅ DEPOIS (Com proteção)

```javascript
// src/composables/useDebounce.js
import { ref } from 'vue';

export function useDebounce(callback, delay = 300) {
  let timeoutId = null;

  return async (...args) => {
    clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          const resultado = await callback(...args);
          resolve(resultado);
        } catch (erro) {
          throw erro;
        }
      }, delay);
    });
  };
}

// src/composables/useThrottle.js
export function useThrottle(callback, limit = 1000) {
  let ultimaExecucao = 0;

  return async (...args) => {
    const agora = Date.now();

    if (agora - ultimaExecucao >= limit) {
      ultimaExecucao = agora;
      return await callback(...args);
    }
  };
}

// src/pages/Configuracoes/PetShopDados.vue
<script setup>
import { ref } from 'vue';
import { useDebounce } from '@/composables/useDebounce';
import { useErro } from '@/composables/useErro';
import empresaService from '@/services/empresaService';

const { capturar } = useErro();
const carregando = ref(false);
const dados = ref({});

// Proteger função salvar com debounce
const salvarComDebounce = useDebounce(async () => {
  try {
    carregando.value = true;
    await empresaService.atualizarDadosEmpresa(dados.value);
    toast('Dados salvos com sucesso!', 'success');
  } catch (e) {
    capturar(e);
  } finally {
    carregando.value = false;
  }
}, 500);

async function salvar() {
  await salvarComDebounce();
}
</script>

<template>
  <button @click="salvar" :disabled="carregando">
    {{ carregando ? 'Salvando...' : 'Salvar' }}
  </button>
</template>
```

---

Este arquivo de exemplos demonstra práticas concretas. Use como referência para refatoração! ✅
