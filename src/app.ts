import { createBot, MemoryDB } from "@builderbot/bot";
import { JsonFileDB } from "@builderbot/database-json";
import { config } from "./config";
import { provider } from "./provider";
import flows from "./flows";
import { IncomingMessage, ServerResponse } from "http";
// import { createDevRoutes } from "./devRoutes";

const main = async () => {
    try {
        console.log("🚀 Iniciando Znapp Bot...");

        const bot = await createBot(
            {
                flow: flows,
                provider,
                database: new MemoryDB(),
            },
            {
                queue: {
                    timeout: 20000,
                    concurrencyLimit: 50,
                },
            }
        );

        // Health check endpoint
        provider.server.get(
            "/v1/health",
            (req: IncomingMessage, res: ServerResponse) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({
                        status: "ok",
                        service: "Znapp WhatsApp Bot",
                        version: "1.0.0",
                        timestamp: new Date().toISOString(),
                    })
                );
            }
        );

        // Additional status endpoint
        provider.server.get("/v1/status", (res: any) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                status: "running",
                service: "Znapp WhatsApp Bot",
                version: "1.0.0",
                flows: ["WelcomeFlow", "InstagramWelcomeFlow", "ServiceSelectionFlow", "ZnappFlow", "ZnappLiteFlow"],
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }));
        });

        // Add development routes
        // createDevRoutes(provider.server);
        bot.httpServer(+config.PORT);
        // console.log(`✅ Znapp Bot iniciado en puerto ${config.PORT}`);
        // console.log(`🌐 Health check: http://localhost:${config.PORT}/v1/health`);
        // console.log(`📋 Status: http://localhost:${config.PORT}/v1/status`);
        // console.log(`🔗 Webhook: http://localhost:${config.PORT}/webhook`);
        // console.log(`📱 Instagram link: wa.me/5491140887031?text=Hola%2C%20quiero%20más%20información%20sobre%20Znapp`);

    } catch (error) {
        console.error("❌ Error al iniciar el bot:", error);
        process.exit(1);
    }
};

main();
