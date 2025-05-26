<template>
  <div class="agenda-semanal-container">
    <!-- Cards Semanais -->
    <div class="cards-grid">
      <div v-for="(dia, i) in semana" :key="i" class="card">
        <header>
          <h3>{{ dia.diaSemana }}</h3>
          <span>{{ dia.dataFormatada }}</span>
        </header>
        <section>
          <p class="section-title">Horários</p>
          <ul>
            <li v-for="(item, idx) in dia.horarios" :key="idx">
              {{ item.hora }} - {{ item.usuario }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

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
        { hora: '08:00', pet: 'Rex', usuario: 'Rennan' },
        { hora: '09:00', pet: 'Rex', usuario: 'Rennan' },
        { hora: '10:00', pet: 'Rex', usuario: 'Rennan' },
        { hora: '11:00', pet: 'Rex', usuario: 'Rennan' },
        { hora: '12:00', pet: 'Rex', usuario: 'Rennan' },
        { hora: '13:00', pet: 'Rex', usuario: 'Rennan' },
        { hora: '14:00', pet: 'Bob', usuario: 'Sergio' },
        { hora: '15:00', pet: 'Luna', usuario: 'Nathan' },
        { hora: '16:00', pet: 'Luna', usuario: 'Nathan' },
        { hora: '17:00', pet: 'Luna', usuario: 'Nathan' },
        { hora: '18:00', pet: 'Luna', usuario: 'Nathan' },
        { hora: '19:00', pet: 'Luna', usuario: 'Nathan' },
        { hora: '20:00', pet: 'Luna', usuario: 'Nathan' }
      ]
    })
  }
  semana.value = novaSemana
}

gerarSemana(dataFiltro.value)

</script>

<style scoped>
/* Container principal */
.agenda-semanal-container {
  min-height: 10vh;
  padding: 1rem;
}

/* Grid responsivo */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
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
  min-height: 120px;
}

.card:hover {
  box-shadow: 0 8px 20px #6b7280;
}

/* Header */
.card header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.card header h3 {
  color: #374151; 
  font-weight: 550;
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
  max-height: 600px;
  overflow-y: auto;
}

.card ul li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
  font-family: monospace;
  color: #6b7280;
}

</style>
