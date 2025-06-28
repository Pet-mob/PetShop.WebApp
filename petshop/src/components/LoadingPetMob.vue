<template>
  <div class="loading-container" role="status" aria-live="polite" tabindex="0">
    <div class="logo-wrapper">
      <img
        src="../assets/LogoSemEscrita.png"
        alt="Logotipo Pet.ON"
        class="logo"
      />
      <div class="spinner" aria-hidden="true"></div>
    </div>
    <p class="loading-text">Carregando...</p>
    <span class="sr-only">Aguarde, conteúdo está sendo carregado.</span>
  </div>
</template>

<script setup>
// Nenhuma lógica JS é necessária aqui, a menos que queira tornar o loading condicional
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.logo-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  z-index: 2;
  position: relative;
}

.spinner {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 140px;
  height: 140px;
  border: 6px solid #c3e3d1;
  border-top: 6px solid #52b788; /* cor principal da Pet.ON */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 1;
}

.loading-text {
  margin-top: 16px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
