export default [
    {
        path: 'horarios',
        name: 'ConfigHorarios',
        component: () => import('@/pages/Configuracoes/PetShopFuncionamento.vue'),
        meta: { label: 'Horários' }
    },
    {
        path: 'servicos',
        name: 'ConfigServicos',
        component: () => import('@/pages/Configuracoes/PetShopServico.vue'),
        meta: { label: 'Serviços' }
    },
    {
        path: 'dados-petshop',
        name: 'ConfigEmpresa',
        component: () => import('@/pages/Configuracoes/PetShopDados.vue'),
        meta: { label: 'Dados da Conta' }
    }
]
