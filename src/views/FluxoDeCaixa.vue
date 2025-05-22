<template>
  <div class="w-full p-4">
    <div class="flex justify-between items-center border-b pb-2 mb-4">
      <div class="flex gap-4 text-sm text-muted-foreground">
        <span :class="{ 'text-primary font-semibold': view === 'Semana' }" @click="view = 'Semana'">Semana</span>
        <span :class="{ 'text-primary font-semibold': view === 'Mês' }" @click="view = 'Mês'">Mês</span>
      </div>
      <div class="flex items-center gap-2 text-lg font-medium">
        <ChevronLeft class="cursor-pointer" @click="previousPeriod" />
        {{ currentMonthLabel }}
        <ChevronRight class="cursor-pointer" @click="nextPeriod" />
      </div>
      <div class="flex gap-2">
        <Select v-model="selectedCompany">
          <SelectTrigger class="w-52">
            <SelectValue placeholder="Empresa(s)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
              {{ empresa.nome }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="selectedConta">
          <SelectTrigger class="w-52">
            <SelectValue placeholder="Caixa/Banco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="conta in contas" :key="conta.id" :value="conta.id">
              {{ conta.nome }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button class="bg-primary text-white">Filtrar</Button>
      </div>
    </div>

    <div v-if="view === 'Mês'" class="grid grid-cols-7 gap-2">
      <div v-for="(dia, index) in diasDoMes" :key="index" class="border rounded p-2">
        <div class="text-sm font-semibold">{{ dia.nome }}</div>
        <div class="text-xs text-muted-foreground">Receitas (R$)</div>
        <div class="text-xs">Previsto: 0,00</div>
        <div class="text-xs font-semibold">Realizado: 0,00</div>
        <div class="text-xs">Saldo: 0,00</div>
        <div class="mt-2 text-xs text-muted-foreground">Despesas (R$)</div>
        <div class="text-xs">Previsto: 0,00</div>
        <div class="text-xs font-semibold">Realizado: 0,00</div>
        <div class="text-xs">Saldo: 0,00</div>
        <div class="mt-2 text-xs text-right text-muted-foreground">{{ dia.numero }}</div>
      </div>
    </div>

    <div v-else class="grid grid-cols-7 gap-2">
      <div v-for="(dia, index) in diasDaSemana" :key="index" class="border rounded p-2">
        <div class="text-sm font-semibold">{{ dia.nome }}</div>
        <div class="text-xs text-muted-foreground">Receitas (R$)</div>
        <div class="text-xs">Previsto: 0,00</div>
        <div class="text-xs font-semibold">Realizado: 0,00</div>
        <div class="text-xs">Saldo: 0,00</div>
        <div class="mt-2 text-xs text-muted-foreground">Despesas (R$)</div>
        <div class="text-xs">Previsto: 0,00</div>
        <div class="text-xs font-semibold">Realizado: 0,00</div>
        <div class="text-xs">Saldo: 0,00</div>
        <div class="mt-2 text-xs text-right text-muted-foreground">{{ dia.numero }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const view = ref('Mês');
const selectedCompany = ref(null);
const selectedConta = ref(null);

const empresas = ref([
  { id: 1, nome: '1 - Pet ON' },
  { id: 2, nome: '2 - LBB Cosméticos' }
]);

const contas = ref([
  { id: 1, nome: 'Conta Corrente' },
  { id: 2, nome: 'Caixa Físico' }
]);

const diasDoMes = ref([
  { nome: 'Domingo', numero: 4 },
  { nome: 'Segunda', numero: 5 },
  { nome: 'Terça', numero: 6 },
  { nome: 'Quarta', numero: 7 },
  { nome: 'Quinta', numero: 8 },
  { nome: 'Sexta', numero: 9 },
  { nome: 'Sábado', numero: 10 },
]);

const diasDaSemana = ref([
  { nome: 'Domingo', numero: 19 },
  { nome: 'Segunda', numero: 20 },
  { nome: 'Terça', numero: 21 },
  { nome: 'Quarta', numero: 22 },
  { nome: 'Quinta', numero: 23 },
  { nome: 'Sexta', numero: 24 },
  { nome: 'Sábado', numero: 25 },
]);

const currentMonthLabel = 'Maio 2025';

function previousPeriod() {
  // lógica para alterar mês ou semana
}

function nextPeriod() {
  // lógica para alterar mês ou semana
}
</script>

<style scoped>
.text-primary {
  color: #6b21a8;
}
</style>
