import React, { useState } from 'react'
import { getImageUrl, getDefaultProductImage } from '../utils/imageUtils'

export default function Cart({ cart, updateQty, onCheckout, locale }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  function fmtAmount(v) {
    // show 3 decimals for KWD; use Arabic currency symbol when locale is 'ar'
    const currency = locale === 'ar' ? 'د.ك' : 'KWD'
    return `${v.toFixed(3)} ${currency}`
  }

  function submit() {
    if (cart.length === 0) return alert(locale === 'ar' ? 'السلة فارغة' : 'Cart is empty')
    onCheckout(customer)
  }

  return (
    <div className="cart">
      <h2>{locale === 'ar' ? 'السلة' : 'Cart'}</h2>
      <div className="items">
        {cart.length === 0 && <p>{locale === 'ar' ? 'لا توجد منتجات' : 'No items'}</p>}
        {cart.map(item => {
          const imageUrl = item.image ? getImageUrl(item.image) : getDefaultProductImage()
          return (
          <div key={item.id} className="cart-item">
            <img 
              src={imageUrl} 
              alt={item.title} 
              className="cart-item-image"
              onError={(e) => { 
                e.target.src = getDefaultProductImage()
              }}
            />
            <div className="info">
              <div className="title">{item.title}</div>
              <div className="price">{locale === 'ar' ? 'سعر الوحدة' : 'Unit price'}: {fmtAmount(item.price)}</div>
              <div className="sku muted">{item.sku}</div>
            </div>
            <div className="controls">
              <input className="qty-input" type="number" value={item.qty} min="0" onChange={e => updateQty(item.id, Number(e.target.value))} />
              <div className="line-total">{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}: {fmtAmount(item.price * item.qty)}</div>
              <button className="remove-btn" onClick={() => updateQty(item.id, 0)}>{locale === 'ar' ? 'إزالة' : 'Remove'}</button>
            </div>
          </div>
          )
        })}
      </div>

      <div className="summary">
        <div className="summary-row"><span>{locale === 'ar' ? 'المجموع' : 'Total'}:</span> <strong>{total.toFixed(3)} KWD</strong></div>
      </div>

      <div className="checkout-form card">
        <h3 className="checkout-title">{locale === 'ar' ? 'معلومات الشحن والدفع' : 'Shipping & Payment'}</h3>
        <div className="checkout-fields">
          <input placeholder={locale === 'ar' ? 'الاسم' : 'Name'} value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
          <input placeholder={locale === 'ar' ? 'الهاتف' : 'Phone'} value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
          <input placeholder={locale === 'ar' ? 'العنوان' : 'Address'} value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
        </div>
        <div className="checkout-actions">
          <button className="pay-btn" onClick={submit}>{locale === 'ar' ? 'الدفع عبر KNET (محاكاة)' : 'Pay with KNET (mock)'}</button>
        </div>
      </div>
    </div>
  )
}
