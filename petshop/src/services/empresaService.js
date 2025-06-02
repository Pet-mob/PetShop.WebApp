import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const atualizarHorariosFuncionamentoEmpresa = (dto) => {
  return new Promise((resolve, reject) => {
    apiClient
      .put("Empresa/HorariosFuncionamento", dto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

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

const buscarHorarioFuncionamentoEmpresa = (idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Empresa/HorariosFuncionamento", {
        params: { IdEmpresa: idEmpresaParam },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarEmpresa,
  buscarHorarioFuncionamentoEmpresa,
  atualizarHorariosFuncionamentoEmpresa,
};
