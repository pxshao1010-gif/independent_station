import React, { useEffect, useState } from 'react'
import { fetchProducts, postCheckout, getMe, postCart } from './api'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import Login from './components/Login'
import Register from './components/Register'
import Account from './components/Account'

const DEFAULT_LOCALE = 'en'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [locale, setLocale] = useState(DEFAULT_LOCALE)
  const [user, setUser] = useState(null)
  const [view, setView] = useState('home') // home, login, register, account
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    fetchProducts().then(setProducts)

    // if token present, fetch profile and cart
    const token = localStorage.getItem('token')
    if (token) {
      getMe().then(me => {
        setUser(me)
        setCart(me.cart || [])
      }).catch(() => {
        localStorage.removeItem('token')
      })
    }
  }, [])

  function addToCart(product, variant) {
    const id = `${product.id}-${variant.sku}`
    setCart(prev => {
      const found = prev.find(i => i.id === id)
      const next = found ? prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { id, productId: product.id, title: product[`title_${locale}`] || product.title_en, price: product.price, sku: variant.sku, qty: 1 }]
      // if logged in, persist cart
      if (user) postCart(next).catch(() => {})
      return next
    })
  }

  function updateQty(id, qty) {
    setCart(prev => {
      const next = prev.map(i => i.id === id ? { ...i, qty } : i).filter(i => i.qty > 0)
      if (user) postCart(next).catch(() => {})
      return next
    })
  }

  async function checkout(customer) {
    const resp = await postCheckout({ cart, customer })
    if (resp && resp.paymentUrl) {
      window.location.href = resp.paymentUrl
    }
  }

  function handleLogin(u) {
    setUser(u)
    // fetch me to get cart
    getMe().then(me => setCart(me.cart || [])).catch(() => {})
    setView('home')
  }

  function handleLogout() {
    setUser(null)
    setCart([])
    setView('home')
  }

  return (
    <div className="app" dir={dir}>
      <header className="header">
        <h1>{locale === 'ar' ? 'متجر تجريبي' : 'Demo Store'}</h1>
        <div>
          <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? 'AR' : 'EN'}</button>
          {!user && <button onClick={() => setView('login')}>{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>}
          {user && <button onClick={() => setView('account')}>{locale === 'ar' ? 'حسابي' : 'Account'}</button>}
          {user && <button onClick={() => { localStorage.removeItem('token'); handleLogout() }}>{locale === 'ar' ? 'خروج' : 'Logout'}</button>}
        </div>
      </header>

      <main className="container">
        {view === 'home' && (
          <>
            <section className="products">
              {products.map(p => (
                <ProductCard key={p.id} product={p} locale={locale} onAdd={addToCart} />
              ))}
            </section>

            <aside className="sidebar">
              <Cart cart={cart} updateQty={updateQty} onCheckout={checkout} locale={locale} />
            </aside>
          </>
        )}

        {view === 'login' && <Login onLogin={handleLogin} locale={locale} />}
        {view === 'register' && <Register onRegister={handleLogin} locale={locale} />}
        {view === 'account' && <Account locale={locale} onLogout={handleLogout} />}
      </main>
    </div>
  )
}
