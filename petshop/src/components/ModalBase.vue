<template>
  <div class="sobreposicao-modal" @click.self="fecharModal">
    <div class="container-modal">
      <header class="cabecalho-modal">
        <h2 class="titulo-modal">{{ titulo }}</h2>
        <button class="botao-fechar-modal" @click="fecharModal" aria-label="Fechar modal">×</button>
      </header>
      <section class="corpo-modal">
        <slot></slot>
      </section>
      <footer class="rodape-modal">
        <slot name="rodape"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, /*defineProps*/ } from 'vue'

// const props = defineProps({
//   titulo: {
//     type: String,
//     default: 'Título do Modal'
//   }
// })

const emit = defineEmits(['fechar'])

function fecharModal() {
  emit('fechar')
}
</script>

<style scoped>
.sobreposicao-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.container-modal {
  background: branco;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cabecalho-modal {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo-modal {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.botao-fechar-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.corpo-modal {
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.rodape-modal {
  padding: 1rem;
  border-top: 1px solid #ddd;
  text-align: right;
}
</style>
