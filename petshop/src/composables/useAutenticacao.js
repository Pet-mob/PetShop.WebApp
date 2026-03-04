import { ref, computed } from "vue";
import { useGlobalStore } from "@/store/useGlobalStore";
import * as autenticacaoService from "@/services/autenticacaoService";

export function useAutenticacao() {
  const store = useGlobalStore();
  const carregando = ref(false);
  const erro = ref(null);

  const estaAutenticado = computed(() => store.estaAutenticado);

  async function login(cnpj, senha) {
    carregando.value = true;
    erro.value = null;

    try {
      const resultado = await autenticacaoService.fazerLogin(cnpj, senha);
      store.autenticar(cnpj, resultado.empresa);
      return true;
    } catch (e) {
      erro.value = e.message;
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function logout() {
    carregando.value = true;
    try {
      await autenticacaoService.fazerLogout();
      store.desautenticar();
    } catch (e) {
      console.error("Erro ao fazer logout:", e);
      store.desautenticar(); // Força logout local mesmo se API falhar
    } finally {
      carregando.value = false;
    }
  }

  return {
    estaAutenticado,
    carregando,
    erro,
    login,
    logout,
  };
}
