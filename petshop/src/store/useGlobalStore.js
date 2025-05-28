import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
  // Dados auxiliares e constantes globais
  const empresaLogada = ref({});
  const cnpjLogado = ref("");

  // Funções utilitárias
  function definirCnpjLogado(param) {
    cnpjLogado.value = param;
  }

  function definirObjetoEmpresaLogada(param) {
    empresaLogada.value = param;
  }

  return {
    empresaLogada,
    cnpjLogado,
    definirCnpjLogado,
    definirObjetoEmpresaLogada,
  };
});
