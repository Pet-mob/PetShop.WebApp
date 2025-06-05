import { createRouter, createWebHistory } from "vue-router";
import ConfiguracoesLayoutBase from "@/ui/layout/ConfiguracoesLayoutBase.vue";
import configuracoesRoutes from "@/router/indexConfiguracoes";
import { Settings } from "lucide-vue-next";
import carregarDadosDoMenu from "@/middlewares/carregarDadosDoMenu";
import { isLoggedIn } from "@/auth";

const routes = [
  {
    path: "/",
    redirect: () => {
      return isLoggedIn() ? "/inicio" : "/login";
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
    beforeEnter: carregarDadosDoMenu,
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

router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn();

  if (to.meta.requiresAuth && !loggedIn) {
    next("/login");
  } else if (to.path === "/login" && loggedIn) {
    next("/inicio");
  } else {
    next();
  }
});

export default router;
