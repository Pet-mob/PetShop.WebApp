import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { menu: false }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { menu: true }
    },
    {
        path: '/agenda',
        name: 'Agenda',
        component: () => import('@/views/AgendaView.vue'),
        meta: { menu: true }
    },
    {
        path: '/fluxo-de-caixa',
        name: 'FluxoDeCaixa',
        component: () => import('@/views/FluxoDeCaixa.vue'),
        meta: { menu: true }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: { menu: false }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    if (to.path !== '/login' && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router
