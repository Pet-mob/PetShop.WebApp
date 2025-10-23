<template>
  <div class="confirmacao-page">
    <div class="card-agendamento" v-if="agendamento">
      <h2 class="titulo">Confirmação de Agendamento</h2>

      <div class="status-badge" :class="agendamento.status.toLowerCase()">
        {{ statusFormatado }}
      </div>

      <div class="detalhes-agendamento">
        <div class="info-grupo">
          <label>Data:</label>
          <span>{{ formatarData(agendamento.data) }}</span>
        </div>
        <div class="info-grupo">
          <label>Horário:</label>
          <span>{{ formatarHora(agendamento.hora) }}</span>
        </div>
        <div class="info-grupo">
          <label>Serviço:</label>
          <span>{{ agendamento.servico }}</span>
        </div>
        <div class="info-grupo">
          <label>Pet:</label>
          <span>{{ agendamento.nomePet }}</span>
        </div>
      </div>

      <div
        v-if="agendamento.status === 'PENDENTE' && isAdmin"
        class="acoes-admin"
      >
        <button class="btn-confirmar" @click="confirmarAgendamento">
          Confirmar Agendamento
        </button>
        <button class="btn-negar" @click="mostrarModalNegacao">
          Negar Agendamento
        </button>
      </div>

      <div v-if="agendamento.status === 'CANCELADO'" class="justificativa">
        <h3>Motivo do Cancelamento:</h3>
        <p>{{ agendamento.justificativa }}</p>
      </div>
    </div>

    <!-- Modal de Negação -->
    <ModalBase v-if="showModal" @fechar="showModal = false">
      <template #titulo> Justificativa de Negação </template>
      <template #conteudo>
        <div class="form-justificativa">
          <label>Por favor, informe o motivo da negação do agendamento:</label>
          <textarea
            v-model="justificativa"
            rows="4"
            placeholder="Digite o motivo..."
            required
          ></textarea>
        </div>
      </template>
      <template #acoes>
        <button
          class="btn-confirmar"
          @click="confirmarNegacao"
          :disabled="!justificativa.trim()"
        >
          Confirmar
        </button>
        <button class="btn-cancelar" @click="showModal = false">
          Cancelar
        </button>
      </template>
    </ModalBase>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import agendaService from "@/services/agendaService";
import ModalBase from "@/components/ModalBase.vue";
import { useGlobalStore } from "@/store/useGlobalStore";

export default {
  name: "ConfirmacaoAgendamentoPage",
  components: {
    ModalBase,
  },
  setup() {
    const route = useRoute();
    const globalStore = useGlobalStore();
    const agendamento = ref(null);
    const showModal = ref(false);
    const justificativa = ref("");
    const isAdmin = ref(false); // Deve ser configurado com base nas permissões do usuário

    const statusFormatado = computed(() => {
      const status = agendamento.value?.status;
      switch (status) {
        case "PENDENTE":
          return "Pendente";
        case "CONFIRMADO":
          return "Confirmado";
        case "CANCELADO":
          return "Cancelado";
        default:
          return "";
      }
    });

    const formatarData = (data) => {
      return new Date(data).toLocaleDateString("pt-BR");
    };

    const formatarHora = (hora) => {
      return hora.substring(0, 5);
    };

    const carregarAgendamento = async () => {
      try {
        const idAgendamento = route.params.id;
        const response = await agendaService.buscarAgendamentoPorId(
          idAgendamento
        );
        agendamento.value = response;
      } catch (error) {
        console.error("Erro ao carregar agendamento:", error);
        globalStore.showToast("Erro ao carregar dados do agendamento", "error");
      }
    };

    const confirmarAgendamento = async () => {
      try {
        await agendaService.atualizarStatusAgendamento(
          agendamento.value.id,
          "CONFIRMADO"
        );
        agendamento.value.status = "CONFIRMADO";
        globalStore.showToast("Agendamento confirmado com sucesso!", "success");
      } catch (error) {
        console.error("Erro ao confirmar agendamento:", error);
        globalStore.showToast("Erro ao confirmar agendamento", "error");
      }
    };

    const mostrarModalNegacao = () => {
      showModal.value = true;
    };

    const confirmarNegacao = async () => {
      if (!justificativa.value.trim()) {
        globalStore.showToast("A justificativa é obrigatória", "error");
        return;
      }

      try {
        await agendaService.atualizarStatusAgendamento(
          agendamento.value.id,
          "CANCELADO",
          justificativa.value
        );
        agendamento.value.status = "CANCELADO";
        agendamento.value.justificativa = justificativa.value;
        showModal.value = false;
        justificativa.value = "";
        globalStore.showToast("Agendamento cancelado", "success");
      } catch (error) {
        console.error("Erro ao negar agendamento:", error);
        globalStore.showToast("Erro ao negar agendamento", "error");
      }
    };

    onMounted(() => {
      carregarAgendamento();
    });

    return {
      agendamento,
      showModal,
      justificativa,
      isAdmin,
      statusFormatado,
      formatarData,
      formatarHora,
      confirmarAgendamento,
      mostrarModalNegacao,
      confirmarNegacao,
    };
  },
};
</script>

<style scoped>
.confirmacao-page {
  padding: 2rem;
}

.card-agendamento {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.titulo {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--cor-primaria);
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.status-badge.pendente {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.confirmado {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.cancelado {
  background-color: #f8d7da;
  color: #721c24;
}

.detalhes-agendamento {
  margin-bottom: 2rem;
}

.info-grupo {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.info-grupo label {
  font-weight: bold;
  min-width: 100px;
}

.acoes-admin {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-confirmar,
.btn-negar,
.btn-cancelar {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
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

.btn-cancelar {
  background-color: #6c757d;
  color: white;
}

.btn-confirmar:hover,
.btn-negar:hover,
.btn-cancelar:hover {
  opacity: 0.9;
}

.justificativa {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.form-justificativa {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-justificativa textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
