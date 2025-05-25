import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import '../src/style/global.css'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.component('ApexChartComponent', VueApexCharts)

app.mount('#app')
