import {
  Clock,
  Scissors,
  Building2,
  GitCompareArrows,
  Settings2,
} from "lucide-vue-next";

export default [
  {
    path: "dados-petshop",
    name: "ConfigEmpresa",
    component: () => import("@/pages/Configuracoes/PetShopDados.vue"),
    meta: {
      label: "Dados da Empresa",
      icon: Building2,
    },
  },
  {
    path: "horarios-funcionamento",
    name: "ConfigHorarios",
    component: () => import("@/pages/Configuracoes/HorarioFuncionamento.vue"),
    meta: {
      label: "Horários de Funcionamento",
      icon: Clock,
    },
  },
  {
    path: "servicos",
    name: "ConfigServicos",
    component: () => import("@/pages/Configuracoes/PetShopServico.vue"),
    meta: {
      label: "Serviços",
      icon: Scissors,
    },
  },
  {
    path: "linkAgendamentos",
    name: "LinkAgendamentos",
    component: () => import("@/pages/Configuracoes/LinkAgendamento.vue"),
    meta: {
      label: "Link de Agendamentos",
      icon: GitCompareArrows,
    },
  },
  {
    path: "parametros-empresa",
    name: "ConfigParametrosEmpresa",
    component: () => import("@/pages/Configuracoes/ParametrosEmpresa.vue"),
    meta: {
      label: "Parâmetros da Empresa",
      icon: Settings2,
    },
  },
];
