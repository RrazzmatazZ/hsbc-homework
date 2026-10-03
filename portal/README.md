# Property Intelligence Portal

The Next.js frontend for the Property Intelligence application. See the
[repository README](../README.md) for the complete architecture, Docker Compose
deployment and backend setup.

## Development

```bash
npm ci
npm run dev
```

The development server listens on http://localhost:3000 and expects:

- FastAPI at `PREDICTION_SERVICE_URL` (default `http://localhost:8000`).
- Spring Boot at `ANALYSIS_SERVICE_URL` (default `http://localhost:8080`).

Both variables are server-only. Browser requests use the route handlers under
`src/app/api`.

## Rendering model

- `src/app/market/page.tsx` is a React Server Component that loads the initial
  market summary.
- `src/app/market/market-client.tsx` owns filters and other interactive state.
- Estimator forms, charts, history, property tables and what-if dialogs are
  Client Components.
- API route handlers provide the BFF boundary for both backend services.

## Production checks

```bash
npm run lint
npm run build
npm start
```

The project uses Next.js standalone output for its production container.
