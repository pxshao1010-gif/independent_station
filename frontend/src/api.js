const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`)
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

export async function postCheckout(payload) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() }
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    // try parse json error, fallback to text (handles HTML error pages)
    let errBody
    try {
      errBody = await res.json()
    } catch (e) {
      errBody = (await res.text()).slice(0, 200)
    }
    throw new Error((errBody && errBody.error) ? errBody.error : `Checkout failed: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    try {
      const err = await res.json()
      throw new Error(err.error || 'Register failed')
    } catch (e) {
      const txt = await res.text().catch(() => '')
      throw new Error(txt || `Register failed: ${res.status}`)
    }
  }
  return res.json()
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    try {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    } catch (e) {
      const txt = await res.text().catch(() => '')
      throw new Error(txt || `Login failed: ${res.status}`)
    }
  }
  return res.json()
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/api/me`, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

export async function getCart() {
  const res = await fetch(`${API_BASE}/api/cart`, { headers: getAuthHeaders() })
  if (!res.ok) return []
  return res.json()
}

export async function postCart(cart) {
  const res = await fetch(`${API_BASE}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ cart }) })
  if (!res.ok) throw new Error('Failed to save cart')
  return res.json()
}

export async function getOrders() {
  const res = await fetch(`${API_BASE}/api/orders`, { headers: getAuthHeaders() })
  if (!res.ok) return []
  return res.json()
}

