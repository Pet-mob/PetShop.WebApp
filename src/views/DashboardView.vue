<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>

    <!-- Cards principais -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl shadow-md">
        <p class="text-gray-500">Pets agendados hoje</p>
        <p class="text-2xl font-semibold text-indigo-600">12</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-md">
        <p class="text-gray-500">Serviços concluídos</p>
        <p class="text-2xl font-semibold text-green-600">9</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-md">
        <p class="text-gray-500">Agendamentos para amanhã</p>
        <p class="text-2xl font-semibold text-blue-600">15</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-md">
        <p class="text-gray-500">Próximo horário</p>
        <p class="text-2xl font-semibold text-rose-600">14:30 - Banho (Thor)</p>
      </div>
    </div>

    <!-- Gráfico de barras -->
    <div class="bg-white p-4 rounded-2xl shadow-md">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Serviços na última semana</h2>
      <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script setup>
// import ApexCharts from 'apexcharts'
// import VueApexCharts from 'vue3-apexcharts'

const chartOptions = {
  chart: {
    id: 'servicos-bar'
  },
  xaxis: {
    categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  },
  colors: ['#6366f1'],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '40%'
    }
  }
}

const series = [
  {
    name: 'Serviços',
    data: [10, 14, 8, 12, 15, 7, 4]
  }
]
</script>

<style scoped>
</style>
