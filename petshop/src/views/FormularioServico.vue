<template>
  <form class="formulario-container" @submit.prevent="enviarFormulario" novalidate role="form"
    aria-label="Formulário de serviço">
    <!-- Linha: Nome, Porte, Duração -->
    <div class="linha-formulario">
      <div class="campo-formulario flex2">
        <label for="nome" class="label-formulario">Nome do Serviço</label>
        <input id="nome" v-model="dados.descricao" type="text" class="campo-texto" placeholder="Ex: Banho e Tosa" required
          aria-label="Nome do serviço" :aria-invalid="erros.descricao ? 'true' : 'false'" />
        <span v-if="erros.descricao" class="mensagem-erro" role="alert">{{
          erros.descricao
        }}</span>
      </div>
      <div class="campo-formulario flex1">
        <label for="porte" class="label-formulario">Porte do Animal</label>
        <select id="porte" v-model.number="dados.idPorte" class="campo-texto" placeholder="Selecione o porte" required
          aria-label="Porte do animal" :aria-invalid="erros.idPorte ? 'true' : 'false'">
          <option value="0">Todos</option>
          <option value="1">Pequeno</option>
          <option value="2">Médio</option>
          <option value="3">Grande</option>
        </select>
        <span v-if="erros.idPorte" class="mensagem-erro" role="alert">{{
          erros.idPorte
        }}</span>
      </div>
      <div class="campo-formulario flex1">
        <label for="duracao" class="label-formulario">Duração (min)</label>
        <input id="duracao" v-model.number="dados.duracao" type="number" class="campo-texto" min="1" required
          aria-label="Duração do serviço em minutos" :aria-invalid="erros.duracao ? 'true' : 'false'" />
        <span v-if="erros.duracao" class="mensagem-erro" role="alert">{{
          erros.duracao
        }}</span>
      </div>
    </div>

    <!-- Linha: Preço, Mensalidade -->
    <div class="linha-formulario">
      <div class="campo-formulario flex1">
        <label for="preco" class="label-formulario">Preço (R$)</label>
        <input id="preco" v-model.number="dados.valor" type="number" class="campo-texto" placeholder="Ex: 120.00" min="0"
          step="0.01" required aria-label="Preço do serviço" :aria-invalid="erros.valor ? 'true' : 'false'" />
        <span v-if="erros.valor" class="mensagem-erro" role="alert">{{
          erros.valor
        }}</span>
      </div>
      <!-- <div class="campo-formulario flex2 mensalidade-group">
        <div class="mensalidade-flex">
          <label class="checkbox-container" aria-label="Possui mensalidade?">
            <input
              type="checkbox"
              v-model="dados.possuiMensal"
              aria-checked="dados.possuiMensal ? 'true' : 'false'"
            />
            <span class="checkmark"></span>
            Possui mensal
          </label>
          <transition name="fade">
            <div v-if="dados.possuiMensal" class="mensalidade-valor">
              <label for="valorOferta" class="label-formulario"
                >Valor do mensal</label
              >
              <input
                id="valorOferta"
                v-model.number="dados.precoMensal"
                type="number"
                step="0.01"
                class="campo-texto"
                min="0"
                aria-label="Valor do mensal"
              />
            </div>
          </transition>
        </div>
      </div> -->
    </div>

    <!-- Linha: Observação -->
    <div class="linha-formulario">
      <div class="campo-formulario flex2">
        <label for="observacao" class="label-formulario">Observação</label>
        <textarea id="observacao" v-model="dados.observacao" rows="2" class="campo-texto"
          aria-label="Observação do serviço"></textarea>
      </div>
    </div>

    <button type="submit" class="botao-principal" aria-label="Salvar serviço">
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
      descricao: "",
      duracao: 0,
      valor: 0,
      observacao: "",
      possuiMensal: false,
      precoMensal: 0,
      idPorte: 0,
    }),
  },
  botaoTexto: {
    type: String,
    default: "Salvar",
  },
});

const emit = defineEmits(["salvar"]);

const dados = ref({ ...props.dadosIniciais });
const erros = ref({ descricao: "", valor: "", duracao: "", idPorte: "" });

watch(
  () => props.dadosIniciais,
  (novo) => {
    dados.value = { ...novo };
  }
);

function validarCampos() {
  erros.value = { descricao: "", valor: "", duracao: "", porte: "" };
  let valido = true;
  if (!dados.value.descricao || dados.value.descricao.trim().length < 3) {
    erros.value.descricao = "Informe um nome válido para o serviço.";
    valido = false;
  }
  if (
    dados.value.valor === null ||
    dados.value.valor === undefined ||
    isNaN(dados.value.valor) ||
    dados.value.valor < 0
  ) {
    erros.value.valor = "Informe um valor válido (maior ou igual a zero).";
    valido = false;
  }
  if (
    !dados.value.duracao ||
    isNaN(dados.value.duracao) ||
    dados.value.duracao < 1
  ) {
    erros.value.duracao = "Informe a duração em minutos (mínimo 1).";
    valido = false;
  }
  // Corrigido: aceita 0 como válido, só acusa erro se for null ou undefined
  if (dados.value.idPorte === null || dados.value.idPorte === undefined) {
    erros.value.idPorte = "Selecione o porte do animal.";
    valido = false;
  }
  return valido;
}

function enviarFormulario() {
  if (validarCampos()) {
    emit("salvar", { ...dados.value });
  }
}
</script>

<style scoped>
.formulario-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(40, 167, 69, 0.08);
  padding: 2rem 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.linha-formulario {
  display: flex;
  text-align: left;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.campo-formulario {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.2rem;
}

.flex2 {
  flex: 2;
  min-width: 220px;
}

.flex1 {
  flex: 1;
  min-width: 140px;
}

.label-formulario {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #222;
}

.campo-texto {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  background-color: #f9f9f9;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.campo-texto:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 3px #28a745;
  background-color: white;
}

select.campo-texto {
  appearance: none;
  -webkit-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%2328a745" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.2em;
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
  align-self: flex-end;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.08);
}

.botao-principal:hover {
  background-color: #218838;
}

/*checkbox*/
.checkbox-container {
  display: inline-flex;
  align-items: center;
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: 0.2s ease;
}

.checkbox-container input:checked~.checkmark {
  background-color: #28a745;
  border-color: #28a745;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked~.checkmark::after {
  display: block;
}

.mensagem-erro {
  color: #d32f2f;
  font-size: 0.95rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}

.mensalidade-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.mensalidade-flex {
  display: flex;
  align-items: flex-end;
  gap: 1.2rem;
}

.mensalidade-valor {
  display: flex;
  flex-direction: column;
  min-width: 140px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 700px) {
  .formulario-container {
    padding: 1rem 0.5rem;
    max-width: 100%;
  }

  .linha-formulario {
    flex-direction: column;
    gap: 0.7rem;
  }

  .botao-principal {
    width: 100%;
    align-self: stretch;
  }

  .mensalidade-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .mensalidade-valor {
    width: 100%;
    min-width: 0;
  }
}
</style>
