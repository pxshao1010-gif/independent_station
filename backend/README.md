# Independent Station — Backend (local dev)

Quick Express backend for local development. Uses JSON files under `./data/` as a light-weight store so we can integrate a DB later.

Run:

```bash
cd backend
npm install
node index.js
# or for live reload (if you install nodemon globally): npm run dev
```

Endpoints:
- `GET /api/products` — list products
- `GET /api/products/:id` — product detail
- `POST /api/checkout` — submit order payload `{cart, customer}`. Returns `{orderId, paymentUrl}` and stores order in `data/orders.json`.
- `GET /knet/mock?orderId=...` — mock KNET return URL (marks order paid)

Notes:
- Real KNET integration requires merchant credentials and a server-to-server callback; this repo mocks the flow so you can develop frontend and checkout UI locally.
