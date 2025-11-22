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
    <div className="account">
      <h2>{locale === 'ar' ? 'حسابي' : 'My Account'}</h2>
      <div><strong>{me.name || me.email}</strong></div>

      <section>
        <h3>{locale === 'ar' ? 'سلة التسوق' : 'My Cart'}</h3>
        {cart.length === 0 && <div>{locale === 'ar' ? 'فارغة' : 'Empty'}</div>}
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div>{item.title} x {item.qty}</div>
            <input type="number" value={item.qty} min="0" onChange={e => updateQty(item.id, Number(e.target.value))} />
          </div>
        ))}
      </section>

      <section>
        <h3>{locale === 'ar' ? 'الطلبات' : 'Orders'}</h3>
        {orders.length === 0 && <div>{locale === 'ar' ? 'لا يوجد طلبات' : 'No orders'}</div>}
        {orders.map(o => (
          <div key={o.id} className="order">
            <div>{locale === 'ar' ? 'رقم الطلب' : 'Order'}: {o.id}</div>
            <div>{locale === 'ar' ? 'حالة' : 'Status'}: {o.status}</div>
            <div>{locale === 'ar' ? 'تاريخ' : 'Date'}: {new Date(o.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </section>

      <button onClick={() => { localStorage.removeItem('token'); onLogout(); }}>{locale === 'ar' ? 'خروج' : 'Logout'}</button>
    </div>
  )
}
