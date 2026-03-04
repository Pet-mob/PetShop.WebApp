export function validarCnpj(cnpj) {
  // Validação CNPJ real
  const regexCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regexCnpj.test(cnpj);
}
