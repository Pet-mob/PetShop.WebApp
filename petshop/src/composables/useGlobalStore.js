import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useGlobalStore = defineStore("global", () => {
  const empresaLogada = ref({});
  const cnpjLogado = ref("");
  const tokenExpiracaoEm = ref(null);

  // Computed
  const estaAutenticado = computed(() => !!cnpjLogado.value);
  const tokenExpirou = computed(() => {
    if (!tokenExpiracaoEm.value) return false;
    return new Date() > new Date(tokenExpiracaoEm.value);
  });

  // Actions
  function autenticar(cnpj, empresa) {
    cnpjLogado.value = cnpj;
    empresaLogada.value = empresa;
    // Não armazenar no localStorage - apenas em memória
    // Backend envia expiracao do token
    tokenExpiracaoEm.value = new Date(Date.now() + 3600000); // 1 hora
  }

  function desautenticar() {
    cnpjLogado.value = "";
    empresaLogada.value = {};
    tokenExpiracaoEm.value = null;
  }

  return {
    empresaLogada,
    cnpjLogado,
    estaAutenticado,
    tokenExpirou,
    autenticar,
    desautenticar,
  };
});
