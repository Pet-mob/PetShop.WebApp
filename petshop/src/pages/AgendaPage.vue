<template>
    <!-- Abas de Visualização -->
    <div class="tabs mb-6">
        <button :class="['tab-btn', { active: visualizacao === 'semanal' }]" @click="visualizacao = 'semanal'">
            Semanal
        </button>
        <button :class="['tab-btn', { active: visualizacao === 'mensal' }]" @click="visualizacao = 'mensal'">
            Mensal
        </button>
    </div>
    <div>
        <AgendaSemanal v-if="visualizacao === 'semanal'" />
        <AgendaMensal v-else />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AgendaSemanal from '@/components/Agenda/AgendaSemanal.vue'
import AgendaMensal from '@/components/Agenda/AgendaMensal.vue'

const visualizacao = ref('semanal')
</script>

<style>
/* Tabs */
.tabs {
    display: flex;
    justify-content: left;
    padding: 1.5rem;
}

.tab-btn {
    background: transparent;
    border: none;
    border-bottom: 4px solid transparent;
    padding: 0.5rem 1.5rem;
    margin: 0 0.75rem;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-btn:hover {
    color: #000000;
}

.tab-btn.active {
    border-bottom-color: #000000;
    color: #000000;
}
</style>