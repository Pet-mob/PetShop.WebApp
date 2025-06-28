import { defineStore } from "pinia";
import { ref } from "vue";
export const useGlobalStore = defineStore("global", () => {
  const empresaLogada = ref({});
  const parametro = ref({});
  const cnpjLogado = ref(localStorage.getItem("cnpj") || ""); // Restaura ao iniciar

  function definirCnpjLogado(param) {
    cnpjLogado.value = param;
    localStorage.setItem("cnpj", param); // Salva
  }

  function definirObjetoEmpresaLogada(param) {
    empresaLogada.value = param;
  }

  function atualizarObjParametro(param) {
    parametro.value = param;
  }

  function retornoObjParametro() {
    return parametro.value;
  }

  return {
    empresaLogada,
    cnpjLogado,
    definirCnpjLogado,
    atualizarObjParametro,
    definirObjetoEmpresaLogada,
    retornoObjParametro,
  };
});
