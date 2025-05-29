import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { TFlow } from "@builderbot/bot/dist/types";
import { config } from "../config";
import { InstagramWelcomeFlow } from "./InstagramWelcomeFlow";
import { ServiceSelectionFlow } from "./ServiceSelectionFlow";
import { WelcomeFlow } from "./WelcomeFlow";
import { ZnappFlow } from "./ZnappFlow";
import { ZnappLiteFlow } from "./ZnappLiteFlow";
import { FallbackFlow } from "./FallbackFlow";

const intentionFlowMap: Record<string, TFlow> = {
    INSTAGRAM_WELCOME: InstagramWelcomeFlow,
    SERVICE_SELECTION: ServiceSelectionFlow,
    WELCOME: WelcomeFlow,
    ZNAPP: ZnappFlow,
    ZNAPP_LITE: ZnappLiteFlow,
};


export const DetectIntentionFlow = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: Object.keys(intentionFlowMap),
    description: `
      Eres un clasificador de intenciones para el bot de WhatsApp de Znapp en español.
      Znapp es una empresa que ofrece servicios de campo y gestión de equipos.
      
      Las intenciones posibles son:
      
      - INSTAGRAM_WELCOME: SOLO si el mensaje es exactamente "Hola, quiero más información sobre Znapp" (texto específico del enlace de Instagram).
      
      - ZNAPP: Si el usuario está interesado en servicios de campo SIN tener equipo propio. Ejemplos:
        * "Necesito hacer auditorías pero no tengo equipo"
        * "Quiero hacer relevamientos en campo"
        * "No tengo personal propio para tareas de campo"
        * "Necesito inspecciones en diferentes ciudades"
        * "Busco colaboradores para hacer trabajo en terreno"
        * Palabras clave: auditorías, relevamientos, inspecciones, campo, terreno, "no tengo equipo", "sin equipo propio"
      
      - ZNAPP_LITE: Si el usuario YA TIENE equipo y necesita organizarlo/gestionarlo. Ejemplos:
        * "Tengo un equipo en campo y necesito organizarlo"
        * "Mi equipo está en la calle y necesito control"
        * "Quiero gestionar mejor a mis empleados en campo"
        * "Necesito software para coordinar mi equipo"
        * "Tengo vendedores en la calle"
        * Palabras clave: "tengo equipo", "mi equipo", gestión, organizar, coordinar, software, control
      
      - WELCOME: Para saludos generales, mensajes iniciales, solicitudes de información general que no encajan en las categorías anteriores.
      
      IMPORTANTE: Distingue claramente entre quien NO tiene equipo (ZNAPP) vs quien SÍ tiene equipo (ZNAPP_LITE).
      
      Responde únicamente con la intención en mayúsculas.
    `,
  })
  .setAIModel({
    modelName: config.MODEL,
    args: {
      modelName: config.MODEL_NAME,
      apikey: config.API_KEY,
    },
  })
  .create({
    afterEnd(flow) {
      return flow.addAction(async (ctx, { state, gotoFlow }) => {
        console.log("[DetectIntentionFlow] New message:", `${ctx.from} - ${ctx.body}`);
        
        const intention: string = await state.get("intention");
        console.log("[DetectIntentionFlow] Detected intention:", intention);
        
        // Si la intención no coincide con ninguna, se redirige al flujo de bienvenida
        const targetFlow = intentionFlowMap[intention] || FallbackFlow;
        console.log("[DetectIntentionFlow] Redirecting to:", intention || "WELCOME");
        
        return gotoFlow(targetFlow);
      });
    },
  });
