import { ModelName } from "@builderbot-plugins/langchain/dist/types";
import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || "3008",
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || "",
  JWT_TOKEN: process.env.JWT_TOKEN || "",
  NUMBER_ID: process.env.NUMBER_ID || "",
  VERSION: process.env.VERSION || "v17.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  MODEL_NAME: process.env.MODEL_NAME || "gpt-4o",
  MODEL: (process.env.MODEL || "openai") as ModelName,
  API_KEY: process.env.API_KEY || "",
};
