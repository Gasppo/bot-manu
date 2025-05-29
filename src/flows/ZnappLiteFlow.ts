import { addKeyword, EVENTS } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";

export const ZnappLiteFlow = addKeyword<MetaProvider>(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    try {
      await provider.sendText(
        ctx.from,
        "✅ Genial. Znapp Lite es nuestro software para planificar, seguir y obtener evidencia del trabajo de tu equipo en campo.\n\n🏢 Paso 1: ¿A qué se dedica tu empresa?\n\n(Escribí el rubro de tu empresa)"
      );
    } catch (error) {
      console.error("[Error ZnappLiteFlow]:", error);
      return provider.sendText(ctx.from, "Ocurrió un error. Por favor, intenta de nuevo.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      // Validar respuesta del Paso 1
      await state.update({
        empresa: ctx.body,
      });

      await provider.sendButtons(
        ctx.from,
        [
          { body: "1 a 5 personas" },
          { body: "Entre 6 y 20" },
          { body: "Más de 20" }
        ],
        "👥 Paso 2: ¿Cuántas personas tienen aproximadamente en el equipo de calle?"
      );

    } catch (error) {
      console.error("[Error ZnappLiteFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow, fallBack }) => {
    try {
      // Validar respuesta del Paso 2
      const userChoice = ctx.body.toLowerCase();
      let equipoTamano = "";

      if (userChoice.includes("1") || userChoice.includes("5")) {
        equipoTamano = "1 a 5 personas";
      } else if (userChoice.includes("6") || userChoice.includes("20") || userChoice.includes("entre")) {
        equipoTamano = "Entre 6 y 20 personas";
      } else if (userChoice.includes("más")) {
        equipoTamano = "Más de 20 personas";
      } else {
        return fallBack(
          "Por favor, elegí una opción válida:\n1 a 5 personas\nEntre 6 y 20\nMás de 20"
        );
      }

      await state.update({
        equipo: equipoTamano,
      });

      await provider.sendButtons(
        ctx.from,
        [
          { body: "Hablar ahora" },
          { body: "Contactar luego" }
        ],
        "🕐 Paso 3: ¿Querés que alguien del equipo te llame?"
      );

    } catch (error) {
      console.error("[Error ZnappLiteFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  })
  .addAction({ capture: true }, async (ctx, { provider, state, endFlow }) => {
    try {
      const userChoice = ctx.body.toLowerCase();
      const stateData = await state.getMyState();

      // Guardar preferencia de contacto
      let contactoPreferencia = "";
      if (userChoice.includes("ahora") || userChoice.includes("sí")) {
        contactoPreferencia = "Quiere ser contactado ahora";
      } else if (userChoice.includes("tarde") || userChoice.includes("contactar")) {
        contactoPreferencia = "Quiere ser contactado más tarde";
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

    } catch (error) {
      console.error("[Error ZnappLiteFlow]:", error);
      return endFlow("Ocurrió un error. Nuestro equipo te contactará pronto.");
    }
  });
