import React, { useState, useMemo } from 'react'
import { getProductImageUrl, getDefaultProductImage } from '../utils/imageUtils'

function parseDescription(descRaw = '') {
  // Normalize newlines
  const text = descRaw.replace(/\r/g, '')
  // Sections: look for Benefits:, Usage:, Storage:, Why our Dalkah is different?
  const sections = { intro: '', why: '', benefits: [], usage: '', storage: '', notes: '' }

  // Split by headings
  // We'll look for keywords and split accordingly
  const benefitMatch = text.match(/Benefits:\s*([\s\S]*?)(?=Usage:|Storage:|$)/i)
  const usageMatch = text.match(/Usage:\s*([\s\S]*?)(?=Storage:|$)/i)
  const storageMatch = text.match(/Storage:\s*([\s\S]*?)(?=$)/i)
  const whyMatch = text.match(/Why[\s\S]*?\?\s*([\s\S]*?)(?=Benefits:|Usage:|Storage:|$)/i)

  // Intro is text before first recognized heading
  const firstHeadingIndex = (() => {
    const idxs = ['Benefits:', 'Usage:', 'Storage:', 'Why'].map(h => {
      const i = text.toLowerCase().indexOf(h.toLowerCase())
      return i >= 0 ? i : null
    }).filter(v => v !== null)
    return idxs.length ? Math.min(...idxs) : -1
  })()
  sections.intro = firstHeadingIndex > -1 ? text.slice(0, firstHeadingIndex).trim() : text.trim()

  if (whyMatch) sections.why = whyMatch[0].trim()
  if (benefitMatch) {
    const b = benefitMatch[1].trim()
    // split by lines that start with - or • or a dash
    sections.benefits = b.split(/\n+/).map(l => l.replace(/^[-–•]\s*/, '').trim()).filter(Boolean)
  }
  if (usageMatch) sections.usage = usageMatch[1].trim()
  if (storageMatch) sections.storage = storageMatch[1].trim()

  return sections
}

export default function ProductDetail({ product, onAdd, onBack, locale }) {
  if (!product) return null

  const title = product[`title_${locale}`] || product.title_en
  const descRaw = product[`description_${locale}`] || product.description_en || ''
  const sections = useMemo(() => parseDescription(descRaw), [descRaw])

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [imageError, setImageError] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // 获取当前显示的图片
  const currentImage = product.images?.[selectedImageIndex]
  const imageUrl = currentImage ? getProductImageUrl(product, selectedImageIndex) : getDefaultProductImage()

  return (
    <div className="product-detail">
      <button className="back-button" onClick={onBack}>
        <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span>{locale === 'ar' ? 'رجوع' : 'Back'}</span>
      </button>

      <div className="product-detail-content">
        {/* 图片区域 */}
        <div className="product-detail-images">
          <div className="main-image">
            <img 
              src={imageError ? getDefaultProductImage() : imageUrl} 
              alt={title}
              onError={() => setImageError(true)}
            />
          </div>

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
          <div className="product-head">
            <h1>{title}</h1>
          </div>

          <p className="price-large">{(selectedVariant && selectedVariant.price) ? selectedVariant.price : product.price} {product.currency}</p>

          {/* Intro paragraphs */}
          {sections.intro && (
            <div className="detail-intro">
              {sections.intro.split(/\n\n+/).map((para, i) => (
                <p key={i} className="intro-paragraph">{para}</p>
              ))}
            </div>
          )}

          {/* Why callout (highlight) */}
          {sections.why && (
            <div className="feature-callout">
              <strong>{locale === 'ar' ? 'لماذا دلكتنا مميزة؟' : 'Why our Dalkah is different?'}</strong>
              <p>{sections.why.replace(/^Why[\s\S]*?\?\s*/i, '').trim()}</p>
            </div>
          )}

          {/* Benefits list */}
          {sections.benefits && sections.benefits.length > 0 && (
            <div className="benefits">
              <h3>{locale === 'ar' ? 'الفوائد' : 'Benefits'}</h3>
              <ul className="benefits-list">
                {sections.benefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage box */}
          {sections.usage && (
            <div className="usage-box">
              <h4>{locale === 'ar' ? 'طريقة الاستخدام' : 'Usage'}</h4>
              <p>{sections.usage}</p>
            </div>
          )}

          {/* Storage note */}
          {sections.storage && (
            <div className="storage-note">
              <strong>{locale === 'ar' ? 'التخزين' : 'Storage'}</strong>
              <p>{sections.storage}</p>
            </div>
          )}

          {/* 规格选择（仅当产品需要显示 variants 时） */}
          {product.show_variants && product.variants && product.variants.length > 0 && (
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
                    {variant.price && <span className="variant-price">{variant.price} {product.currency}</span>}
                    {(!product.hide_stock && variant.stock !== undefined) && (
                      <span className="stock">{locale === 'ar' ? 'المخزون' : 'Stock'}: {variant.stock}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 添加到购物车按钮 */}
          {(() => {
            const defaultVariant = selectedVariant || (product.variants && product.variants[0]) || { sku: `p-${product.id}`, size: 'Default' }
            return (
              <button 
                className="add-to-cart-large"
                onClick={() => onAdd(product, defaultVariant)}
              >
                <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#fff" d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45C8.89 16.37 9.33 17 10 17h8v-2h-7.42c-.14 0-.25-.11-.29-.24L11.1 13h5.45c.75 0 1.41-.41 1.75-1.03L21 6H6.21"/></svg>
                <span>{locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}</span>
              </button>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

