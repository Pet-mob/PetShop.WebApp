<template>
    <div class="flex h-full">
        <!-- Menu lateral -->
        <div class="w-64 bg-gray-100 p-4 border-r border-gray-200">
            <ul class="space-y-2">
                <li v-for="route in configuracoesRoutes" :key="route.path">
                    <RouterLink :to="`/configuracoes/${route.path}`"
                        class="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                        active-class="bg-blue-100 font-semibold">
                        <!-- Ícone -->
                        <component :is="route.meta?.icon" class="w-5 h-5 text-gray-600" />

                        <!-- Label -->
                        <span>{{ route.meta?.label || route.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </div>

        <!-- Área de conteúdo -->
        <div class="flex-1 p-6 overflow-y-auto">
            <RouterView />
        </div>
    </div>
</template>

<script setup>
import configuracoesRoutes from '@/router/indexConfiguracoes'
</script>
