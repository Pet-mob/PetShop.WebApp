import { CRUDService } from "./baseService";

class ServicosEmpresaService extends CRUDService {
  constructor() {
    super("Servicos");
  }

  async buscarServicosEmpresa(idEmpresa) {
    return this.obter("ListaServicosPetShop", { IdEmpresa: idEmpresa });
  }

  async buscarServicosEmpresaPorIdEmpresaEIdServico(idEmpresa, idServico) {
    return this.obter("ListaServicosPetShop", {
      IdEmpresa: idEmpresa,
      IdServico: idServico,
    });
  }

  async atualizarServicoEmpresa(dto) {
    return this.atualizar("", dto);
  }

  async adicionarServicoEmpresa(dto) {
    return this.adicionar("", dto);
  }

  async excluirServicoEmpresa(dto) {
    const { idEmpresa, idServico } = dto;
    return this.deletar("", { idEmpresa, idServico });
  }

  async possoExcluirServico(dto) {
    const { idEmpresa, idServico } = dto;
    return this.deletar("PossoExcluirServico", { idEmpresa, idServico });
  }
}

export default new ServicosEmpresaService();
