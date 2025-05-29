import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";
import { ZnappFlow } from "./ZnappFlow";
import { ZnappLiteFlow } from "./ZnappLiteFlow";

export const ServiceSelectionFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction({ capture: true }, async (ctx, { provider, gotoFlow, endFlow }) => {
    try {
      const userChoice = ctx.body.toLowerCase();
      
      if (userChoice.includes("1") || userChoice.includes("znapp") && !userChoice.includes("lite")) {
        // Import ZnappFlow here to avoid circular dependencies
        return gotoFlow(ZnappFlow);
      }
      
      if (userChoice.includes("2") || userChoice.includes("lite")) {
        // Import ZnappLiteFlow here to avoid circular dependencies
        return gotoFlow(ZnappLiteFlow);
      }
      
      if (userChoice.includes("3") || userChoice.includes("otro")) {
        await provider.sendText(
          ctx.from,
          "💬 Te estamos contactando con alguien del equipo.\n\nMientras tanto, si querés ir leyendo nuestras preguntas frecuentes, podés visitar:\n\n🔗 znapp.la"
        );
        return endFlow();
      }
      
      // Si no coincide con ninguna opción, volver a preguntar
      await provider.sendText(
        ctx.from,
        "Por favor, elegí una de las opciones:\n\n1️⃣ Znapp\n2️⃣ Znapp Lite\n3️⃣ Otro tema puntual"
      );
      
    } catch (error) {
      console.error("[Error ServiceSelectionFlow]:", error);
      return endFlow("Ocurrió un error. Por favor, intenta de nuevo.");
    }
  });
