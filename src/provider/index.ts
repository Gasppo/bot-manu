import { MetaProvider } from "@builderbot/provider-meta";
import { config } from "../config";
import { addKeyword, MemoryDB } from "@builderbot/bot";

export const provider = new MetaProvider({
  jwtToken: config.JWT_TOKEN,
  numberId: config.NUMBER_ID,
  verifyToken: config.VERIFY_TOKEN,
  version: config.VERSION,
  port: config.PORT,
});

export const createMetaFlow = (keywords: string | [string, ...string[]]) => addKeyword<MetaProvider, MemoryDB>(keywords);
