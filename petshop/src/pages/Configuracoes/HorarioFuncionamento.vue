<template>
  <div class="horario-funcionamento">
    <!-- Cabeçalho -->
    <div class="cabecalho">
      <h2 class="titulo">Configurar horários</h2>
    </div>

    <!-- Lista de dias -->
    <div class="dias-container">
      <div v-for="dia in diasDaSemana" :key="dia.value" class="dia-card">
        <div class="switch-container">
          <span class="dia-texto">{{ dia.label }}</span>
          <input type="checkbox" v-model="horarios[dia.value].ativo" />
        </div>

        <div v-if="horarios[dia.value].ativo" class="horario-container">
          <div class="picker-container">
            <label>Abertura</label>
            <select v-model="horarios[dia.value].abertura">
              <option v-for="opcao in opcoesDeHorario" :key="opcao.value" :value="opcao.value">
                {{ opcao.label }}
              </option>
            </select>
          </div>

          <div class="picker-container">
            <label>Fechamento</label>
            <select v-model="horarios[dia.value].fechamento">
              <option v-for="opcao in opcoesDeHorario" :key="opcao.value" :value="opcao.value">
                {{ opcao.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão de salvar -->
    <button class="botao-salvar" @click="salvarHorarios">Salvar Horários</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const diasDaSemana = [
  { label: 'Segunda-feira', value: 'segunda' },
  { label: 'Terça-feira', value: 'terca' },
  { label: 'Quarta-feira', value: 'quarta' },
  { label: 'Quinta-feira', value: 'quinta' },
  { label: 'Sexta-feira', value: 'sexta' },
  { label: 'Sábado', value: 'sabado' },
  { label: 'Domingo', value: 'domingo' },
];

const opcoesDeHorario = [
  { label: '08:00', value: '08:00' },
  { label: '09:00', value: '09:00' },
  { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' },
  { label: '12:00', value: '12:00' },
  { label: '13:00', value: '13:00' },
  { label: '14:00', value: '14:00' },
  { label: '15:00', value: '15:00' },
  { label: '16:00', value: '16:00' },
  { label: '17:00', value: '17:00' },
  { label: '18:00', value: '18:00' },
];

const horarios = reactive({});

for (const dia of diasDaSemana) {
  horarios[dia.value] = {
    ativo: false,
    abertura: '08:00',
    fechamento: '18:00',
  };
}

function salvarHorarios() {
  const configuracoes = {};
  for (const dia of diasDaSemana) {
    if (horarios[dia.value].ativo) {
      configuracoes[dia.value] = {
        abertura: horarios[dia.value].abertura,
        fechamento: horarios[dia.value].fechamento,
      };
    }
  }
  console.log('Horários salvos:', configuracoes);
  alert('Horários salvos com sucesso!');
}
</script>

<style scoped>
.horario-funcionamento {
  padding: 20px;
}

.cabecalho {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.botao-voltar {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  font-size: 24px;
}

.titulo {
  flex: 1;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.dias-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dia-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dia-texto {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.horario-container {
  display: flex;
  margin-top: 15px;
  gap: 10px;
}

.picker-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  color: #777;
  margin-bottom: 5px;
}

select {
  padding: 8px;
  border-radius: 5px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  font-size: 16px;
}

.botao-salvar {
  margin-top: 30px;
  padding: 15px;
  background-color: #28A745;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
}
</style>
