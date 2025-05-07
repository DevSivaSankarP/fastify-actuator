import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

export interface HealthCheckOptions extends FastifyPluginOptions {
  prefix?: string;
}

async function healthCheckPlugin(
  fastify: FastifyInstance,
  options: HealthCheckOptions
) {
  const prefix = options.prefix || '/actuator';

  fastify.register(async function (instance) {
    instance.get('/health', async () => {
      return { status: 'up' };
    });
  }, { prefix });
}

export default fp(healthCheckPlugin, {
  name: 'fastify-health-check'
});
