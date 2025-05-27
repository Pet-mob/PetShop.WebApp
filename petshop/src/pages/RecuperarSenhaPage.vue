<template>
  <div class="recuperar-senha">
    <h1>Recuperar Senha PetShop</h1>

    <div v-if="step === 1" class="step">
      <p>
        Enviaremos um código para o e-mail do petshop:
        <strong>equpepeton@gmail.com</strong>
      </p>
      <button @click="enviarCodigo" :disabled="carregando">
        {{ carregando ? "Enviando código..." : "Enviar código" }}
      </button>
    </div>

    <div v-if="step === 2" class="step">
      <p>Insira o código que você recebeu no e-mail:</p>
      <input v-model="codigoDigitado" placeholder="Digite o código" />
      <button
        @click="verificarCodigo"
        :disabled="carregando || !codigoDigitado"
      >
        {{ carregando ? "Verificando..." : "Verificar código" }}
      </button>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </div>

    <div v-if="step === 3" class="step">
      <p>Digite sua nova senha:</p>
      <input type="password" v-model="novaSenha" placeholder="Nova senha" />
      <input
        type="password"
        v-model="confirmaSenha"
        placeholder="Confirme a nova senha"
      />
      <button
        @click="redefinirSenha"
        :disabled="carregando || !novaSenha || novaSenha !== confirmaSenha"
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

const step = ref(1);
const carregando = ref(false);
const codigoGerado = ref("");
const codigoDigitado = ref("");
const novaSenha = ref("");
const confirmaSenha = ref("");
const mensagem = ref("");
const erro = ref("");
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

    // Simular envio de e-mail com fetch (exemplo)
    const emailData = {
      remetente: "equpepeton@gmail.com",
      destinatario: "rennancastanheira@gmail.com",
      assunto: "Código de Recuperação de Senha - Pet.ON",
      corpo: `Seu código de recuperação é: ${codigoGerado.value}`,
    };

    // Aqui você pode colocar sua URL real da API para enviar email
    await fetch("https://webhook.site/your-test-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });

    mensagem.value = `Código enviado para equpepeton@gmail.com`;
    sucesso.value = true;
    step.value = 2;
  } catch (e) {
    erro.value = "Erro ao enviar código. Tente novamente.";
  } finally {
    carregando.value = false;
  }
};

// Função para verificar o código digitado
const verificarCodigo = () => {
  erro.value = "";
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
const redefinirSenha = () => {
  erro.value = "";
  if (novaSenha.value !== confirmaSenha.value) {
    erro.value = "As senhas não coincidem.";
    sucesso.value = false;
    return;
  }
  carregando.value = true;

  // Simular chamada backend para redefinir senha
  setTimeout(() => {
    carregando.value = false;
    mensagem.value = "Senha redefinida com sucesso!";
    sucesso.value = true;
    step.value = 1;

    // Resetar campos
    codigoDigitado.value = "";
    novaSenha.value = "";
    confirmaSenha.value = "";
    codigoGerado.value = "";
  }, 1500);
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
