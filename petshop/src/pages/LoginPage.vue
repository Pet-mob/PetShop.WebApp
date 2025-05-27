<template>
  <div class="container-login">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetON v-if="carregando" />

    <!-- Oculta o card de login durante o loading -->
    <div class="card-login" v-else>
      <img src="@/assets/LogoPetON.png" alt="Logo Pet.ON" class="logo" />
      <h2>Bem-vindo</h2>
      <p>Faça login com seu CNPJ e senha cadastrados.</p>

      <form @submit.prevent="realizarLogin">
        <label for="cnpj">CNPJ</label>
        <input
          id="cnpj"
          v-model="cnpj"
          @input="formatarCnpj"
          type="text"
          placeholder="00.000.000/0000-00"
          required
          maxlength="18"
        />

        <label for="senha">Senha</label>
        <input
          id="senha"
          v-model="senha"
          type="password"
          placeholder="Digite sua senha"
          required
        />

        <button type="submit">Entrar</button>

        <Toast :message="toastMessage" :type="toastType" />

        <router-link to="/recuperar-senha" class="link">
          Esqueceu a senha?
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import loginService from "@/services/loginService";
import Toast from "@/components/ToastCustomizado.vue";
import LoadingPetON from "@/components/LoadingPetON.vue";
import useCnpjFormatado from "@/composables/useCnpjFormatado";

const { cnpj, cnpjSemFormatacao, formatarCnpj } = useCnpjFormatado();
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

const realizarLogin = async () => {
  carregando.value = true;

  try {
    const resultado = await loginService.validarLogin(
      cnpjSemFormatacao.value,
      senha.value
    );

    // Supondo que a API retorna { token: '...' }
    localStorage.setItem("token", resultado.token);

    if (lembrar.value) {
      localStorage.setItem("cnpj", cnpj.value);
    } else {
      localStorage.removeItem("cnpj");
    }

    showToast("Login realizado com sucesso!", "success");
    router.push("/inicio");
  } catch (err) {
    console.log(err);
    showToast(
      err.response?.data?.message || "CNPJ ou senha incorretos.",
      "error"
    );
  } finally {
    carregando.value = false;
  }
};
</script>

<style scoped>
.container-login {
  /* background-color: #1e1e2f; */
  background-image: linear-gradient(90deg, #10b981, #1e1e2f);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  /* Adicionado padding para telas menores */
  box-sizing: border-box;
}

.card-login {
  background-color: #fff;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  max-width: 400px;
  box-shadow: 0 6px 16px rgba(27, 148, 27, 0.15);
  text-align: center;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

@media (min-width: 768px) {
  .card-login {
    padding: 3rem;
    max-width: 450px;
  }
}

@media (min-width: 1024px) {
  .card-login {
    max-width: 480px;
  }
}

.logo {
  width: 180px;
  margin-bottom: 1rem;
}

h2 {
  margin: 0.5rem 0;
  font-weight: 600;
}

p {
  color: #555;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

input[type="text"],
input[type="password"] {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  background-color: #1043cf;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover:not([disabled]) {
  background-color: #0832a0;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.lembrar-dados {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #444;
}

.link {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7b2cbf;
  text-decoration: none;
  text-align: center;
}

.link:hover {
  text-decoration: underline;
}
</style>
