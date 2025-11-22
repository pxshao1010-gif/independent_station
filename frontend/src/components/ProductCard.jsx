import React from 'react'

export default function ProductCard({ product, onAdd, locale }) {
  const title = product[`title_${locale}`] || product.title_en
  const desc = product[`description_${locale}`] || product.description_en
  const variant = product.variants && product.variants[0]

  return (
    <div className="product-card">
      <img src={product.images?.[0]} alt={title} />
      <div className="product-body">
        <h3>{title}</h3>
        <p className="price">{product.price} {product.currency}</p>
        <p className="desc">{desc}</p>
        {variant && <button onClick={() => onAdd(product, variant)}>{locale === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}</button>}
      </div>
    </div>
  )
}
