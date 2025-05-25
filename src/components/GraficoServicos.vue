<template>
  <div>
    <Bar :data="dadosGrafico" :options="opcoesGrafico" />
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// Declarar props corretamente
const props = defineProps({
  dadosSemana: {
    type: Array,
    default: () => [5, 8, 6, 10, 7, 9, 12],
  }
})

const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

const dadosGrafico = ref({
  labels,
  datasets: [
    {
      label: 'Serviços realizados',
      backgroundColor: '#6a1b9a',
      data: []
    }
  ]
})

const opcoesGrafico = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#555',
        font: { size: 14 }
      }
    },
    tooltip: {
      enabled: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#555',
        stepSize: 2
      }
    },
    x: {
      ticks: {
        color: '#555'
      }
    }
  }
}

// Atualiza dados com o valor da prop
watch(() => props.dadosSemana, (novoValor) => {
  dadosGrafico.value.datasets[0].data = novoValor
}, { immediate: true })
</script>

<style scoped>
div {
  height: 300px;
  width: 100%;
}
</style>
