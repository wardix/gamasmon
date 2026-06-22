# Gemini Project Context: gamasmon

## Project Overview
`gamasmon` is a Prometheus exporter + monitoring dashboard for detecting mass outages (Gangguan Massal/Gamas) in FTTX networks. It fetches alert data from Karma, clusters alerts by time proximity, and exposes results as both Prometheus metrics and a JSON API consumed by a React dashboard.

- **Purpose:** Monitor FTTX network health by identifying clusters of subscriber-offline alerts.
- **Primary Technologies:** [Bun](https://bun.sh/), [Hono](https://hono.dev/), TypeScript (backend); [Vite](https://vite.dev/), [React](https://react.dev/), [daisyUI](https://daisyui.com/), TypeScript (frontend).
- **Data Source:** Karma (Alertmanager UI) JSON API.

## Architecture

### Backend (`src/`)
1.  **`src/server.ts`**: Hono web server entry point.
    - `GET /api/clusters` — JSON API for the dashboard
    - `GET /metrics` — Prometheus scrape endpoint
    - `GET /healthz` — health check
    - Production mode: serves frontend static files from `frontend/dist/`
    - CORS enabled for `/api/*` routes

2.  **`src/metrics.ts`**: Core logic.
    - **Types:** `ClusterSummary`, `ClusterResponse`, `ParsedAlert`
    - **`getClusteredAlerts()`**: Fetches from Karma, parses alerts, clusters by operator + time
    - **`getClusterResponse()`**: Returns JSON-friendly cluster data for the API
    - **`buildMetrics()`**: Formats Prometheus text exposition

3.  **`src/cli.ts`**: CLI tool for debugging clusters in terminal.

### Frontend (`frontend/`)
- Vite + React + TypeScript SPA
- daisyUI v5 + Tailwind CSS v4 for styling (dark theme default)
- Components: Header, StatsRow, FilterBar, ClusterCard, ClusterGrid, EmptyState, LoadingState
- Features: auto-refresh (30s), operator filter, mass outage filter, label search
- Vite dev server proxies `/api` to backend at port 3000

## Building and Running

### Prerequisites
- [Bun](https://bun.sh/) for backend
- [Node.js](https://nodejs.org/) (npm) for frontend

### Development
```bash
# Backend
bun install
bun run dev  # port 3000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev  # port 5173
```

### Production
```bash
cd frontend && npm run build && cd ..
bun run start  # NODE_ENV=production, serves frontend/dist
```

### CLI
```bash
bun run cli
```

### Configuration (Environment Variables)
- `PORT`: Port the exporter listens on (default: `3000`)
- `KARMA_URL`: URL to the Karma alerts JSON endpoint
- `THRESHOLD_MINUTES`: Max time gap between alerts in same cluster (default: `2`)
- `MIN_GROUP_SIZE`: Min alerts for mass outage classification (default: `15`)
- `MAX_ALERT_AGE_DAYS`: Max alert age to consider (default: `7`)

## Development Conventions
- **Runtime:** Bun APIs (`Bun.env`, `Bun.serve`, `fetch`) for backend
- **Type Safety:** Strict TypeScript types shared between backend and frontend
- **Functional Logic:** Pure clustering and formatting logic in `src/metrics.ts`
- **Metrics Format:** Prometheus text-based exposition format
- **Frontend:** daisyUI v5 + Tailwind CSS v4, no additional UI libraries, custom CSS only for animations
