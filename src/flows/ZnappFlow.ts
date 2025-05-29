import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";

export const ZnappFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    await provider.sendText(
      ctx.from,
      "✅ ¡Perfecto! Znapp es nuestra red de colaboradores distribuidos en todo el país para hacer auditorías, chequeos, relevamientos y tareas en campo sin que tengas que tener equipo propio.\n\n📍 Paso 1: ¿En cuántas ubicaciones tenés presencia o te gustaría explorar?\n\nA. 1 - 20\nB. Entre 21 y 50\nC. Entre 51 y 100\nD. Más de 100"
    );
    
    await state.update({ currentStep: "ubicaciones" });
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      const currentStep = await state.get("currentStep");
      
      if (currentStep === "ubicaciones") {
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
          return provider.sendText(
            ctx.from,
            "Por favor, elegí una opción válida:\nA. 1 - 20\nB. Entre 21 y 50\nC. Entre 51 y 100\nD. Más de 100"
          );
        }
        
        await state.update({ 
          ubicaciones: ubicacionesRange,
          currentStep: "localizacion" 
        });
        
        await provider.sendText(
          ctx.from,
          "🗺️ Paso 2: ¿Dónde están aproximadamente esas ubicaciones?\n\n(Escribí acá donde están ubicadas)"
        );
        
      } else if (currentStep === "localizacion") {
        await state.update({ 
          localizacion: ctx.body,
          currentStep: "empresa" 
        });
        
        await provider.sendText(
          ctx.from,
          "🏢 Paso 3: ¿A qué se dedica tu empresa?\n\n(Ej.: Consumo masivo, retail, logística, servicios, etc.)"
        );
        
      } else if (currentStep === "empresa") {
        await state.update({ 
          empresa: ctx.body,
          currentStep: "contacto" 
        });
        
        await provider.sendText(
          ctx.from,
          "🕐 Paso 4: ¿Querés que alguien del equipo te llame?\n\n1️⃣ Sí, quiero hablar ahora\n2️⃣ Quiero que me contacten más tarde (escribí cuándo te queda cómodo)"
        );
        
      } else if (currentStep === "contacto") {
        const userChoice = ctx.body.toLowerCase();
        const stateData = await state.getMyState();
        
        // Guardar preferencia de contacto
        let contactoPreferencia = "";
        if (userChoice.includes("1") || userChoice.includes("ahora") || userChoice.includes("sí")) {
          contactoPreferencia = "Quiere ser contactado ahora";
        } else if (userChoice.includes("2") || userChoice.includes("tarde") || userChoice.includes("después")) {
          contactoPreferencia = `Quiere ser contactado más tarde: ${ctx.body}`;
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
      }
      
    } catch (error) {
      console.error("[Error ZnappFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  });
