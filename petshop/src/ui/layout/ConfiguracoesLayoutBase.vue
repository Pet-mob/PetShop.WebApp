<template>
  <div class="layout-configuracoes">
    <!-- Menu lateral com scroll próprio -->
    <aside class="menu-lateral">
      <h2 class="titulo-menu">Configurações</h2>

      <router-link
        v-for="item in rotas"
        :key="item.name"
        :to="`/configuracoes/${item.path}`"
        class="link-menu"
        active-class="ativo"
      >
        <span class="icone-menu">
          <component :is="item.meta.icon" size="18" />
        </span>
        <span class="texto-menu">{{ item.meta.label }}</span>
      </router-link>
    </aside>

    <!-- Conteúdo principal com scroll separado -->
    <main class="conteudo-principal">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import rotasConfiguracoes from '@/router/indexConfiguracoes'
const rotas = rotasConfiguracoes
</script>

<style scoped>
/* Layout geral */
.layout-configuracoes {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: sans-serif;
}

/* Menu lateral fixo com rolagem própria */
.menu-lateral {
  width: 260px;
  background-color: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

/* Título do menu */
.titulo-menu {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* Itens do menu */
.link-menu {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  text-decoration: none;
  border-radius: 6px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

.link-menu:hover {
  background-color: #e9ecef;
}

.icone-menu {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.ativo {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* Conteúdo com scroll separado */
.conteudo-principal {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 32px;
}

/* Responsividade */
@media (max-width: 768px) {
  .layout-configuracoes {
    flex-direction: column;
  }

  .menu-lateral {
    width: 100%;
    height: auto;
    max-height: 160px;
    overflow-x: auto;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #ccc;
  }

  .titulo-menu {
    display: none;
  }

  .link-menu {
    flex: 1;
    margin: 0 4px;
    justify-content: center;
    font-size: 14px;
    white-space: nowrap;
  }

  .conteudo-principal {
    padding: 16px;
  }
}
</style>
