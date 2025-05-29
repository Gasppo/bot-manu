import { EVENTS } from "@builderbot/bot";
import { createMetaFlow } from "../provider";
import { FallbackFlow } from "./FallbackFlow";

export const HumanHandoverFlow = createMetaFlow([
    EVENTS.ACTION,
]).addAction({ capture: true }, async (ctx, { provider, state, endFlow, gotoFlow, fallBack }) => {
    try {
        const userChoice = ctx.body.toLowerCase();
        const humanHandoverStartTime = state.get("humanHandoverStartTime");

        if (new Date().getTime() - new Date(humanHandoverStartTime).getTime() > 60 * 60 * 1000) {
            await provider.sendText(
                ctx.from,
                "El tiempo de espera ha expirado. Por favor, vuelve a intentarlo y nos pondremos en contacto contigo lo antes posible.");
            return endFlow("Tiempo de espera agotado.");
        }

        if (userChoice.includes("volver al menú")) {
            await provider.sendText(
                ctx.from,
                "Redirigiendo...");
            return gotoFlow(FallbackFlow);
        }

        return fallBack("");

    } catch (error) {
        console.error("[Error HumanHandoverFlow]:", error);
        return endFlow("Ocurrió un error. Por favor, intenta de nuevo.");
    }
});