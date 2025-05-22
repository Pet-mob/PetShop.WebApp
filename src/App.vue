<template>
  <div id="app">
    <MenuView v-if="$route.meta.menu" />
    <router-view />
  </div>
</template>

<script setup>
import MenuView from '@/components/MenuView.vue'
</script>

body, html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}