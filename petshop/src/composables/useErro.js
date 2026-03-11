import { ref } from "vue";
import { ErroApp, LoggerErro } from "@/utils/erroHandler";

/**
 * Composable para gerenciar erros de forma centralizada
 */
export function useErro() {
  const erro = ref(null);
  const carregando = ref(false);

  /**
   * Limpar erro atual
   */
  function limpar() {
    erro.value = null;
  }

  /**
   * Capturar e normalizar erro
   * @param {Error|ErroApp} erroCapturado - Erro capturado
   * @param {Object} contexto - Contexto adicional para o log
   */
  function capturar(erroCapturado, contexto = {}) {
    if (erroCapturado instanceof ErroApp) {
      erro.value = erroCapturado;
    } else {
      erro.value = new ErroApp(
        erroCapturado.message || "Erro desconhecido",
        "NAO_TRATADO",
      );
    }

    LoggerErro.registrar(erro.value, contexto);
  }

  /**
   * Mostrar notificação de erro usando toast
   * @param {Function} toast - Função toast para exibir mensagem
   */
  function mostrarNotificacao(toast) {
    if (erro.value && toast) {
      toast(erro.value.message, "error");
    }
  }

  return {
    erro,
    carregando,
    limpar,
    capturar,
    mostrarNotificacao,
  };
}
