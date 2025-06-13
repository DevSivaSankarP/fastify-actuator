# Fastify Actuator

A lightweight Fastify plugin that adds a customizable health check and env endpoint to your Fastify applications. Inspired by Spring Boot's actuator endpoints, this plugin provides a simple way to monitor your application.

## Features

- 🚀 Simple health check and env endpoint
- ⚙️ Customizable endpoint prefix
- 📦 Written in TypeScript
- 🔌 Easy to integrate with Fastify applications

## Installation

```bash
npm install fastify-actuator
```

## Usage

### Example: Health and Env Endpoints

```typescript
import fastify from 'fastify';
import { healthCheck, envEndpoint } from 'fastify-actuator';

const app = fastify();

// Register the health check endpoint
app.register(healthCheck);

// Register the env endpoint
app.register(envEndpoint);

// Or use custom prefixes/settings
// app.register(healthCheck, { prefix: '/custom-health' });
// app.register(envEndpoint, { prefix: '/custom-env', settings: './settings.ts' });

app.listen({ port: 3000 });
```

The endpoints will be available at:
- Health: `GET /actuator/health`
- Env: `GET /actuator/env`

Example responses:

**Health**
```json
{
  "status": "up"
}
```

**Env**
```json
{
  "PORT": "3000",
  "NODE_ENV": "development",
  "API_KEY": "your-api-key-here",
  "ENABLE_FEATURE_X": "false"
}
```

## multiRegister

`multiRegister` is a utility function that allows you to register multiple Fastify actuator plugins at once, applying the same options to all of them. This is useful for grouping endpoints under a common prefix or sharing configuration.

### Example: Using multiRegister

```typescript
import fastify from 'fastify';
import { healthCheck, envEndpoint, multiRegister } from 'fastify-actuator';

const app = fastify();

// Register both endpoints under a custom prefix and shared options
app.register(
  multiRegister([healthCheck, envEndpoint]),
  { prefix: '/custom', settings: ['./settings.ts', '.env'] }
);

app.listen({ port: 3000 });
```

This will expose:
- Health: `GET /custom/health`
- Env: `GET /custom/env`

## Options

| Option   | Type             | Default                      | Description                                                        | Endpoint     |
|----------|------------------|------------------------------|--------------------------------------------------------------------|--------------|
| prefix   | string           | '/actuator'                  | Custom prefix for the endpoint                                     | health, env  |
| settings | string\|string[] | ['./settings.ts', '.env']    | Path(s) to settings file(s) for default env values (TypeScript/JS) | env          |

## Environment Configuration

This plugin can read environment variables from both a `.env` file and a TypeScript `settings.ts` file. The `settings.ts` file allows you to define default values and types for your environment variables, while the `.env` file can override these defaults at runtime.

### Sample `.env`

```
PORT=3000
NODE_ENV=development
API_KEY=your-api-key-here
```

### Sample `settings.ts`

```typescript
export default {
  PORT: Number({ default: 8080 }),
  NODE_ENV: String({ default: 'production' }),
  API_KEY: String({ default: '' }),
  ENABLE_FEATURE_X: Boolean({ default: false })
};
```

- The plugin will merge values from `settings.ts` and `.env`, with `.env` taking precedence.
- You can specify a custom location for `settings.ts` and `.env` file via the `settings` option.

## Changelog

### 1.1.0
- Added `envEndpoint` for `/env` endpoint to expose merged environment and settings values.
- Updated options table, with accurate defaults.
- Improved usage examples for health and env endpoints.
- Fixed 1 low-severity vulnerability

### 1.0.0
- Initial release with health check endpoint (`/actuator/health`).

## Migration Guide: 1.0.0 → 1.1.0

- **New Env Endpoint:**
  - To use the new `/env` endpoint, import and register `envEndpoint` from `fastify-actuator`:
    ```typescript
    import { envEndpoint } from 'fastify-actuator';
    app.register(envEndpoint);
    ```
  - You can customize the prefix and settings file(s) as shown in the updated usage example.

- **Updated Imports:**
  - If you previously used the default import for health check, switch to named import:
    ```typescript
    import { healthCheck } from 'fastify-actuator';
    ```

- **Options Table:**
  - Review the new options table for updated defaults and descriptions.

- **No Breaking Changes:**
  - Existing health check usage will continue to work, but updating imports and reviewing new features is recommended.

## License

ISC 