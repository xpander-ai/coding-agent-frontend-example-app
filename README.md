# Task Management App

This is a simple frontend app built with React, TypeScript, Tailwind CSS and React Query.

## Development

```bash
npm install
npm run dev
npm run build
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root (gitignored) or use your preferred `.env.*` file format. Refer to `.env.example` for guidance:

```dotenv
.env.local (or .env)
VITE_APP_API_KEY=your_api_key_here
VITE_APP_AGENT_ID=your_agent_id_here
VITE_APP_ORGANIZATION_ID=your_organization_id_here
```

### Using Xpander Backend as a Service

By default, this app points to the Xpander staging backend (`https://inbound.stg.xpander.ai`). To use the Xpander production Backend as a Service, update the base URL in `src/api/tasks.ts`:

```ts
// src/api/tasks.ts
const xpanderClient = new XpanderClient(
  import.meta.env.VITE_APP_API_KEY!,
  'https://inbound.xpander.ai'
);
```

The `fetchLogs` function will automatically detect production vs. staging based on this base URL and load logs from `https://actions.xpander.ai`.
```
