import { createRouter, createWebHistory } from "vue-router";
import ConfiguracoesLayoutBase from "@/ui/layout/ConfiguracoesLayoutBase.vue";
import configuracoesRoutes from "@/router/indexConfiguracoes";

import { Settings } from "lucide-vue-next";

const routes = [
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
    path: "/recupera-senha",
    name: "RecuperaSenha",
    component: () => import("@/pages/RecuperaSenhaPage.vue"),
    meta: { menu: false },
  },
  {
    path: "/configuracoes",
    component: ConfiguracoesLayoutBase,
    children: configuracoesRoutes,
    meta: { menu: true, icon: Settings },
  },
  // {
  //   path: '/fluxo-de-caixa',
  //   name: 'FluxoDeCaixa',
  //   component: () => import('@/views/FluxoDeCaixa.vue'),
  //   meta: { menu: true }
  // },
  // {
  //   path: '/',
  //   redirect: '/dashboard'
  // },
  // {
  //   path: '/:catchAll(.*)',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFound.vue'),
  //   meta: { menu: false }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.path !== "/login" && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;

// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

// export default router
