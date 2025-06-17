import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const buscarAgenda = (dataInicioParam, dataFimParam, idEmpresaParam) => {
  const dashboardDto = {
    dataFiltroInicio: dataInicioParam,
    dataFiltroFim: dataFimParam,
    idEmpresa: idEmpresaParam,
  };
  return new Promise((resolve, reject) => {
    apiClient
      .post("Agendamento/Agenda", dashboardDto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarAgenda,
};
