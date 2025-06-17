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

    <!--Conteudo-->
    <!--TODO: isolar em um componente, fazer um componente pra isso-->
    <div v-if="carregando" class="text-center text-gray-400 py-6">
      <span class="animate-pulse">Carregando agendamentos...</span>
    </div>
    <div v-else class="agenda-semanal">
      <div class="cards-dias">
        <div v-for="dia in diasSemana" :key="dia.data" class="card-dia">
          <div class="header-dia">
            <span class="nome-dia">{{ dia.nome }}</span>
            <span class="data-dia">{{ dia.data.format("DD/MM") }}</span>
          </div>

          <div class="agendamentos-dia">
            <div
              v-if="agendamentosPorDia(dia.data).length === 0"
              class="sem-agendamentos"
            >
              Nenhum agendamento
            </div>
            <div
              v-for="ag in agendamentosPorDia(dia.data)"
              :key="ag.idAgendamento"
              class="agendamento-item"
            >
              <strong>{{ ag.NomeAnimal }}</strong> <br />
              <small>{{ ag.HorarioInicial }} - {{ ag.DescricaoServico }}</small>
            </div>
          </div>
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

const diasSemana = computed(() => {
  return [...Array(7).keys()].map((i) => {
    return {
      nome: dayjs().day(i).locale("pt-br").format("ddd"),
      data: dayjs(dataFiltro.value)
        .startOf("week")
        .add(1 + i, "day"),
    };
  });
});

function agendamentosPorDia(dia) {
  return agendamentos.value.filter(
    (ag) => dayjs(ag.Data).format("YYYY-MM-DD") === dia.format("YYYY-MM-DD")
  );
}

async function buscarAgendamentos() {
  carregando.value = true;
  const dataInicio = dayjs(dataFiltro.value)
    .startOf("week")
    .add(1, "day")
    .format("YYYY-MM-DD");
  const dataFim = dayjs(dataFiltro.value)
    .endOf("week")
    .add(1, "day")
    .format("YYYY-MM-DD");
  try {
    const dados = await AgendaService.buscarAgenda(
      dataInicio,
      dataFim,
      idEmpresaLogada
    );
    agendamentos.value = dados;
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
  margin-top: 10px;
  padding-right: 0.75rem;
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

.filtro-navegacao {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.agenda-semanal {
  /* max-width: 900px; */
  margin: 0 auto;
  /* padding: 20px; */
}

.cards-dias {
  display: flex;
  gap: 1rem;
}

.card-dia {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 0.1);
  padding: 1rem;
  min-width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.header-dia {
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.nome-dia {
  font-weight: 700;
  text-transform: capitalize;
}

.data-dia {
  font-weight: 600;
  text-transform: capitalize;
}

.agendamentos-dia {
  height: 400px;
}

.agendamento-item {
  background: #e8f0fe;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
}

.sem-agendamentos {
  font-style: italic;
  color: #777;
  text-align: center;
  margin-top: 1rem;
}
</style>
