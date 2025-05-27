<template>
  <section class="secao-servicos">
    <header class="cabecalho-secao">
      <h1 class="titulo">Serviços</h1>
      <button class="botao-adicionar" @click="abrirModalNovo">Adicionar Serviço</button>
    </header>

    <div class="lista-grid">
      <article v-for="servico in servicos" :key="servico.id" class="item-grid">
        <div class="info-servico">
          <h2 class="nome-servico">{{ servico.nome }}</h2>
          <p class="detalhe-servico">{{ servico.descricao }}</p>
          <p class="detalhe-servico"><strong>Preço:</strong> R$ {{ servico.preco.toFixed(2) }}</p>
          <p class="detalhe-servico">
            <strong>Status:</strong> {{ servico.ativo ? 'Ativo' : 'Inativo' }}
          </p>
        </div>
        <button class="botao-editar" @click="abrirModalEditar(servico)">Editar</button>
      </article>
    </div>

    <ModalGenerico
      v-if="modalAberto"
      :titulo="modalTitulo"
      @fechar="fecharModal"
    >
      <FormularioServico
        :dadosIniciais="servicoSelecionado"
        :botaoTexto="botaoTextoModal"
        @salvar="salvarServico"
      />
    </ModalGenerico>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ModalGenerico from '@/components/ModalBase.vue'
import FormularioServico from '@/views/FormularioServico.vue'

const servicos = ref([
  { id: 1, nome: 'Banho e Tosa', descricao: 'Banho completo e tosa', preco: 120.0, ativo: true },
  { id: 2, nome: 'Vacinação', descricao: 'Vacinas essenciais para seu pet', preco: 80.0, ativo: true },
  { id: 3, nome: 'Vacinação', descricao: 'Vacinas essenciais para seu pet', preco: 80.0, ativo: true },
  { id: 4, nome: 'Vacinação', descricao: 'Vacinas essenciais para seu pet', preco: 80.0, ativo: true },
  { id: 5, nome: 'Vacinação', descricao: 'Vacinas essenciais para seu pet', preco: 80.0, ativo: true },
  { id: 6, nome: 'Vacinação', descricao: 'Vacinas essenciais para seu pet', preco: 80.0, ativo: true }
])

const modalAberto = ref(false)
const servicoSelecionado = ref(null)
const modalTitulo = ref('')
const botaoTextoModal = ref('')

function abrirModalNovo() {
  servicoSelecionado.value = { nome: '', descricao: '', preco: 0, ativo: true }
  modalTitulo.value = 'Adicionar Serviço'
  botaoTextoModal.value = 'Adicionar'
  modalAberto.value = true
}

function abrirModalEditar(servico) {
  servicoSelecionado.value = { ...servico }
  modalTitulo.value = 'Editar Serviço'
  botaoTextoModal.value = 'Salvar'
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
}

function salvarServico(dados) {
  if (servicoSelecionado.value && servicoSelecionado.value.id) {
    // Editar
    const index = servicos.value.findIndex(s => s.id === servicoSelecionado.value.id)
    if (index !== -1) servicos.value[index] = { ...dados, id: servicoSelecionado.value.id }
  } else {
    // Adicionar
    const novoId = Math.max(0, ...servicos.value.map(s => s.id)) + 1
    servicos.value.push({ ...dados, id: novoId })
  }
  fecharModal()
}
</script>

<style scoped>
.secao-servicos {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.cabecalho-secao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.75rem;
  font-weight: 700;
}

.botao-adicionar {
  background-color: #28a745;
  color: branco;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.botao-adicionar:hover {
  background-color: #218838;
}

.lista-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.item-grid {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.info-servico {
  margin-bottom: 1rem;
}

.nome-servico {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.detalhe-servico {
  margin: 0.1rem 0;
}

.botao-editar {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: #ffc107;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.botao-editar:hover {
  background-color: #e0a800;
}


</style>
