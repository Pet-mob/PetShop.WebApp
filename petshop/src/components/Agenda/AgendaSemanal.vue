<template>
  <div class="agenda-semanal-container">
    <!-- Cards Semanais -->
    <div class="cards-grid">
      <div v-for="(dia, i) in semana" :key="i" class="card">
        <header>
          <h3>{{ dia.diaSemana }}</h3>
          <span>{{ dia.dataFormatada }}</span>
        </header>
        <section>
          <p class="section-title">Horários</p>
          <ul>
            <li v-for="(item, idx) in dia.horarios" :key="idx">
              {{ item.hora }} - {{ item.usuario }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from "vue";
import AgendaService from "@/services/agendaService";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

const emit = defineEmits([
  "carregando",
  "carregado",
  "dados-vazios",
  "dados-encontrados",
]);
const props = defineProps({
  dataFiltro: String,
  idEmpresa: Number,
});

const semana = ref([]);

// onMounted(async () => {
//   emit("carregando");
//   console.log("emit:carregando");
//   const dados = await carregarAgenda(); // sua função real

//   if (!dados || dados.length === 0) {
//     emit("dados-vazios");
//     console.log("emit:dados-vazios");
//   } else {
//     emit("dados-encontrados");
//     console.log("emit:dados-encontrados");
//   }

//   console.log("emit:carregado");
//   emit("carregado");
// });

const carregarAgenda = async () => {
  try {
    const resposta = await AgendaService.buscarAgenda(
      props.dataFiltro,
      props.idEmpresa
    );
    semana.value = resposta;
    return resposta;
  } catch (error) {
    console.error("Erro ao buscar agenda:", error);
    semana.value = [];
    return [];
  }
};

// Reage a mudanças no dataFiltro
watch(
  () => props.dataFiltro,
  async () => {
    emit("carregando");
    const dados = await carregarAgenda();
    if (!dados || dados.length === 0) {
      emit("dados-vazios");
    } else {
      emit("dados-encontrados");
    }
    emit("carregado");
  },
  { immediate: true }
);
</script>

<style scoped>
/* Container principal */
.agenda-semanal-container {
  min-height: 10vh;
  padding: 1rem;
}

/* Grid responsivo */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

/* Card */
.card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.3s ease;
  min-height: 120px;
}

.card:hover {
  box-shadow: 0 8px 20px #6b7280;
}

/* Header */
.card header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.card header h3 {
  color: #374151;
  font-weight: 550;
  font-size: 1.1rem;
  margin: 0;
}

.card header span {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Conteúdo */
.card section {
  color: #374151;
  font-size: 0.875rem;
}

.section-title {
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem;
  margin-bottom: 0.5rem;
}

.card ul {
  list-style: disc;
  padding-left: 1.2rem;
  margin: 0;
  max-height: 600px;
  overflow-y: auto;
}

.card ul li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
  font-family: monospace;
  color: #6b7280;
}
</style>
