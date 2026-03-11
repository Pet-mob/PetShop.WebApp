/**
 * Hook para Debounce - aguarda o usuário parar de disparar eventos antes de executar
 * Ideal para: automático ao digitar, busca em tempo real, salvar após edição
 *
 * @param {Function} callback - Função a ser executada
 * @param {number} delay - Atraso em milissegundos (padrão: 300ms)
 * @returns {Function} Função debounceada
 *
 * @example
 * const salvarDebounced = useDebounce(async () => {
 *   await salvarDados();
 * }, 500);
 *
 * // No template:
 * @input="salvarDebounced"
 */
export function useDebounce(callback, delay = 300) {
  let timeoutId = null;

  return async (...args) => {
    // Limpar timeout anterior
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const resultado = await callback(...args);
          resolve(resultado);
        } catch (erro) {
          reject(erro);
        }
      }, delay);
    });
  };
}

/**
 * Criar debounce com controle de loading
 * @param {Function} callback - Função a ser executada
 * @param {Ref} loadingRef - Ref de estado de carregamento
 * @param {number} delay - Atraso em ms
 * @returns {Function} Função debounceada
 */
export function useDebounceWithLoading(callback, loadingRef, delay = 300) {
  const debounced = useDebounce(async (...args) => {
    loadingRef.value = true;
    try {
      return await callback(...args);
    } finally {
      loadingRef.value = false;
    }
  }, delay);

  return debounced;
}
