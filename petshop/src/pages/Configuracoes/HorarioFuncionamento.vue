<template>
  <div class="horario-funcionamento">
    <LoadingPetMob v-if="carregando" />

    <div v-else>
      <div class="cabecalho">
        <h2 class="titulo">Configurar horários</h2>
      </div>

      <div class="dias-container">
        <div v-for="dia in diasDaSemana" :key="dia.value" class="dia-card">
          <div class="switch-container">
            <span class="dia-texto">{{ dia.label }}</span>
            <input
              type="checkbox"
              v-model="horarios[dia.value].ativo"
              :aria-label="`Ativar/desativar ${dia.label}`"
            />
          </div>

          <div v-if="horarios[dia.value]?.ativo" class="horario-container">
            <div class="picker-container">
              <label :for="`abertura-${dia.value}`">Abertura</label>
              <select
                v-model="horarios[dia.value].abertura"
                @change="
                  (e) => {
                    formulario.valores[`abertura_${dia.value}`] =
                      e.target.value;
                    formulario.validarAoSair(`abertura_${dia.value}`);
                  }
                "
                :id="`abertura-${dia.value}`"
                :aria-label="`Horário de abertura de ${dia.label}`"
                :class="{
                  'select-erro':
                    formulario.erros.value[`abertura_${dia.value}`],
                }"
              >
                <option value="">Selecione um horário</option>
                <option
                  v-for="opcao in opcoesDeHorario"
                  :key="opcao.value"
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
              <span
                v-if="formulario.erros.value[`abertura_${dia.value}`]"
                class="texto-erro"
              >
                {{ formulario.erros.value[`abertura_${dia.value}`] }}
              </span>
            </div>

            <div class="picker-container">
              <label :for="`fechamento-${dia.value}`">Fechamento</label>
              <select
                v-model="horarios[dia.value].fechamento"
                @change="
                  (e) => {
                    formulario.valores[`fechamento_${dia.value}`] =
                      e.target.value;
                    formulario.validarAoSair(`fechamento_${dia.value}`);
                  }
                "
                :id="`fechamento-${dia.value}`"
                :aria-label="`Horário de fechamento de ${dia.label}`"
                :class="{
                  'select-erro':
                    formulario.erros.value[`fechamento_${dia.value}`],
                }"
              >
                <option value="">Selecione um horário</option>
                <option
                  v-for="opcao in opcoesDeHorario"
                  :key="opcao.value"
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
              <span
                v-if="formulario.erros.value[`fechamento_${dia.value}`]"
                class="texto-erro"
              >
                {{ formulario.erros.value[`fechamento_${dia.value}`] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        class="botao-salvar"
        @click="salvarHorarios"
        aria-label="Salvar horários de funcionamento"
      >
        Salvar Horários
      </button>
    </div>

    <Toast :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import empresaService from "@/services/empresaService";
import { useGlobalStore } from "@/store/useGlobalStore";
import LoadingPetMob from "@/components/LoadingPetMob.vue";
import Toast from "@/components/ToastCustomizado.vue";
import { useErro } from "@/composables/useErro";
import { useFormulario } from "@/composables/useFormulario";
import { useDebounce } from "@/composables/useDebounce";

const store = useGlobalStore();
const { capturar } = useErro();
const empresaLogada = store.empresaLogada;
const idEmpresaLogada = empresaLogada.idEmpresa ?? empresaLogada[0].idEmpresa;

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

// Criar validadores de horário por dia
const validadoresPorDia = {};
diasDaSemana.forEach((dia) => {
  validadoresPorDia[`abertura_${dia.value}`] = (valor) => {
    if (horarios[dia.value].ativo && !valor) {
      return `Horário de abertura obrigatório para ${dia.label}`;
    }
    return null;
  };
  validadoresPorDia[`fechamento_${dia.value}`] = (valor) => {
    if (horarios[dia.value].ativo && !valor) {
      return `Horário de fechamento obrigatório para ${dia.label}`;
    }
    if (horarios[dia.value].ativo && valor && horarios[dia.value].abertura) {
      if (valor <= horarios[dia.value].abertura) {
        return `Fechamento deve ser após abertura para ${dia.label}`;
      }
    }
    return null;
  };
});

const formulario = useFormulario(validadoresPorDia);

onMounted(async () => {
  await buscarHorariosDeFuncionamentoDaEmpresa();
});

async function buscarHorariosDeFuncionamentoDaEmpresa() {
  carregando.value = true;
  try {
    const data = await empresaService.buscarHorarioFuncionamentoEmpresa(
      idEmpresaLogada,
    );

    for (const entrada of data) {
      const chave = mapearNomeDiaParaChave(entrada.nomeDiaSemana);
      horarios[chave] = {
        ativo: entrada.funcionaNesseDia,
        abertura: entrada.horarioAbertura.slice(0, 5),
        fechamento: entrada.horarioFechamento.slice(0, 5),
      };

      // Preencher os valores do formulário
      formulario.definirValores({
        [`abertura_${chave}`]: entrada.horarioAbertura.slice(0, 5),
        [`fechamento_${chave}`]: entrada.horarioFechamento.slice(0, 5),
      });
    }
  } catch (e) {
    capturar(e, { acao: "buscarHorariosDeFuncionamento" });
    showToast(
      e.message || "Erro ao carregar horários de funcionamento",
      "error",
    );
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

function validarHorarios() {
  // Validar usando o formulário
  return formulario.validarFormulario();
}

// Função salvar horários sem debounce (base)
const salvarHorariosSemDebounce = async () => {
  if (!validarHorarios()) {
    // Mostrar o primeiro erro encontrado
    const errosEncontrados = Object.values(formulario.erros.value).filter(
      (e) => e,
    );
    if (errosEncontrados.length > 0) {
      showToast(errosEncontrados[0], "error");
    }
    return;
  }
  carregando.value = true;

  const configuracoes = [];

  for (const dia of diasDaSemana) {
    const valor = horarios[dia.value];
    configuracoes.push({
      idEmpresa: idEmpresaLogada,
      nomeDiaSemana: dia.label,
      funcionaNesseDia: valor.ativo,
      horarioAbertura: valor.abertura,
      horarioFechamento: valor.fechamento,
      intervaloEntreServicos: 0,
    });
  }
  // Limpar horários dos dias desativados
  for (const dia of diasDaSemana) {
    if (!horarios[dia.value].ativo) {
      horarios[dia.value].abertura = "";
      horarios[dia.value].fechamento = "";
    }
  }
  try {
    await empresaService.atualizarHorariosFuncionamentoEmpresa(configuracoes);
    showToast("Horários salvos com sucesso!", "success");
  } catch (e) {
    capturar(e, { acao: "salvarHorarios" });
    showToast(
      e.message || "Erro ao salvar horários. Tente novamente.",
      "error",
    );
  } finally {
    carregando.value = false;
  }
};

// Proteger com debounce de 500ms
const salvarHorarios = useDebounce(salvarHorariosSemDebounce, 500);
</script>

<style scoped>
.horario-funcionamento {
  padding: 20px 10px;
  padding-bottom: 70px;
  max-width: 480px;
  margin: 0 auto;
}

.cabecalho {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.titulo {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.dias-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dia-card {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dia-texto {
  font-weight: 500;
  font-size: 16px;
}

.horario-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  gap: 10px;
}

.picker-container {
  flex: 1 1 45%;
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
  margin-top: 25px;
  padding: 14px;
  background-color: #28a745;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.botao-salvar:hover {
  background-color: #218838;
}

/* Responsividade para telas pequenas */
@media (max-width: 400px) {
  .titulo {
    font-size: 18px;
  }

  .dia-texto {
    font-size: 14px;
  }

  .picker-container {
    flex: 1 1 100%;
  }

  select {
    font-size: 14px;
  }

  .botao-salvar {
    font-size: 16px;
    padding: 12px;
  }
}

.select-erro {
  border-color: #d32f2f !important;
  background-color: #ffebee !important;
}

.texto-erro {
  font-size: 0.85rem;
  color: #d32f2f;
  margin-top: 4px;
  text-align: left;
}
</style>
