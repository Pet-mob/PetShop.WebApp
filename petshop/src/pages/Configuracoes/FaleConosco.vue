<template>
  <div class="fale-conosco-container">
    <div class="logo-container">
      <img src="@/assets/LogoGrande.png" alt="Logo da PETMOB" class="logo" />
    </div>

    <h3 class="titulo">Fale Conosco</h3>

    <div class="contato-info">
      <div
        v-for="(item, index) in contactItems"
        :key="index"
        class="contato-item"
      >
        <span class="item-label">{{ item.label }}:</span>
        <a :href="item.href" class="item-value">
          {{ item.value }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const contactItems = ref([
  {
    label: "Telefone",
    value: "(16) 99355-7709",
    href: "tel:+5516993557709",
  },
  {
    label: "E-mail",
    value: "equipepetmob@gmail.com",
    href: "mailto:equipepetmob@gmail.com",
  },
  {
    label: "Endereço",
    value: "Ribeirão Preto - SP",
    href: "https://www.google.com/search?q=https://maps.google.com/%3Fq%3DRibeir%C3%A3o Preto - SP",
  },
  {
    label: "Site",
    value: "petmob.com.br",
    href: "https://www.google.com/search?q=https://petmob.com.br",
  },
]);
</script>

<style scoped>
.fale-conosco-container {
  max-width: 100%;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-container {
  margin-bottom: 24px;
}

.logo {
  width: 300px;
  height: auto;
  border-radius: 15%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.titulo {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.contato-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.contato-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza horizontalmente /
text-align: center; / Centraliza o texto */
}

.item-label {
  font-size: 16px;
  font-weight: 600;
  color: #0065d1;
}

.item-value {
  font-size: 16px;
  color: #333;
  text-decoration: none;
  word-break: break-all;
  margin-top: 4px;
  transition: color 0.2s ease;
}

.item-value:hover {
  color: #004ea8;
  text-decoration: underline;
}
</style>
