import { FastifyInstance, FastifyPluginOptions } from "fastify";

export function multiRegister(pluginsOrPlugin: any | any[]) {
  return async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
  ) {
    const plugins = Array.isArray(pluginsOrPlugin)
      ? pluginsOrPlugin
      : [pluginsOrPlugin];
    for (const plugin of plugins) {
      await fastify.register(plugin, options);
    }
  };
}
