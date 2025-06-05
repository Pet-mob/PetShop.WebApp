<template>
  <div v-if="agendamentosPendentes.length > 0" class="notificacoes-laterais">
    <TransitionGroup name="fade" tag="div">
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
    </TransitionGroup>

    <!-- Toast customizado -->
    <Toast :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useSignalR } from "@/composables/useSignalR";
import Toast from "@/components/ToastCustomizado.vue";

const agendamentosPendentes = ref([]);
const loadingIds = ref([]);
const { novoAgendamento, startConnection, stopConnection } = useSignalR();

const toastMessage = ref("");
const toastType = ref("info");

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

onMounted(() => {
  startConnection();
});

onBeforeUnmount(() => {
  stopConnection();
});

watch(novoAgendamento, (novo) => {
  if (novo && !agendamentosPendentes.value.find((a) => a.id === novo.id)) {
    agendamentosPendentes.value.push(novo);
    showToast("📥 Novo agendamento recebido!", "info");
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
      showToast("✅ Agendamento aceito!", "success");
    } else {
      const erro = await res.text();
      console.error("❌ Falha ao aceitar:", erro);
      showToast("Erro ao aceitar: " + erro, "error");
    }
  } catch (err) {
    console.error("❌ Erro de rede:", err);
    showToast("Erro de rede ao aceitar", "error");
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
      showToast("❌ Agendamento recusado!", "warning");
    } else {
      const erro = await res.text();
      console.error("❌ Falha ao recusar:", erro);
      showToast("Erro ao recusar: " + erro, "error");
    }
  } catch (err) {
    console.error("❌ Erro de rede:", err);
    showToast("Erro de rede ao recusar", "error");
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
  width: 320px;
  background: #f4f4f4;
  border-left: 2px solid #ccc;
  padding: 1rem;
  z-index: 1000;
  overflow-y: auto;
  max-height: 90vh;
}
.card {
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
button[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

/* Animações de entrada/saída */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

<!-- <template>
  <div v-if="agendamentosPendentes.length > 0" class="notificacoes-laterais">
    <TransitionGroup name="fade" tag="div" class="notificacoes-lista">
      <div
        v-for="agendamento in agendamentosPendentes"
        :key="agendamento.id"
        class="card"
      >
        <p><strong>Cliente:</strong> {{ agendamento.cliente }}</p>
        <p><strong>Serviço:</strong> {{ agendamento.servico }}</p>
        <button @click="aceitar(agendamento.id)">✅ Aceitar</button>
        <button @click="recusar(agendamento.id)">❌ Recusar</button>
      </div>
    </TransitionGroup>
    <Toast :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useSignalR } from "@/composables/useSignalR";
import Toast from "@/components/ToastCustomizado.vue";

const agendamentosPendentes = ref([]);
const toastMessage = ref("");
const toastType = ref("info");

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

const { novoAgendamento, startConnection, stopConnection } = useSignalR();

onMounted(() => {
  startConnection();
});

onBeforeUnmount(() => {
  stopConnection();
});

watch(novoAgendamento, (novo) => {
  if (novo) {
    agendamentosPendentes.value.push(novo);
    showToast("Novo agendamento recebido!", "success");
  }
});

function aceitar(id) {
  fetch(`/api/agendamentos/${id}/aceitar`, { method: "POST" });
  agendamentosPendentes.value = agendamentosPendentes.value.filter(
    (a) => a.id !== id
  );
  showToast("Agendamento aceito!", "success");
}

function recusar(id) {
  fetch(`/api/agendamentos/${id}/recusar`, { method: "POST" });
  agendamentosPendentes.value = agendamentosPendentes.value.filter(
    (a) => a.id !== id
  );
  showToast("Agendamento recusado!", "warning");
}
</script>

<style scoped>
.notificacoes-laterais {
  position: fixed;
  right: 0;
  top: 60px;
  width: 320px;
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
  transition: all 0.3s ease-in-out;
}

/* Animações de entrada/saída dos cards */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> -->
