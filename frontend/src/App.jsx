import React, { useEffect, useState } from 'react'
import { fetchProducts, postCheckout, getMe, postCart } from './api'
import { getHeroBannerImage } from './utils/imageUtils'
import ProductCard from './components/ProductCard'
import ProductDetail from './components/ProductDetail'
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
  const [view, setView] = useState('home') // home, login, register, account, product-detail, cart
  const [selectedProduct, setSelectedProduct] = useState(null)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  // Explicit layout rows (user requested order)
  const rowsById = [
    [1],      // row 1: product 1
    [2, 3],   // row 2: product 2 and 3
    [5],      // row 3: product 5
    [4],      // row 4: product 4
    [6],      // row 5: product 6
    [7],      // row 6: product 7
  ]

  useEffect(() => {
    fetchProducts().then(setProducts).catch(err => {
      console.error('Failed to load products', err)
      setProducts([])
    })

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
      const itemPrice = (variant && variant.price) ? variant.price : product.price
      // For packages with selected choices, include choice names in title
      let title = product[`title_${locale}`] || product.title_en
      if (variant && variant.choices && Array.isArray(variant.choices)) {
        const names = variant.choices.map(cid => {
          const p = products.find(x => x.id === cid)
          return p ? (p[`title_${locale}`] || p.title_en) : `#${cid}`
        })
        title = `${title} — ${names.join(', ')}`
      }

      const next = found ? prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { id, productId: product.id, title, price: itemPrice, sku: variant.sku, qty: 1, image: product.images?.[0] }]
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

  function handleProductClick(product) {
    setSelectedProduct(product)
    setView('product-detail')
  }

  function handleBackToHome() {
    setSelectedProduct(null)
    setView('home')
  }

  function handleCartClick() {
    setView('cart')
  }

  return (
    <div className="app" dir={dir}>
      <header className="header">
        <h1 
          className="logo-title"
          onClick={handleBackToHome}
        >
          dalka_kw
        </h1>
        <div>
          <button className="cart-button" onClick={handleCartClick}>
            {locale === 'ar' ? 'السلة' : 'Cart'}
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
          <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>{locale === 'en' ? 'AR' : 'EN'}</button>
          {!user && <button onClick={() => setView('login')}>{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>}
          {user && <button onClick={() => setView('account')}>{locale === 'ar' ? 'حسابي' : 'Account'}</button>}
          {user && <button onClick={() => { localStorage.removeItem('token'); handleLogout() }}>{locale === 'ar' ? 'خروج' : 'Logout'}</button>}
        </div>
      </header>

      <main className="container">
        {view === 'home' && (
          <>
            <div className="hero-banner">
              <img 
                src={getHeroBannerImage()} 
                alt={locale === 'ar' ? 'صورة رئيسية للمستحضرات التجميلية' : 'Cosmetics Hero Banner'}
                className="hero-image"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.display = 'none'
                }}
              />
              <div className="hero-cta">
                <h2>{locale === 'ar' ? 'أول مركز مساج سوداني في الكويت' : 'Kuwait\'s first Sudanese massage'}</h2>
                <p>{locale === 'ar' ? 'دلکا — تجربة مساج سودانية أصيلة في الكويت' : "dalka_kw — Authentic Sudanese massage experience in Kuwait"}</p>
                <div style={{display:'flex',gap:12}}>
                  <button className="btn" onClick={() => { setView('product-detail'); if (products[0]) { setSelectedProduct(products[0]); } }}>{locale === 'ar' ? 'تسوق الآن' : 'Shop Now'}</button>
                  <button className="btn" onClick={() => { const el = document.querySelector('.products'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>{locale === 'ar' ? 'كل المنتجات' : 'View All'}</button>
                </div>
              </div>
            </div>

            <section className="products-layout" id="products-section">
              {products.length === 0 ? (
                <div className="no-products">{locale === 'ar' ? 'لا توجد منتجات حالياً. تابعنا قريباً.' : 'No products available right now — check back soon.'}</div>
              ) : (
                (() => {
                  const normal = products.filter(p => !p.is_package)
                  const packages = products.filter(p => p.is_package)

                  // Map configured id rows to actual product objects
                  const rows = rowsById.map(row => row.map(id => normal.find(p => p.id === id)).filter(Boolean))

                  return (
                    <>
                      <div className="main-products">
                        <div className="products-rows">
                          {rows.map((row, rIdx) => (
                            <div key={rIdx} className={`product-row row-${rIdx}`}> 
                              {row.map(p => (
                                <ProductCard 
                                  key={p.id}
                                  product={p}
                                  locale={locale}
                                  onAdd={addToCart}
                                  onImageClick={handleProductClick}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      <aside className="packages-aside">
                        <div className="packages-box">
                          <h3 className="packages-title">{locale === 'ar' ? 'الباقات المميزة' : 'Amazing Packages'}</h3>
                          <div className="packages-list">
                            {packages.map(p => (
                              <div key={p.id} className="package-card">
                                <ProductCard 
                                  product={p}
                                  locale={locale}
                                  onAdd={addToCart}
                                  onImageClick={handleProductClick}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </aside>
                    </>
                  )
                })()
              )}
            </section>
          </>
        )}

        {view === 'cart' && (
          <div className="cart-page">
            <button className="back-button" onClick={handleBackToHome}>
              ← {locale === 'ar' ? 'رجوع' : 'Back'}
            </button>
            <Cart cart={cart} updateQty={updateQty} onCheckout={checkout} locale={locale} />
          </div>
        )}

        {view === 'product-detail' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct}
            onAdd={addToCart}
            onBack={handleBackToHome}
            locale={locale}
            products={products}
          />
        )}

        {view === 'login' && <Login onLogin={handleLogin} locale={locale} />}
        {view === 'register' && <Register onRegister={handleLogin} locale={locale} />}
        {view === 'account' && <Account locale={locale} onLogout={handleLogout} />}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="left">
          <h4>{locale === 'ar' ? 'اتصل بخدمة العملاء' : 'Contact Customer Service'}</h4>
          <p>{locale === 'ar' ? 'لدعم الطلبات والاستفسارات، تواصل معنا عبر WhatsApp أو Instagram أو اتصل مباشرة.' : 'For orders and inquiries, reach us via WhatsApp, Instagram or call us directly.'}</p>
            <div className="socials">
            <a className="social-icon" href="https://www.instagram.com/dalka_kw?igsh=b3JkdTRqb2lqMjQ0&utm_source=qr" target="_blank" rel="noreferrer" title="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm6.4-.8a1.12 1.12 0 1 0 0 2.24 1.12 1.12 0 0 0 0-2.24zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>
            </a>
            <a className="social-icon" href="https://wa.me/96555398685?text=Hello%20dalka_kw" target="_blank" rel="noreferrer" title="WhatsApp">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.6 0 12.6c0 2 0.5 3.9 1.6 5.6L0 24l6.1-1.6a12 12 0 0 0 6 1.6c6.6 0 12-5.6 12-12.6 0-1.9-.4-3.7-1.6-5.1zM12 21c-1.8 0-3.6-.5-5.1-1.4L5 19l.9-1.8A8.6 8.6 0 0 1 3.5 12C3.5 7 7.2 3.5 12 3.5c2 0 3.8.7 5.2 2.1 1.3 1.3 2 3.1 2 5 0 4-3.7 7.4-8.2 7.4z"/></svg>
            </a>
          </div>
        </div>

        <div className="right">
          <div className="contact-line">
            <a href="tel:+96555398685">{locale === 'ar' ? 'اتصل الآن: +965 553 98685' : 'Call us: +965 553 98685'}</a>
            <a href="mailto:info@dalka_kw.com">info@dalka_kw.com</a>
          </div>
        </div>
      </footer>

      {/* Floating contact widget */}
      <div className="contact-widget">
        <a className="contact-button" href="tel:+96555398685" title="Call"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8c1.1 2 2.8 3.7 4.8 4.8l1.7-1.7c.2-.2.5-.3.8-.2 1 .3 2 .5 3 .5.4 0 .8.3.9.7l.8 3.1c.1.4 0 .8-.3 1C17.2 21.9 12 23.5 6.5 19.8 1 16 1 8.6 5.8 4c.3-.3.7-.4 1.1-.3l3.1.8c.4.1.7.4.7.9 0 1 .2 2 .5 3 .1.3 0 .6-.2.8L6.6 10.8z"/></svg></a>
        <a className="contact-button small" href="https://wa.me/96555398685?text=Hello%20dalka_kw" target="_blank" rel="noreferrer" title="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.6 0 12.6c0 2 0.5 3.9 1.6 5.6L0 24l6.1-1.6a12 12 0 0 0 6 1.6c6.6 0 12-5.6 12-12.6 0-1.9-.4-3.7-1.6-5.1zM12 21c-1.8 0-3.6-.5-5.1-1.4L5 19l.9-1.8A8.6 8.6 0 0 1 3.5 12C3.5 7 7.2 3.5 12 3.5c2 0 3.8.7 5.2 2.1 1.3 1.3 2 3.1 2 5 0 4-3.7 7.4-8.2 7.4z"/></svg></a>
        <a className="contact-button small" href="https://www.instagram.com/dalka_kw?igsh=b3JkdTRqb2lqMjQ0&utm_source=qr" target="_blank" rel="noreferrer" title="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm6.4-.8a1.12 1.12 0 1 0 0 2.24 1.12 1.12 0 0 0 0-2.24zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg></a>
      </div>
    </div>
  )
}
