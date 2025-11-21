import React, { useState } from 'react';
import './App.css';

// 产品数据
const products = [
  {
    id: 1,
    title: 'قفاز مقشر للجسم',
    titleEn: '身体去角质手套',
    price: 3.000,
    originalPrice: null,
    image: '🥊',
    badge: null
  },
  {
    id: 2,
    title: 'بوكس عناية بالبشرة',
    titleEn: '护肤套装',
    price: 22.000,
    originalPrice: 26.500,
    image: '📦',
    badge: 'تخفيض'
  },
  {
    id: 3,
    title: 'سنفرة للوجه والجسم',
    titleEn: '面部和身体磨砂膏',
    price: 5.000,
    originalPrice: null,
    image: '✨',
    badge: null
  },
  {
    id: 4,
    title: 'صابون مغربى',
    titleEn: '摩洛哥肥皂',
    price: 7.000,
    originalPrice: null,
    image: '🧼',
    badge: null
  },
  {
    id: 5,
    title: 'لوشن الجسم',
    titleEn: '身体乳液',
    price: 5.000,
    originalPrice: null,
    image: '💧',
    badge: null
  },
  {
    id: 6,
    title: 'سنفرة للجسم للتبييض',
    titleEn: '美白身体磨砂膏',
    price: 6.500,
    originalPrice: null,
    image: '🌟',
    badge: null
  }
];

// 客户评价数据
const reviews = [
  {
    id: 1,
    name: 'عائشة',
    nameEn: 'Aisha',
    text: 'ياهلا وغلااااا 😍💕💕💕 للامانه اليوم بيكون ثالث استخدام وللحين خيال بالاخص سنفرة الوجه 🥺💕💕💕💕💕💕💕',
    textEn: '太棒了！今天是第三次使用，效果依然惊艳，特别是面部磨砂膏 🥺💕'
  },
  {
    id: 2,
    name: 'حصة',
    nameEn: 'Hessa',
    text: 'شنو اقول شنو اخلي البوكس بروحه يفتح النفس 😩 والريحه خيال واستخدمت المجموعه كامله وطلعت بصاله اختي تقول شنو حاطه ريحه قبلج تمشي اشكرج من كل قلبي 💋',
    textEn: '这个套装本身就很棒！香味太惊艳了，我用了全套产品，我姐姐问我喷了什么香水 💋'
  },
  {
    id: 3,
    name: 'مريم',
    nameEn: 'Maryam',
    text: 'حبيت اشكرج هذي اول مرا اطلب فيها صابونيه واشوف النتيجه العاده ماكو نتيجه بس بوكس العنايه يفوق الوصف 😍😍❤‍🔥',
    textEn: '这是第一次订购肥皂类产品就看到效果，通常都没有效果，但这个护肤套装超出了预期 😍❤'
  },
  {
    id: 4,
    name: 'ريم',
    nameEn: 'Reem',
    text: 'ماشاءالله صج صجج مبين الحين ثاني استخدام ومبين والله الريحه صصجج خيال واللوشن ريحته مو طبيعية ❤',
    textEn: '真的有效！现在是第二次使用就能看到效果，香味太惊艳了，乳液的味道不一般 ❤'
  },
  {
    id: 5,
    name: 'شيخة',
    nameEn: 'Sheikha',
    text: 'ياعمري وصلت واخذت احلا شور فيهم صج نظااافه ولييفه طلعت كل الجلدددد شي خيال 🔥🤍🤍🤍🤍',
    textEn: '到货了，用它们洗了最棒的澡，真的干净又柔滑，皮肤都发亮了 🔥🤍'
  }
];

function App() {
  const [language, setLanguage] = useState('ar'); // 'ar' for Arabic, 'en' for English

  const handleBuyNow = (product) => {
    alert(language === 'ar' 
      ? `تمت إضافة ${product.title} إلى السلة` 
      : `${product.titleEn} 已添加到购物车`);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RDR November</div>
          <div className="nav-menu">
            <button 
              className="lang-toggle"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <h2 className="section-title">
            {language === 'ar' ? 'صنع من أجلك' : '为您定制'}
          </h2>
        </section>

        <section className="products-section">
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-title">
                    {language === 'ar' ? product.title : product.titleEn}
                  </h3>
                  <div className="product-price">
                    {product.originalPrice && (
                      <span className="original-price">KD {product.originalPrice.toFixed(3)}</span>
                    )}
                    <span className="current-price">KD {product.price.toFixed(3)}</span>
                  </div>
                  <button 
                    className="buy-button"
                    onClick={() => handleBuyNow(product)}
                  >
                    {language === 'ar' ? 'شراء الآن' : '立即购买'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <h2 className="section-title">
            {language === 'ar' ? 'أراء العملاء' : '客户评价'}
          </h2>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{review.name.charAt(0)}</div>
                  <div className="review-info">
                    <h4 className="review-name">{review.name}</h4>
                    {language === 'en' && (
                      <span className="review-name-en">({review.nameEn})</span>
                    )}
                  </div>
                </div>
                <p className="review-text">
                  {language === 'ar' ? review.text : review.textEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <h2 className="section-title">
            {language === 'ar' ? 'تواصل معنا' : '联系我们'}
          </h2>
          <div className="contact-info">
            <h3>{language === 'ar' ? 'معلومات التواصل' : '联系信息'}</h3>
            <div className="contact-details">
              <a href="tel:+96555451955" className="contact-link">
                <span className="contact-icon">📞</span>
                +965 55451955
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© Powered By Empower</p>
      </footer>
    </div>
  );
}

export default App;
