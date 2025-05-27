import { ref } from "vue";

export default function useCnpjFormatado() {
  const cnpj = ref("");
  const cnpjSemFormatacao = ref("");

  function formatarCnpj(event) {
    let valor = event.target.value;

    // Remove tudo que não for número
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 14);
    cnpjSemFormatacao.value = apenasNumeros;

    // Aplica a máscara para exibição
    let valorFormatado = apenasNumeros;
    valorFormatado = valorFormatado.replace(/^(\d{2})(\d)/, "$1.$2");
    valorFormatado = valorFormatado.replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3"
    );
    valorFormatado = valorFormatado.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valorFormatado = valorFormatado.replace(/(\d{4})(\d)/, "$1-$2");

    cnpj.value = valorFormatado;
  }

  return {
    cnpj,
    cnpjSemFormatacao,
    formatarCnpj,
  };
}
