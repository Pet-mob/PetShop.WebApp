// import axios from "axios";

// // Base URL da API
// const apiClient = axios.create({
//   baseURL: process.env.VUE_APP_API_URL, // usa a variável do .env
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });
// // Interceptor de resposta (ex: tratamento global de erros)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Aqui você pode fazer tratamento global de erros
//     // console.error('Erro na resposta da API:', error);
//     return Promise.reject(error);
//   }
// );
// export default apiClient;

// Interceptor de requisição (ex: adicionar token JWT)
// apiClient.interceptors.request.use(
//   (config) => {
//     // Exemplo: adicionar token se existir
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import { useGlobalStore } from "@/store/useGlobalStore";
import router from "@/router";
import { configurarDebugCORS } from "@/utils/corsDebug";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  // 🔑 IMPORTANTE para HttpOnly cookies
  withCredentials: true,
});

// Proteção CSRF
apiClient.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  if (token) {
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

// Tratamento de erro global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou
      const store = useGlobalStore();
      store.desautenticar();
      router.push("/login");
    }
    return Promise.reject(error);
  },
);

// Debug de CORS em desenvolvimento
configurarDebugCORS(apiClient);

export default apiClient;
