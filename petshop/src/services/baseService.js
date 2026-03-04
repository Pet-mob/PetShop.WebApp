import apiClient from "./apiClient";

export class CRUDService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * GET com parâmetros na QueryString [FromQuery]
   * Uso: buscar e filtrar dados
   * @param {string} acao - Nome do método/ação no controller
   * @param {object} parametros - Parâmetros da query
   */
  async obter(acao = "", parametros = {}) {
    const url = this._construirUrl(acao);
    const response = await apiClient.get(url, { params: parametros });
    return response.data;
  }

  /**
   * POST - Parâmetros no corpo (JSON) [FromBody]
   * Uso: criar, processar dados complexos
   * @param {string} acao - Nome do método/ação no controller
   * @param {object} dados - Dados do corpo da requisição
   * @param {object} config - Configurações axios (headers, etc)
   */
  async adicionar(acao = "", dados = {}, config = {}) {
    const url = this._construirUrl(acao);
    const response = await apiClient.post(url, dados, config);
    return response.data;
  }

  /**
   * POST - FormData para upload de arquivos [FromForm]
   * Uso: upload de imagens, logos, fotos, etc
   * @param {string} acao - Nome do método/ação no controller
   * @param {FormData} arquivo - FormData com arquivo
   * @param {object} parametros - Parâmetros adicionais na query
   */
  async adicionarComArquivo(acao = "", arquivo, parametros = {}) {
    const url = this._construirUrl(acao);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      params: parametros,
    };
    const response = await apiClient.post(url, arquivo, config);
    return response.data;
  }

  /**
   * POST - Parâmetros na QueryString [FromQuery] + Dados no corpo [FromBody]
   * Uso: quando a API espera dados tanto na query quanto no body
   * @param {string} acao - Nome do método/ação no controller
   * @param {object} dados - Dados do corpo
   * @param {object} parametros - Parâmetros na query
   */
  async adicionarComConsulta(acao = "", dados = {}, parametros = {}) {
    const url = this._construirUrl(acao);
    const response = await apiClient.post(url, dados, { params: parametros });
    return response.data;
  }

  /**
   * PUT - Parâmetros no corpo (JSON) [FromBody]
   * Uso: atualizar dados
   * @param {string} acao - Nome do método/ação no controller
   * @param {object} dados - Dados a atualizar
   */
  async atualizar(acao = "", dados = {}) {
    const url = this._construirUrl(acao);
    const response = await apiClient.put(url, dados);
    return response.data;
  }

  /**
   * PUT - Parâmetros na QueryString [FromQuery] + Dados no corpo [FromBody]
   * Uso: quando a API espera dados tanto na query quanto no body
   * @param {string} acao - Nome do método/ação no controller
   * @param {object} dados - Dados do corpo
   * @param {object} parametros - Parâmetros na query
   */
  async atualizarComConsulta(acao = "", dados = {}, parametros = {}) {
    const url = this._construirUrl(acao);
    const response = await apiClient.put(url, dados, { params: parametros });
    return response.data;
  }

  /**
   * DELETE com parâmetros na QueryString [FromQuery]
   * Uso: deletar dados
   * @param {string} acao - Nome do método/ação no controller
   * @param {object} parametros - Parâmetros da query
   */
  async deletar(acao = "", parametros = {}) {
    const url = this._construirUrl(acao);
    const response = await apiClient.delete(url, { params: parametros });
    return response.data;
  }

  /**
   * Helper privado para construir a URL
   * @private
   */
  _construirUrl(acao) {
    return acao ? `${this.endpoint}/${acao}` : this.endpoint;
  }
}
