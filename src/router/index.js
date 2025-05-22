import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MenuView from '@/views/MenuView.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/menu', name: 'Menu', component: MenuView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token') // ou outra verificação

    if (to.path !== '/login' && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})


export default router
