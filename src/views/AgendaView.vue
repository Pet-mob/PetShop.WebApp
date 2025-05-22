<template>
  <div class="agenda-view">
    <!-- Menu Horizontal -->
    <header class="menu-header">
      <nav class="menu">
        <router-link to="/app/dashboard">Dashboard</router-link>
        <router-link to="/app/agenda" class="active">Agenda</router-link>
        <router-link to="/app/contas-a-receber">Contas a Receber</router-link>
        <router-link to="/app/contas-a-pagar">Contas a Pagar</router-link>
        <router-link to="/app/conta-digital">Conta Digital</router-link>
        <router-link to="/app/fluxo-de-caixa">Fluxo de Caixa</router-link>
        <router-link to="/app/conciliador-bancario">Conciliador Bancário</router-link>
      </nav>
      <div class="menu-utilities">
        <span><i class="icon-book"></i> Como funciona</span>
        <i class="icon-settings"></i>
        <i class="icon-menu"></i>
      </div>
    </header>

    <!-- Tabs Semana/Mês e Intervalo de datas -->
    <section class="agenda-toolbar">
      <div class="tabs">
        <span class="active">Semana</span>
        <span>Mês</span>
      </div>
      <div class="date-range">
        <button><</button>
        <strong>18/05 - 24/05</strong>
        <button>></button>
      </div>
    </section>

    <!-- Filtros -->
    <section class="agenda-filters">
      <select>
        <option>Empresa(s)</option>
        <option>2 - LBB Pet Shop</option>
      </select>
      <select>
        <option>Selecione o profissional</option>
      </select>
      <button class="btn-filtrar">Filtrar</button>
    </section>

    <!-- Agenda Semanal -->
    <section class="agenda-grid">
      <div class="day-column" v-for="(day, index) in week" :key="index">
        <div class="day-header">{{ day.name }}<br />{{ day.date }}</div>
        <div class="agenda-item">
          <strong>Serviços Agendados</strong>
          <div>Banho: 2</div>
          <div>Tosa: 1</div>
        </div>
        <div class="agenda-item">
          <strong>Horários</strong>
          <div>09:00 - Rex</div>
          <div>11:00 - Bob</div>
          <div>15:00 - Luna</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AgendaView',
  data() {
    return {
      week: [
        { name: 'Domingo', date: '18' },
        { name: 'Segunda', date: '19' },
        { name: 'Terça', date: '20' },
        { name: 'Quarta', date: '21' },
        { name: 'Quinta', date: '22' },
        { name: 'Sexta', date: '23' },
        { name: 'Sábado', date: '24' },
      ],
    };
  },
};
</script>

<style scoped>
.menu-header {
  display: flex;
  justify-content: space-between;
  background-color: #4b2c5e;
  color: white;
  padding: 0.5rem 1rem;
  align-items: center;
}
.menu a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}
.menu a.active {
  font-weight: bold;
  border-bottom: 2px solid white;
}
.menu-utilities i,
.menu-utilities span {
  margin-left: 1rem;
  cursor: pointer;
}
.agenda-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f8f8;
  align-items: center;
}
.tabs span {
  margin-right: 1rem;
  cursor: pointer;
}
.tabs span.active {
  font-weight: bold;
  border-bottom: 2px solid #512d6d;
}
.agenda-filters {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
}
.btn-filtrar {
  background-color: #512d6d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.agenda-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9f9f9;
  padding: 1rem;
  gap: 1rem;
}
.day-column {
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.day-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.agenda-item {
  margin-bottom: 0.5rem;
}
</style>
