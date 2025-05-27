<template>
  <div class="dados-petshop">
    <!-- Cabeçalho -->
    <div class="header">
      <button class="back-button" @click="voltar">
        <i class="icon">←</i>
      </button>
      <h1 class="title">Dados da Conta</h1>
    </div>

    <div class="body-container">
      <!-- Foto do usuário -->
      <div class="foto-container" @click="selecionarFoto">
        <img
          :src="foto || '/logoPetON.png'"
          class="foto"
          alt="Foto do Petshop"
        />
        <p class="texto-foto">Alterar Foto</p>
      </div>

      <div class="input-container">
        <label>Razão/Fantasia:</label>
        <input v-model="nome" placeholder="Digite Razão social/Fantasia" />
      </div>

      <div class="input-container">
        <label>CNPJ:</label>
        <input v-model="cnpj" placeholder="Digite seu CNPJ" />
      </div>

      <div class="input-container">
        <label>Email:</label>
        <input v-model="email" placeholder="Digite seu email" type="email" />
      </div>

      <div class="input-container">
        <label>Telefone:</label>
        <input v-model="telefone" placeholder="Digite seu telefone" />
      </div>

      <button class="botao-salvar">Salvar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const nome = ref("Rennan Pet Shop");
const cnpj = ref("123.456.789/0001-22");
const email = ref("rennanpetshop@email.com");
const telefone = ref("(11) 98765-4321");
const foto = ref(null);

const voltar = () => {
  router.back();
};

const selecionarFoto = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      foto.value = URL.createObjectURL(file);
    }
  };
  input.click();
};
</script>

<style scoped>
.dados-petshop {
  background: #fff;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  position: relative;
}

.back-button {
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
}

.body-container {
  padding: 1rem;
}

.foto-container {
  text-align: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.foto {
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: #e0e0e0;
  object-fit: cover;
}

.texto-foto {
  color: #007bff;
  margin-top: 0.5rem;
}

.input-container {
  margin-bottom: 1rem;
}

.input-container label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.input-container input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.botao-salvar {
  background-color: #28a745;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  width: 100%;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;
}
</style>
