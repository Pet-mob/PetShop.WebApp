import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const buscarEmpresa = (cnpjParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Empresa", {
        params: { cnpj: cnpjParam },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarEmpresa,
};
