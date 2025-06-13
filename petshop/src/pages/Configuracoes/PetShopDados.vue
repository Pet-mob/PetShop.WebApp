<template>
  <div class="empresa-container">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetON v-if="carregando" />

    <!-- Conteúdo principal -->
    <div v-else>
      <h2 class="titulo">Dados da Empresa</h2>

      <div class="empresa-fotos-linha">
        <div class="foto-perfil-bloco">
          <label class="foto-perfil">
            <img :src="perfilUrl" alt="Logo da empresa" />
            <input type="file" @change="onFotoPerfilChange" hidden />
          </label>
          <div class="foto-legenda">Logo da empresa</div>
        </div>

        <div class="foto-capa-bloco">
          <label class="foto-capa">
            <img :src="capaUrl" alt="Foto de capa" />
            <input type="file" @change="onFotoCapaChange" hidden />
          </label>
          <div class="foto-legenda">Foto de capa</div>
          <div class="foto-descricao">
            Essa imagem será exibida no aplicativo quando o usuário for agendar
            um horário com sua empresa.
          </div>
        </div>
      </div>

      <form class="formulario" @submit.prevent="salvar">
        <div class="linha">
          <div class="campo">
            <label for="nome">Nome da Empresa</label>
            <input
              type="text"
              id="nome"
              v-model="empresa.descricaoNomeFisica"
              required
            />
          </div>
          <div class="campo">
            <label for="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              :value="cnpjFormatado"
              disabled
              required
            />
          </div>
        </div>

        <div class="linha">
          <div class="campo">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="empresa.email" required />
          </div>
          <div class="campo">
            <label for="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              v-model="telefoneFormatado"
              @input="onTelefoneInput"
              required
            />
          </div>
        </div>

        <div class="botoes">
          <button type="submit" class="btn">Salvar</button>
        </div>
      </form>
    </div>
    <!-- Toast de mensagens -->
    <Toast :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import perfilPadrao from "@/assets/perfil.png";
import fotoCapaPadrao from "@/assets/LogoEscrita.png";
import empresaService from "@/services/empresaService";
import LoadingPetON from "@/components/LoadingPetON.vue";
import Toast from "@/components/ToastCustomizado.vue";
import { useGlobalStore } from "@/store/useGlobalStore";

const store = useGlobalStore();
const empresaLogada = store.empresaLogada;
const idEmpresaLogado = empresaLogada.idEmpresa;

const carregando = ref(false);
const toastMessage = ref("");
const toastType = ref("info");
const empresa = ref({
  descricaoNomeFisica: "",
  cnpj: "",
  email: "",
  telefone: "",
});
const perfilUrl = ref(perfilPadrao);
const capaUrl = ref(fotoCapaPadrao);
const cnpjFormatado = ref("");
const telefoneFormatado = ref("");

onMounted(async () => {
  await buscarDadosDaEmpresa();
  await carregarFotos();
});

async function carregarFotos() {
  await carregarLogoEmpresa();
  await carregarCapaEmpresa();
}

const carregarLogoEmpresa = async () => {
  carregando.value = true;
  try {
    const logo = await empresaService.buscarLogoEmpresa(idEmpresaLogado);
    if (logo.length > 0) perfilUrl.value = logo[0].url;
  } catch (error) {
    showToast("Erro ao carregar logo da empresa", "error");
  } finally {
    carregando.value = false;
  }
};

const carregarCapaEmpresa = async () => {
  carregando.value = true;
  try {
    const logo = await empresaService.buscarCapaEmpresa(idEmpresaLogado);
    if (logo.length > 0) capaUrl.value = logo[0].url;
  } catch (error) {
    showToast("Erro ao carregar capa da empresa", "error");
  } finally {
    carregando.value = false;
  }
};

async function buscarDadosDaEmpresa() {
  carregando.value = true;
  try {
    const data = await empresaService.buscarEmpresa(cnpjEmpresaLogada);
    if (data.length > 0) {
      empresa.value = data[0];
      cnpjFormatado.value = formatarCnpj(empresa.value.cnpj);
    }
  } catch (error) {
    showToast("Erro ao carregar dados da empresa", "error");
  } finally {
    carregando.value = false;
  }
}

function formatarCnpj(valor) {
  const apenasNumeros = (valor || "").replace(/\D/g, "").slice(0, 14);
  let valorFormatado = apenasNumeros;
  valorFormatado = valorFormatado.replace(/^(\d{2})(\d)/, "$1.$2");
  valorFormatado = valorFormatado.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  valorFormatado = valorFormatado.replace(/\.(\d{3})(\d)/, ".$1/$2");
  valorFormatado = valorFormatado.replace(/(\d{4})(\d)/, "$1-$2");
  return valorFormatado;
}

function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);

  if (valor.length > 10) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (valor.length > 5) {
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (valor.length > 0) {
    valor = valor.replace(/^(\d*)/, "($1");
  }

  return valor;
}

watch(
  () => empresa.value.telefone,
  (novo) => {
    telefoneFormatado.value = formatarTelefone(novo);
  },
  { immediate: true }
);

function onTelefoneInput(e) {
  const valor = e.target.value;
  const apenasNumeros = valor.replace(/\D/g, "");
  empresa.value.telefone = apenasNumeros; // salva só números sem formatação
  telefoneFormatado.value = formatarTelefone(valor); // atualiza o campo formatado
}

const onFotoPerfilChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      perfilUrl.value = URL.createObjectURL(file);
      empresaService.enviarLogoEmpresaPorIdEmpresa(file, idEmpresaLogado);

      showToast("Logo atualizada com com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao enviar logo da empresa", "error");
    }
  }
};

const onFotoCapaChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      capaUrl.value = URL.createObjectURL(file);
      empresaService.enviarCapaEmpresaPorIdEmpresa(file, idEmpresaLogado);
      showToast("Capa atualizada com com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao enviar capa da empresa", "error");
    }
  }
};

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

async function salvar() {
  carregando.value = true;
  try {
    const data = await empresaService.atualizarDadosEmpresa(empresa.value);
    if (data) {
      showToast("Dados da empresa atualizada com com sucesso!", "success");
    }
  } catch (error) {
    showToast("Erro ao atualizar dados da empresa", "error");
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.empresa-container {
  max-width: 100%;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.titulo {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
  text-align: left;
}

.empresa-fotos-linha {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
  width: 100%;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.foto-perfil-bloco,
.foto-capa-bloco {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.foto-perfil img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
  cursor: pointer;
}

.foto-capa img {
  width: 100%;
  max-width: 480px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #ccc;
  cursor: pointer;
}

.foto-legenda {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.foto-descricao {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
  text-align: center;
  max-width: 480px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.linha {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.campo {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.campo label {
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  text-align: left;
}

.campo input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fefefe;
}

.botoes {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 10px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background-color: #43a047;
}
</style>
