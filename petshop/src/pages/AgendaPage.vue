<template>
  <div class="agenda-container p-4 bg-gray-50 min-h-screen">
    <!-- Tabs -->
    <div class="tabs mb-4">
      <button
        :class="['tab-btn', { active: visualizacao === 'semanal' }]"
        @click="visualizacao = 'semanal'"
      >
        Semanal
      </button>
      <!-- <button
        :class="['tab-btn', { active: visualizacao === 'mensal' }]"
        disabled
      >
        Mensal
      </button> -->
    </div>

    <!-- Navegação -->
    <div class="filtro-navegacao mb-4">
      <input
        ref="inputData"
        v-model="dataFiltro"
        type="date"
        class="input-date-hidden"
        @change="aplicarFiltro"
      />
      <div class="navegacao-central">
        <button @click="voltarPeriodo" aria-label="Voltar período">&lt;</button>
        <label
          class="label-data"
          @click="abrirCalendario"
          role="button"
          tabindex="0"
          @keydown.enter.prevent="abrirCalendario"
          @keydown.space.prevent="abrirCalendario"
        >
          {{ intervaloSemana }}
        </label>
        <button @click="avancarPeriodo" aria-label="Avançar período">
          &gt;
        </button>
      </div>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="text-center text-gray-400 py-6">
      <span class="animate-pulse">Carregando agendamentos...</span>
    </div>

    <!-- Agenda semanal -->
    <div v-else>
      <div
        v-if="agendamentos.length === 0"
        class="text-center text-gray-500 py-6"
      >
        Nenhum agendamento para esse período.
      </div>
      <div v-else class="grid gap-4">
        <div
          v-for="(item, index) in agendamentos"
          :key="index"
          class="bg-white p-4 rounded shadow"
        >
          <h3 class="font-semibold text-lg truncate">{{ item.nomePet }}</h3>
          <p><strong>Serviço:</strong> {{ item.servico }}</p>
          <p><strong>Data:</strong> {{ formatarData(item.data) }}</p>
          <p><strong>Hora:</strong> {{ item.hora }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import AgendaService from "@/services/agendaService";
import { useGlobalStore } from "@/store/useGlobalStore";

dayjs.locale("pt-br");

const store = useGlobalStore();
const visualizacao = ref("semanal");
const dataFiltro = ref(dayjs().format("YYYY-MM-DD"));
const inputData = ref(null);
const carregando = ref(false);
const agendamentos = ref([]);
const empresaLogada = store.empresaLogada;
const idEmpresaLogada = empresaLogada.idEmpresa;

const intervaloSemana = computed(() => {
  const inicio = dayjs(dataFiltro.value)
    .startOf("week")
    .add(1, "day")
    .format("DD/MM");
  const fim = dayjs(dataFiltro.value)
    .endOf("week")
    .add(1, "day")
    .format("DD/MM");
  return `${inicio} - ${fim}`;
});

function abrirCalendario() {
  inputData.value?.showPicker?.();
  inputData.value?.focus();
}

function voltarPeriodo() {
  dataFiltro.value = dayjs(dataFiltro.value)
    .subtract(7, "day")
    .format("YYYY-MM-DD");
}

function avancarPeriodo() {
  dataFiltro.value = dayjs(dataFiltro.value).add(7, "day").format("YYYY-MM-DD");
}

function aplicarFiltro() {
  dataFiltro.value = inputData.value.value;
}

function formatarData(data) {
  return dayjs(data).format("DD/MM/YYYY");
}

async function buscarAgendamentos() {
  carregando.value = true;
  try {
    const data = await AgendaService.buscarAgenda(
      dataFiltro.value,
      idEmpresaLogada
    );
    agendamentos.value = data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    agendamentos.value = [];
  } finally {
    carregando.value = false;
  }
}

watch(
  dataFiltro,
  () => {
    buscarAgendamentos();
  },
  { immediate: true }
);
</script>

<style scoped>
.agenda-container {
  min-height: 10vh;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.filtro-navegacao {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  justify-content: flex-start;
  padding: 0 0.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: #000000;
}

.tab-btn.active {
  border-bottom-color: #000000;
  color: #000000;
}

.input-date-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  overflow: hidden;
  user-select: none;
  z-index: -1;
}

.label-data {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.15rem;
  color: #000000;
  user-select: none;
  min-width: 140px;
  text-align: center;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  line-height: 1.25;
}

.label-data:hover,
.label-data:focus {
  background-color: #757575;
  color: #fff;
  outline: none;
}

.navegacao-central {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  flex-wrap: nowrap;
}

.navegacao-central button {
  background-color: white;
  border: 2px solid #757575;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 1.15rem;
  color: #757575;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.navegacao-central button:hover {
  background-color: #757575;
  color: white;
}

.navegacao-central button:active {
  transform: scale(0.95);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.bg-white {
  word-break: break-word;
}

h3.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
