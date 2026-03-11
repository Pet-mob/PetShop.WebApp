/**
 * Hook para Throttle - executa no máximo uma vez dentro de um intervalo de tempo
 * Ideal para: cliques em botões, scroll, resize, múltiplos requests
 *
 * @param {Function} callback - Função a ser executada
 * @param {number} limit - Intervalo mínimo em milissegundos (padrão: 1000ms)
 * @returns {Function} Função throttleada
 *
 * @example
 * const enviarThrottled = useThrottle(async () => {
 *   await enviarDados();
 * }, 2000);
 *
 * // No template:
 * @click="enviarThrottled"
 */
export function useThrottle(callback, limit = 1000) {
  let ultimaExecucao = 0;
  let timeoutId = null;

  return async (...args) => {
    const agora = Date.now();
    const diferenca = agora - ultimaExecucao;

    // Se passou o intervalo mínimo, executar imediatamente
    if (diferenca >= limit) {
      ultimaExecucao = agora;

      return new Promise((resolve, reject) => {
        try {
          const resultado = callback(...args);
          if (resultado instanceof Promise) {
            resultado.then(resolve).catch(reject);
          } else {
            resolve(resultado);
          }
        } catch (erro) {
          reject(erro);
        }
      });
    }

    // Se não passou, agendar para o próximo intervalo
    return new Promise((resolve) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        ultimaExecucao = Date.now();
        try {
          const resultado = await callback(...args);
          resolve(resultado);
        } catch (erro) {
          console.error("Erro no throttle:", erro);
        }
      }, limit - diferenca);
    });
  };
}

/**
 * Criar throttle com controle de loading
 * @param {Function} callback - Função a ser executada
 * @param {Ref} loadingRef - Ref de estado de carregamento
 * @param {number} limit - Intervalo mínimo em ms
 * @returns {Function} Função throttleada
 */
export function useThrottleWithLoading(callback, loadingRef, limit = 1000) {
  const throttled = useThrottle(async (...args) => {
    loadingRef.value = true;
    try {
      return await callback(...args);
    } finally {
      loadingRef.value = false;
    }
  }, limit);

  return throttled;
}

/**
 * Criar throttle imediato (executa na primeira chamada, depois aguarda)
 * @param {Function} callback - Função a ser executada
 * @param {number} limit - Intervalo mínimo em ms
 * @returns {Function} Função throttleada
 */
export function useThrottleLeading(callback, limit = 1000) {
  let ultimaExecucao = 0;

  return async (...args) => {
    const agora = Date.now();

    if (agora - ultimaExecucao >= limit) {
      ultimaExecucao = agora;
      return await callback(...args);
    }

    // Retorna promise que será rejeitado (chamada ignorada)
    return Promise.reject(new Error("Throttle: Aguarding interval"));
  };
}
