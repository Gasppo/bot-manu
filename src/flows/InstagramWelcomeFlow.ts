import { addKeyword } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";
import { ServiceSelectionFlow } from "./ServiceSelectionFlow";

// Este flujo maneja específicamente el mensaje que viene desde Instagram
export const InstagramWelcomeFlow = addKeyword<MetaProvider>([
  "Hola, quiero más información sobre Znapp"
]).addAction(async (ctx, { provider, gotoFlow }) => {
  try {
    await provider.sendText(
      ctx.from,
      "👋 ¡Hola! Gracias por escribirnos desde Instagram.\n\nQueremos ayudarte de la mejor manera posible. Para eso, contanos un poco más sobre lo que necesitás:\n\n¿Qué servicio te interesa?\n\n1️⃣ Znapp – Necesito hacer tareas en campo y no tengo equipo propio\n\n2️⃣ Znapp Lite – Tengo equipo en la calle y necesito organizar su trabajo\n\n3️⃣ Otro tema puntual (consultá por acá)"
    );
    
    // Redirigir al flujo de selección de servicios
    return gotoFlow(ServiceSelectionFlow);
    
  } catch (error) {
    console.error("[Error InstagramWelcomeFlow]:", error);
    return provider.sendText(ctx.from, "Ocurrió un error. Por favor, intenta de nuevo.");
  }
});
