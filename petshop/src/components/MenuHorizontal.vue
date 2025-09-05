<template>
  <nav class="top-menu" aria-label="Menu principal de navegação">
    <div class="menu-left">
      <router-link
        to="/inicio"
        class="nav-button"
        active-class="active-button"
        aria-label="Ir para Início"
      >
        <Home class="icon" />
        <span class="nav-label">Início</span>
      </router-link>

      <router-link
        to="/agenda"
        class="nav-button"
        active-class="active-button"
        aria-label="Ir para Agenda"
      >
        <Calendar class="icon" />
        <span class="nav-label">Agenda</span>
      </router-link>
    </div>

    <div class="menu-right">
      <router-link
        to="/configuracoes"
        class="nav-button"
        active-class="active-button"
        aria-label="Ir para Configurações"
      >
        <Settings class="icon" />
        <span class="nav-label">Configurações</span>
      </router-link>
      <button
        class="nav-button logoff-button"
        @click="logoff"
        aria-label="Sair do sistema"
      >
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 15l3-3m0 0-3-3m3 3H9"
          />
        </svg>
        <span class="nav-label">Sair</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { Home, Calendar, Settings } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();

function logoff() {
  localStorage.removeItem("cnpj");
  // Se houver outros dados de autenticação, limpe aqui também
  router.push("/login");
}
</script>

<style scoped>
.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #dadada;
  padding: 1rem 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

.menu-left,
.menu-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logoff-button {
  background: #fff;
  border: 1px solid #d32f2f;
  color: #d32f2f;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.logoff-button:hover {
  background: #d32f2f;
  color: #fff;
}

.nav-button {
  background-color: transparent;
  color: #000000cc;
  border: 2px solid transparent;
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 999px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nav-button:hover {
  background-color: #73aff0;
  color: #ffffff;
  box-shadow: 0 0 10px #73aff090;
  transform: translateY(-2px);
}

.nav-button:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
  z-index: 2;
}

.active-button {
  background-color: #73aff0;
  color: #ffffff;
  border: 2px solid #73aff0;
  box-shadow: 0 0 12px #73aff090;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.nav-label {
  display: inline;
}

/* 📱 Mobile Responsiveness */
@media (max-width: 768px) {
  .top-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-around;
    padding: 0.6rem 1rem;
    background-color: #dadada;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .menu-left,
  .menu-right {
    gap: 0.8rem;
  }

  .nav-button {
    flex-direction: column;
    padding: 0.4rem;
    font-size: 0.75rem;
  }

  .icon {
    margin: 0;
    width: 22px;
    height: 22px;
  }

  .nav-label {
    margin-top: 0.2rem;
    font-size: 0.7rem;
  }
}
</style>
