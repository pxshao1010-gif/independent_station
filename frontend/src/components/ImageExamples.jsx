import React, { useState } from 'react'

// 带错误处理的图片组件
function ImageWithFallback({ src, fallback, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src)
  
  return (
    <img 
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      style={{ width: '300px', height: '200px', objectFit: 'cover' }}
      {...props}
    />
  )
}

/**
 * 图片插入方法示例组件
 * 展示在React网页中插入图片的多种方法
 */
export default function ImageExamples() {
  const [imageError, setImageError] = useState(false)

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>网页图片插入方法示例</h2>

      {/* 方法1: 使用外部URL（当前ProductCard使用的方法） */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法1: 使用外部URL</h3>
        <p>直接从网络URL加载图片（适用于CDN、外部服务）</p>
        <img 
          src="https://via.placeholder.com/300x200?text=External+URL" 
          alt="外部URL图片"
          style={{ width: '300px', height: '200px', objectFit: 'cover' }}
        />
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`<img src="https://via.placeholder.com/300x200" alt="描述" />`}
        </pre>
      </section>

      {/* 方法2: 使用本地public文件夹中的图片 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法2: 使用public文件夹中的图片</h3>
        <p>将图片放在public文件夹，使用绝对路径引用</p>
        <p style={{ color: '#666' }}>示例：将图片放在 public/images/logo.png</p>
        <img 
          src="/images/logo.png" 
          alt="本地图片"
          style={{ width: '300px', height: '200px', objectFit: 'cover', border: '1px dashed #ccc' }}
          onError={(e) => {
            e.target.style.display = 'none'
            setImageError(true)
          }}
        />
        {imageError && <p style={{ color: 'orange' }}>注意：图片不存在，请创建 public/images/logo.png</p>}
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`<img src="/images/logo.png" alt="描述" />`}
        </pre>
      </section>

      {/* 方法3: 使用import导入src文件夹中的图片 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法3: 使用import导入（推荐用于src文件夹）</h3>
        <p>从src文件夹导入图片，构建工具会处理优化</p>
        <p style={{ color: '#666' }}>示例代码：</p>
        <pre style={{ background: '#f5f5f5', padding: '1rem' }}>
{`// 在组件顶部导入
import logoImage from '../assets/logo.png'

// 在JSX中使用
<img src={logoImage} alt="描述" />`}
        </pre>
      </section>

      {/* 方法4: 使用CSS背景图片 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法4: 使用CSS背景图片</h3>
        <p>通过CSS设置背景图片，适合装饰性图片</p>
        <div 
          style={{
            width: '300px',
            height: '200px',
            backgroundImage: 'url(https://via.placeholder.com/300x200?text=CSS+Background)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid #ddd'
          }}
        />
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`// 内联样式
<div style={{
  backgroundImage: 'url(/images/bg.jpg)',
  backgroundSize: 'cover'
}} />

// 或CSS类
.banner {
  background-image: url(/images/banner.jpg);
  background-size: cover;
}`}
        </pre>
      </section>

      {/* 方法5: 使用Base64编码 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法5: 使用Base64编码</h3>
        <p>将图片转换为Base64字符串直接嵌入（适合小图标）</p>
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwN2ZjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhc2U2NCBJbWFnZTwvdGV4dD48L3N2Zz4=" 
          alt="Base64图片"
          style={{ width: '300px', height: '200px', objectFit: 'cover' }}
        />
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="描述" />`}
        </pre>
      </section>

      {/* 方法6: 动态图片加载与错误处理 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法6: 动态图片加载与错误处理</h3>
        <p>处理图片加载失败的情况，提供默认图片</p>
        <ImageWithFallback 
          src="https://invalid-url.com/image.jpg"
          fallback="https://via.placeholder.com/300x200?text=Fallback+Image"
          alt="带错误处理的图片"
        />
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`function ImageWithFallback({ src, fallback, alt }) {
  const [imgSrc, setImgSrc] = useState(src)
  
  return (
    <img 
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
    />
  )
}`}
        </pre>
      </section>

      {/* 方法7: 响应式图片 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法7: 响应式图片（srcset）</h3>
        <p>根据设备屏幕大小加载不同尺寸的图片</p>
        <img 
          src="https://via.placeholder.com/300x200?text=Responsive"
          srcSet="https://via.placeholder.com/300x200 300w, https://via.placeholder.com/600x400 600w, https://via.placeholder.com/900x600 900w"
          sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 900px"
          alt="响应式图片"
          style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
        />
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`<img 
  src="/images/default.jpg"
  srcSet="/images/small.jpg 300w, /images/medium.jpg 600w, /images/large.jpg 900w"
  sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 900px"
  alt="响应式图片"
/>`}
        </pre>
      </section>

      {/* 方法8: 懒加载图片 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee' }}>
        <h3>方法8: 懒加载图片（Lazy Loading）</h3>
        <p>图片进入视口时才加载，提升页面性能</p>
        <img 
          src="https://via.placeholder.com/300x200?text=Lazy+Load"
          loading="lazy"
          alt="懒加载图片"
          style={{ width: '300px', height: '200px', objectFit: 'cover' }}
        />
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
{`<img 
  src="/images/large-image.jpg"
  loading="lazy"
  alt="懒加载图片"
/>`}
        </pre>
      </section>
    </div>
  )
}

