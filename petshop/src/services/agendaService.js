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

const atualizarStatusAgendamento = (
  idAgendamento,
  status,
  justificativa = null
) => {
  const atualizacaoDto = {
    idAgendamento,
    status,
    justificativa,
  };
  return new Promise((resolve, reject) => {
    apiClient
      .put("Agendamento/AtualizarStatus", atualizacaoDto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const buscarAgendamentoPorId = (idAgendamento) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`Agendamento/${idAgendamento}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarAgenda,
  atualizarStatusAgendamento,
  buscarAgendamentoPorId,
};
