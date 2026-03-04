import { CRUDService } from "./baseService";

class DashboardService extends CRUDService {
  constructor() {
    super("Agendamento");
  }

  async buscarDashboard(data, idEmpresa) {
    const dashboardDto = {
      dataFiltro: data,
      idEmpresa: idEmpresa,
    };
    return this.adicionar("Dashboard", dashboardDto);
  }
}

export default new DashboardService();
