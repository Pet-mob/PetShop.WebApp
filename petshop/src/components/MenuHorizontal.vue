<template>
    <nav class="top-menu">
        <div class="menu-left">
            <router-link to="/inicio" class="nav-button" active-class="active-button">Início</router-link>
            <router-link to="/agenda" class="nav-button" active-class="active-button">Agenda</router-link>
            <router-link to="/servicos" class="nav-button" active-class="active-button">Serviços</router-link>
            <router-link to="/pets" class="nav-button" active-class="active-button">Pets</router-link>
            <router-link to="/configuracoes" class="nav-button" active-class="active-button">Configurações</router-link>
        </div>
        <div class="menu-right">
            <img src="@/assets/perfil.png" class="profile-icon" alt="Perfil" />
        </div>
    </nav>
</template>

<style scoped>
.top-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e1e2f;
    padding: 1rem 2.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.nav-button {
    background-color: transparent;
    color: #ffffffcc;
    border: 2px solid transparent;
    padding: 0.6rem 1.4rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 999px;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;
}

.nav-button:hover {
    background-color: #00d1b2;
    color: #ffffff;
    box-shadow: 0 0 10px #00d1b290;
    transform: translateY(-2px);
}

.active-button {
    background-color: #00d1b2;
    color: #ffffff;
    border: 2px solid #00d1b2;
    box-shadow: 0 0 12px #00d1b290;
}

.profile-icon {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 2px solid #00d1b2;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.profile-icon:hover {
    transform: scale(1.05);
}
</style>
