<template>
  <div class="horario-funcionamento">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetON v-if="carregando" />

    <!-- Conteúdo principal -->
    <div v-else>
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

          <div v-if="horarios[dia.value]?.ativo" class="horario-container">
            <div class="picker-container">
              <label>Abertura</label>
              <select v-model="horarios[dia.value].abertura">
                <option
                  v-for="opcao in opcoesDeHorario"
                  :key="opcao.value"
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
            </div>

            <div class="picker-container">
              <label>Fechamento</label>
              <select v-model="horarios[dia.value].fechamento">
                <option
                  v-for="opcao in opcoesDeHorario"
                  :key="opcao.value"
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão de salvar -->
      <button class="botao-salvar" @click="salvarHorarios">
        Salvar Horários
      </button>
    </div>

    <!-- Toast de mensagens -->
    <Toast :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import empresaService from "@/services/empresaService";
import { useGlobalStore } from "@/store/useGlobalStore";
import LoadingPetON from "@/components/LoadingPetON.vue";
import Toast from "@/components/ToastCustomizado.vue";

const store = useGlobalStore();
const empresaLogada = store.empresaLogada;
const idEmpresaLogada = empresaLogada.idEmpresa;

const carregando = ref(false);
const toastMessage = ref("");
const toastType = ref("info");

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

const diasDaSemana = [
  { label: "Segunda-feira", value: "segunda" },
  { label: "Terça-feira", value: "terca" },
  { label: "Quarta-feira", value: "quarta" },
  { label: "Quinta-feira", value: "quinta" },
  { label: "Sexta-feira", value: "sexta" },
  { label: "Sábado", value: "sabado" },
  { label: "Domingo", value: "domingo" },
];

const opcoesDeHorario = [
  { label: "08:00", value: "08:00" },
  { label: "09:00", value: "09:00" },
  { label: "10:00", value: "10:00" },
  { label: "11:00", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "13:00", value: "13:00" },
  { label: "14:00", value: "14:00" },
  { label: "15:00", value: "15:00" },
  { label: "16:00", value: "16:00" },
  { label: "17:00", value: "17:00" },
  { label: "18:00", value: "18:00" },
];

const horarios = reactive({
  segunda: { ativo: false, abertura: "", fechamento: "" },
  terca: { ativo: false, abertura: "", fechamento: "" },
  quarta: { ativo: false, abertura: "", fechamento: "" },
  quinta: { ativo: false, abertura: "", fechamento: "" },
  sexta: { ativo: false, abertura: "", fechamento: "" },
  sabado: { ativo: false, abertura: "", fechamento: "" },
  domingo: { ativo: false, abertura: "", fechamento: "" },
});

onMounted(async () => {
  await buscarHorariosDeFuncionamentoDaEmpresa();
});

async function buscarHorariosDeFuncionamentoDaEmpresa() {
  carregando.value = true;
  try {
    const data = await empresaService.buscarHorarioFuncionamentoEmpresa(
      idEmpresaLogada
    );

    for (const entrada of data) {
      const chave = mapearNomeDiaParaChave(entrada.nomeDiaSemana);
      horarios[chave] = {
        ativo: entrada.funcionaNesseDia,
        abertura: entrada.horarioAbertura.slice(0, 5),
        fechamento: entrada.horarioFechamento.slice(0, 5),
      };
    }

    // showToast("Horários carregados com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao carregar horários de funcionamento", "error");
  } finally {
    carregando.value = false;
  }
}

function mapearNomeDiaParaChave(nomeDia) {
  const mapa = {
    "Segunda-feira": "segunda",
    "Terça-feira": "terca",
    "Quarta-feira": "quarta",
    "Quinta-feira": "quinta",
    "Sexta-feira": "sexta",
    Sábado: "sabado",
    Domingo: "domingo",
  };
  return mapa[nomeDia];
}

async function salvarHorarios() {
  carregando.value = true;

  const configuracoes = [];

  for (const dia of diasDaSemana) {
    const valor = horarios[dia.value];
    configuracoes.push({
      idEmpresa: idEmpresaLogada,
      nomeDiaSemana: dia.label,
      funcionaNesseDia: valor.ativo,
      horarioAbertura: valor.abertura + ":00",
      horarioFechamento: valor.fechamento + ":00",
      intervaloEntreServicos: 0,
    });
  }

  try {
    await empresaService.atualizarHorariosFuncionamentoEmpresa(configuracoes);
    showToast("Horários salvos com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao salvar horários. Tente novamente.", "error");
    console.error(error);
  } finally {
    carregando.value = false;
  }
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
  background-color: #28a745;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
}
</style>
