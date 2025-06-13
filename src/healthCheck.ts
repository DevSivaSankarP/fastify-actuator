import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export interface HealthCheckOptions extends FastifyPluginOptions {
  prefix?: string;
}

async function healthCheckPlugin(
  fastify: FastifyInstance,
  options: HealthCheckOptions
) {
  // If prefix is not set by the user, register the plugin with default prefix
  if (!options.prefix) {
    fastify.register(
      async function (instance) {
        instance.get("/health", async () => {
          return { status: "up" };
        });
      },
      { prefix: "/actuator" }
    );
  } else {
    fastify.register(
      async function (instance) {
        instance.get("/health", async () => {
          return { status: "up" };
        });
      },
      { prefix: options.prefix }
    );
  }
}

export default fp(healthCheckPlugin, {
  name: "fastify-health-check",
});
