import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const buscarDashboard = (dataParam, idEmpresaParam) => {
  const dashboardDto = {
    dataFiltro: dataParam,
    idEmpresa: idEmpresaParam,
  };
  return new Promise((resolve, reject) => {
    apiClient
      .post("Agendamento/Dashboard", dashboardDto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarDashboard,
};
