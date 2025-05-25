<template>
  <div class="container-dashboard">
    <div class="cartoes">
      <section class="cartao">
        <h2>Pets agendados hoje</h2>
        <p>{{ petsAgendadosHoje }}</p>
      </section>
      <section class="cartao">
        <h2>Serviços concluídos</h2>
        <p>{{ servicosConcluidos }}</p>
      </section>
      <section class="cartao">
        <h2>Agendamentos para amanhã</h2>
        <p>{{ agendamentosAmanha }}</p>
      </section>
      <section class="cartao">
        <h2>Próximo horário</h2>
        <p>{{ proximoHorario }}</p>
      </section>
    </div>

    <div class="grafico">
      <h3>Serviços na última semana</h3>
      <GraficoServicos :dadosSemana="dadosSemana" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GraficoServicos from '../components/GraficoServicos.vue'

const petsAgendadosHoje = ref(12)
const servicosConcluidos = ref(9)
const agendamentosAmanha = ref(15)
const proximoHorario = ref('14:30 - Banho (Thor)')

// Dados reais do gráfico (exemplo dinâmico)
const dadosSemana = ref([5, 8, 6, 10, 7, 9, 12])
</script>


<style scoped>
.container-dashboard {
  padding: 2rem;
}

.cartoes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.cartao {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s ease;
}

.cartao:hover {
  transform: translateY(-5px);
}

.cartao h2 {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.cartao p {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.grafico {
  margin-top: 3rem;
}
</style>
