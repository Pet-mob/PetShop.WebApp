<template>
  <form class="formulario-container" @submit.prevent="enviarFormulario">
    <div class="grupo-formulario">
      <div class="linha-formulario">
        <div class="campo-formulario">
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
        <div class="campo-formulario">
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
        <div class="campo-formulario">
          <label for="duracao" class="label-formulario">Duração (min)</label>
          <input
            id="duracao"
            class="campo-texto"
            v-model="dados.duracao"
            type="number"
          />
        </div>
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

// Atualiza local se dadosIniciais mudar
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

.grupo-formulario {
  display: flex;
  flex-direction: column;
}

.label-formulario {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.campo-texto,
.caixa-texto {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  background-color: #f9f9f9;
  font-size: 1rem;
}

.campo-texto:focus,
.caixa-texto:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 3px #28a745;
  background-color: branco;
}

.caixa-texto {
  resize: vertical;
}

.grupo-checkbox {
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.caixa-checkbox {
  margin-right: 0.5rem;
}

.botao-principal {
  background-color: #28a745;
  color: branco;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.botao-principal:hover {
  background-color: #218838;
}

/* Formulário */
.linha-formulario {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.campo-formulario {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.campo-formulario label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.campo-formulario input,
.campo-formulario textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.observacao {
  flex: 1 1 100%;
}
</style>
