import apiClient from "./apiClient";

export async function fazerLogin(cnpj, senha) {
  // Validar entrada
  if (!validarCnpj(cnpj) || !senha || senha.length < 8) {
    throw new Error("Dados inválidos");
  }

  // Backend deve fazer hash de senha e validar
  const response = await apiClient.post("Autenticacao/Login", {
    cnpj,
    senha,
  });

  // Backend retorna JWT em HttpOnly cookie (automático)
  // Frontend recebe confirmação
  return response.data;
}

export async function fazerLogout() {
  // Backend revoga token
  await apiClient.post("Autenticacao/Logout");
  // Cookie é automaticamente limpo pelo backend
}
