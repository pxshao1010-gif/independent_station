import React, { useState } from 'react'
import { getProductImageUrl, getDefaultProductImage } from '../utils/imageUtils'

export default function ProductCard({ product, onAdd, onImageClick, locale }) {
  const title = product[`title_${locale}`] || product.title_en
  const desc = product[`description_${locale}`] || product.description_en
  const variant = product.variants && product.variants[0]
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
        <div className="image-overlay">
          <span>{locale === 'ar' ? 'انقر للتفاصيل' : 'Click for details'}</span>
        </div>
      </div>
      <div className="product-body">
        <h3 onClick={handleImageClick} style={{ cursor: 'pointer' }}>{title}</h3>
        <p className="price">{product.price} {product.currency}</p>
        <p className="desc">{desc}</p>
        {variant && <button onClick={() => onAdd(product, variant)}>{locale === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}</button>}
      </div>
    </div>
  )
}
