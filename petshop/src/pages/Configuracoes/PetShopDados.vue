<template>
  <div class="empresa-container">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetMob v-if="carregando" />

    <!-- Conteúdo principal -->
    <div v-else>
      <h2 class="titulo">Dados da Empresa</h2>

      <div class="empresa-fotos-linha">
        <div class="foto-perfil-bloco">
          <label
            class="foto-perfil"
            tabindex="0"
            role="button"
            aria-label="Alterar logo da empresa"
            @keydown.enter.prevent="() => $refs.inputLogo.click()"
            @keydown.space.prevent="() => $refs.inputLogo.click()"
          >
            <img :src="perfilUrl" alt="Logo da empresa" />
            <input
              ref="inputLogo"
              type="file"
              @change="onFotoPerfilChange"
              hidden
              accept="image/*"
              aria-label="Selecionar arquivo de logo"
            />
          </label>
          <div class="foto-legenda">Logo da empresa</div>
        </div>

        <div class="foto-capa-bloco">
          <label
            class="foto-capa"
            tabindex="0"
            role="button"
            aria-label="Alterar foto de capa da empresa"
            @keydown.enter.prevent="() => $refs.inputCapa.click()"
            @keydown.space.prevent="() => $refs.inputCapa.click()"
          >
            <img :src="capaUrl" alt="Foto de capa" />
            <input
              ref="inputCapa"
              type="file"
              @change="onFotoCapaChange"
              hidden
              accept="image/*"
              aria-label="Selecionar arquivo de capa"
            />
          </label>
          <div class="foto-legenda">Foto de capa</div>
          <div class="foto-descricao">
            Essa imagem será exibida no aplicativo quando o usuário for agendar
            um horário com sua empresa (tamanho recomendado: 500x200px).
          </div>
        </div>
      </div>

      <form class="formulario" @submit.prevent="salvar" novalidate>
        <div class="linha">
          <div class="campo">
            <label for="nome">Nome da Empresa</label>
            <input
              type="text"
              id="nome"
              v-model="formulario.valores.nome"
              @blur="() => formulario.validarAoSair('nome')"
              autocomplete="organization"
              placeholder="Digite o nome da empresa"
              aria-label="Nome da empresa"
              :class="{ 'input-erro': formulario.erros.value.nome }"
            />
            <span v-if="formulario.erros.value.nome" class="texto-erro">
              {{ formulario.erros.value.nome }}
            </span>
          </div>
          <div class="campo">
            <label for="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              :value="cnpjFormatado"
              disabled
              aria-disabled="true"
              aria-label="CNPJ da empresa"
            />
          </div>
        </div>

        <div class="linha">
          <div class="campo">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formulario.valores.email"
              @blur="() => formulario.validarAoSair('email')"
              autocomplete="email"
              placeholder="exemplo@empresa.com"
              aria-label="E-mail da empresa"
              :class="{ 'input-erro': formulario.erros.value.email }"
            />
            <span v-if="formulario.erros.value.email" class="texto-erro">
              {{ formulario.erros.value.email }}
            </span>
          </div>
          <div class="campo">
            <label for="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              v-model="telefoneFormatado"
              @input="onTelefoneInput"
              @blur="() => formulario.validarAoSair('telefone')"
              placeholder="(XX) XXXXX-XXXX"
              aria-label="Telefone da empresa"
              :class="{ 'input-erro': formulario.erros.value.telefone }"
            />
            <span v-if="formulario.erros.value.telefone" class="texto-erro">
              {{ formulario.erros.value.telefone }}
            </span>
          </div>
        </div>

        <div class="botoes">
          <button
            type="submit"
            class="btn"
            aria-live="polite"
            aria-label="Salvar dados da empresa"
          >
            Salvar
          </button>
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
import fotoCapaPadrao from "@/assets/LogoEscritaPetMob.png";
import empresaService from "@/services/empresaService";
import LoadingPetMob from "@/components/LoadingPetMob.vue";
import Toast from "@/components/ToastCustomizado.vue";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useErro } from "@/composables/useErro";
import { useFormulario } from "@/composables/useFormulario";
import { useDebounce } from "@/composables/useDebounce";
import {
  validarNome,
  validarEmail,
  validarTelefone,
} from "@/utils/validadores";

const store = useGlobalStore();
const { capturar } = useErro();
const empresaLogada = store.empresaLogada;
const cnpjEmpresaLogada = empresaLogada.cnpj ?? empresaLogada[0].cnpj;
const idEmpresaLogado = empresaLogada.idEmpresa ?? empresaLogada[0].idEmpresa;

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

const formulario = useFormulario({
  nome: (valor) => validarNome(valor, 3),
  email: validarEmail,
  telefone: validarTelefone,
});

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
  } catch (e) {
    capturar(e, { acao: "carregarLogoEmpresa" });
    showToast(e.message || "Erro ao carregar logo da empresa", "error");
  } finally {
    carregando.value = false;
  }
};

const carregarCapaEmpresa = async () => {
  carregando.value = true;
  try {
    const logo = await empresaService.buscarCapaEmpresa(idEmpresaLogado);
    if (logo.length > 0) capaUrl.value = logo[0].url;
  } catch (e) {
    capturar(e, { acao: "carregarCapaEmpresa" });
    showToast(e.message || "Erro ao carregar capa da empresa", "error");
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

      // Preencher os valores do formulário
      formulario.definirValores({
        nome: empresa.value.descricaoNomeFisica,
        email: empresa.value.email,
        telefone: empresa.value.telefone,
      });
    }
  } catch (e) {
    capturar(e, { acao: "buscarDadosDaEmpresa" });
    showToast(e.message || "Erro ao carregar dados da empresa", "error");
  } finally {
    carregando.value = false;
  }
}

function formatarCnpj(valor) {
  const apenasNumeros = (valor || "").replace(/\D/g, "").slice(0, 14);
  let valorFormatado = apenasNumeros;
  if (apenasNumeros.length > 2) {
    valorFormatado = apenasNumeros.replace(/(\d{2})(\d)/, "$1.$2");
    if (apenasNumeros.length > 5) {
      valorFormatado = valorFormatado.replace(
        /(\d{2})\.(\d{3})(\d)/,
        "$1.$2.$3",
      );
      if (apenasNumeros.length > 8) {
        valorFormatado = valorFormatado.replace(
          /(\d{2})\.(\d{3})\.(\d{3})(\d)/,
          "$1.$2.$3/$4",
        );
        if (apenasNumeros.length > 12) {
          valorFormatado = valorFormatado.replace(
            /(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{0,2})/,
            "$1.$2.$3/$4-$5",
          );
        }
      }
    }
  }
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
  { immediate: true },
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
      showToast("Logo atualizada com sucesso!", "success");
    } catch (e) {
      capturar(e, { acao: "enviarLogo" });
      showToast(e.message || "Erro ao enviar logo da empresa", "error");
    }
  }
};

const onFotoCapaChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      capaUrl.value = URL.createObjectURL(file);
      empresaService.enviarCapaEmpresaPorIdEmpresa(file, idEmpresaLogado);
      showToast("Capa atualizada com sucesso!", "success");
    } catch (e) {
      capturar(e, { acao: "enviarCapa" });
      showToast(e.message || "Erro ao enviar capa da empresa", "error");
    }
  }
};

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

// Criar função salvar com debounce para evitar múltiplos cliques
const salvarSemDebounce = async () => {
  if (!formulario.validarFormulario()) {
    showToast(
      Object.values(formulario.erros.value).find((e) => e) ||
        "Preencha todos os campos corretamente.",
      "error",
    );
    return;
  }
  carregando.value = true;
  try {
    // Atualizar objeto empresa com os valores do formulário
    empresa.value.descricaoNomeFisica = formulario.valores.nome;
    empresa.value.email = formulario.valores.email;
    empresa.value.telefone = formulario.valores.telefone;

    const data = await empresaService.atualizarDadosEmpresa(empresa.value);
    if (data) {
      showToast("Dados da empresa atualizados com sucesso!", "success");
    }
  } catch (e) {
    capturar(e, { acao: "salvarDadosEmpresa" });
    showToast(e.message || "Erro ao atualizar dados da empresa", "error");
  } finally {
    carregando.value = false;
  }
};

// Proteger com debounce de 500ms
const salvar = useDebounce(salvarSemDebounce, 500);
</script>

<style scoped>
.empresa-container {
  max-width: 100%;
  padding: 32px;
  padding-bottom: 70px; /* espaço extra para o menu inferior */
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
  min-width: 180px;
}

.foto-perfil,
.foto-capa {
  cursor: pointer;
  position: relative;
  display: inline-block;
  outline-offset: 4px;
}

.foto-perfil:focus,
.foto-capa:focus {
  outline: 2px solid #4caf50;
  border-radius: 8px;
}

.foto-perfil img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

.foto-capa img {
  width: 500px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #ccc;
}

.foto-legenda {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: center;
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
  min-width: 220px;
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
  transition: border-color 0.3s;
}

.campo input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
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
  transition: background-color 0.2s;
}

.btn:hover,
.btn:focus {
  background-color: #43a047;
  outline: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .empresa-fotos-linha {
    flex-direction: column;
    gap: 24px;
  }

  .linha {
    flex-direction: column;
    gap: 16px;
  }
}

.input-erro {
  border-color: #d32f2f !important;
  background-color: #ffebee !important;
}

.texto-erro {
  font-size: 0.85rem;
  color: #d32f2f;
  margin-top: 4px;
  text-align: left;
}
</style>
