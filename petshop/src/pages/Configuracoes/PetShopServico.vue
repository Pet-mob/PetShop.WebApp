<template>
  <section class="secao-servicos">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetMob v-if="carregando" />

    <!-- Conteúdo principal -->
    <div v-else>
      <!-- NOVO BLOCO: Modo de Agendamento -->
      <div class="modelo-trabalho">
        <h2 class="titulo-modelo">Como você deseja oferecer seus serviços?</h2>

        <div class="opcoes-modelo">
          <div
            class="card-modelo"
            :class="{ ativo: modoAgendamento === 'agrupado' }"
            @click="setarModo('agrupado')"
            role="button"
            tabindex="0"
            aria-label="Selecionar modo agrupado"
            @keydown.enter.prevent="setarModo('agrupado')"
            @keydown.space.prevent="setarModo('agrupado')"
          >
            <h3>Serviços Agrupados</h3>
            <p>O cliente escolhe apenas 1 serviço por agendamento.</p>
          </div>

          <div
            class="card-modelo"
            :class="{ ativo: modoAgendamento === 'separado' }"
            @click="setarModo('separado')"
            role="button"
            tabindex="0"
            aria-label="Selecionar modo separado"
            @keydown.enter.prevent="setarModo('separado')"
            @keydown.space.prevent="setarModo('separado')"
          >
            <h3>Serviços Separados</h3>
            <p>O cliente pode marcar vários serviços em uma só vez.</p>
          </div>
        </div>
      </div>

      <!-- Cabeçalho da Seção -->
      <header class="cabecalho-secao">
        <h1 class="titulo">Serviços</h1>
        <button
          class="botao-adicionar"
          @click="abrirModalNovo"
          aria-label="Adicionar novo serviço"
        >
          Adicionar Serviço
        </button>
      </header>

      <!-- Lista de Serviços -->
      <div class="lista-grid">
        <article
          v-for="servico in servicos"
          :key="servico.idServico"
          class="item-grid"
        >
          <div class="info-servico">
            <h2 class="nome-servico">{{ servico.descricao }}</h2>
            <p class="detalhe-servico">{{ servico.observacao }}</p>
            <p class="detalhe-servico">
              <strong>Preço:</strong> R$ {{ (servico.valor ?? 0).toFixed(2) }}
            </p>
          </div>
          <div class="card_botoes">
            <button
              class="botao-editar"
              @click="abrirModalEditar(servico)"
              aria-label="Editar serviço {{ servico.descricao }}"
            >
              Editar
            </button>
            <button
              class="botao-excluir"
              @click="excluirServico(servico)"
              aria-label="Excluir serviço {{ servico.descricao }}"
            >
              Excluir
            </button>
          </div>
        </article>
      </div>

      <!-- Modal -->
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
    </div>
  </section>

  <!-- Toast de mensagens -->
  <Toast :message="toastMessage" :type="toastType" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import ModalGenerico from "@/components/ModalBase.vue";
import FormularioServico from "@/views/FormularioServico.vue";
import ServicosEmpresaService from "@/services/ServicosEmpresaService";
import { useGlobalStore } from "@/store/useGlobalStore";
import LoadingPetMob from "@/components/LoadingPetMob.vue";
import Toast from "@/components/ToastCustomizado.vue";

const store = useGlobalStore();
const parametros = store.retornoObjParametro();
const empresaLogada = store.empresaLogada;
const idEmpresaLogada = empresaLogada.idEmpresa;

const carregando = ref(false);
const toastMessage = ref("");
const toastType = ref("info");
const modalAberto = ref(false);
const servicoSelecionado = ref(null);
const modalTitulo = ref("");
const botaoTextoModal = ref("");
const servicos = ref([]);
const modoAgendamento = ref("agrupado"); // novo estado

onMounted(async () => {
  await buscarServicosDaEmpresa();
  // Carrega o modo de agendamento salvo no localStorage
  // Se não houver, usa o modo padrão "agrupado"
  parametros.modoAgendamento = modoAgendamento.value;
  // console.log("parametros: ", parametros); // Removido para produção
  const modoSalvo = localStorage.getItem("modoAgendamento");
  if (modoSalvo) modoAgendamento.value = modoSalvo;
});

function setarModo(modo) {
  modoAgendamento.value = modo;
  localStorage.setItem("modoAgendamento", modo);
  showToast("Modo de agendamento atualizado!", "success");
}

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

async function buscarServicosDaEmpresa() {
  carregando.value = true;
  try {
    const data = await ServicosEmpresaService.buscarServicosEmpresa(
      idEmpresaLogada
    );
    if (data) servicos.value = data;
  } catch (error) {
    showToast("Erro ao carregar serviços", "error");
  } finally {
    carregando.value = false;
  }
}

function abrirModalNovo() {
  servicoSelecionado.value = null;
  modalTitulo.value = "Adicionar Serviço";
  botaoTextoModal.value = "Adicionar";
  modalAberto.value = true;
}

async function abrirModalEditar(servico) {
  servicoSelecionado.value = { ...servico };
  modalTitulo.value = "Editar Serviço";
  botaoTextoModal.value = "Salvar";
  modalAberto.value = true;
}

async function fecharModal() {
  modalAberto.value = false;
  await buscarServicosDaEmpresa();
}

async function adicionarServico(dto) {
  // Exemplo de reforço de validação (pode ser expandido conforme regras de negócio)
  if (!dto.descricao || dto.valor === undefined || dto.valor < 0) {
    showToast("Preencha todos os campos obrigatórios corretamente.", "error");
    return;
  }
  if (dto.duracao === undefined || dto.duracao === null) {
    dto.duracao = 0;
  }
  carregando.value = true;
  try {
    const data = await ServicosEmpresaService.adicionarServicoEmpresa(dto);
    if (data.data) showToast("Serviço adicionado com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao adicionar serviços", "error");
  } finally {
    carregando.value = false;
  }
}

async function atualizarServico(dto) {
  if (!dto.descricao || dto.valor === undefined || dto.valor < 0) {
    showToast("Preencha todos os campos obrigatórios corretamente.", "error");
    return;
  }
  carregando.value = true;
  try {
    const data = await ServicosEmpresaService.atualizarServicoEmpresa(dto);
    if (data.data) showToast("Serviço atualizado com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao atualizar serviços", "error");
  } finally {
    carregando.value = false;
  }
}

async function excluirServico(dto) {
  carregando.value = true;
  try {
    const data = await ServicosEmpresaService.excluirServicoEmpresa(dto);
    if (data.data) {
      showToast("Serviço excluído com sucesso!", "success");
      await buscarServicosDaEmpresa();
    }
  } catch (error) {
    showToast("Erro ao excluir serviços", "error");
  } finally {
    carregando.value = false;
  }
}

async function salvarServico(dados) {
  carregando.value = true;
  try {
    if (servicoSelecionado.value && servicoSelecionado.value.idServico) {
      const dto = {
        ...dados,
        idServico: servicoSelecionado.value.idServico,
        idEmpresa: idEmpresaLogada,
      };
      await atualizarServico(dto);
    } else {
      const dto = {
        ...dados,
        idEmpresa: idEmpresaLogada,
      };
      await adicionarServico(dto);
    }
    showToast("Serviço salvo com sucesso!", "success");
    await fecharModal();
  } catch (error) {
    showToast("Erro ao salvar serviço", "error");
  } finally {
    carregando.value = false;
  }
}
</script>
<style scoped>
.modelo-trabalho {
  margin-bottom: 2rem;
}

.titulo-modelo {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.opcoes-modelo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-modelo {
  flex: 1 1 280px;
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.card-modelo:hover {
  border-color: #28a745;
}

.card-modelo.ativo {
  border-color: #28a745;
  background-color: #eafbe9;
}

.secao-servicos {
  padding: 1.5rem;
  padding-bottom: 70px;
  max-width: 900px;
  margin: 0 auto;
}

.cabecalho-secao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.75rem;
  font-weight: 700;
}

.card_botoes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.botao-adicionar {
  background-color: #28a745;
  color: white;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  font-size: 0.95rem;
}

.botao-editar,
.botao-excluir {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.botao-editar {
  background-color: #ffc107;
}

.botao-editar:hover {
  background-color: #e0a800;
}

.botao-excluir {
  background-color: #ee363f;
  color: white;
}

.botao-excluir:hover {
  background-color: #cc1f26;
}

/* Responsividade Mobile */
@media (max-width: 600px) {
  .cabecalho-secao {
    flex-direction: column;
    align-items: stretch;
  }

  .titulo {
    font-size: 1.5rem;
    text-align: center;
  }

  .botao-adicionar {
    width: 100%;
    text-align: center;
  }

  .lista-grid {
    grid-template-columns: 1fr;
  }

  .item-grid {
    padding: 1rem;
  }

  .card_botoes {
    flex-direction: column;
    gap: 0.5rem;
  }

  .botao-editar,
  .botao-excluir {
    width: 100%;
    text-align: center;
  }
}
</style>
