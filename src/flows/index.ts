import { createFlow } from "@builderbot/bot";
import { DetectIntentionFlow } from "./DetectIntentionFlow";
import { WelcomeFlow } from "./WelcomeFlow";
import { InstagramWelcomeFlow } from "./InstagramWelcomeFlow";
import { ServiceSelectionFlow } from "./ServiceSelectionFlow";
import { ZnappFlow } from "./ZnappFlow";
import { ZnappLiteFlow } from "./ZnappLiteFlow";
import { FallbackFlow } from "./FallbackFlow";
import { HumanHandoverFlow } from "./HumanHandoverFlow";
// import { FallbackFlow, CatchAllFlow } from "./FallbackFlow";

export default createFlow([
  DetectIntentionFlow,   // AI-powered intention detection first
  InstagramWelcomeFlow,  // Más específico primero
  ServiceSelectionFlow,
  ZnappFlow,
  HumanHandoverFlow,
  ZnappLiteFlow,
  FallbackFlow,          // Fallback para EVENTS.WELCOME
  WelcomeFlow,           // General welcome
]);
