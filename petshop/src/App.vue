<template>
  <div id="app">
    <MenuHorizontal v-if="$route.meta.menu" />
    <router-view />
  </div>
  <NotificacaoAgendamento />
  <!-- <- fica sempre ativo -->
</template>
<script setup>
import MenuHorizontal from "@/components/MenuHorizontal.vue";
import NotificacaoAgendamento from "@/components/NotificacaoAgendamento.vue";
</script>
<style>
html,
body {
  /* margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
 */
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh; /* ocupa pelo menos toda a altura da viewport */
  background-color: #f5f5f5; /* ou outra cor que desejar */
}

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
