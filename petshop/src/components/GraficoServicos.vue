<template>
  <div role="region" aria-label="Gráfico de agendamentos na semana">
    <Bar :data="dadosGrafico" :options="opcoesGrafico" />
    <p v-if="!dadosGrafico.datasets[0].data.length" class="mensagem-erro" role="status">
      Nenhum dado disponível para exibir o gráfico.
    </p>
    <span class="sr-only">Este gráfico mostra a quantidade de agendamentos em cada dia da
      semana.</span>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Declarar props corretamente
const props = defineProps({
  dadosSemana: {
    type: Array,
    default: () => [5, 8, 6, 10, 7, 9, 12],
  },
});

const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const dadosGrafico = ref({
  labels,
  datasets: [
    {
      label: "Agendamentos",
      backgroundColor: "#6a1b9a",
      data: [],
    },
  ],
});

const opcoesGrafico = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#555",
        font: { size: 14 },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#555",
        stepSize: 2,
      },
    },
    x: {
      ticks: {
        color: "#555",
      },
    },
  },
};

// Atualiza dados com o valor da prop
watch(
  () => props.dadosSemana,
  (novoValor) => {
    dadosGrafico.value.datasets[0].data = novoValor;
  },
  { immediate: true }
);
</script>

<style scoped>
div {
  height: 300px;
  width: 100%;
}

.mensagem-erro {
  color: #d32f2f;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
