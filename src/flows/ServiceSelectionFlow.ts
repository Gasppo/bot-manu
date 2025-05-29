import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";
import { ZnappFlow } from "./ZnappFlow";
import { ZnappLiteFlow } from "./ZnappLiteFlow";
import { HumanHandoverFlow } from "./HumanHandoverFlow";

export const ServiceSelectionFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction({ capture: true }, async (ctx, { provider, state, gotoFlow, endFlow }) => {
    try {
      const userChoice = ctx.body.toLowerCase();

      if (userChoice.includes("1") || userChoice.includes("znapp") && !userChoice.includes("lite")) {
        return gotoFlow(ZnappFlow);
      }

      if (userChoice.includes("2") || userChoice.includes("lite")) {
        return gotoFlow(ZnappLiteFlow);
      }

      await provider.sendButtons(
        ctx.from,
        [
          { body: "Volver al menú" }
        ],
        "💬 Te estamos contactando con alguien del equipo.\n\nMientras tanto, si querés ir leyendo nuestras preguntas frecuentes, podés visitar:\n\n🔗 znapp.la\n\nSi quieres cancelar la solicitud, pulsa el boton de volver al menu"
      );

      await state.update({
        humanHandoverStartTime: new Date(),
      });
      
      return gotoFlow(HumanHandoverFlow);

    } catch (error) {
      console.error("[Error ServiceSelectionFlow]:", error);
      return endFlow("Ocurrió un error. Por favor, intenta de nuevo.");
    }
  });
