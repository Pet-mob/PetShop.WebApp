<template>
  <nav class="top-menu">
    <div class="menu-left">
      <img src="@/assets/LogoPetON.png" alt="Pet.ON" class="logo" />
      <router-link to="/dashboard" class="nav-link">Início</router-link>
      <router-link to="/servicos" class="nav-link">Serviços</router-link>
      <router-link to="/pets" class="nav-link">Pets</router-link>
      <router-link to="/configuracoes" class="nav-link">Configurações</router-link>
    </div>
    <div class="menu-right">
      <!-- <img src="@/assets/user-icon.png" class="profile-icon" /> -->
    </div>
  </nav>
</template>

<style scoped>
.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6a1b9a;
  padding: 0.75rem 1.5rem;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.menu-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
}
.nav-link:hover {
  text-decoration: underline;
}
.logo {
  height: 40px;
}
.profile-icon {
  height: 32px;
  width: 32px;
  border-radius: 50%;
}
</style>
