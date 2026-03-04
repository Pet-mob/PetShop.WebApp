export function sanitizar(entrada) {
  const div = document.createElement("div");
  div.textContent = entrada;
  return div.innerHTML;
}
