import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
  // Dados auxiliares e constantes globais
  const empresa = ref({});
  const cnpjLogado = ref("");

  // Funções utilitárias
  function definirCnpjLogado(param) {
    cnpjLogado.value = param;
  }

  return {
    empresa,
    cnpjLogado,
    definirCnpjLogado,
  };
});
