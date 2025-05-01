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