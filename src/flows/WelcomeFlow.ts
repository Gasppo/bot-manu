import { addKeyword, EVENTS } from "@builderbot/bot";
import { ServiceSelectionFlow } from "./ServiceSelectionFlow";
import { DetectIntentionFlow } from "./DetectIntentionFlow";

export const WelcomeFlow = addKeyword([
  EVENTS.WELCOME,
]).addAction(async (ctx, { provider, gotoFlow }) => {
  try {
    console.log("[WelcomeFlow] User initiated conversation:", ctx.from);
    return gotoFlow(DetectIntentionFlow);
  } catch (error) {
    console.error("[Error WelcomeFlow]:", error);
    return provider.sendText(ctx.from, "Ocurrió un error. Por favor, intenta de nuevo.");
  }
});
