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

This app uses the Xpander production Backend as a Service by default. No additional configuration is needed if your environment variables are set.

```ts
// src/api/tasks.ts
const xpanderClient = new XpanderClient(import.meta.env.VITE_APP_API_KEY!);
```

The `fetchLogs` function will load logs from `https://actions.xpander.ai`.
```
