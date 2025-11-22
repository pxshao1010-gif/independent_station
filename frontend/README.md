# Independent Station — Frontend (local dev)

This is a minimal Vite + React frontend for local development. It demonstrates product listing, cart and a mock KNET checkout flow.

Run locally:

```bash
cd frontend
npm install
npm run dev
```

By default the frontend calls the backend at `http://localhost:4000`. You can change that by setting `VITE_API_BASE` in your environment.

Notes:
- KNET is mocked by the backend at `/knet/mock`.
- This is a simple scaffold — production should add proper routing, forms validation, error handling, accessibility and real payment integration.
