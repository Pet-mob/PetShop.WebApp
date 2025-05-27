<template>
  <form class="formulario-container" @submit.prevent="enviarFormulario">
    <div class="linha-formulario">
      <div class="campo-formulario flex2">
        <label for="nome" class="label-formulario">Nome do Serviço</label>
        <input
          id="nome"
          v-model="dados.nome"
          type="text"
          class="campo-texto"
          placeholder="Ex: Banho e Tosa"
          required
        />
      </div>
      <div class="campo-formulario flex1">
        <label for="preco" class="label-formulario">Preço (R$)</label>
        <input
          id="preco"
          v-model.number="dados.preco"
          type="number"
          class="campo-texto"
          placeholder="Ex: 120.00"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div class="campo-formulario flex1">
        <label for="duracao" class="label-formulario">Duração (min)</label>
        <input
          id="duracao"
          v-model="dados.duracao"
          type="number"
          class="campo-texto"
        />
      </div>
    </div>

    <div class="grupo-formulario">
      <label for="ativo" class="grupo-checkbox">
        <input
          id="ativo"
          v-model="dados.ativo"
          type="checkbox"
          class="caixa-checkbox"
        />
        Serviço Ativo
      </label>
    </div>

    <button type="submit" class="botao-principal">
      {{ botaoTexto }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  dadosIniciais: {
    type: Object,
    default: () => ({
      nome: "",
      duracao: 0,
      preco: 0,
      ativo: true,
    }),
  },
  botaoTexto: {
    type: String,
    default: "Salvar",
  },
});

const emit = defineEmits(["salvar"]);

const dados = ref({ ...props.dadosIniciais });

watch(
  () => props.dadosIniciais,
  (novo) => {
    dados.value = { ...novo };
  }
);

function enviarFormulario() {
  emit("salvar", { ...dados.value });
}
</script>

<style scoped>
.formulario-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.linha-formulario {
  display: flex;
  text-align: left;
  gap: 1rem;
  flex-wrap: wrap;
}

.campo-formulario {
  display: flex;
  flex-direction: column;
}

.flex2 {
  flex: 2;
  min-width: 200px;
}

.flex1 {
  flex: 1;
  min-width: 120px;
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

.grupo-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.caixa-checkbox {
  margin: 0;
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
