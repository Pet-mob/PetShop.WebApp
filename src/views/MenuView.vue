<template>
  <div>
    <nav class="menu">
      <ul>
        <li>🏠 Início</li>
        <li>📋 Serviços</li>
        <li>🐾 Pets</li>
        <li>⚙️ Configurações</li>
      </ul>
    </nav>
    <div class="conteudo">
      <h1>Bem-vindo ao Pet.ON</h1>
      <p>Escolha uma opção no menu.</p>
    </div>
  </div>
</template>

<style scoped>
.menu {
  background-color: #7b2cbf;
  color: white;
  padding: 1rem;
}
.menu ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
}
.conteudo {
  padding: 2rem;
}
</style>
