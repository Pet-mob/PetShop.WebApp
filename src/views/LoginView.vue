<template>
  <div class="login-container">
    <div class="login-card">
      <img src="@/assets/LogoPetON.png" alt="Logo Pet.ON" class="logo" />
      <h2>Bem-vindo</h2>
      <p>Acesse o sistema com seus dados.</p>

      <form @submit.prevent="handleLogin">
        <label for="cnpj">CNPJ</label>
        <input
          id="cnpj"
          v-model="cnpj"
          type="text"
          placeholder="00.000.000/0000-00"
        />

        <label for="senha">Senha</label>
        <input
          id="senha"
          v-model="senha"
          type="password"
          placeholder="••••••••••"
        />

        <div class="remember">
          <input type="checkbox" id="remember" v-model="remember" />
          <label for="remember">Lembrar dados de login</label>
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>

        <router-link to="/recuperar-senha" class="link">
          Esqueceu a senha?
        </router-link>

        <a href="https://docs.peton.app" target="_blank" class="link">
          Acesso à documentação
        </a>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const cnpj = ref('')
const senha = ref('')
const remember = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  // Simulação de autenticação (futuro: substituir por chamada à API)
  setTimeout(() => {
    if (cnpj.value === '00.000.000/0001-00' && senha.value === '123456') {
      // Simula token
      localStorage.setItem('token', 'fake-jwt-token')

      // Se lembrar o login, salva o CNPJ
      if (remember.value) {
        localStorage.setItem('cnpj', cnpj.value)
      } else {
        localStorage.removeItem('cnpj')
      }

      // Redireciona após login
      router.push('/dashboard') // ou '/menu'
    } else {
      alert('CNPJ ou senha inválidos')
    }

    loading.value = false
  }, 1000)
}
</script>

<style scoped>
.login-container {
  background-color: #334d3c;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background-color: #fff;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 6px 16px rgba(27, 148, 27, 0.15);
  text-align: center;
}
.logo {
  width: 120px;
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
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.remember {
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
}
.link:hover {
  text-decoration: underline;
}
</style>
