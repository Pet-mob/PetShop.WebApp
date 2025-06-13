import { createRouter, createWebHistory } from "vue-router";
import ConfiguracoesLayoutBase from "@/ui/layout/ConfiguracoesLayoutBase.vue";
import { Settings } from "lucide-vue-next";
import carregarDadosDoMenu from "@/middlewares/carregarDadosDoMenu";

// Import direto, sem children separados:
const routes = [
  {
    path: "/",
    redirect: () => {
      return localStorage.getItem("cnpj") ? "/inicio" : "/login";
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/LoginPage.vue"),
    meta: { menu: false },
  },
  {
    path: "/inicio",
    name: "Inicio",
    component: () => import("@/pages/DashboardPage.vue"),
    meta: { menu: true },
  },
  {
    path: "/agenda",
    name: "Agenda",
    component: () => import("@/pages/AgendaPage.vue"),
    meta: { menu: true },
  },
  {
    path: "/recuperar-senha",
    name: "RecuperarSenha",
    component: () => import("@/pages/RecuperarSenhaPage.vue"),
    meta: { menu: false },
  },

  // 🔧 Rotas de Configurações
  {
    path: "/configuracoes",
    component: ConfiguracoesLayoutBase,
    meta: { menu: true, icon: Settings },
    children: [
      {
        path: "dados-petshop",
        name: "ConfigEmpresa",
        component: () => import("@/pages/Configuracoes/PetShopDados.vue"),
        meta: {
          label: "Dados da Empresa",
        },
      },
      {
        path: "horarios-funcionamento",
        name: "ConfigHorarios",
        component: () =>
          import("@/pages/Configuracoes/HorarioFuncionamento.vue"),
        meta: {
          label: "Horários de Funcionamento",
        },
      },
      {
        path: "servicos",
        name: "ConfigServicos",
        component: () => import("@/pages/Configuracoes/PetShopServico.vue"),
        meta: {
          label: "Serviços",
        },
      },
      {
        path: "linkAgendamentos",
        name: "LinkAgendamentos",
        component: () => import("@/pages/Configuracoes/LinkAgendamento.vue"),
        meta: {
          label: "Link de Agendamentos",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(), // pode trocar por createWebHashHistory() em dev
  routes,
});

// Middleware global
router.beforeEach(async (to, from, next) => {
  const loggedIn = !!localStorage.getItem("cnpj");

  if (!loggedIn && to.path !== "/login") {
    return next("/login");
  }

  if (to.path === "/login" && loggedIn) {
    return next("/inicio");
  }

  if (to.path !== "/login") {
    try {
      await carregarDadosDoMenu(to, from, next);
    } catch (e) {
      console.error("Erro ao carregar dados do menu:", e);
    }
  } else {
    next();
  }
});

export default router;
