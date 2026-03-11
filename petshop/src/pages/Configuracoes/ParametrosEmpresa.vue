<template>
  <section class="secao-parametros">
    <h1 class="titulo">Parâmetros da Empresa</h1>
    <form
      @submit.prevent="salvar"
      class="form-parametros"
      aria-label="Formulário de parâmetros da empresa"
    >
      <div class="campo-formulario">
        <label for="qtde" class="label-formulario">
          Qtde. Atendimento Simultâneo por Horário
        </label>
        <input
          id="qtde"
          v-model.number="formulario.valores.qtdeAtendimento"
          @blur="() => formulario.validarAoSair('qtdeAtendimento')"
          type="number"
          min="1"
          max="20"
          class="campo-texto"
          :class="{ 'input-erro': formulario.erros.value.qtdeAtendimento }"
          aria-label="Quantidade de atendimentos simultâneos por horário"
        />
        <span v-if="formulario.erros.value.qtdeAtendimento" class="texto-erro">
          {{ formulario.erros.value.qtdeAtendimento }}
        </span>
      </div>
      <div class="campo-formulario">
        <label for="modelo" class="label-formulario">
          Modelo de Serviço/Trabalho
        </label>
        <select
          id="modelo"
          v-model.number="formulario.valores.modeloTrabalho"
          @change="() => formulario.validarAoSair('modeloTrabalho')"
          class="campo-texto"
          :class="{ 'input-erro': formulario.erros.value.modeloTrabalho }"
          aria-label="Modelo de serviço/trabalho"
        >
          <option value="0">Selecione um modelo</option>
          <option :value="1">Seleção única de serviço</option>
          <option :value="2">Seleção simultânea de itens</option>
        </select>
        <span v-if="formulario.erros.value.modeloTrabalho" class="texto-erro">
          {{ formulario.erros.value.modeloTrabalho }}
        </span>
      </div>
      <button
        type="submit"
        class="botao-principal"
        aria-label="Salvar parâmetros"
      >
        Salvar
      </button>
    </form>
    <Toast :message="toastMessage" :type="toastType" />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import parametrosService from "@/services/parametroService";
import { useGlobalStore } from "@/store/useGlobalStore";
import Toast from "@/components/ToastCustomizado.vue";
import { useErro } from "@/composables/useErro";
import { useFormulario } from "@/composables/useFormulario";
import { validarNumero } from "@/utils/validadores";

// Estado e store
const store = useGlobalStore();
const { capturar } = useErro();
const empresaLogada = store.empresaLogada || {};
const idEmpresaLogada = empresaLogada.idEmpresa ?? empresaLogada[0].idEmpresa;

const parametros = ref({
  idEmpresa: idEmpresaLogada,
  qtdeAtendimentoSimultaneoHorario: 1,
  idModeloTrabalho: 1,
});
const toastMessage = ref("");
const toastType = ref("info");

const formulario = useFormulario({
  qtdeAtendimento: (valor) => validarNumero(valor, 1, 20),
  modeloTrabalho: (valor) => {
    if (!valor || valor === 0) return "Modelo de trabalho obrigatório";
    return null;
  },
});

// Toast helper
function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

// Carregar parâmetros existentes
async function carregarParametros() {
  try {
    const data = await parametrosService.buscarParametro(idEmpresaLogada);
    if (data) {
      Object.assign(parametros.value, data);

      // Preencher os valores do formulário
      formulario.definirValores({
        qtdeAtendimento: data.qtdeAtendimentoSimultaneoHorario,
        modeloTrabalho: data.idModeloTrabalho,
      });
    }
  } catch (e) {
    capturar(e, { acao: "carregarParametros" });
    showToast(e.message || "Erro ao carregar parâmetros.", "error");
  }
}

// Salvar parâmetros
async function salvar() {
  if (!formulario.validarFormulario()) {
    showToast(
      Object.values(formulario.erros.value).find((e) => e) ||
        "Preencha todos os campos corretamente.",
      "error",
    );
    return;
  }

  try {
    // Atualizar objeto parametros com os valores do formulário
    parametros.value.qtdeAtendimentoSimultaneoHorario = Number(
      formulario.valores.qtdeAtendimento,
    );
    parametros.value.idModeloTrabalho = Number(
      formulario.valores.modeloTrabalho,
    );

    const resultado = await parametrosService.ataulizarParametros(
      parametros.value,
    );
    if (!resultado) {
      showToast("Erro ao salvar parâmetros.", "error");
      return;
    }
    showToast("Parâmetros salvos com sucesso!", "success");
  } catch (e) {
    capturar(e, { acao: "salvarParametros" });
    showToast(e.message || "Erro ao salvar parâmetros.", "error");
  }
}

onMounted(carregarParametros);
</script>

<style scoped>
.secao-parametros {
  max-width: 500px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.titulo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.form-parametros {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.campo-formulario {
  display: flex;
  flex-direction: column;
}

.label-formulario {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.campo-texto {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  background-color: #f9f9f9;
  font-size: 1rem;
}

.campo-texto:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 3px #28a745;
  background-color: white;
}

.botao-principal {
  background-color: #28a745;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: flex-start;
}

.botao-principal:hover {
  background-color: #218838;
}

.input-erro {
  border-color: #d32f2f !important;
  background-color: #ffebee !important;
}

.texto-erro {
  font-size: 0.85rem;
  color: #d32f2f;
  margin-top: 4px;
}
</style>
