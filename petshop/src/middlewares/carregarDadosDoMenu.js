import { useGlobalStore } from "@/store/useGlobalStore";
import empresaService from "@/services/empresaService";
import parametroService from "@/services/parametroService";

export default async function carregarDadosDoMenu(to, from, next) {
  const store = useGlobalStore();
  store.carregando = true;

  try {
    // Recupera o CNPJ logado da store ou localStorage
    const cnpj = store.cnpjLogado || localStorage.getItem("cnpj");

    if (!cnpj) {
      console.warn("CNPJ não encontrado, redirecionando para login");
      return next("/login");
    }

    // Chama a API e espera o retorno
    const empresa = await empresaService.buscarEmpresa(cnpj);
    // Se não veio empresa, redireciona para erro
    if (!empresa) {
      console.warn("Empresa não encontrada para o CNPJ:", cnpj);
      return next("/erro");
    }

    const parametro = await parametroService.buscarParametro(
      empresa[0].idEmpresa
    );

    // Salva a empresa na store global
    store.definirObjetoEmpresaLogada(empresa[0]);
    store.atualizarObjParametro(parametro);
    // Continua para a rota
    return next();
  } catch (erro) {
    console.error("Erro ao carregar dados do menu:", erro);
    return next("/erro");
  } finally {
    store.carregando = false;
  }
}
