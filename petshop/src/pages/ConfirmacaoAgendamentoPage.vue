<template>
  <div class="confirmacao-agendamento">
    <h2>Confirmação de Agendamentos</h2>

    <div class="cards-container" v-if="agendamentos.length > 0">
      <div
        class="card"
        v-for="agendamento in agendamentos"
        :key="agendamento.id"
      >
        <div class="card-header">
          <h3>Agendamento #{{ agendamento.id }}</h3>
          <span class="data">{{
            formatarData(agendamento.dataAgendamento)
          }}</span>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">Cliente:</span>
            <span class="value">{{ agendamento.nomeCliente }}</span>
          </div>
          <div class="info-row">
            <span class="label">Pet:</span>
            <span class="value">{{ agendamento.nomePet }}</span>
          </div>
          <div class="info-row">
            <span class="label">Serviço:</span>
            <span class="value">{{ agendamento.servico }}</span>
          </div>
          <div class="info-row">
            <span class="label">Horário:</span>
            <span class="value">{{
              formatarHora(agendamento.dataAgendamento)
            }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button
            class="btn-confirmar"
            @click="confirmarAgendamento(agendamento.id)"
            :disabled="loading"
          >
            Confirmar
          </button>
          <button
            class="btn-negar"
            @click="negarAgendamento(agendamento.id)"
            :disabled="loading"
          >
            Negar
          </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <p>Não há agendamentos pendentes de confirmação.</p>
    </div>

    <Toast :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { agendaService } from "../services/agendaService";
import Toast from "../components/ToastCustomizado.vue";

const agendamentos = ref([]);
const loading = ref(false);
const toastMessage = ref("");
const toastType = ref("info");

onMounted(async () => {
  await carregarAgendamentos();
});

const carregarAgendamentos = async () => {
  try {
    loading.value = true;
    const response = await agendaService.buscarAgendamentosPendentes();
    agendamentos.value = response.data;
  } catch (error) {
    showToast("Erro ao carregar agendamentos", "error");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const confirmarAgendamento = async (id) => {
  try {
    loading.value = true;
    await agendaService.confirmarAgendamento(id);
    await carregarAgendamentos();
    showToast("Agendamento confirmado com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao confirmar agendamento", "error");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const negarAgendamento = async (id) => {
  try {
    loading.value = true;
    await agendaService.negarAgendamento(id);
    await carregarAgendamentos();
    showToast("Agendamento negado com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao negar agendamento", "error");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString("pt-BR");
};

const formatarHora = (data) => {
  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}
</script>

<style scoped>
.confirmacao-agendamento {
  padding: 20px;
}

h2 {
  color: var(--cor-primaria);
  margin-bottom: 20px;
  text-align: center;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.card-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
  padding-bottom: 8px;
}

.card-header h3 {
  color: var(--cor-primaria);
  margin: 0;
  font-size: 1.1em;
}

.data {
  color: #666;
  font-size: 0.9em;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  width: 80px;
  color: #555;
}

.value {
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: flex-end;
}

.btn-confirmar,
.btn-negar {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-confirmar {
  background-color: var(--cor-primaria);
  color: white;
}

.btn-negar {
  background-color: #dc3545;
  color: white;
}

.btn-confirmar:hover,
.btn-negar:hover {
  opacity: 0.9;
}

.btn-confirmar:disabled,
.btn-negar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px;
}
</style>
