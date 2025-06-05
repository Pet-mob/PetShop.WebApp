import { useGlobalStore } from "@/store/useGlobalStore";
import empresaService from "@/services/empresaService";

export default async function carregarDadosDoMenu(to, from, next) {
  try {
    const store = useGlobalStore();

    store.carregando = true;

    // Se o valor em memória sumiu (por causa de F5), tenta pegar do localStorage
    const cnpj = store.cnpjLogado || localStorage.getItem("cnpj");

    if (!cnpj) {
      console.warn("CNPJ não encontrado, redirecionando para login");
      return next("/login"); // ou outra ação
    }

    const [empresa] = await Promise.all([empresaService.buscarEmpresa(cnpj)]);

    store.definirObjetoEmpresaLogada(empresa[0]);
    next();
  } catch (erro) {
    console.error("Erro ao carregar dados do menu:", erro);
    next("/erro");
  } finally {
    const store = useGlobalStore();
    store.carregando = false;
  }
}
