import { createRouter, createWebHistory } from "vue-router";
import ConfiguracoesLayoutBase from "@/ui/layout/ConfiguracoesLayoutBase.vue";
import configuracoesRoutes from "@/router/indexConfiguracoes";
import { Settings } from "lucide-vue-next";
import carregarDadosDoMenu from "@/middlewares/carregarDadosDoMenu";

const routes = [
  {
    path: "/",
    redirect: () => {
      // 👇 Isso precisa ser dinâmico
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
  {
    path: "/configuracoes",
    component: ConfiguracoesLayoutBase,
    children: configuracoesRoutes,
    meta: { menu: true, icon: Settings },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const loggedIn = !!localStorage.getItem("cnpj"); // 👈 verificação dinâmica aqui

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
      return next("/erro");
    }
  } else {
    next();
  }
});

export default router;
