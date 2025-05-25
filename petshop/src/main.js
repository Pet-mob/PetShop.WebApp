import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/style/global.css'

createApp(App).use(router).mount('#app')
