import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";

export const ZnappLiteFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    await provider.sendText(
      ctx.from,
      "✅ Genial. Znapp Lite es nuestro software para planificar, seguir y obtener evidencia del trabajo de tu equipo en campo.\n\n🏢 Paso 1: ¿A qué se dedica tu empresa?\n\n(Escribí el rubro de tu empresa)"
    );
    
    await state.update({ currentStep: "empresa" });
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      const currentStep = await state.get("currentStep");
      
      if (currentStep === "empresa") {
        await state.update({ 
          empresa: ctx.body,
          currentStep: "equipo" 
        });
        
        await provider.sendText(
          ctx.from,
          "👥 Paso 2: ¿Cuántas personas tienen aproximadamente en el equipo de calle?\n\nA. 1 a 5 personas\nB. Entre 6 y 20\nC. Más de 20"
        );
        
      } else if (currentStep === "equipo") {
        // Validar respuesta del Paso 2
        const userChoice = ctx.body.toLowerCase();
        let equipoTamano = "";
        
        if (userChoice.includes("a") || userChoice.includes("1") || userChoice.includes("5")) {
          equipoTamano = "1 a 5 personas";
        } else if (userChoice.includes("b") || userChoice.includes("6") || userChoice.includes("20")) {
          equipoTamano = "Entre 6 y 20 personas";
        } else if (userChoice.includes("c") || userChoice.includes("más") || userChoice.includes("20")) {
          equipoTamano = "Más de 20 personas";
        } else {
          return provider.sendText(
            ctx.from,
            "Por favor, elegí una opción válida:\nA. 1 a 5 personas\nB. Entre 6 y 20\nC. Más de 20"
          );
        }
        
        await state.update({ 
          equipo: equipoTamano,
          currentStep: "contacto" 
        });
        
        await provider.sendText(
          ctx.from,
          "🕐 Paso 3: ¿Querés que alguien del equipo te llame?\n\n1️⃣ Sí, quiero hablar ahora\n2️⃣ Quiero que me contacten más tarde (escribí cuándo te queda cómodo)"
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
        const resumen = `✅ ¡Perfecto! Hemos registrado tu información:\n\n🏢 Empresa: ${stateData.empresa}\n👥 Tamaño del equipo: ${stateData.equipo}\n🕐 Contacto: ${contactoPreferencia}\n\n¡Nos contactaremos contigo pronto! 🚀`;
        
        await provider.sendText(ctx.from, resumen);
        
        // Aquí podrías enviar la información a un sistema CRM o base de datos
        console.log("Nueva consulta Znapp Lite:", {
          telefono: ctx.from,
          empresa: stateData.empresa,
          equipo: stateData.equipo,
          contacto: contactoPreferencia,
          timestamp: new Date().toISOString()
        });
        
        return endFlow();
      }
      
    } catch (error) {
      console.error("[Error ZnappLiteFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  });
