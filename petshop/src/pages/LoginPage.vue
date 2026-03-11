<template>
  <div class="container-login">
    <div class="login-wrapper">
      <div class="login-side-info">
        <div class="side-content">
          <h2>Gerencie seu pet shop de forma inteligente</h2>
          <p>
            Toda a sua gestão em um só lugar, com dados e ferramentas que
            impulsionam seu negócio.
          </p>
          <img :src="logoGrande" alt="Logo PetMob" class="side-img" />
        </div>
      </div>
      <!-- Formulário de login -->
      <div class="card-login">
        <LoadingPetMob v-if="carregando" />
        <div v-else>
          <div class="logo-container">
            <img :src="logo" alt="Logo Pet.ON" class="logo" />
          </div>
          <h1>Área de Acesso</h1>
          <form @submit.prevent="realizarLogin" autocomplete="on">
            <label for="cnpj">CNPJ</label>
            <input
              id="cnpj"
              v-model="cnpj"
              @input="formatarCnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              required
              maxlength="18"
              aria-label="CNPJ do usuário"
            />

            <label for="senha">Senha</label>
            <input
              id="senha"
              v-model="senha"
              type="password"
              placeholder="Digite sua senha"
              required
              aria-label="Senha do usuário"
            />

            <Toast :message="toastMessage" :type="toastType" />

            <button
              type="submit"
              :disabled="carregando"
              aria-label="Entrar no sistema"
            >
              {{ carregando ? "Carregando..." : "Entrar" }}
            </button>
          </form>
          <div class="links">
            <a href="#" @click.prevent="onForgotPassword">Esqueceu a senha?</a>
            <a href="#" @click.prevent="onRegister">
              Não tem conta? <span>Cadastre-se!</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import logoGrande from "@/assets/LogoGrande.png";
import logo from "@/assets/LogoSemEscritaCentralizado.png";
import loginService from "@/services/loginService";
import Toast from "@/components/ToastCustomizado.vue";
import LoadingPetMob from "@/components/LoadingPetMob.vue";
import useCnpjFormatado from "@/composables/useCnpjFormatado";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useErro } from "@/composables/useErro";

const store = useGlobalStore();
const { cnpj, cnpjSemFormatacao, formatarCnpj } = useCnpjFormatado();
const { erro, capturar, mostrarNotificacao } = useErro();
const toastMessage = ref("");
const toastType = ref("info");

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

const router = useRouter();
const senha = ref("");
const lembrar = ref(false);
const carregando = ref(false);

onMounted(() => {
  const cnpjSalvo = localStorage.getItem("cnpj");
  if (cnpjSalvo) {
    cnpj.value = cnpjSalvo;
    lembrar.value = true;
  }
});

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

const realizarLogin = async () => {
  if (!validarCampos()) return;
  carregando.value = true;

  try {
    await loginService.validarLogin(cnpjSemFormatacao.value, senha.value);
    localStorage.setItem("cnpj", cnpjSemFormatacao.value);
    store.definirCnpjLogado(cnpjSemFormatacao.value);
    showToast("Login realizado com sucesso!", "success");
    router.push("/inicio");
  } catch (e) {
    capturar(e, { acao: "login", cnpj: cnpjSemFormatacao.value });
    mostrarNotificacao(showToast);
    showToast(erro.value?.message || "CNPJ ou senha incorretos.", "error");
  } finally {
    carregando.value = false;
  }
};

// Links de ação
function onForgotPassword() {
  showToast("Redirecionando para recuperação de senha...", "info");
}
function onRegister() {
  showToast("Redirecionando para a página de registro...", "info");
}
</script>

<style scoped>
/* Fundo branco */
.container-login {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Segoe UI", "Roboto", "Arial", sans-serif;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* Wrapper para centralizar e dividir os lados */
.login-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  background: transparent;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(106, 13, 173, 0.12),
    0 1.5px 8px 0 rgba(0, 146, 63, 0.08);
}

@media (min-width: 900px) {
  .login-wrapper {
    flex-direction: row;
    min-height: 600px;
  }
}

.login-side-info {
  display: none;
  position: relative;
  background: #00923f; /* alterado para fundo verde */
  min-width: 340px;
  max-width: 500px;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
@media (min-width: 900px) {
  .login-side-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 2rem;
  }
}

.side-content {
  position: relative;
  z-index: 2;
  color: #fff; /* texto branco para contraste */
  text-align: center;
  width: 100%;
}
.side-content h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: none;
  color: #fff;
}
.side-content p {
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: #e0e0e0;
}
.side-img {
  width: 100%;
  max-width: 320px;
  border-radius: 2rem;
  margin: 0 auto;
  box-shadow: 0 6px 32px 0 #6a0dad22;
  animation: fade-in 1.2s;
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Card do formulário */
.card-login {
  background: #fff;
  flex: 1 1 0;
  padding: 2.5rem 1.5rem;
  border-radius: 2rem;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 6px 24px 0 #00923f18;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 320px;
  min-height: 480px;
  position: relative;
  z-index: 2;
  transition: box-shadow 0.2s;
}
@media (min-width: 600px) {
  .card-login {
    padding: 3rem 2.5rem;
  }
}
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}
.logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #f6f6f6;
  box-shadow: 0 2px 12px #6a0dad22;
  object-fit: contain;
}
h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d2d2d;
  text-align: center;
  margin-bottom: 0.2rem;
}
.subtitle {
  color: #6a0dad;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
label {
  font-size: 0.98rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 0.2rem;
}
input[type="text"],
input[type="password"] {
  padding: 0.85rem 1rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 1rem;
  font-size: 1.05rem;
  background: #fafbfc;
  color: #222;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px #00923f0a;
}
input[type="text"]:focus,
input[type="password"]:focus {
  border: 1.5px solid #00923f;
  outline: none;
  box-shadow: 0 0 0 2px #00923f33;
}
button {
  background: #6a0dad;
  color: #fff;
  padding: 0.95rem 0;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 2px 12px #6a0dad22;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.15s;
}
button:hover:not([disabled]) {
  background: #00923f;
  transform: scale(1.03);
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  margin-top: 1.2rem;
}
.links a {
  color: #6a0dad;
  font-size: 0.98rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}
.links a:hover {
  color: #00923f;
  text-decoration: underline;
}
.links span {
  color: #00923f;
  font-weight: 700;
}
</style>
