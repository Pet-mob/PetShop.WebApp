<template>
  <div id="app">
    <MenuView v-if="$route.meta.menu" />
    <router-view />
  </div>
</template>

<script setup>
import MenuView from '@/components/MenuView.vue'
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

}
</style>