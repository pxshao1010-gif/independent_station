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
    <div className="product-card dior-style">
      <div className="product-image-wrapper" onClick={handleImageClick}>
        <img 
          src={imageError ? getDefaultProductImage() : imageUrl} 
          alt={title}
          onError={() => setImageError(true)}
        />

        {/* Overlay shown on hover similar to high-fashion galleries */}
        <div className="product-overlay">
          <div className="overlay-meta">
            <div className="product-title-large">{title}</div>
            <div className="product-subtitle">{product.brand || ''}</div>
          </div>
          <div className="overlay-actions">
            <div className="overlay-price">{product.price} {product.currency}</div>
          </div>
        </div>
      </div>

      {/* Minimal body with uppercase title underneath — Dior-like clean layout */}
      <div className="product-body dior-body">
        <h3 onClick={handleImageClick} style={{ cursor: 'pointer' }}>{title}</h3>
      </div>
    </div>
  )
}
