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

        <!-- Filtro e Navegação -->
        <div class="filtro-navegacao mb-6">
            <div class="filtro">
                <input v-model="dataFiltro" type="date" />
                <button @click="aplicarFiltro">Aplicar</button>
            </div>
            <div class="navegacao-semana" v-if="visualizacao === 'semanal'">
                <button @click="voltarSemana">&lt;</button>
                <span>{{ intervaloSemana }}</span>
                <button @click="avancarSemana">&gt;</button>
            </div>
            <div class="navegacao-mes" v-else>
                <button @click="voltarMes">&lt;</button>
                <span>{{ intervaloMes }}</span>
                <button @click="avancarMes">&gt;</button>
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

function aplicarFiltro() {
    // Já atualizou dataFiltro pelo v-model, só dispara recarregamento no filho
    // Como dataFiltro é reactivo e passado via props, filhos atualizam automaticamente
}

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
    background-color: #f9fafb;
    min-height: 100vh;
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

/* Filtro e Navegação */
.filtro-navegacao {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0 1.5rem 1.5rem 1.5rem;
}

.filtro input[type='date'] {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    outline: none;
    transition: border-color 0.3s ease;
}

.filtro input[type='date']:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
}

.filtro button {
    background-color: #7c3aed;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 0.5rem;
}

.filtro button:hover {
    background-color: #6d28d9;
}

.navegacao-semana,
.navegacao-mes {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #7c3aed;
    font-weight: 600;
    font-size: 1.125rem;
    user-select: none;
}

.navegacao-semana button,
.navegacao-mes button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease;
}

.navegacao-semana button:hover,
.navegacao-mes button:hover {
    background-color: #ede9fe;
}
</style>
