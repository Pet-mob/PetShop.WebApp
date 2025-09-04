<template>
  <ModalBase v-if="visible" :titulo="titulo" @fechar="onFechar">
    <template #default>
      <div class="modal-agendamento-detalhes">
        <div class="modal-agendamento-header">
          <img
            v-if="agendamento?.urlFotoAnimal"
            :src="agendamento.urlFotoAnimal"
            alt="Foto do animal"
            class="modal-agendamento-foto"
          />
          <div class="modal-agendamento-nomes">
            <div class="modal-agendamento-animal">
              🐾 <strong>{{ agendamento?.nomeAnimal }}</strong>
            </div>
            <div class="modal-agendamento-usuario">
              👤 <strong>{{ agendamento?.nomeUsuario }}</strong>
            </div>
          </div>
        </div>

        <div class="modal-agendamento-servicos" style="margin-top: 0.75rem">
          <span style="font-weight: 600; color: #2563eb">Serviços:</span>
          <div v-if="agendamento?.descricaoServicos">
            <div
              v-for="(servico, idx) in agendamento.descricaoServicos.split(',')"
              :key="idx"
              class="modal-agendamento-servico-item"
            >
              <span style="color: #2563eb; margin-right: 0.3em">•</span>
              {{ servico.trim() }}
            </div>
          </div>
          <div v-else style="color: #999; font-style: italic">
            Nenhum serviço detalhado.
          </div>
        </div>

        <div class="modal-agendamento-info" style="margin-top: 0.75rem">
          <div>
            <strong>Horário:</strong> {{ agendamento?.horarioInicial }} -
            {{ agendamento?.horarioFinal }}
          </div>
          <div>
            <strong>Status:</strong>
            <span :style="statusStyle">{{ agendamento?.status }}</span>
          </div>
          <div v-if="agendamento?.pacoteMensal">
            <strong>Pacote:</strong> <span style="color: #2563eb">Mensal</span>
          </div>
          <div><strong>Empresa:</strong> {{ agendamento?.nomeEmpresa }}</div>
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script setup>
import { computed } from "vue";
import ModalBase from "@/components/ModalBase.vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  agendamento: { type: Object, default: null },
  titulo: { type: String, default: "" },
});
const emit = defineEmits(["fechar"]);

function onFechar() {
  emit("fechar");
}

const statusStyle = computed(() => {
  const s = props.agendamento?.status;
  return {
    color:
      s === "Confirmado"
        ? "#22c55e"
        : s === "Cancelado"
        ? "#ef4444"
        : "#2563eb",
    fontWeight: "bold",
  };
});
</script>

<style scoped>
.modal-agendamento-detalhes {
}
.modal-agendamento-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.modal-agendamento-foto {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
}
.modal-agendamento-nomes {
  display: flex;
  flex-direction: column;
}
.modal-agendamento-animal {
  font-weight: 700;
}
.modal-agendamento-usuario {
  color: #6b7280;
}
.modal-agendamento-servicos {
  margin-top: 0.5rem;
}
.modal-agendamento-servico-item {
  margin: 0.25rem 0;
}
.modal-agendamento-info {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
</style>
