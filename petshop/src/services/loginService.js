import { CRUDService } from "./baseService";

class LoginService extends CRUDService {
  constructor() {
    super("Usuario");
  }

  async validarLogin(cnpj, senha) {
    const loginDto = {
      cnpj: cnpj,
      senha: senha,
    };
    return this.adicionar("Login", loginDto);
  }
}

export default new LoginService();
