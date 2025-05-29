import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";

export const ZnappFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    try {
      await provider.sendText(
        ctx.from,
        "✅ ¡Perfecto! Znapp es nuestra red de colaboradores distribuidos en todo el país para hacer auditorías, chequeos, relevamientos y tareas en campo sin que tengas que tener equipo propio.\n\n📍 Paso 1: ¿En cuántas ubicaciones tenés presencia o te gustaría explorar?\n\nA. 1 - 20\nB. Entre 21 y 50\nC. Entre 51 y 100\nD. Más de 100"
      );
    } catch (error) {
      console.error("[Error ZnappFlow]:", error);
      return provider.sendText(ctx.from, "Ocurrió un error. Por favor, intenta de nuevo.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow, fallBack }) => {
    try {
      // Validar respuesta del Paso 1
      const userChoice = ctx.body.toLowerCase();
      let ubicacionesRange = "";
      
      if (userChoice.includes("a") || userChoice.includes("1") || userChoice.includes("20")) {
        ubicacionesRange = "1-20";
      } else if (userChoice.includes("b") || userChoice.includes("21") || userChoice.includes("50")) {
        ubicacionesRange = "21-50";
      } else if (userChoice.includes("c") || userChoice.includes("51") || userChoice.includes("100")) {
        ubicacionesRange = "51-100";
      } else if (userChoice.includes("d") || userChoice.includes("más") || userChoice.includes("100")) {
        ubicacionesRange = "Más de 100";
      } else {
        return fallBack(
          "Por favor, elegí una opción válida:\nA. 1 - 20\nB. Entre 21 y 50\nC. Entre 51 y 100\nD. Más de 100"
        );
      }
      
      await state.update({ 
        ubicaciones: ubicacionesRange,
      });
      
      await provider.sendText(
        ctx.from,
        "🗺️ Paso 2: ¿Dónde están aproximadamente esas ubicaciones?\n\n(Escribí acá donde están ubicadas)"
      );
      
    } catch (error) {
      console.error("[Error ZnappFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      // Validar respuesta del Paso 2
      await state.update({
        localizacion: ctx.body,
      });

      await provider.sendText(
        ctx.from,
        "🏢 Paso 3: ¿A qué se dedica tu empresa?\n\n(Ej.: Consumo masivo, retail, logística, servicios, etc.)"
      );
    } catch (error) {
      console.error("[Error ZnappFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      // Validar respuesta del Paso 3
      await state.update({ 
        empresa: ctx.body,
      });
      
      await provider.sendButtons(
        ctx.from,
        [
          { body: "Hablar ahora" }, 
          { body: "Contactar luego" }
        ],
        "🕐 Paso 4: ¿Querés que alguien del equipo te llame?"
      );
      
    } catch (error) {
      console.error("[Error ZnappFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      const userChoice = ctx.body.toLowerCase();
      const stateData = state.getMyState();
      
      // Guardar preferencia de contacto
      let contactoPreferencia = "";
      if (userChoice.includes("ahora") || userChoice.includes("sí")) {
        contactoPreferencia = "Quiere ser contactado ahora";
      } else if (userChoice.includes("luego") || userChoice.includes("contactar")) {
        contactoPreferencia = "Quiere ser contactado luego";
      } else {
        contactoPreferencia = `Horario preferido: ${ctx.body}`;
      }
      
      // Mensaje final con resumen
      const resumen = `✅ ¡Perfecto! Hemos registrado tu información:\n\n📍 Ubicaciones: ${stateData.ubicaciones}\n🗺️ Localización: ${stateData.localizacion}\n🏢 Empresa: ${stateData.empresa}\n🕐 Contacto: ${contactoPreferencia}\n\n¡Nos contactaremos contigo pronto! 🚀`;
      
      await provider.sendText(ctx.from, resumen);
      
      // Aquí podrías enviar la información a un sistema CRM o base de datos
      console.log("Nueva consulta Znapp:", {
        telefono: ctx.from,
        ubicaciones: stateData.ubicaciones,
        localizacion: stateData.localizacion,
        empresa: stateData.empresa,
        contacto: contactoPreferencia,
        timestamp: new Date().toISOString()
      });
      
      return endFlow();
      
    } catch (error) {
      console.error("[Error ZnappFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  });
