import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const atualizarDadosEmpresa = (dto) => {
  return new Promise((resolve, reject) => {
    apiClient
      .put("Empresa", dto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const atualizarHorariosFuncionamentoEmpresa = (dto) => {
  return new Promise((resolve, reject) => {
    apiClient
      .put("Empresa/AtualizarHorariosFuncionamento", dto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const buscarLogoEmpresa = (idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Empresa/BuscarLogosEmpresas", {
        params: { idEmpresa: idEmpresaParam },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const buscarCapaEmpresa = (idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("Empresa/BuscarCapasEmpresas", {
        params: { idEmpresa: idEmpresaParam },
      })
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

const enviarLogoEmpresaPorIdEmpresa = async (imagem, idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("arquivo", imagem);
    formData.append("idEmpresa", idEmpresaParam);

    apiClient
      .post("Empresa/EnviarLogoEmpresa", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

const enviarCapaEmpresaPorIdEmpresa = async (imagem, idEmpresaParam) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("arquivo", imagem);
    formData.append("idEmpresa", idEmpresaParam);

    apiClient
      .post("Empresa/EnviarCapaEmpresa", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  buscarEmpresa,
  buscarHorarioFuncionamentoEmpresa,
  atualizarHorariosFuncionamentoEmpresa,
  atualizarDadosEmpresa,
  buscarCapaEmpresa,
  buscarLogoEmpresa,
  enviarLogoEmpresaPorIdEmpresa,
  enviarCapaEmpresaPorIdEmpresa,
};
