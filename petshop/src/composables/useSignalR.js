// composables/useSignalR.js
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ref } from "vue";

const novoAgendamento = ref(null);
let connection = null;

export function useSignalR() {
  const startConnection = async () => {
    connection = new HubConnectionBuilder()
      .withUrl(process.env.VUE_APP_SIGNALR_URL) // Ajuste se for diferente
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("NovoAgendamentoRecebido", (agendamento) => {
      console.log("📥 Novo agendamento recebido:", agendamento);
      novoAgendamento.value = agendamento;
    });

    connection.onclose((error) => {
      console.warn("⚠️ Conexão encerrada:", error);
    });

    connection.onreconnecting((error) => {
      console.warn("🔄 Reconectando SignalR:", error);
    });

    connection.onreconnected(() => {
      console.log("✅ Reconectado ao SignalR");
    });

    try {
      await connection.start();
      console.log("✅ Conectado ao SignalR");
    } catch (err) {
      console.error("❌ Erro ao conectar SignalR:", err);
    }
  };

  const stopConnection = async () => {
    if (connection) {
      await connection.stop();
      console.log("🛑 SignalR desconectado");
    }
  };

  return {
    novoAgendamento,
    startConnection,
    stopConnection,
  };
}
