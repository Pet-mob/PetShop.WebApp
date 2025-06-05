import { defineStore } from "pinia";
import { ref } from "vue";
export const useGlobalStore = defineStore("global", () => {
  const empresaLogada = ref({});
  const cnpjLogado = ref(localStorage.getItem("cnpj") || ""); // Restaura ao iniciar

  function definirCnpjLogado(param) {
    cnpjLogado.value = param;
    localStorage.setItem("cnpj", param); // Salva
  }

  function definirObjetoEmpresaLogada(param) {
    empresaLogada.value = param;
    // Se quiser, também pode persistir isso como JSON
    // localStorage.setItem("empresaLogada", JSON.stringify(param));
  }

  return {
    empresaLogada,
    cnpjLogado,
    definirCnpjLogado,
    definirObjetoEmpresaLogada,
  };
});
