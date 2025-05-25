import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/style/principal.css'
// import '@/assets/css/principal.css'

createApp(App).use(router).mount('#app')
