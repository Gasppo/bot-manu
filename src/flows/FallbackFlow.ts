import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";
import { InstagramWelcomeFlow } from "./InstagramWelcomeFlow";
import { ServiceSelectionFlow } from "./ServiceSelectionFlow";

// Flujo para manejar mensajes no reconocidos
export const FallbackFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    try {
      // Verificar si ya se envió un mensaje de bienvenida reciente
      const lastWelcome = await state.get("lastWelcome");
      const now = Date.now();
      
      // Solo enviar mensaje si han pasado más de 5 minutos desde el último
      if (!lastWelcome || (now - lastWelcome) > 300000) {
        await provider.sendText(
          ctx.from,
          "👋 ¡Hola! Bienvenido/a a Znapp.\n\n¿En qué podemos ayudarte hoy?\n\n1️⃣ Znapp – Necesito hacer tareas en campo y no tengo equipo propio\n\n2️⃣ Znapp Lite – Tengo equipo en la calle y necesito organizar su trabajo\n\n3️⃣ Otro tema puntual (consultá por acá)\n\n💡 También podés escribir directamente tu consulta y te ayudaremos."
        );
        
        await state.update({ lastWelcome: now });
      }
    } catch (error) {
      console.error("[Error FallbackFlow]:", error);
      await provider.sendText(
        ctx.from, 
        "¡Hola! Gracias por contactarte con Znapp. ¿En qué podemos ayudarte?"
      );
    }
  });

// Flujo para manejar cualquier mensaje no capturado por otros flujos
export const CatchAllFlow = addKeyword<MetaProvider>([
  "ayuda", "help", "info", "información", "hola", "buenos días", "buenas tardes", "buenas noches"
]).addAction(async (ctx, { provider, gotoFlow }) => {
  try {
    const message = ctx.body.toLowerCase();
    
    // Si menciona Znapp o servicios específicos, dirigir al flujo apropiado
    if (message.includes("znapp") && message.includes("información")) {
      return gotoFlow(InstagramWelcomeFlow);
    }
    
    // Si menciona equipo o team, sugerir Znapp Lite
    if (message.includes("equipo") || message.includes("team") || message.includes("gestión")) {
      await provider.sendText(
        ctx.from,
        "🎯 Parece que podrías estar interesado en Znapp Lite, nuestra solución para gestionar equipos en campo.\n\n¿Te gustaría saber más sobre este servicio?\n\n1️⃣ Sí, contame sobre Znapp Lite\n2️⃣ No, quiero ver todas las opciones"
      );
      return;
    }
    
    // Respuesta general para otros casos
    await provider.sendText(
      ctx.from,
      "👋 ¡Gracias por contactarte!\n\nPara brindarte la mejor ayuda, elegí una opción:\n\n1️⃣ Znapp – Necesito hacer tareas en campo y no tengo equipo propio\n\n2️⃣ Znapp Lite – Tengo equipo en la calle y necesito organizar su trabajo\n\n3️⃣ Hablar con una persona del equipo\n\n¿Cuál te interesa más?"
    );
    
    // Redirigir al flujo de selección de servicios
    return gotoFlow(ServiceSelectionFlow);
    
  } catch (error) {
    console.error("[Error CatchAllFlow]:", error);
    await provider.sendText(
      ctx.from,
      "Disculpá, hubo un problema. ¿Podrías intentar de nuevo o contarme en qué te puedo ayudar?"
    );
  }
});
