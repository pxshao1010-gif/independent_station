const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// simple request logger for debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE) || [];
  res.json(products);
});

// --- Auth: register / login
app.post('/api/register', (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    console.log('register body:', { email, name })
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const users = readJson(USERS_FILE) || [];
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = { id: uuidv4(), email, name: name || '', passwordHash, cart: [], createdAt: new Date().toISOString() };
    users.push(user);
    writeJson(USERS_FILE, users);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    console.log('login attempt:', { email })
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const users = readJson(USERS_FILE) || [];
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    if (!bcrypt.compareSync(password, user.passwordHash)) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
});

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const users = readJson(USERS_FILE) || [];
    const user = users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE) || [];
  const p = products.find(x => String(x.id) === String(req.params.id));
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/api/checkout', (req, res) => {
  // Minimal order handling: save order and return a mock KNET payment URL
  const { cart, customer } = req.body;
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const orders = readJson(ORDERS_FILE) || [];
  const orderId = uuidv4();
  // attempt to read optional bearer token to associate order with a user
  let userId;
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET);
      userId = payload.userId;
    }
  } catch (e) {
    userId = undefined;
  }

  const order = {
    id: orderId,
    cart,
    customer: customer || {},
    status: 'pending',
    userId: userId,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  writeJson(ORDERS_FILE, orders);

  // Return a mock payment URL (in production this should be a KNET redirect)
  const mockPaymentUrl = `${req.protocol}://${req.get('host')}/knet/mock?orderId=${orderId}`;
  res.json({ orderId, paymentUrl: mockPaymentUrl });
});

// --- User endpoints (requires auth)
app.get('/api/me', authMiddleware, (req, res) => {
  const users = readJson(USERS_FILE) || [];
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const safe = { id: user.id, email: user.email, name: user.name, cart: user.cart || [] };
  res.json(safe);
});

app.get('/api/cart', authMiddleware, (req, res) => {
  const users = readJson(USERS_FILE) || [];
  const user = users.find(u => u.id === req.user.id);
  res.json(user ? (user.cart || []) : []);
});

app.post('/api/cart', authMiddleware, (req, res) => {
  const { cart } = req.body || {};
  if (!Array.isArray(cart)) return res.status(400).json({ error: 'cart must be an array' });
  const users = readJson(USERS_FILE) || [];
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx].cart = cart;
  writeJson(USERS_FILE, users);
  res.json({ ok: true });
});

app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = readJson(ORDERS_FILE) || [];
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

// Update: allow authenticated checkout to be created when Authorization header present


// Mock KNET endpoint to simulate a payment redirect and callback
app.get('/knet/mock', (req, res) => {
  const { orderId } = req.query;
  if (!orderId) return res.status(400).send('Missing orderId');
  // In real integration, KNET will redirect to your callback URL with payment status
  // Here we simulate immediate success and update the order
  const orders = readJson(ORDERS_FILE) || [];
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = 'paid';
    orders[idx].paidAt = new Date().toISOString();
    writeJson(ORDERS_FILE, orders);
  }

  res.send(`<html><body><h2>Mock KNET Payment</h2><p>Order ${orderId} marked as paid (mock).</p><p>Return to store.</p></body></html>`);
});

// Generic error handler - return JSON for errors when possible
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
