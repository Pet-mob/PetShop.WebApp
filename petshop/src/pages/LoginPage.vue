<template>
  <div class="container-login">
    <div class="card-login">
      <img src="@/assets/LogoPetON.png" alt="Logo Pet.ON" class="logo" />
      <h2>Bem-vindo</h2>
      <p>Faça login com seu CNPJ e senha cadastrados.</p>

      <form @submit.prevent="realizarLogin">
        <label for="cnpj">CNPJ</label>
        <input id="cnpj" v-model="cnpj" type="text" placeholder="00.000.000/0000-00" required />

        <label for="senha">Senha</label>
        <input id="senha" v-model="senha" type="password" placeholder="Digite sua senha" required />

        <div class="lembrar-dados">
          <input type="checkbox" id="lembrar" v-model="lembrar" />
          <label for="lembrar">Lembrar meus dados</label>
        </div>

        <button type="submit" :disabled="carregando">
          <span v-if="carregando">Entrando...</span>
          <span v-else>Entrar</span>
        </button>

        <router-link to="/recuperar-senha" class="link">
          Esqueceu a senha?
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cnpj = ref('')
const senha = ref('')
const lembrar = ref(false)
const carregando = ref(false)

const realizarLogin = async () => {
  carregando.value = true

  setTimeout(() => {
    const cnpjValido = '00.000.000/0001-00'
    const senhaValida = '123456'

    if (cnpj.value === cnpjValido && senha.value === senhaValida) {
      localStorage.setItem('token', 'fake-jwt-token')

      if (lembrar.value) {
        localStorage.setItem('cnpj', cnpj.value)
      } else {
        localStorage.removeItem('cnpj')
      }

      router.push('/inicio')
    } else {
      alert('CNPJ ou senha incorretos. Tente novamente.')
    }

    carregando.value = false
  }, 1000)
}
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
