import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const buscarParametro = (idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`Parametros?idEmpresa=${idEmpresaParam}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const ataulizarParametros = (dto) => {
  return new Promise((resolve, reject) => {
    apiClient
      .put("Parametros", dto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarParametro,
  ataulizarParametros,
};
