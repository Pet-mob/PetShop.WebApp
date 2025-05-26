<template>
  <div class="cards-grid">
    <div v-for="(dia, i) in diasDoMes" :key="i" class="card">
      <header>
        <h3>{{ dia.dia }}</h3>
        <span>{{ dia.data }}</span>
      </header>
      <section>
        <p class="section-title">Total de Agendamentos: {{ dia.totalAgendamentos }}</p>
        <p class="section-title">Total Recebido: R$ {{ dia.valorTotal.toFixed(2) }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const diasDoMes = ref([])

onMounted(() => {
  const hoje = dayjs()
  const inicio = hoje.startOf('month')
  const fim = hoje.endOf('month')
  const dias = []

  for (let d = inicio; d.isBefore(fim) || d.isSame(fim, 'day'); d = d.add(1, 'day')) {
    dias.push({
      dia: d.format('dddd'),
      data: d.format('DD/MM'),
      totalAgendamentos: Math.floor(Math.random() * 6),
      valorTotal: Math.floor(Math.random() * 500) + 50
    })
  }

  diasDoMes.value = dias
})
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.card {
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}
.card:hover {
  box-shadow: 0 8px 20px #6b7280;
}
.card header {
  text-align: center;
}
.section-title {
  font-weight: 600;
  margin-top: 0.75rem;
}
</style>
