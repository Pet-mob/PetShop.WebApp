/**
 * Classe base para erros aplicados
 */
export class ErroApp extends Error {
  constructor(
    mensagem,
    codigo = "GENERICO",
    statusCode = 500,
    detalhes = null,
  ) {
    super(mensagem);
    this.name = "ErroApp";
    this.codigo = codigo;
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }

  toJSON() {
    return {
      mensagem: this.message,
      codigo: this.codigo,
      statusCode: this.statusCode,
      detalhes: this.detalhes,
    };
  }
}

/**
 * Mapa de erros conhecidos
 */
const MAPA_ERROS = {
  401: {
    codigo: "NAO_AUTENTICADO",
    mensagem: "Sessão expirada. Faça login novamente.",
  },
  403: {
    codigo: "NAO_AUTORIZADO",
    mensagem: "Você não tem permissão para acessar este recurso.",
  },
  404: {
    codigo: "NAO_ENCONTRADO",
    mensagem: "Recurso não encontrado.",
  },
  422: {
    codigo: "VALIDACAO_FALHOU",
    mensagem: "Dados inválidos. Verifique os campos.",
  },
  500: {
    codigo: "ERRO_SERVIDOR",
    mensagem: "Erro no servidor. Tente novamente em alguns momentos.",
  },
  503: {
    codigo: "SERVICO_INDISPONIVEL",
    mensagem: "Servidor em manutenção. Tente mais tarde.",
  },
};

/**
 * Trata erro da API e retorna ErroApp normalizado
 */
export function tratarErroApi(erro) {
  // Erro de timeout
  if (erro.code === "ECONNABORTED") {
    return new ErroApp(
      "Conexão expirou. Verifique sua internet e tente novamente.",
      "TIMEOUT",
      0,
    );
  }

  // Sem conexão
  if (erro.message === "Network Error") {
    return new ErroApp(
      "Sem conexão com o servidor. Verifique sua internet.",
      "REDE",
      0,
    );
  }

  // Erro HTTP da API
  if (erro.response) {
    const status = erro.response.status;
    const mapa = MAPA_ERROS[status];

    return new ErroApp(
      erro.response.data?.message || mapa?.mensagem || "Erro desconhecido",
      mapa?.codigo || "GENERICO",
      status,
      erro.response.data,
    );
  }

  // Erro genérico
  return new ErroApp(erro.message || "Erro desconhecido", "GENERICO", 500);
}

/**
 * Logger estruturado para erros
 */
export class LoggerErro {
  static registrar(erro, contexto = {}) {
    const registro = {
      timestamp: new Date().toISOString(),
      mensagem: erro.message,
      codigo: erro.codigo,
      statusCode: erro.statusCode,
      contexto,
      stack: process.env.NODE_ENV === "development" ? erro.stack : undefined,
    };

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === "production") {
      // Exemplo: Sentry.captureException(erro);
    }

    console.error(`[${erro.codigo}]`, registro);
  }
}
