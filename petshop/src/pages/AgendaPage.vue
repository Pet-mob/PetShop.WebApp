<template>
    <div class="agenda-container p-6 bg-gray-50 min-h-screen">
        <!-- Abas de Visualização -->
        <div class="tabs mb-6">
            <button :class="['tab-btn', { active: visualizacao === 'semanal' }]" @click="visualizacao = 'semanal'">
                Semanal
            </button>
            <button :class="['tab-btn', { active: visualizacao === 'mensal' }]" @click="visualizacao = 'mensal'">
                Mensal
            </button>
        </div>

        <div class="filtro-navegacao mb-6">
            <!-- Esconde input date, só abre no clique no label -->
            <input
                ref="inputData"
                v-model="dataFiltro"
                type="date"
                class="input-date-hidden"
                @change="aplicarFiltro"
            />
            <div class="navegacao-central">
                <button @click="voltarSemana" v-if="visualizacao === 'semanal'">&lt;</button>
                <button @click="voltarMes" v-else>&lt;</button>

                <label
                    class="label-data"
                    @click="abrirCalendario"
                    tabindex="0"
                    @keydown.enter.prevent="abrirCalendario"
                    @keydown.space.prevent="abrirCalendario"
                >
                    {{ visualizacao === 'semanal' ? intervaloSemana : intervaloMes }}
                </label>

                <button @click="avancarSemana" v-if="visualizacao === 'semanal'">&gt;</button>
                <button @click="avancarMes" v-else>&gt;</button>
            </div>
        </div>

        <!-- Exibe o componente conforme visualização -->
        <div>
            <AgendaSemanal v-if="visualizacao === 'semanal'" :data-base="dataFiltro" />
            <AgendaMensal v-else :data-base="dataFiltro" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

import AgendaSemanal from '@/components/Agenda/AgendaSemanal.vue'
import AgendaMensal from '@/components/Agenda/AgendaMensal.vue'

const visualizacao = ref('semanal')
const dataFiltro = ref(dayjs().format('YYYY-MM-DD'))

// const dataFiltro = ref(dayjs().format('YYYY-MM-DD'))
const inputData = ref(null)

function abrirCalendario() {
  if (inputData.value) {
    inputData.value.showPicker?.() // showPicker é suporte novo e mais direto em alguns browsers
    inputData.value.focus()
  }
}

function aplicarFiltro() {
  // já atualiza dataFiltro pelo v-model, aqui você pode fazer lógica extra se quiser
}

// Semana (para navegação e exibição do intervalo)
const intervaloSemana = computed(() => {
    const inicio = dayjs(dataFiltro.value).startOf('week').format('DD/MM')
    const fim = dayjs(dataFiltro.value).endOf('week').format('DD/MM')
    return `${inicio} - ${fim}`
})

// Mês (para navegação mensal)
const intervaloMes = computed(() => {
    return dayjs(dataFiltro.value).format('MMMM [de] YYYY')
})

// function aplicarFiltro() {
//     // Já atualizou dataFiltro pelo v-model, só dispara recarregamento no filho
//     // Como dataFiltro é reactivo e passado via props, filhos atualizam automaticamente
// }

function voltarSemana() {
    const novaData = dayjs(dataFiltro.value).subtract(7, 'day')
    dataFiltro.value = novaData.format('YYYY-MM-DD')
}

function avancarSemana() {
    const novaData = dayjs(dataFiltro.value).add(7, 'day')
    dataFiltro.value = novaData.format('YYYY-MM-DD')
}

function voltarMes() {
    const novaData = dayjs(dataFiltro.value).subtract(1, 'month')
    dataFiltro.value = novaData.format('YYYY-MM-DD')
}

function avancarMes() {
    const novaData = dayjs(dataFiltro.value).add(1, 'month')
    dataFiltro.value = novaData.format('YYYY-MM-DD')
}
</script>

<style scoped>
.agenda-container {    
    min-height: 10vh;
}

.filtro-navegacao {
  display: flex;
  align-items: center;
  justify-content: center; /* centraliza o conjunto inteiro */
  gap: 2rem; /* espaço entre filtro e navegação */
  margin-bottom: 1.5rem;
}

.filtro {
  flex-grow: 0; /* tira o crescimento para não empurrar */
  min-width: 180px; /* ou o que achar ideal */
  display: flex;
  justify-content: center; /* centraliza o label */
}

/* Tabs */
.tabs {
    display: flex;
    justify-content: left;
    padding: 1.5rem;
}

.tab-btn {
    background: transparent;
    border: none;
    border-bottom: 4px solid transparent;
    padding: 0.5rem 1.5rem;
    margin: 0 0.75rem;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-btn:hover {
    color: #000000;
}

.tab-btn.active {
    border-bottom-color: #000000;
    color: #000000;
}

/*input oculto*/
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

/* Data (Label Central) */
.label-data {
  cursor: pointer;
  padding: 0.5rem 1rem;  
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.25rem;
  color: #000000;
  user-select: none;
  min-width: 180px;
  text-align: center;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px; /* garante altura compatível com os botões */
  line-height: 1.25;
}

.label-data:hover,
.label-data:focus {
  background-color: #757575;
  color: #fff;
  outline: none;
}

/* Navegação */
.navegacao-central {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
}

/* Botões da navegação */
.navegacao-central button {
  background-color: white;
  border: 2px solid #757575;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 1.25rem;
  color: #757575;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navegacao-central button:hover {
  background-color: #757575;
  color: white;
}

.navegacao-central button:active {
  transform: scale(0.95);
}

</style>
