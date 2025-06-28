import apiClient from "@/services/apiClient";

const PARAMS_ENDPOINT = "/parametrosEmpresa";

export default {
  async buscarParametros(idEmpresa) {
    const { data } = await apiClient.get(`${PARAMS_ENDPOINT}/${idEmpresa}`);
    return data;
  },
  async salvarParametros(parametros) {
    const { data } = await apiClient.post(PARAMS_ENDPOINT, parametros);
    return data;
  },
};
