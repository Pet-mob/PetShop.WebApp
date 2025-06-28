<template>
  <section class="secao-parametros">
    <h1 class="titulo">Parâmetros da Empresa</h1>
    <form
      @submit.prevent="salvar"
      class="form-parametros"
      aria-label="Formulário de parâmetros da empresa"
    >
      <div class="campo-formulario">
        <label for="qtde" class="label-formulario"
          >Qtde. Atendimento Simultâneo por Horário</label
        >
        <input
          id="qtde"
          v-model.number="parametros.qtde_atendimento_simultaneo_horario"
          type="number"
          min="1"
          required
          class="campo-texto"
          aria-label="Quantidade de atendimentos simultâneos por horário"
        />
      </div>
      <div class="campo-formulario">
        <label for="modelo" class="label-formulario"
          >Modelo de Serviço/Trabalho</label
        >
        <select
          id="modelo"
          v-model.number="parametros.id_modelo_servico_trabalho"
          required
          class="campo-texto"
          aria-label="Modelo de serviço/trabalho"
        >
          <option :value="1">Agrupado</option>
          <option :value="2">Separado</option>
        </select>
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
import parametrosService from "@/services/parametrosService";
import { useGlobalStore } from "@/store/useGlobalStore";
import Toast from "@/components/ToastCustomizado.vue";

const store = useGlobalStore();
const idEmpresa = store.empresaLogada.idEmpresa;
const parametros = ref({
  id_empresa: idEmpresa,
  qtde_atendimento_simultaneo_horario: 1,
  id_modelo_servico_trabalho: 1,
});
const toastMessage = ref("");
const toastType = ref("info");

async function carregarParametros() {
  try {
    const data = await parametrosService.buscarParametros(idEmpresa);
    if (data) Object.assign(parametros.value, data);
  } catch (error) {
    toastMessage.value = "Erro ao carregar parâmetros.";
    toastType.value = "error";
  }
}

async function salvar() {
  try {
    await parametrosService.salvarParametros(parametros.value);
    toastMessage.value = "Parâmetros salvos com sucesso!";
    toastType.value = "success";
  } catch (error) {
    toastMessage.value = "Erro ao salvar parâmetros.";
    toastType.value = "error";
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
</style>
