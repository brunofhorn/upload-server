import { log } from "@/infra/logs/logger";
import type { FastifyInstance } from "fastify";

export async function healthCheckRoute(app: FastifyInstance) {
  app.get("/health", async (request, reply) => {
    log.info("Acessei a rota e deu certo");
    await reply.status(200).send({ message: "OK!" });
  });
}
