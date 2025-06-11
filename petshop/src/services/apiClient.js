import axios from "axios";

// Base URL da API
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // usa a variável do .env
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de requisição (ex: adicionar token JWT)
apiClient.interceptors.request.use(
  (config) => {
    // Exemplo: adicionar token se existir
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta (ex: tratamento global de erros)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode fazer tratamento global de erros
    // console.error('Erro na resposta da API:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
