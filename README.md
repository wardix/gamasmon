# gamasmon

Monitoring dashboard + Prometheus exporter untuk mendeteksi gangguan massal (Gamas) FTTX dari data Karma.

## Arsitektur

```
gamasmon/
├── src/
│   ├── server.ts        # Hono backend: API + metrics + static files
│   └── metrics.ts       # Clustering logic + Prometheus format + JSON API
├── frontend/            # Vite + React + daisyUI dashboard
│   ├── src/
│   │   ├── App.tsx          # Main app
│   │   ├── components/      # UI components
│   │   └── types.ts         # TypeScript types
│   ├── index.html
│   └── vite.config.ts
├── package.json
└── .env
```

## Endpoint

| Endpoint | Fungsi |
|----------|--------|
| `GET /` | Dashboard (production) / ok (development) |
| `GET /api/clusters` | JSON: semua cluster + info gangguan massal |
| `GET /metrics` | Prometheus metrics |
| `GET /healthz` | Health check |

## Metric

```text
# HELP fttx_mass_outage_active Whether a mass outage is currently detected.
# TYPE fttx_mass_outage_active gauge
fttx_mass_outage_active{operator="Iforte",started_at="2026-04-23 18:27"} 1
```

## Konfigurasi

Salin `.env.example` menjadi `.env`, lalu sesuaikan:

```env
PORT=3000
KARMA_URL=https://nmx.example.com/karma/alerts.json?q=alertname%3Dfttx%20subscriber%20offline
THRESHOLD_SECONDS=120
MIN_GROUP_SIZE=15
MAX_ALERT_AGE_DAYS=7
```

| Variable | Default | Fungsi |
|----------|---------|--------|
| `PORT` | `3000` | Port HTTP server |
| `KARMA_URL` | `https://nmx.example.com/...` | URL sumber alert Karma |
| `THRESHOLD_SECONDS` | `120` | Jarak waktu maks (detik) antar alert dalam satu cluster |
| `MIN_GROUP_SIZE` | `15` | Jumlah minimum alert agar dianggap gangguan massal |
| `MAX_ALERT_AGE_DAYS` | `7` | Umur maksimal alert yang diproses (hari) |

## Development

### Backend

```bash
bun install
bun run dev
```

Backend berjalan di port 3000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di port 5173. API calls di-proxy ke backend via Vite.

## Production

Build frontend lalu jalankan backend:

```bash
cd frontend && npm install && npm run build && cd ..
bun run start
```

Backend akan serve static files dari `frontend/dist/`.

## Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: gamasmon
    metrics_path: /metrics
    static_configs:
      - targets:
          - 127.0.0.1:3000
```
