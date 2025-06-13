import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

export interface EnvEndpointOptions extends FastifyPluginOptions {
  prefix?: string;
  settings?: string | string[];
}

function extractDefaultsFromSettingsFile(
  fileContent: string
): Record<string, string> {
  const result: Record<string, string> = {};
  // Regex to match: KEY: TYPE({ default: VALUE, ... })
  const regex = /(\w+):\s*\w+\(\s*{[^}]*default:\s*([^,}]+)[^}]*}\s*\)/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    const key = match[1];
    let value = match[2].trim();

    // Remove quotes if present
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    } else if (value === "true" || value === "false") {
      value = value === "true" ? "true" : "false";
    } else if (!isNaN(Number(value))) {
      value = String(Number(value));
    }
    result[key] = value;
  }
  return result;
}

function readEnvFiles(settings?: string | string[]) {
  const inputFiles = settings
    ? Array.isArray(settings)
      ? settings
      : [settings]
    : ["./settings.ts"];

  const filesSet = new Set(inputFiles); // removes duplicates
  filesSet.delete(".env"); // ensure .env is not in the middle

  const files = [...filesSet, ".env"]; // always process .env last

  return files.reduce<Record<string, string>>((envVars, file) => {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) return envVars;

    const content = fs.readFileSync(filePath, "utf8");

    const parsed = file.endsWith(".env")
      ? dotenv.parse(content)
      : file.endsWith(".ts") || file.endsWith(".js")
      ? extractDefaultsFromSettingsFile(content)
      : {};

    return { ...envVars, ...parsed };
  }, {});
}

async function envEndpointPlugin(
  fastify: FastifyInstance,
  options: EnvEndpointOptions
) {
  const envVars = readEnvFiles(options.settings);
  if (!options.prefix) {
    fastify.register(
      async function (instance) {
        instance.get("/env", async () => {
          return envVars;
        });
      },
      { prefix: "/actuator" }
    );
  } else {
    fastify.register(
      async function (instance) {
        instance.get("/env", async () => {
          return envVars;
        });
      },
      { prefix: options.prefix }
    );
  }
}

export default fp(envEndpointPlugin, {
  name: "fastify-env-endpoint",
});
