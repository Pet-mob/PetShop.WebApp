import { Clock, Scissors, Building2 } from 'lucide-vue-next'

export default [
    {
        path: 'horarios-funcionamento',
        name: 'ConfigHorarios',
        component: () => import('@/pages/Configuracoes/PetShopFuncionamento.vue'),
        meta: {
            label: 'Horários de Funcionamento',
            icon: Clock
        }
    },
    {
        path: 'servicos',
        name: 'ConfigServicos',
        component: () => import('@/pages/Configuracoes/PetShopServico.vue'),
        meta: {
            label: 'Serviços',
            icon: Scissors
        }
    },
    {
        path: 'dados-petshop',
        name: 'ConfigEmpresa',
        component: () => import('@/pages/Configuracoes/PetShopDados.vue'),
        meta: {
            label: 'Dados da Empresa',
            icon: Building2
        }

    }
]
