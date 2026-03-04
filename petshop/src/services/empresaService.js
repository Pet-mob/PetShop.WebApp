import { CRUDService } from "./baseService";

class EmpresaService extends CRUDService {
  constructor() {
    super("Empresa");
  }

  async buscarEmpresa(cnpj) {
    return this.obter("", { cnpj });
  }

  async buscarHorariosFuncionamento(idEmpresa) {
    return this.obter("HorariosFuncionamento", { IdEmpresa: idEmpresa });
  }

  async buscarLogos(idEmpresa) {
    return this.obter("BuscarLogosEmpresas", { idEmpresa });
  }

  async buscarCapas(idEmpresa) {
    return this.obter("BuscarCapasEmpresas", { idEmpresa });
  }

  async enviarLogo(imagem, idEmpresa) {
    const formData = new FormData();
    formData.append("arquivo", imagem);
    formData.append("idEmpresa", idEmpresa);

    return this.adicionarComArquivo("EnviarLogoEmpresa", formData);
  }

  async enviarCapa(imagem, idEmpresa) {
    const formData = new FormData();
    formData.append("arquivo", imagem);
    formData.append("idEmpresa", idEmpresa);

    return this.adicionarComArquivo("EnviarCapaEmpresa", formData);
  }

  async atualizarHorariosFuncionamento(dto) {
    return this.atualizar("AtualizarHorariosFuncionamento", dto);
  }

  async atualizarDadosEmpresa(dto) {
    return this.atualizar("", dto);
  }

  // ALIASES - Manter compatibilidade com código existente
  async buscarHorarioFuncionamentoEmpresa(idEmpresa) {
    return this.buscarHorariosFuncionamento(idEmpresa);
  }

  async buscarLogoEmpresa(idEmpresa) {
    return this.buscarLogos(idEmpresa);
  }

  async buscarCapaEmpresa(idEmpresa) {
    return this.buscarCapas(idEmpresa);
  }

  async enviarLogoEmpresaPorIdEmpresa(imagem, idEmpresa) {
    return this.enviarLogo(imagem, idEmpresa);
  }

  async enviarCapaEmpresaPorIdEmpresa(imagem, idEmpresa) {
    return this.enviarCapa(imagem, idEmpresa);
  }

  async atualizarHorariosFuncionamentoEmpresa(dto) {
    return this.atualizarHorariosFuncionamento(dto);
  }
}

export default new EmpresaService();
