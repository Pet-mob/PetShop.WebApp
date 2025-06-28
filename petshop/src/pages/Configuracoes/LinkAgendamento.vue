<template>
  <div class="link-agendamento">
    <h3 class="titulo">Compartilhar link de agendamento</h3>

    <div class="input-group">
      <input
        v-model="linkGerado"
        readonly
        class="link-input"
        aria-label="Link de agendamento"
      />
      <div class="botoes-container">
        <button
          type="button"
          class="botao"
          @click="copiarLink"
          aria-label="Copiar link de agendamento"
        >
          Copiar
        </button>
        <button
          type="button"
          class="botao"
          v-if="podeCompartilhar"
          @click="compartilharLink"
          aria-label="Compartilhar link de agendamento"
        >
          Compartilhar
        </button>
      </div>
    </div>

    <p v-if="copiado" class="mensagem-sucesso" role="status" aria-live="polite">
      Link copiado com sucesso!
    </p>
    <p v-if="erro" class="mensagem-erro" role="alert">{{ erro }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useGlobalStore } from "@/store/useGlobalStore";

// Dados da empresa
const store = useGlobalStore();
const idEmpresa = store.empresaLogada?.idEmpresa ?? "";
const baseUrl = "https://peton.app/redirect";

// Computado e estados
const linkGerado = computed(() => `${baseUrl}?empresa=${idEmpresa}`);
const copiado = ref(false);
const erro = ref("");
const podeCompartilhar = computed(() => !!navigator.share);

// Ações
function copiarLink() {
  erro.value = "";
  navigator.clipboard
    .writeText(linkGerado.value)
    .then(() => {
      copiado.value = true;
      setTimeout(() => (copiado.value = false), 2000);
    })
    .catch(() => {
      erro.value = "Não foi possível copiar o link. Tente manualmente.";
    });
}

function compartilharLink() {
  erro.value = "";
  navigator
    .share({
      title: "Agende com a Pet.ON",
      text: "Clique no link para agendar o serviço do seu pet:",
      url: linkGerado.value,
    })
    .catch(() => {
      erro.value = "Não foi possível compartilhar o link neste dispositivo.";
    });
}
</script>

<style scoped>
.link-agendamento {
  max-width: 100%;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.titulo {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  text-align: left;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 16px; /* <-- Aqui adicionamos espaço após os botões */
}

.link-input {
  width: 90%;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  word-break: break-all;
}

.botoes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.botao {
  padding: 10px 16px;
  background-color: #0065d1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.botao:hover {
  background-color: #004ea8;
}

.mensagem-sucesso {
  font-size: 16px;
  color: green;
  margin-top: 12px;
  text-align: left;
}

.mensagem-erro {
  font-size: 16px;
  color: #d32f2f;
  margin-top: 12px;
  text-align: left;
}
</style>
