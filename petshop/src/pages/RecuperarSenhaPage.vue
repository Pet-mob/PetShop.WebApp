<template>
  <div class="recuperar-senha">
    <h1>Recuperar Senha PetShop</h1>

    <div v-if="step === 1" class="step">
      <p>Enviaremos um código para o e-mail cadastrado do petshop.</p>
      <button
        @click="enviarCodigo"
        :disabled="carregando"
        aria-label="Enviar código de recuperação"
      >
        {{ carregando ? "Enviando código..." : "Enviar código" }}
      </button>
    </div>

    <div v-if="step === 2" class="step">
      <p>Insira o código que você recebeu no e-mail:</p>
      <input
        v-model="codigoDigitado"
        placeholder="Digite o código"
        aria-label="Código recebido por e-mail"
      />
      <button
        @click="verificarCodigo"
        :disabled="carregando || !codigoDigitado"
        aria-label="Verificar código"
      >
        {{ carregando ? "Verificando..." : "Verificar código" }}
      </button>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </div>

    <div v-if="step === 3" class="step">
      <p>Digite sua nova senha:</p>
      <input
        type="password"
        v-model="novaSenha"
        placeholder="Nova senha"
        aria-label="Nova senha"
      />
      <input
        type="password"
        v-model="confirmaSenha"
        placeholder="Confirme a nova senha"
        aria-label="Confirme a nova senha"
      />
      <button
        @click="redefinirSenha"
        :disabled="carregando || !novaSenha || novaSenha !== confirmaSenha"
        aria-label="Redefinir senha"
      >
        {{ carregando ? "Redefinindo senha..." : "Redefinir senha" }}
      </button>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </div>

    <p v-if="mensagem" :class="{ sucesso: sucesso, erro: !sucesso }">
      {{ mensagem }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useErro } from "@/composables/useErro";

const { erro, capturar } = useErro();

const step = ref(1);
const carregando = ref(false);
const codigoGerado = ref("");
const codigoDigitado = ref("");
const novaSenha = ref("");
const confirmaSenha = ref("");
const mensagem = ref("");
const sucesso = ref(false);

// Função para simular envio de código
const enviarCodigo = async () => {
  carregando.value = true;
  erro.value = "";
  mensagem.value = "";
  sucesso.value = false;

  try {
    // Simular geração de código de 6 dígitos
    codigoGerado.value = Math.floor(100000 + Math.random() * 900000).toString();

    // Aqui você deve integrar com sua API real para envio de e-mail
    // Exemplo:
    // await apiService.enviarCodigoRecuperacao(emailDoUsuario, codigoGerado.value);

    mensagem.value = `Código enviado para o e-mail cadastrado.`;
    sucesso.value = true;
    step.value = 2;
  } catch (e) {
    capturar(e, { acao: "enviarCodigo" });
    erro.value = e.message || "Erro ao enviar código. Tente novamente.";
  } finally {
    carregando.value = false;
  }
};

// Função para verificar o código digitado
const verificarCodigo = () => {
  erro.value = "";
  if (!codigoDigitado.value || codigoDigitado.value.length < 6) {
    erro.value = "Digite o código recebido.";
    sucesso.value = false;
    return;
  }
  if (codigoDigitado.value === codigoGerado.value) {
    mensagem.value = "";
    sucesso.value = true;
    step.value = 3;
  } else {
    erro.value = "Código inválido. Verifique e tente novamente.";
    sucesso.value = false;
  }
};

// Função para redefinir senha
const redefinirSenha = async () => {
  erro.value = "";
  if (!novaSenha.value || novaSenha.value.length < 4) {
    erro.value = "A senha deve ter pelo menos 4 caracteres.";
    sucesso.value = false;
    return;
  }
  if (novaSenha.value !== confirmaSenha.value) {
    erro.value = "As senhas não coincidem.";
    sucesso.value = false;
    return;
  }
  carregando.value = true;

  try {
    // Aqui você deve integrar com sua API real para redefinir a senha
    await new Promise((resolve) => setTimeout(resolve, 1500));

    mensagem.value = "Senha redefinida com sucesso!";
    sucesso.value = true;
    step.value = 1;

    // Resetar campos
    codigoDigitado.value = "";
    novaSenha.value = "";
    confirmaSenha.value = "";
    codigoGerado.value = "";
  } catch (e) {
    capturar(e, { acao: "redefinirSenha" });
    erro.value = e.message || "Erro ao redefinir senha.";
    sucesso.value = false;
  } finally {
    carregando.value = false;
  }
};
</script>

<style scoped>
.recuperar-senha {
  max-width: 400px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  text-align: center;
  border: 1px solid #ddd;
  padding: 30px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.step {
  margin-bottom: 20px;
}

input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.erro {
  color: #f44336;
  margin-top: 10px;
}

.sucesso {
  color: #4caf50;
  margin-top: 10px;
}
</style>
