<template>
  <div
    class="sobreposicao-modal"
    @click.self="fecharModal"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'titulo-modal'"
    tabindex="-1"
    ref="modalRef"
    @keydown.esc="fecharModal"
  >
    <div class="container-modal" :style="{ maxWidth: props.maxWidth }">
      <header class="cabecalho-modal">
        <h2 class="titulo-modal" :id="'titulo-modal'">{{ props.titulo }}</h2>
        <button
          class="botao-fechar-modal"
          @click="fecharModal"
          aria-label="Fechar modal"
        >
          ×
        </button>
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
import { defineEmits, defineProps, ref, onMounted, nextTick } from "vue";

const props = defineProps({
  titulo: { type: String, default: "Título do Modal" },
  // 👇 novo: permite controlar a largura do modal
  maxWidth: { type: String, default: "500px" },
});

const emit = defineEmits(["fechar"]);
const modalRef = ref(null);

function fecharModal() {
  emit("fechar");
}

onMounted(async () => {
  await nextTick();
  if (modalRef.value) modalRef.value.focus();
});
</script>

<style scoped>
.sobreposicao-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.container-modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cabecalho-modal {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
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
  color: #333;
}
.botao-fechar-modal:hover {
  color: #d00;
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
  background-color: #f9f9f9;
}

@media (max-width: 600px) {
  .container-modal {
    max-width: 95%;
    max-height: 95vh;
  }
  .titulo-modal {
    font-size: 1.1rem;
  }
  .corpo-modal,
  .rodape-modal {
    padding: 0.75rem;
  }
}
</style>
