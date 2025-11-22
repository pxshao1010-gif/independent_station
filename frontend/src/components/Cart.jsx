import React, { useState } from 'react'

export default function Cart({ cart, updateQty, onCheckout, locale }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  function submit() {
    if (cart.length === 0) return alert(locale === 'ar' ? 'السلة فارغة' : 'Cart is empty')
    onCheckout(customer)
  }

  return (
    <div className="cart">
      <h2>{locale === 'ar' ? 'السلة' : 'Cart'}</h2>
      <div className="items">
        {cart.length === 0 && <p>{locale === 'ar' ? 'لا توجد منتجات' : 'No items'}</p>}
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="info">
              <div className="title">{item.title}</div>
              <div className="sku">{item.sku}</div>
            </div>
            <div className="controls">
              <input type="number" value={item.qty} min="0" onChange={e => updateQty(item.id, Number(e.target.value))} />
            </div>
          </div>
        ))}
      </div>

      <div className="summary">
        <div>{locale === 'ar' ? 'المجموع' : 'Total'}: {total.toFixed(3)} KWD</div>
      </div>

      <div className="checkout-form">
        <input placeholder={locale === 'ar' ? 'الاسم' : 'Name'} value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
        <input placeholder={locale === 'ar' ? 'الهاتف' : 'Phone'} value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
        <input placeholder={locale === 'ar' ? 'العنوان' : 'Address'} value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
        <button onClick={submit}>{locale === 'ar' ? 'الدفع عبر KNET (محاكاة)' : 'Pay with KNET (mock)'}</button>
      </div>
    </div>
  )
}
