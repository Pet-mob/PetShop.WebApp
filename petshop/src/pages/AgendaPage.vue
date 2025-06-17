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
            <span class="nome-dia"
              >{{ dia.nome }} - {{ dia.data.format("DD/MM") }}</span
            >
          </div>

          <div class="agendamentos-dia">
            <div
              v-if="agendamentosDoDia(dia.data).length === 0"
              class="sem-agendamentos"
            >
              Nenhum agendamento
            </div>
            <div
              v-for="ag in agendamentosDoDia(dia.data)"
              :key="ag.idAgendamento"
              class="agendamento-item"
            >
              <strong>{{ ag.nomeAnimal }}</strong> <br />
              <small>{{ ag.horarioInicial }} - {{ ag.descricaoServico }}</small>
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

function agendamentosDoDia(dia) {
  const diaFormatado = dayjs(dia).format("YYYY-MM-DD");
  return agendamentos.value.filter((ag) => {
    const agFormatado = dayjs(ag.data).format("YYYY-MM-DD");
    return agFormatado === diaFormatado;
  });
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
  padding: 1rem;
  background-color: #f9fafb;
  min-height: 100%;
}

/* Tabs */
.tabs {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
  gap: 0.5rem;
}
.tab-btn {
  flex-shrink: 0;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
}
.tab-btn.active {
  border-color: #000;
  color: #000;
}
.tab-btn:hover {
  color: #000;
}

/* Navegação */
.filtro-navegacao {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}
.navegacao-central {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}
.navegacao-central button {
  background: white;
  border: 2px solid #757575;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 1rem;
  color: #757575;
  cursor: pointer;
  height: 40px;
}
.navegacao-central button:hover {
  background-color: #757575;
  color: white;
}
.label-data {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  background: #f0f0f0;
  color: #000;
  text-align: center;
}

/* Input invisível */
.input-date-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Agenda */
.agenda-semanal {
  overflow-x: auto;
}
.cards-dias {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
}

.card-dia {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  height: 470px; /* altura fixa */
  min-width: 160px;
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
}

.agendamentos-dia {
  /* max-height: 320px; */
  flex: 1;
  overflow-y: auto;
}
.agendamento-item {
  background: #e8f0fe;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}
.sem-agendamentos {
  text-align: center;
  font-style: italic;
  color: #999;
  margin-top: 1rem;
}

/* Responsividade extra */
@media (max-width: 640px) {
  .label-data {
    width: 100%;
  }

  .tab-btn {
    font-size: 0.95rem;
  }

  .cards-dias {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }

  .card-dia {
    min-width: 140px;
    height: 600px;
  }

  .agendamento-item {
    font-size: 0.85rem;
  }
}
</style>
