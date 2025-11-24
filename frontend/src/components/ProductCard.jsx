import React, { useState } from 'react'
import { getProductImageUrl, getDefaultProductImage } from '../utils/imageUtils'

export default function ProductCard({ product, onAdd, onImageClick, locale }) {
  const title = product[`title_${locale}`] || product.title_en
  const desc = product[`description_${locale}`] || product.description_en
  const variant = product.variants && product.variants[0]
  const defaultVariant = variant || { sku: `p-${product.id}`, size: 'Default' }
  const [imageError, setImageError] = useState(false)
  
  // 获取图片URL，优先使用public文件夹路径
  const imageUrl = getProductImageUrl(product) || getDefaultProductImage()

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(product)
    }
  }

  return (
    <div className="product-card">
      <div className="product-image-wrapper" onClick={handleImageClick}>
        <img 
          src={imageError ? getDefaultProductImage() : imageUrl} 
          alt={title}
          onError={() => setImageError(true)}
        />
        
      </div>
      <div className="product-body">
        <h3 onClick={handleImageClick} style={{ cursor: 'pointer' }}>{title}</h3>
        <p className="price">{product.price} {product.currency}</p>
        
        <button className="add-btn" onClick={() => onAdd(product, defaultVariant)}>
          <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#fff" d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45C8.89 16.37 9.33 17 10 17h8v-2h-7.42c-.14 0-.25-.11-.29-.24L11.1 13h5.45c.75 0 1.41-.41 1.75-1.03L21 6H6.21"/></svg>
          <span>{locale === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}</span>
        </button>
      </div>
    </div>
  )
}
