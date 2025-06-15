import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const buscarServicosEmpresa = (idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Servicos/ListaServicosPetShop", {
        params: { IdEmpresa: idEmpresaParam },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const buscarServicosEmpresaPorIdEmpresaEIdServico = (
  idEmpresaParam,
  idServicoParam
) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Servicos/ListaServicosPetShop", {
        params: { IdEmpresa: idEmpresaParam, IdServico: idServicoParam },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const atualizarServicoEmpresa = (dto) => {
  return new Promise((resolve, reject) => {
    apiClient
      .put("Servicos", dto)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

const adicionarServicoEmpresa = (dto) => {
  return new Promise((resolve, reject) => {
    apiClient
      .post("Servicos", dto)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

const excluirServicoEmpresa = (dto) => {
  const { idEmpresa, idServico } = dto;
  return new Promise((resolve, reject) => {
    apiClient
      .delete(`Servicos?idEmpresa=${idEmpresa}&idServico=${idServico}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export default {
  buscarServicosEmpresa,
  buscarServicosEmpresaPorIdEmpresaEIdServico,
  atualizarServicoEmpresa,
  adicionarServicoEmpresa,
  excluirServicoEmpresa,
};
