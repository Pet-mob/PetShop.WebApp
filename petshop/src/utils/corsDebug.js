/**
 * Utilitário para debugar problemas de CORS
 * Usado apenas em desenvolvimento para ajudar na configuração
 */

export function verificarCORSHeaders(response) {
  if (!response) return;

  const headers = response.headers;

  console.group("🔍 CORS Headers Recebidos:");
  console.log(
    "Access-Control-Allow-Origin:",
    headers["access-control-allow-origin"],
  );
  console.log(
    "Access-Control-Allow-Credentials:",
    headers["access-control-allow-credentials"],
  );
  console.log(
    "Access-Control-Allow-Methods:",
    headers["access-control-allow-methods"],
  );
  console.log(
    "Access-Control-Allow-Headers:",
    headers["access-control-allow-headers"],
  );
  console.log("Access-Control-Max-Age:", headers["access-control-max-age"]);
  console.groupEnd();
}

export function logErrosCORS(erro) {
  console.group("🚨 Erro de CORS Detectado:");
  console.error("Mensagem:", erro.message);

  if (erro.response) {
    console.error("Status:", erro.response.status);
    console.error("Headers:", erro.response.headers);
  }

  if (erro.config) {
    console.group("Configuração da Requisição:");
    console.log("URL:", erro.config.url);
    console.log("Método:", erro.config.method);
    console.log("withCredentials:", erro.config.withCredentials);
    console.log("Headers enviados:", erro.config.headers);
    console.groupEnd();
  }

  console.group("ℹ️ Dica de Solução:");
  console.log("❌ Backend retorna: Access-Control-Allow-Origin: *");
  console.log(
    "✅ Backend DEVE retornar: Access-Control-Allow-Origin: http://localhost:8080",
  );
  console.log("");
  console.log("Quando usa credentials (HttpOnly cookies), * é inválido!");
  console.log("Configure CORS no Backend com origem específica.");
  console.groupEnd();
}

/**
 * Adicionar interceptador para debug de CORS em desenvolvimento
 */
export function configurarDebugCORS(apiClient) {
  if (process.env.NODE_ENV === "development") {
    apiClient.interceptors.response.use(
      (response) => {
        verificarCORSHeaders(response);
        return response;
      },
      (error) => {
        logErrosCORS(error);
        return Promise.reject(error);
      },
    );
  }
}
