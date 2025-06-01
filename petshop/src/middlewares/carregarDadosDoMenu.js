// src/router/middlewares/carregarDadosDoMenu.js
import empresaService from "@/services/empresaService";
import { useGlobalStore } from "@/store/useGlobalStore";

export default async function carregarDadosDoMenu(to, from, next) {
  try {
    const store = useGlobalStore(); // Agora chamado dentro da função

    // Se quiser, mostrar loading
    store.carregando = true;

    const [empresa] = await Promise.all([
      empresaService.buscarEmpresa(store.cnpjLogado),
    ]);

    store.definirObjetoEmpresaLogada(empresa[0]);

    next();
  } catch (erro) {
    console.error("Erro ao carregar dados do menu:", erro);
    next("/erro");
  } finally {
    const store = useGlobalStore(); // de novo, dentro do escopo
    store.carregando = false;
  }
}
