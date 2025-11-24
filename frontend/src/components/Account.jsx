import React, { useEffect, useState } from 'react'
import { getMe, getOrders, getCart, postCart } from '../api'

export default function Account({ locale, onLogout }) {
  const [me, setMe] = useState(null)
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    getMe().then(setMe).catch(() => setMe(null))
    getOrders().then(setOrders).catch(() => setOrders([]))
    getCart().then(setCart).catch(() => setCart([]))
  }, [])

  function updateQty(id, qty) {
    const updated = cart.map(i => i.id === id ? { ...i, qty } : i).filter(i => i.qty > 0)
    setCart(updated)
    postCart(updated).catch(() => {})
  }

  if (!me) return <div>{locale === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</div>

  return (
    <div className="account container">
      <div className="account-grid">
        <div className="user-info card">
          <h2 className="account-title">{locale === 'ar' ? 'حسابي' : 'My Account'}</h2>
          <div className="user-name">{me.name || me.email}</div>
          <div className="user-actions">
            <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); onLogout(); }}>{locale === 'ar' ? 'خروج' : 'Logout'}</button>
          </div>
        </div>

        <div className="section-card">
          <h3>{locale === 'ar' ? 'سلة التسوق' : 'My Cart'}</h3>
          {cart.length === 0 && <div className="muted">{locale === 'ar' ? 'فارغة' : 'Empty'}</div>}
          <div className="cart-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-left">
                  {item.image ? <img src={item.image} alt={item.title} /> : null}
                  <div className="cart-item-meta">
                    <div className="cart-item-title">{item.title}</div>
                    <div className="cart-item-sku muted">{item.sku || ''}</div>
                  </div>
                </div>
                <div className="cart-item-controls">
                  <input className="qty-input" type="number" value={item.qty} min="0" onChange={e => updateQty(item.id, Number(e.target.value))} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3>{locale === 'ar' ? 'الطلبات' : 'Orders'}</h3>
          {orders.length === 0 && <div className="muted">{locale === 'ar' ? 'لا يوجد طلبات' : 'No orders'}</div>}
          <div className="orders-list">
            {orders.map(o => (
              <div key={o.id} className="order-row card-sm">
                <div className="order-row-top">
                  <div className="order-id">{locale === 'ar' ? 'طلب' : 'Order'}: <span className="order-id-val">{o.id}</span></div>
                  <div className={`status-badge ${o.status === 'paid' ? 'paid' : o.status === 'pending' ? 'pending' : ''}`}>{o.status}</div>
                </div>
                <div className="order-date muted">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
