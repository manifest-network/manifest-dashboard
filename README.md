# manifest-dashboard

A modern dashboard featuring:

- TypeScript
- Skeleton UI components
- Theming (light/dark)
- Charting with Carbon Charts
- Carbon pictograms

## Getting Started

Clone this repository and install dependencies:

```bash
git clone https://github.com/liftedinit/manifest-dashboard.git
cd manifest-dashboard
bun install
```

## Development

Start the development server:

```bash
bun dev
```

## Environment Variables

Create a `.env` file in the root directory and add your environment variables. For example:

```env
VITE_RPC_PROXY_TARGET=http://your-api-server:3000
```

Restart the dev server after changing `.env`.

## Building for Production

Build the project for production:

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

## Production

Set the `VITE_RPC_PROXY_TARGET` environment variable to the API server URL in a `.env` file. This is required for the application to function correctly in production.

```env
VITE_RPC_PROXY_TARGET=http://your-api-server:3000
```

Build the production build using

```bash
bun run build
```
This will create an optimized build in the `build` directory. Run the server using

```bash
node build
```

You can change the port by setting the `PORT` environment variable:

```bash
PORT=3001 node build
```

You can tell the application where the application is being served by setting the `ORIGIN` environment variable:

```bash
ORIGIN=http://localhost:3001 node build
```

You can find more information in the [Svelte Node servers](https://svelte.dev/docs/kit/adapter-node) documentation.