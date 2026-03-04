import { statusAgendamentoEnum } from "@/utils/statusAgendamentoEnum";
import { CRUDService } from "./baseService";

class AgendaService extends CRUDService {
  constructor() {
    super("Agendamento");
  }

  async buscarAgendamentosPendentes(idEmpresa) {
    return this.obter("AgendamentosPendentes", { IdEmpresa: idEmpresa });
  }

  async buscarAgendamentoPorId(idAgendamento) {
    return this.obter("", { IdAgendamento: idAgendamento });
  }

  async buscarAgenda(dto) {
    return this.adicionar("Agenda", dto);
  }

  async atualizarStatusAgendamento(idAgendamento, idStatusAgendamento) {
    return this.atualizar("AtualizarStatus", {
      idAgendamento,
      idStatusAgendamento,
    });
  }

  async cancelarAgendamento(idAgendamento) {
    return this.atualizarStatusAgendamento(
      idAgendamento,
      statusAgendamentoEnum.CANCELADO,
    );
  }

  async confirmarAgendamento(idAgendamento) {
    return this.atualizarStatusAgendamento(
      idAgendamento,
      statusAgendamentoEnum.CONCLUIDO,
    );
  }
}

export default new AgendaService();
