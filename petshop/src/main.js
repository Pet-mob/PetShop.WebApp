import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
// import '../src/style/principal.css'
// import '@/assets/css/principal.css'

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount("#app");
