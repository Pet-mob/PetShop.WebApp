<template>
  <ModalBase
    v-if="visible"
    :titulo="titulo"
    :maxWidth="'720px'"
    @fechar="onFechar"
  >
    <template #default>
      <div class="ag-layout">
        <!-- Coluna esquerda: avatar + nomes + serviços -->
        <div class="ag-left">
          <div class="ag-header">
            <img
              v-if="agendamento?.urlFotoAnimal"
              :src="agendamento.urlFotoAnimal"
              alt="Foto do animal"
              class="ag-avatar"
            />
            <div class="ag-names">
              <div class="ag-animal">🐾 {{ agendamento?.nomeAnimal }}</div>
              <div class="ag-user">👤 {{ agendamento?.nomeUsuario }}</div>
            </div>
          </div>

          <!-- Dentro do ag-left -->
          <div class="ag-section">
            <div class="ag-section-title">Serviços</div>

            <div v-if="listaServicos.length" class="ag-services-card">
              <table class="ag-services-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(servico, i) in listaServicos" :key="i">
                    <td>{{ servico }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="ag-muted">Nenhum serviço informado.</div>
          </div>
        </div>

        <!-- Coluna direita: detalhes -->
        <div class="ag-right">
          <div class="ag-card">
            <dl class="ag-details">
              <div class="ag-row">
                <dt>Data</dt>
                <dd>{{ formatarData(agendamento?.data) }}</dd>
              </div>

              <div class="ag-row">
                <dt>Horário</dt>
                <dd>
                  {{ agendamento?.horarioInicial }} -
                  {{ agendamento?.horarioFinal }}
                </dd>
              </div>

              <div class="ag-row">
                <dt>Status</dt>
                <dd>
                  <span class="ag-badge" :class="statusClass">{{
                    agendamento?.idStatusAgendamento === 1
                      ? "Concluído"
                      : agendamento?.idStatusAgendamento === 3
                      ? "Agendado"
                      : agendamento?.idStatusAgendamento === 2
                      ? "Cancelado"
                      : "Desconhecido"
                  }}</span>
                </dd>
              </div>

              <div class="ag-row">
                <dt>Pacote</dt>
                <dd>{{ agendamento?.pacoteMensal ? "Mensal" : "Avulso" }}</dd>
              </div>

              <div class="ag-row">
                <dt>Empresa</dt>
                <dd>{{ agendamento?.nomeEmpresa }}</dd>
              </div>
            </dl>
          </div>
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

// Formata data (yyyy-mm-dd => dd/mm/yyyy)
const formatarData = (data) => {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

// lista de serviços limpa
const listaServicos = computed(() =>
  props.agendamento?.descricaoServicos
    ? props.agendamento.descricaoServicos
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [],
);

const statusClass = computed(() => {
  const s = props.agendamento?.idStatusAgendamento;
  if (s === "Concluído") return "ag-badge--ok";
  if (s === "Agendado") return "ag-badge--warn";
  if (s === "Cancelado") return "ag-badge--err";
  return "ag-badge--muted";
});
</script>

<style scoped>
.ag-layout {
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 20px;
  align-items: start;
  color: #111827;
  text-align: left;
}

/* Coluna esquerda */
.ag-left {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ag-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ag-avatar {
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.ag-names {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ag-animal {
  font-weight: 700;
  color: #111827;
}

.ag-user {
  color: #6b7280;
}

.ag-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ag-section-title {
  font-weight: 800;
  color: #1f2937;
  font-size: 1.05rem;
}

.ag-services {
  margin: 0;
  padding-left: 1.05rem;
  list-style: disc;
}

.ag-services li {
  margin: 6px 0;
}

/* Coluna direita */
.ag-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ag-card {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eef2f6;
  background: #ffffff;
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.02);
}

.ag-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
}

.ag-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ag-row dt {
  width: 85px;
  font-weight: 700;
  color: #374151;
}

.ag-row dd {
  margin: 0;
  color: #111827;
}

/* Badge status */
.ag-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.ag-badge--ok {
  background: #dcfce7;
  color: #166534;
}

.ag-badge--warn {
  background: #fef3c7;
  color: #92400e;
}

.ag-badge--err {
  background: #fee2e2;
  color: #991b1b;
}

.ag-badge--muted {
  background: #f3f4f6;
  color: #374151;
}

.ag-muted {
  color: #9ca3af;
  font-style: italic;
}

/* Responsivo */
@media (max-width: 720px) {
  .ag-layout {
    grid-template-columns: 1fr;
  }

  /* rótulos em cima do valor no mobile */
  .ag-row {
    flex-direction: column;
    gap: 2px;
  }

  .ag-row dt {
    width: auto;
    font-size: 0.9rem;
  }

  .ag-row dd {
    font-size: 0.95rem;
  }
}

/* Serviços em forma de tabela */
.ag-services-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.ag-services-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.ag-services-table th {
  text-align: left;
  padding: 8px 10px;
  background: #f9fafb;
  font-weight: 700;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.ag-services-table td {
  padding: 8px 10px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.ag-services-table tr:last-child td {
  border-bottom: none;
}
</style>
