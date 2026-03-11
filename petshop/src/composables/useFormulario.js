import { ref, computed } from "vue";

/**
 * Composable para gerenciar validação e estado de formulários
 * @param {Object} definicaoValidadores - Dicionário com validadores para cada campo
 * @returns {Object} Estado e métodos do formulário
 */
export function useFormulario(definicaoValidadores = {}) {
  const valores = ref({});
  const erros = ref({});
  const foiTentadoSubmeter = ref(false);

  // Inicializar valores vazios para cada campo
  Object.keys(definicaoValidadores).forEach((campo) => {
    valores.value[campo] = "";
  });

  /**
   * Validar um campo individual
   * @param {string} campo - Nome do campo
   * @returns {string|null} Mensagem de erro ou null se válido
   */
  function validarCampo(campo) {
    const validador = definicaoValidadores[campo];
    if (!validador) return null;

    const erro = validador(valores.value[campo]);
    if (erro) {
      erros.value[campo] = erro;
      return erro;
    }

    delete erros.value[campo];
    return null;
  }

  /**
   * Validar todos os campos do formulário
   * @returns {boolean} true se todos válidos, false caso contrário
   */
  function validarFormulario() {
    foiTentadoSubmeter.value = true;
    erros.value = {};

    Object.keys(definicaoValidadores).forEach((campo) => {
      validarCampo(campo);
    });

    return Object.keys(erros.value).length === 0;
  }

  /**
   * Validar um campo ao sair (blur)
   * @param {string} campo - Nome do campo
   */
  function validarAoSair(campo) {
    if (foiTentadoSubmeter.value) {
      validarCampo(campo);
    }
  }

  /**
   * Verificar se formulário é válido
   */
  const eValido = computed(() => {
    return foiTentadoSubmeter.value && Object.keys(erros.value).length === 0;
  });

  /**
   * Verificar se há algum erro
   */
  const temErro = computed(() => {
    return Object.keys(erros.value).length > 0;
  });

  /**
   * Limpar formulário
   */
  function limpar() {
    Object.keys(definicaoValidadores).forEach((campo) => {
      valores.value[campo] = "";
    });
    erros.value = {};
    foiTentadoSubmeter.value = false;
  }

  /**
   * Definir valores customizados
   * @param {Object} novosCampos - Objeto com valores a atualizar
   */
  function definirValores(novosCampos) {
    Object.assign(valores.value, novosCampos);
  }

  /**
   * Resetar tentativa de submissão
   */
  function resetarTentativaSubmissao() {
    foiTentadoSubmeter.value = false;
  }

  return {
    valores,
    erros,
    eValido,
    temErro,
    foiTentadoSubmeter,
    validarCampo,
    validarFormulario,
    validarAoSair,
    limpar,
    definirValores,
    resetarTentativaSubmissao,
  };
}
