import { CRUDService } from "./baseService";

class AutenticacaoService extends CRUDService {
  constructor() {
    super("Autenticacao");
  }

  async fazerLogin(cnpj, senha) {
    // Validar entrada
    if (!this._validarCnpj(cnpj) || !senha || senha.length < 8) {
      throw new Error("Dados inválidos");
    }

    // Backend deve fazer hash de senha e validar
    return this.adicionar("Login", { cnpj, senha });
  }

  async fazerLogout() {
    // Backend revoga token
    return this.adicionar("Logout", {});
  }

  _validarCnpj(cnpj) {
    // Implementar validação de CNPJ conforme necessário
    return cnpj && cnpj.length > 0;
  }
}

export default new AutenticacaoService();
