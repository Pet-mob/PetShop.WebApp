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
        v-model="formularioCodigoVerificacao.valores.codigo"
        @blur="() => formularioCodigoVerificacao.validarAoSair('codigo')"
        placeholder="Digite o código"
        aria-label="Código recebido por e-mail"
        :class="{
          'input-erro': formularioCodigoVerificacao.erros.value.codigo,
        }"
      />
      <span
        v-if="formularioCodigoVerificacao.erros.value.codigo"
        class="texto-erro"
      >
        {{ formularioCodigoVerificacao.erros.value.codigo }}
      </span>
      <button
        @click="verificarCodigo"
        :disabled="carregando"
        aria-label="Verificar código"
      >
        {{ carregando ? "Verificando..." : "Verificar código" }}
      </button>
    </div>

    <div v-if="step === 3" class="step">
      <p>Digite sua nova senha:</p>
      <input
        type="password"
        v-model="formularioNovaSenha.valores.novaSenha"
        @blur="() => formularioNovaSenha.validarAoSair('novaSenha')"
        placeholder="Nova senha"
        aria-label="Nova senha"
        :class="{ 'input-erro': formularioNovaSenha.erros.value.novaSenha }"
      />
      <span v-if="formularioNovaSenha.erros.value.novaSenha" class="texto-erro">
        {{ formularioNovaSenha.erros.value.novaSenha }}
      </span>
      <input
        type="password"
        v-model="formularioNovaSenha.valores.confirmaSenha"
        @blur="() => formularioNovaSenha.validarAoSair('confirmaSenha')"
        placeholder="Confirme a nova senha"
        aria-label="Confirme a nova senha"
        :class="{ 'input-erro': formularioNovaSenha.erros.value.confirmaSenha }"
      />
      <span
        v-if="formularioNovaSenha.erros.value.confirmaSenha"
        class="texto-erro"
      >
        {{ formularioNovaSenha.erros.value.confirmaSenha }}
      </span>
      <button
        @click="redefinirSenha"
        :disabled="carregando"
        aria-label="Redefinir senha"
      >
        {{ carregando ? "Redefinindo senha..." : "Redefinir senha" }}
      </button>
    </div>

    <p v-if="mensagem" :class="{ sucesso: sucesso, erro: !sucesso }">
      {{ mensagem }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useErro } from "@/composables/useErro";
import { useFormulario } from "@/composables/useFormulario";
import { validarSenha, validarConfirmacaoSenha } from "@/utils/validadores";

const { erro, capturar } = useErro();

const step = ref(1);
const carregando = ref(false);
const codigoGerado = ref("");
const mensagem = ref("");
const sucesso = ref(false);

const formularioCodigoVerificacao = useFormulario({
  codigo: (valor) => {
    if (!valor) return "Código obrigatório";
    if (valor.length < 6) return "Código deve ter 6 dígitos";
    return null;
  },
});

const formularioNovaSenha = useFormulario({
  novaSenha: validarSenha,
  confirmaSenha: (valor) =>
    validarConfirmacaoSenha(valor, formularioNovaSenha.valores.novaSenha),
});

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
    formularioCodigoVerificacao.limpar();
  } catch (e) {
    capturar(e, { acao: "enviarCodigo" });
    erro.value = e.message || "Erro ao enviar código. Tente novamente.";
  } finally {
    carregando.value = false;
  }
};

// Função para verificar o código digitado
const verificarCodigo = () => {
  if (!formularioCodigoVerificacao.validarFormulario()) {
    return;
  }

  if (formularioCodigoVerificacao.valores.codigo === codigoGerado.value) {
    mensagem.value = "";
    sucesso.value = true;
    step.value = 3;
    formularioNovaSenha.limpar();
  } else {
    formularioCodigoVerificacao.erros.value.codigo =
      "Código inválido. Verifique e tente novamente.";
  }
};

// Função para redefinir senha
const redefinirSenha = async () => {
  if (!formularioNovaSenha.validarFormulario()) {
    return;
  }

  carregando.value = true;
  erro.value = "";
  mensagem.value = "";

  try {
    // Aqui você deve integrar com sua API real para redefinir a senha
    await new Promise((resolve) => setTimeout(resolve, 1500));

    mensagem.value = "Senha redefinida com sucesso!";
    sucesso.value = true;
    step.value = 1;

    // Resetar campos
    formularioCodigoVerificacao.limpar();
    formularioNovaSenha.limpar();
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

.input-erro {
  border-color: #d32f2f !important;
  background-color: #ffebee !important;
}

.texto-erro {
  display: block;
  font-size: 0.85rem;
  color: #d32f2f;
  margin-top: 5px;
  text-align: left;
}
</style>
