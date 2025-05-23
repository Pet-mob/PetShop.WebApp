<template>
  <div class="dashboard-container">
    <h1>Bem-vindo ao <span class="highlight">Pet.ON</span></h1>
    <p>Escolha uma opção no menu acima.</p>

    <div class="cards">
      <div class="card">
        <h2>Pets agendados hoje</h2>
        <p>{{ petsHoje }}</p>
      </div>
      <div class="card">
        <h2>Serviços concluídos</h2>
        <p>{{ servicosConcluidos }}</p>
      </div>
      <div class="card">
        <h2>Agendamentos para amanhã</h2>
        <p>{{ agendamentosAmanha }}</p>
      </div>
      <div class="card">
        <h2>Próximo horário</h2>
        <p>{{ proximoHorario }}</p>
      </div>
    </div>

    <div class="grafico">
      <h3>Serviços na última semana</h3>
      <!-- Componente de gráfico aqui -->
    </div>
  </div>
</template>

<script setup>
const petsHoje = 12
const servicosConcluidos = 9
const agendamentosAmanha = 15
const proximoHorario = '14:30 - Banho (Thor)'
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}
.highlight {
  color: #6a1b9a;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  text-align: center;
}
.card h2 {
  font-size: 1rem;
  color: #555;
}
.card p {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}
.grafico {
  margin-top: 3rem;
}
</style>
