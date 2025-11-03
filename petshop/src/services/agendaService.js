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
) => {
  return new Promise((resolve, reject) => {
    apiClient
      .put("Agendamento/AtualizarStatus?idAgendamento=" + idAgendamento + "&status=" + status)
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

const buscarAgendamentosPendentes = (idEmpresa) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`Agendamento/AgendamentosPendentes?idEmpresa=${idEmpresa}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

const confirmarAgendamento = (idAgendamento) => {
  return atualizarStatusAgendamento(idAgendamento, 1); // 1 = Confirmado
};

const negarAgendamento = (idAgendamento) => {
  return atualizarStatusAgendamento(idAgendamento, 2); // 2 = Negado
};

export const agendaService = {
  buscarAgenda,
  atualizarStatusAgendamento,
  buscarAgendamentoPorId,
  buscarAgendamentosPendentes,
  confirmarAgendamento,
  negarAgendamento,
};
