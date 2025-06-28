<template>
  <div class="container-dashboard">
    <!-- Exibe o loading se estiver carregando -->
    <LoadingPetMob v-if="carregando" />

    <!-- Oculta o card de login durante o loading -->
    <div v-else>
      <div class="cartoes">
        <section class="cartao">
          <h2>Pets agendados hoje</h2>
          <p>{{ petsAgendadosHoje }}</p>
        </section>
        <section class="cartao">
          <h2>Serviços concluídos</h2>
          <p>{{ servicosConcluidos }}</p>
        </section>
        <section class="cartao">
          <h2>Agendamentos para amanhã</h2>
          <p>{{ agendamentosAmanha }}</p>
        </section>
        <section class="cartao">
          <h2>Próximo horário</h2>
          <p>{{ proximoHorario }}</p>
        </section>
      </div>

      <div class="grafico">
        <h3>Serviços na última semana</h3>
        <GraficoServicos :dadosSemana="dadosSemana" />
      </div>

      <Toast :message="toastMessage" :type="toastType" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import GraficoServicos from "../components/GraficoServicos.vue";
import { useGlobalStore } from "@/store/useGlobalStore";
import empresaService from "@/services/empresaService";
import dashboardService from "@/services/dashboardService";
import Toast from "@/components/ToastCustomizado.vue";
import LoadingPetMob from "@/components/LoadingPetMob.vue";

const store = useGlobalStore();

const carregando = ref(false);
const petsAgendadosHoje = ref(0);
const servicosConcluidos = ref(0);
const agendamentosAmanha = ref(0);
const proximoHorario = ref("Nenhum horário");
const dadosSemana = ref([]);
const toastMessage = ref("");
const toastType = ref("info");

onMounted(async () => {
  await buscarEmpresaLogadaPorCnpj();
});

function showToast(msg, type = "info") {
  toastMessage.value = msg;
  toastType.value = type;
}

const buscarEmpresaLogadaPorCnpj = async () => {
  try {
    carregando.value = true;
    const empresa = await empresaService.buscarEmpresa(store.cnpjLogado.value);
    if (empresa) {
      store.definirObjetoEmpresaLogada(empresa[0]);
      const dashboard = await buscarDashboard(empresa[0].idEmpresa);

      if (dashboard) {
        petsAgendadosHoje.value = dashboard.petsAgendadosHoje || 0;
        servicosConcluidos.value = dashboard.servicosConcluidos || 0;
        agendamentosAmanha.value = dashboard.agendamentosAmanha || 0;
        proximoHorario.value = dashboard.proximoHorario || "Nenhum horário";
        dadosSemana.value = dashboard.graficoSemanal || [0, 0, 0, 0, 0, 0, 0];
      }
    }
  } catch (error) {
    showToast(
      error.response?.data?.message || "Erro ao carregar dashboard",
      "error"
    );
  } finally {
    carregando.value = false;
  }
};

const buscarDashboard = async (idEmpresaParam) => {
  try {
    const dataAtual = new Date();
    return await dashboardService.buscarDashboard(dataAtual, idEmpresaParam);
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
    return null;
  }
};
</script>

<style scoped>
.container-dashboard {
  padding: 2rem;
}

.cartoes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.cartao {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s ease;
}

.cartao:hover {
  transform: translateY(-5px);
}

.cartao h2 {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.cartao p {
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  font-weight: 700;
  color: #333;
  margin: 0;
}

.grafico {
  margin-top: 3rem;
  width: 100%;
  overflow-x: auto;
}

/* 📱 Ajustes para dispositivos móveis */
@media (max-width: 600px) {
  .container-dashboard {
    padding: 1rem;
  }

  .cartoes {
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .cartao {
    padding: 1rem;
  }

  .cartao h2 {
    font-size: 1rem;
  }

  .cartao p {
    font-size: clamp(1rem, 5vw, 1.4rem);
  }

  .grafico {
    margin-top: 2rem;
    padding-bottom: 5rem;
  }
}
</style>
