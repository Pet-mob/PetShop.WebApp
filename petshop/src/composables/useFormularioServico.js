import { ref, computed } from 'vue'

export function useFormularioServico(initial = {}) {
  const nome = ref(initial.nome || '')
  const preco = ref(initial.preco || 0)

  const erros = ref({})

  function validar() {
    erros.value = {}

    if (!nome.value.trim()) {
      erros.value.nome = 'O nome é obrigatório.'
    }

    if (!preco.value || preco.value <= 0) {
      erros.value.preco = 'O preço deve ser maior que zero.'
    }

    return Object.keys(erros.value).length === 0
  }

  function resetar() {
    nome.value = ''
    preco.value = 0
    erros.value = {}
  }

  const servico = computed(() => ({
    nome: nome.value,
    preco: preco.value,
  }))

  return {
    nome,
    preco,
    erros,
    servico,
    validar,
    resetar,
  }
}
