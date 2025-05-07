# Fastify Actuator

A lightweight Fastify plugin that adds a customizable health check endpoint to your Fastify applications. Inspired by Spring Boot's actuator endpoints, this plugin provides a simple way to monitor your application's health status.

## Features

- 🚀 Simple health check endpoint
- ⚙️ Customizable endpoint prefix
- 📦 Written in TypeScript
- 🔌 Easy to integrate with Fastify applications

## Installation

```bash
npm install fastify-actuator
```

## Usage

```typescript
import fastify from 'fastify';
import healthCheck from 'fastify-actuator';

const app = fastify();

// Register the plugin with default options
app.register(healthCheck);

// Or with custom prefix
app.register(healthCheck, {
  prefix: '/custom-prefix'
});
```

The health check endpoint will be available at:
- Default: `GET /actuator/health`
- Custom: `GET /custom-prefix/health`

Response:
```json
{
  "status": "up"
}
```

## Options

| Option  | Type     | Default     | Description                    |
|---------|----------|-------------|--------------------------------|
| prefix  | string   | '/actuator' | Custom prefix for the endpoint |

## License

ISC 