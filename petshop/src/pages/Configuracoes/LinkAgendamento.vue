<template>
  <div class="link-agendamento">
    <h3 class="titulo">Compartilhar link de agendamento</h3>

    <div class="input-group">
      <input v-model="linkGerado" readonly class="link-input" />
      <button type="submit" class="botoes" @click="copiarLink">Copiar</button>
      <button
        type="submit"
        class="botoes"
        @click="compartilharLink"
        v-if="podeCompartilhar"
      >
        Compartilhar
      </button>
    </div>

    <p v-if="copiado" class="sucesso">Link copiado com sucesso!</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useGlobalStore } from "@/store/useGlobalStore";

const store = useGlobalStore();
const empresaLogada = store.empresaLogada;
const idEmpresaLogada = empresaLogada.idEmpresa;

const idEmpresa = idEmpresaLogada; // Pode ser passado por props ou vindo da store
const baseUrl = "https://peton.app/redirect";

const linkGerado = computed(() => `${baseUrl}?empresa=${idEmpresa}`);
const copiado = ref(false);

function copiarLink() {
  navigator.clipboard.writeText(linkGerado.value).then(() => {
    copiado.value = true;
    setTimeout(() => (copiado.value = false), 2000);
  });
}

const podeCompartilhar = computed(() => !!navigator.share);

function compartilharLink() {
  if (!podeCompartilhar.value) return;

  navigator
    .share({
      title: "Agende com a Pet.ON",
      text: "Clique no link para agendar o serviço para seu pet:",
      url: linkGerado.value,
    })
    .catch((error) => {
      console.error("Erro ao compartilhar:", error);
    });
}
</script>

<style scoped>
.titulo {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
  text-align: left;
}

.link-agendamento {
  max-width: 100%;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.link-input {
  flex: 1;
  padding: 0.5rem;
}

.sucesso {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 32px;
  color: green;
  text-align: left;
}

.botoes {
  padding: 10px 24px;
  background-color: #0065d1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}
</style>
