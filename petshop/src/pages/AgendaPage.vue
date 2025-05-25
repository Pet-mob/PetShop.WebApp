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
            <div class="navegacao-semana">
                <button @click="voltarSemana">&lt;</button>
                <span>{{ intervaloSemana }}</span>
                <button @click="avancarSemana">&gt;</button>
            </div>
        </div>

        <!-- Cards Semanais -->
        <div class="cards-grid">
            <div v-for="(dia, i) in semana" :key="i" class="card">
                <header>
                    <h3>{{ dia.diaSemana }}</h3>
                    <span>{{ dia.dataFormatada }}</span>
                </header>
                <section>
                    <p class="section-title">Serviços Agendados</p>
                    <p>Banho: {{ dia.banho }}</p>
                    <p>Tosa: {{ dia.tosa }}</p>

                    <p class="section-title" style="margin-top:1rem;">Horários</p>
                    <ul>
                        <li v-for="(item, idx) in dia.horarios" :key="idx">
                            {{ item.hora }} - {{ item.pet }}
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

const visualizacao = ref('semanal')
const dataFiltro = ref(dayjs().format('YYYY-MM-DD'))
const semana = ref([])

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function gerarSemana(dataBase) {
    const inicio = dayjs(dataBase).startOf('week')
    const novaSemana = []
    for (let i = 0; i < 7; i++) {
        const dataAtual = inicio.add(i, 'day')
        novaSemana.push({
            diaSemana: diasDaSemana[dataAtual.day()],
            dataFormatada: dataAtual.format('DD/MM'),
            banho: 2,
            tosa: 1,
            horarios: [
                { hora: '09:00', pet: 'Rex' },
                { hora: '11:00', pet: 'Bob' },
                { hora: '15:00', pet: 'Luna' }
            ]
        })
    }
    semana.value = novaSemana
}

gerarSemana(dataFiltro.value)

function aplicarFiltro() {
    gerarSemana(dataFiltro.value)
}

function voltarSemana() {
    const novaData = dayjs(dataFiltro.value).subtract(7, 'day')
    dataFiltro.value = novaData.format('YYYY-MM-DD')
    gerarSemana(dataFiltro.value)
}

function avancarSemana() {
    const novaData = dayjs(dataFiltro.value).add(7, 'day')
    dataFiltro.value = novaData.format('YYYY-MM-DD')
    gerarSemana(dataFiltro.value)
}

const intervaloSemana = computed(() => {
    const inicio = dayjs(dataFiltro.value).startOf('week').format('DD/MM')
    const fim = dayjs(dataFiltro.value).endOf('week').format('DD/MM')
    return `${inicio} - ${fim}`
})
</script>

<style scoped>
.agenda-container {
    background-color: #f9fafb;
    min-height: 100vh;
}

/* Tabs */
.tabs {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1rem;
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
    color: #7c3aed;
}

.tab-btn.active {
    border-bottom-color: #7c3aed;
    color: #7c3aed;
}

/* Filtro e Navegação */
.filtro-navegacao {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
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

/* Navegação da semana */
.navegacao-semana {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #7c3aed;
    font-weight: 600;
    font-size: 1.125rem;
    user-select: none;
}

.navegacao-semana button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease;
}

.navegacao-semana button:hover {
    background-color: #ede9fe;
}

/* Grid dos cards */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
}

/* Card */
.card {
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: box-shadow 0.3s ease;
    min-height: 180px;
}

.card:hover {
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
}

/* Header do card */
.card header {
    text-align: center;
    margin-bottom: 0.75rem;
}

.card header h3 {
    color: #7c3aed;
    font-weight: 700;
    font-size: 1.1rem;
    margin: 0;
}

.card header span {
    color: #6b7280;
    font-size: 0.875rem;
}

/* Conteúdo */
.card section {
    color: #374151;
    font-size: 0.875rem;
}

.section-title {
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.25rem;
    margin-bottom: 0.5rem;
}

.card ul {
    list-style: disc;
    padding-left: 1.2rem;
    margin: 0;
    max-height: 100px;
    overflow-y: auto;
}

.card ul li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
    font-family: monospace;
    color: #7c3aed;
}
</style>
