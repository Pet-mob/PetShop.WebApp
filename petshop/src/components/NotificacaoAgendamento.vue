<template>
  <div class="notificacoes-laterais">
    <div
      v-for="agendamento in agendamentosPendentes"
      :key="agendamento.id"
      class="card"
    >
      <p><strong>Cliente:</strong> {{ agendamento.cliente }}</p>
      <p><strong>Serviço:</strong> {{ agendamento.servico }}</p>
      <button
        :disabled="isLoading(agendamento.id)"
        @click="aceitar(agendamento.id)"
      >
        ✅ Aceitar
      </button>
      <button
        :disabled="isLoading(agendamento.id)"
        @click="recusar(agendamento.id)"
      >
        ❌ Recusar
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useSignalR } from "@/composables/useSignalR";

const agendamentosPendentes = ref([]);
const loadingIds = ref([]);
const { novoAgendamento, startConnection, stopConnection } = useSignalR();

onMounted(() => {
  startConnection();
});

onBeforeUnmount(() => {
  stopConnection();
});

watch(novoAgendamento, (novo) => {
  if (novo && !agendamentosPendentes.value.find((a) => a.id === novo.id)) {
    agendamentosPendentes.value.push(novo);
  }
});

const isLoading = (id) => loadingIds.value.includes(id);

async function aceitar(id) {
  if (isLoading(id)) return;
  loadingIds.value.push(id);
  try {
    const res = await fetch(`/api/agendamentos/${id}/aceitar`, {
      method: "POST",
    });
    if (res.ok) {
      agendamentosPendentes.value = agendamentosPendentes.value.filter(
        (a) => a.id !== id
      );
    } else {
      console.error("❌ Falha ao aceitar:", await res.text());
    }
  } catch (err) {
    console.error("❌ Erro de rede ao aceitar:", err);
  } finally {
    loadingIds.value = loadingIds.value.filter((i) => i !== id);
  }
}

async function recusar(id) {
  if (isLoading(id)) return;
  loadingIds.value.push(id);
  try {
    const res = await fetch(`/api/agendamentos/${id}/recusar`, {
      method: "POST",
    });
    if (res.ok) {
      agendamentosPendentes.value = agendamentosPendentes.value.filter(
        (a) => a.id !== id
      );
    } else {
      console.error("❌ Falha ao recusar:", await res.text());
    }
  } catch (err) {
    console.error("❌ Erro de rede ao recusar:", err);
  } finally {
    loadingIds.value = loadingIds.value.filter((i) => i !== id);
  }
}
</script>

<style scoped>
.notificacoes-laterais {
  position: fixed;
  right: 0;
  top: 60px;
  width: 300px;
  background: #f4f4f4;
  border-left: 2px solid #ccc;
  padding: 1rem;
  z-index: 1000;
}
.card {
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
button[disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
