<template>
  <div class="agenda-container p-4 bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <div class="tabs mb-4" role="tablist" aria-label="Visualização da agenda">
      <div class="navegacao-central-centralizada">
        <input
          v-model="dataFiltro"
          type="date"
          class="input-date-hidden"
          ref="inputData"
          aria-label="Selecionar data para filtrar agenda"
        />
        <button @click="voltarPeriodo" aria-label="Voltar período" tabindex="0">
          &lt;
        </button>
        <label
          class="label-data"
          @click="abrirCalendario"
          role="button"
          tabindex="0"
          @keydown.enter.prevent="abrirCalendario"
          @keydown.space.prevent="abrirCalendario"
          aria-label="Selecionar data da semana"
        >
          {{ intervaloSemana }}
        </label>
        <button
          @click="avancarPeriodo"
          aria-label="Avançar período"
          tabindex="0"
        >
          &gt;
        </button>
      </div>
    </div>

    <div
      v-if="carregando"
      class="text-center text-gray-400 py-6"
      role="status"
      aria-live="polite"
    >
      <span class="animate-pulse">Carregando agendamentos...</span>
    </div>

    <div v-else class="agenda-semanal">
      <div class="cards-dias">
        <div
          v-for="dia in diasSemana"
          :key="dia.data.format('YYYY-MM-DD')"
          class="card-dia"
          role="region"
          :aria-label="
            'Agendamentos de ' + dia.nome + ' ' + dia.data.format('DD/MM')
          "
        >
          <div class="header-dia">
            <span class="nome-dia"
              >{{ dia.nome }} - {{ dia.data.format("DD/MM") }}</span
            >
          </div>

          <div class="agendamentos-dia">
            <div
              v-if="agendamentosDoDia(dia.data).length === 0"
              class="sem-agendamentos"
              aria-label="Nenhum agendamento para este dia"
              role="status"
            >
              Nenhum agendamento
            </div>

            <div
              v-for="ag in agendamentosDoDia(dia.data)"
              :key="ag.idAgendamento"
              class="agendamento-item agendamento-clicavel"
              role="listitem"
              :aria-label="
                'Agendamento de ' +
                ag.nomeAnimal +
                ', serviço: ' +
                (ag.descricaoServicos || '') +
                ', horário: ' +
                (ag.horarioInicial || '')
              "
              @click="abrirModalServicos(ag)"
              tabindex="0"
              @keydown.enter.prevent="abrirModalServicos(ag)"
              @keydown.space.prevent="abrirModalServicos(ag)"
            >
              <strong>{{ ag.nomeAnimal }}</strong>
              <br />
              <small>{{ ag.horarioInicial }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal outside of the list (migrated to separate component) -->
    <FormularioAgendaVisualizacao
      :visible="modalServicosAberto"
      :agendamento="agendamentoSelecionado"
      :titulo="
        'Serviços agendados para ' + (agendamentoSelecionado?.nomeAnimal || '')
      "
      @fechar="fecharModalServicos"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import FormularioAgendaVisualizacao from "@/views/FormularioAgendaVisualizacao.vue";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useGlobalStore } from "@/store/useGlobalStore";
import agendaService from "@/services/agendaService";
dayjs.locale("pt-br");

const store = useGlobalStore();
const dataFiltro = ref(dayjs().format("YYYY-MM-DD"));
const inputData = ref(null);
const carregando = ref(false);
const agendamentos = ref([]);
const modalServicosAberto = ref(false);
const agendamentoSelecionado = ref(null);
const erroBusca = ref("");

const empresaLogada = store.empresaLogada || {};
const idEmpresaLogada = empresaLogada.idEmpresa ?? empresaLogada[0].idEmpresa;

function abrirModalServicos(agendamento) {
  // normalize fields to camelCase used in template
  const normalized = {
    ...agendamento,
    nomeAnimal:
      agendamento.nomeAnimal ||
      agendamento.NomeAnimal ||
      agendamento.nome ||
      "",
    nomeUsuario:
      agendamento.nomeUsuario ||
      agendamento.NomeUsuario ||
      agendamento.nomeUsuario ||
      "",
    descricaoServicos:
      agendamento.descricaoServicos ||
      agendamento.DescricaoServicos ||
      agendamento.descricao ||
      "",
    horarioInicial:
      agendamento.horarioInicial ||
      agendamento.HorarioInicial ||
      agendamento.horario ||
      "",
    horarioFinal: agendamento.horarioFinal || agendamento.HorarioFinal || "",
    idStatusAgendamento:
      agendamento.idStatusAgendamento || agendamento.IdStatusAgendamento || "",
    pacoteMensal: agendamento.pacoteMensal || agendamento.PacoteMensal || false,
    nomeEmpresa: agendamento.nomeEmpresa || agendamento.NomeEmpresa || "",
    urlFotoAnimal:
      agendamento.urlFotoAnimal ||
      agendamento.UrlFotoAnimal ||
      agendamento.UrlFoto ||
      "",
  };

  agendamentoSelecionado.value = normalized;
  modalServicosAberto.value = true;
}

function fecharModalServicos() {
  modalServicosAberto.value = false;
  agendamentoSelecionado.value = null;
}

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
  inputData.value?.focus?.();
}

function voltarPeriodo() {
  dataFiltro.value = dayjs(dataFiltro.value)
    .subtract(7, "day")
    .format("YYYY-MM-DD");
}

function avancarPeriodo() {
  dataFiltro.value = dayjs(dataFiltro.value).add(7, "day").format("YYYY-MM-DD");
}

const diasSemana = computed(() => {
  // start from Monday of the selected week and derive name from the actual date
  const inicioSemana = dayjs(dataFiltro.value).startOf("week").add(1, "day");
  return [...Array(7).keys()].map((i) => {
    const data = inicioSemana.add(i, "day");
    return {
      nome: data.locale("pt-br").format("ddd"),
      data,
    };
  });
});

function agendamentosDoDia(dia) {
  const diaFormatado = dayjs(dia).format("YYYY-MM-DD");
  return agendamentos.value.filter(
    (ag) => dayjs(ag.data).format("YYYY-MM-DD") === diaFormatado,
  );
}

async function buscarAgendamentos() {
  carregando.value = true;
  erroBusca.value = "";
  const dataInicio = dayjs(dataFiltro.value)
    .startOf("week")
    .add(1, "day")
    .format("YYYY-MM-DD");
  const dataFim = dayjs(dataFiltro.value)
    .endOf("week")
    .add(1, "day")
    .format("YYYY-MM-DD");
  try {
    const dados = await agendaService.buscarAgenda(
      dataInicio,
      dataFim,
      idEmpresaLogada,
    );
    agendamentos.value = dados || [];
  } catch (error) {
    erroBusca.value =
      "Erro ao buscar agendamentos. Tente novamente mais tarde.";
    agendamentos.value = [];
  } finally {
    carregando.value = false;
  }
}

watch(dataFiltro, () => buscarAgendamentos(), { immediate: true });
</script>

<style scoped>
.agenda-container {
  padding: 1rem;
  background-color: #f9fafb;
  min-height: 100%;
}

/* Tabs */
.tabs {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  overflow: visible;
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
}

.navegacao-central-centralizada {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.navegacao-central {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.navegacao-central-centralizada button {
  background: #fff;
  border: 2px solid #2563eb;
  border-radius: 12px;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #2563eb;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  height: 44px;
  min-width: 44px;
  outline: none;
}

.navegacao-central-centralizada button:hover,
.navegacao-central-centralizada button:focus {
  background: #e8f0fe;
  color: #1746a2;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
  border-color: #1746a2;
}

.label-data {
  background: #f8fafc;
  border-radius: 16px;
  padding: 0.7rem 2.2rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #222;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
  border: none;
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
  overflow-y: hidden;
}

.cards-dias {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2rem;
  justify-content: center;
  align-items: flex-start;
}

.card-dia {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  height: 470px;
  /* altura fixa */
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
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  padding: 1rem 1.2rem;
  margin-bottom: 0.7rem;
  border: 1.5px solid #e5e7eb;
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.agendamento-clicavel {
  cursor: pointer;
}

.agendamento-clicavel:hover,
.agendamento-clicavel:focus {
  background: #e8f0fe;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
  border-color: #2563eb;
  outline: none;
}

.agendamento-item strong {
  font-size: 1.15rem;
  color: #2563eb;
  margin-bottom: 0.2rem;
  font-weight: 700;
}

.agendamento-item small {
  color: #374151;
  margin-bottom: 0.4rem;
  font-size: 1rem;
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

<style scoped>
.agenda-container {
  padding: 1rem;
  background-color: #f9fafb;
  min-height: 100%;
}

/* Tabs */
.tabs {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  overflow: visible;
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
}

.navegacao-central-centralizada {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.navegacao-central {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.navegacao-central-centralizada button {
  background: #fff;
  border: 2px solid #2563eb;
  border-radius: 12px;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #2563eb;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  height: 44px;
  min-width: 44px;
  outline: none;
}

.navegacao-central-centralizada button:hover,
.navegacao-central-centralizada button:focus {
  background: #e8f0fe;
  color: #1746a2;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
  border-color: #1746a2;
}

.label-data {
  background: #f8fafc;
  border-radius: 16px;
  padding: 0.7rem 2.2rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #222;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
  border: none;
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
  overflow-y: hidden;
}

.cards-dias {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2rem;
  justify-content: center;
  align-items: flex-start;
}

.card-dia {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  height: 470px;
  /* altura fixa */
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
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  padding: 1rem 1.2rem;
  margin-bottom: 0.7rem;
  border: 1.5px solid #e5e7eb;
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.agendamento-clicavel {
  cursor: pointer;
}

.agendamento-clicavel:hover,
.agendamento-clicavel:focus {
  background: #e8f0fe;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
  border-color: #2563eb;
  outline: none;
}

.agendamento-item strong {
  font-size: 1.15rem;
  color: #2563eb;
  margin-bottom: 0.2rem;
  font-weight: 700;
}

.agendamento-item small {
  color: #374151;
  margin-bottom: 0.4rem;
  font-size: 1rem;
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
