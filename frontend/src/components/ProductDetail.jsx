import React, { useState } from 'react'
import { getProductImageUrl, getDefaultProductImage } from '../utils/imageUtils'

export default function ProductDetail({ product, onAdd, onBack, locale }) {
  if (!product) return null

  const title = product[`title_${locale}`] || product.title_en
  const desc = product[`description_${locale}`] || product.description_en
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [imageError, setImageError] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  // 获取当前显示的图片
  const currentImage = product.images?.[selectedImageIndex]
  const imageUrl = currentImage ? getProductImageUrl(product, selectedImageIndex) : getDefaultProductImage()

  return (
    <div className="product-detail">
      <button className="back-button" onClick={onBack}>
        ← {locale === 'ar' ? 'رجوع' : 'Back'}
      </button>

      <div className="product-detail-content">
        {/* 图片区域 */}
        <div className="product-detail-images">
          {/* 主图 */}
          <div className="main-image">
            <img 
              src={imageError ? getDefaultProductImage() : imageUrl} 
              alt={title}
              onError={() => setImageError(true)}
            />
          </div>
          
          {/* 缩略图列表（如果有多张图片） */}
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-list">
              {product.images.map((img, index) => {
                const thumbUrl = getProductImageUrl(product, index) || getDefaultProductImage()
                return (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImageIndex(index)
                      setImageError(false)
                    }}
                  >
                    <img 
                      src={thumbUrl} 
                      alt={`${title} ${index + 1}`}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 商品信息区域 */}
        <div className="product-detail-info">
          <h1>{title}</h1>
          <p className="price-large">{product.price} {product.currency}</p>
          <p className="description">{desc}</p>

          {/* 规格选择 */}
          {product.variants && product.variants.length > 0 && (
            <div className="variants-section">
              <h3>{locale === 'ar' ? 'المواصفات' : 'Variants'}</h3>
              <div className="variants-list">
                {product.variants.map((variant) => (
                  <button
                    key={variant.sku}
                    className={`variant-button ${selectedVariant?.sku === variant.sku ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <span>{variant.size || variant.sku}</span>
                    <span className="stock">{locale === 'ar' ? 'المخزون' : 'Stock'}: {variant.stock}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 添加到购物车按钮 */}
          {selectedVariant && (
            <button 
              className="add-to-cart-large"
              onClick={() => onAdd(product, selectedVariant)}
            >
              {locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

