# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Package Manager:** This project uses Bun. Use `bun` instead of `npm` or `yarn`.

### Common Commands

```bash
# Install dependencies
bun install

# Development server (runs on http://localhost:5173)
bun dev

# Type checking
bun run check
bun run check:watch

# Build for production
bun run build

# Build release (includes version update, sitemap, and robots.txt generation)
bun run build-release

# Preview production build
bun run preview

# Sitemap and robots.txt generation
bun run gen-sitemap
bun run gen-robots
```

## Architecture Overview

### Tech Stack

- **Framework:** SvelteKit with TypeScript
- **Styling:** Tailwind CSS 4.1 + Skeleton UI components
- **Charts:** LayerChart + D3.js for data visualization
- **Package Manager:** Bun
- **Server Adapter:** Node.js adapter (`@sveltejs/adapter-node`)

### Project Structure

```
src/
├── routes/                    # Page routes following SvelteKit file-based routing
│   ├── +page.server.ts       # Server-side data loading for home page
│   ├── +page.svelte          # Home page component
│   └── [details]/            # Detail pages for each metric category
│       ├── +page.server.ts   # Server loader for detail page
│       ├── +page.svelte      # Detail page UI
│       └── config.ts         # Chart configurations for that detail page
├── lib/
│   ├── components/           # Reusable Svelte components (cards, charts, etc.)
│   ├── loaders/              # Server-side data fetching utilities
│   ├── schemas/              # Zod schemas for API response validation
│   ├── stores/               # Svelte stores (currently just theme store)
│   ├── config/               # Application configuration
│   └── utils/                # Utility functions
└── assets/                   # Static assets (countries-110m.json for globe)
```

### Data Flow Architecture

1. **Routes & Server Loading:** Each route has a `+page.server.ts` file that defines the `load` function using SvelteKit's `PageServerLoad` type.

2. **Loader Pattern:** The `src/lib/loaders/` directory contains specialized loaders:
   - `createDataLoader()` and `createSingleLoader()` - Factory functions that return loaders
   - Specific loaders like `loadAggregateMetric()`, `loadLatestMetric()`, etc. - Wrapper functions
   - All loaders use `createDataLoader` or `createSingleLoader` internally
   - Loaders handle:
     - Time parameter extraction and validation from URL (interval, start date, end date)
     - API requests to `VITE_RPC_PROXY_TARGET`
     - Zod schema validation of responses
     - Error handling via SvelteKit's `error()` function

3. **Task Runner:** `runTasks()` utility in `src/lib/utils/runTasks.ts`:
   - Takes an object of loader functions and executes them in parallel
   - Uses `Promise.allSettled()` so failures don't block other loaders
   - Returns an object with data and error messages for each loader
   - Errors are passed to components, not thrown

4. **Component Rendering:** Svelte components receive the loaded data as props and render charts/cards.

### Configuration System

- **Chart Configs:** Each detail page route has a `config.ts` file defining an array of `ChartConfig` objects
- **Chart Config Structure:**
  - `id`: Unique identifier matching the API metric ID
  - `title`: String or function (receives latest data point)
  - `yAxisTitle`: Y-axis label
  - `type`: Determines which loader to use:
    - `"common"` / `"chain"` - Uses `loadAggregateMetric()` for API data
    - `"supply"` - Uses `loadAggregateSupplyMetric()` for supply metrics
    - `"cumsum"` - Uses `loadCumsumMetric()` for cumulative metrics
    - `"static"` - Uses `loadStaticMetric()` for hardcoded constant values
  - `staticValue`: Required when `type: "static"` - the constant number to display
  - `tooltipValueFormatter`: Optional function to format values in chart tooltips
  - `yAxisFormatter`: Optional function to format values on Y-axis

### API Integration

- **Proxy Setup:** Development proxies `/rpc` requests to `VITE_RPC_PROXY_TARGET` (configured in `vite.config.ts`)
- **Environment Variables:**
  - `VITE_RPC_PROXY_TARGET`: API server URL (default: `http://localhost:3000`)
  - `NETWORK`: Network type (testnet/mainnet) - affects which data is fetched
  - `LAUNCH_DATE`: Mainnet launch date (ISO format) - pre-launch data is filtered
  - `SITE_DOMAIN`: Domain for sitemap generation
  - `PORT`: Server port (default: 3000)
  - `ORIGIN`: Application origin for canonical URLs

- **API Response Format:** All responses are validated against Zod schemas in `src/lib/schemas/`
- **Time Parameters:** API requests include `p_from`, `p_to`, `p_interval`, `order` parameters

### Styling & Components

- **Tailwind CSS:** Used for layout and utility classes. Configured in `@tailwindcss/vite`
- **Skeleton UI:** Pre-built components from `@skeletonlabs/skeleton` (Cards, Buttons, etc.)
- **Theme:** Light/dark theme switching via `src/lib/stores/theme.ts`
- **Svelte 5:** Component syntax uses Runes API

### Data Visualization

- **LayerChart:** Charting library built on top of D3.js and Svelte
- **D3.js:** Used for low-level data transformations (especially for geospatial data)
- **Globe Visualization:** Uses D3 geo and TopoJSON for rendering world map

## Key Development Patterns

### Adding a New Detail Page

1. Create a new folder under `src/routes/[details-name]/`
2. Add `+page.server.ts` with a load function that calls `runTasks()` with loaders
3. Create `config.ts` with chart configurations matching your metric IDs
4. Add `+page.svelte` to render the charts using `<ChartCard>` components
5. Loaders will fetch data from the API using the metric IDs in config

### Adding a New Metric/Chart (API-backed)

1. Add the metric ID to `config.ts` in the appropriate route's config array
2. The server loader automatically creates tasks based on `type` - no manual wiring needed
3. Update the Zod schema in `src/lib/schemas/` if the response format is new
4. The `<ChartCard>` component will automatically render it using the config

### Adding a Static Chart (hardcoded value)

For charts that display a constant value without API calls:

```typescript
// In config.ts
{
  id: 'my_static_metric',
  title: (latest) => `My Metric: ${latest ? latest.value : "N/A"}`,
  yAxisTitle: 'Value',
  category: 'tokenomic',
  type: "static",
  staticValue: 42,  // The constant value to display
}
```

The `loadStaticMetric()` loader generates time-series data points at the same intervals as API-backed charts, rendering as a flat line.

### Handling Time Intervals

- Users select intervals via URL parameter: `?interval=1 week`, `?interval=1 year`, etc.
- Valid intervals (defined in `src/lib/utils/time.ts`):
  - `1 hour`, `1 day`, `1 week`, `1 month`, `3 months`, `1 year`
- Each interval maps to a data aggregation scale via `IntervalMap`:
  - `1 hour` / `1 day` → `1 minute` buckets
  - `1 week` → `1 hour` buckets
  - `1 month` / `3 months` → `5 hours` buckets
  - `1 year` → `12 hours` buckets
- `extractAndPrepareTimeParams()` converts intervals to API parameters (`p_interval`, `p_from`, `p_to`)

## Building & Deployment

- **Build Output:** Creates optimized bundle in `build/` directory
- **Docker:** Multi-stage Dockerfile provided. Requires `.env` file with `VITE_RPC_PROXY_TARGET`
- **SEO:** Sitemap and robots.txt are auto-generated during build (scripts: `generate_sitemap.js`, `generate_robots.js`)
- **Production Server:** Use `node build` with environment variables set

## Common File Patterns

- **Route files:** Named `+page.server.ts` (server load) and `+page.svelte` (UI component)
- **SvelteKit special files:** `$types` auto-generated type definitions, `$env/static/private` for env vars
- **Imports:** Use `$lib` alias for imports from `src/lib/`
