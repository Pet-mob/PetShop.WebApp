/**
 * Validar CNPJ
 * @param {string} cnpj - CNPJ a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarCnpj(cnpj) {
  if (!cnpj) return "CNPJ obrigatório";
  const apenasNumeros = cnpj.replace(/\D/g, "");
  if (apenasNumeros.length !== 14) return "CNPJ deve ter 14 dígitos";
  // ValidarCNPJ real com dígito verificador
  const regexCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  if (!regexCnpj.test(cnpj)) return "CNPJ em formato inválido";
  return null;
}

/**
 * Validar senha
 * @param {string} senha - Senha a validar
 * @returns {string|null} Mensagem de erro ou null se válida
 */
export function validarSenha(senha) {
  if (!senha) return "Senha obrigatória";
  if (senha.length < 8) return "Senha deve ter mínimo 8 caracteres";
  if (!/[A-Z]/.test(senha)) return "Deve conter letra maiúscula";
  if (!/[a-z]/.test(senha)) return "Deve conter letra minúscula";
  if (!/[0-9]/.test(senha)) return "Deve conter número";
  if (!/[!@#$%^&*]/.test(senha))
    return "Deve conter caractere especial (!@#$%^&*)";
  return null;
}

/**
 * Validar confirmação de senha
 * @param {string} confirmacao - Senha de confirmação
 * @param {string} original - Senha original
 * @returns {string|null} Mensagem de erro ou null se válida
 */
export function validarConfirmacaoSenha(confirmacao, original) {
  if (!confirmacao) return "Confirmação de senha obrigatória";
  if (confirmacao !== original) return "As senhas não coincidem";
  return null;
}

/**
 * Validar e-mail
 * @param {string} email - E-mail a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarEmail(email) {
  if (!email) return "E-mail obrigatório";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "E-mail inválido";
  return null;
}

/**
 * Validar nome/razão social
 * @param {string} nome - Nome a validar
 * @param {number} minimo - Comprimento mínimo (padrão: 3)
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarNome(nome, minimo = 3) {
  if (!nome) return "Nome obrigatório";
  if (nome.trim().length < minimo)
    return `Nome deve ter mínimo ${minimo} caracteres`;
  return null;
}

/**
 * Validar telefone
 * @param {string} telefone - Telefone a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarTelefone(telefone) {
  if (!telefone) return "Telefone obrigatório";
  const apenasNumeros = telefone.replace(/\D/g, "");
  if (apenasNumeros.length < 10) return "Telefone deve ter mínimo 10 dígitos";
  if (apenasNumeros.length > 11)
    return "Telefone não pode ter mais de 11 dígitos";
  return null;
}

/**
 * Validar campo numérico
 * @param {number|string} valor - Valor a validar
 * @param {number} minimo - Valor mínimo (padrão: 0)
 * @param {number} maximo - Valor máximo (opcional)
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarNumero(valor, minimo = 0, maximo = null) {
  if (valor === "" || valor === null || valor === undefined)
    return "Campo obrigatório";
  const num = Number(valor);
  if (isNaN(num)) return "Deve ser um número";
  if (num < minimo) return `Deve ser maior ou igual a ${minimo}`;
  if (maximo !== null && num > maximo)
    return `Deve ser menor ou igual a ${maximo}`;
  return null;
}

/**
 * Validar campo obrigatório
 * @param {string|number} valor - Valor a validar
 * @param {string} nomeCampo - Nome do campo (para mensagem)
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarObrigatorio(valor, nomeCampo = "Campo") {
  if (!valor || (typeof valor === "string" && !valor.trim())) {
    return `${nomeCampo} obrigatório`;
  }
  return null;
}

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {string|null} Mensagem de erro ou null se válida
 */
export function validarUrl(url) {
  if (!url) return "URL obrigatória";
  try {
    new URL(url);
    return null;
  } catch {
    return "URL inválida";
  }
}

/**
 * Validar código (a-z, 0-9, hífem)
 * @param {string} codigo - Código a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validarCodigo(codigo) {
  if (!codigo) return "Código obrigatório";
  if (!/^[a-z0-9-]+$/i.test(codigo))
    return "Código deve conter apenas letras, números e hífens";
  return null;
}
