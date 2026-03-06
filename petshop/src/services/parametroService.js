import { CRUDService } from "./baseService";

class ParametroService extends CRUDService {
  constructor() {
    super("Parametros");
  }

  async buscarParametro(idEmpresa) {
    return this.obter("", { idEmpresa });
  }

  async atualizarParametros(dto) {
    return this.atualizar("", dto);
  }

  // ALIAS - Manter compatibilidade com typo existente no código
  async ataulizarParametros(dto) {
    return this.atualizarParametros(dto);
  }
}

export default new ParametroService();
