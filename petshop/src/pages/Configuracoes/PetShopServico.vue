<template>
  <section class="secao-servicos">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetON v-if="carregando" />

    <!-- Conteúdo principal -->
    <div v-else>
      <header class="cabecalho-secao">
        <h1 class="titulo">Serviços</h1>
        <button class="botao-adicionar" @click="abrirModalNovo">
          Adicionar Serviço
        </button>
      </header>

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
            <!-- <p class="detalhe-servico">
              <strong>Status:</strong> {{ servico.ativo ? "Ativo" : "Inativo" }}
            </p> -->
          </div>
          <button class="botao-editar" @click="abrirModalEditar(servico)">
            Editar
          </button>
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
import LoadingPetON from "@/components/LoadingPetON.vue";
import Toast from "@/components/ToastCustomizado.vue";

const store = useGlobalStore();
const idEmpresaLogada = store.empresaLogada.value.idEmpresa;

const carregando = ref(false);
const toastMessage = ref("");
const toastType = ref("info");
const modalAberto = ref(false);
const servicoSelecionado = ref(null);
const modalTitulo = ref("");
const botaoTextoModal = ref("");
const servicos = ref([]);

onMounted(async () => {
  await buscarServicosDaEmpresa();
});

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
    // showToast("Horários carregados com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao carregar serviços", "error");
  } finally {
    carregando.value = false;
  }
}

function abrirModalNovo() {
  modalTitulo.value = "Adicionar Serviço";
  botaoTextoModal.value = "Adicionar";
  modalAberto.value = true;
}

// async function buscarServicosDaEmpresaComIdEmpresaEIdServico(idServicoParam) {
//   carregando.value = true;
//   try {
//     const data =
//       await ServicosEmpresaService.buscarServicosEmpresaPorIdEmpresaEIdServico(
//         idEmpresaLogada,
//         idServicoParam
//       );

//     if (data) servicos.value = data;
//   } catch (error) {
//     showToast("Erro ao carregar serviços", "error");
//   } finally {
//     carregando.value = false;
//   }
// }

async function abrirModalEditar(servico) {
  servicoSelecionado.value = { ...servico };
  // const idServicoSelecionado = servico.idServico;
  // await buscarServicosDaEmpresaComIdEmpresaEIdServico(idServicoSelecionado);
  modalTitulo.value = "Editar Serviço";
  botaoTextoModal.value = "Salvar";
  modalAberto.value = true;
}

async function fecharModal() {
  modalAberto.value = false;
  await buscarServicosDaEmpresa();
}

async function adicionarServico(dto) {
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
  carregando.value = true;
  try {
    const data = await ServicosEmpresaService.atualizarServicoEmpresa(dto);
    if (data.data) showToast("Serviço ataulizado com com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao atualizar serviços", "error");
  } finally {
    carregando.value = false;
  }
}

async function salvarServico(dados) {
  carregando.value = true;
  try {
    if (servicoSelecionado.value && servicoSelecionado.value.idServico) {
      // Editar
      const dto = {
        ...dados,
        idServico: servicoSelecionado.value.idServico,
        idEmpresa: idEmpresaLogada,
      };
      await atualizarServico(dto);
    } else {
      // Adicionar
      const dto = {
        ...dados,
        idEmpresa: idEmpresaLogada,
      };
      await adicionarServico(dto);
    }
    showToast("Serviço salvo com sucesso!", "success");
    fecharModal();
  } catch (error) {
    showToast("Erro ao salvar serviço", "error");
  } finally {
    carregando.value = false;
  }
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
