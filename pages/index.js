import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useLanguage from '../lib/useLanguage';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [priceKrw, setPriceKrw] = useState('');
  const [qty, setQty] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const [toast, setToast] = useState('');
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const EXCHANGE_RATE = 1360;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    setCartCount(cart.length);
  }, []);

  function changeQty(delta) {
    const next = Math.max(1, qty + delta);
    setQty(next);
    if (showBreakdown && priceKrw) {
      const price = parseFloat(priceKrw);
      if (price > 0) calc(price, next);
    }
  }

  function calc(price, quantity) {
    const totalKrw = price * quantity;
    const priceUsd = totalKrw / EXCHANGE_RATE;
    const serviceFee = priceUsd * 0.10;
    const total = priceUsd + serviceFee;
    setBreakdown({ totalKrw, priceUsd, serviceFee, total });
  }

  function calculate() {
    const price = parseFloat(priceKrw);
    if (!price || price <= 0) {
      flash(lang === 'ko' ? '쿠팡 판매가를 입력해 주세요.' : 'Please enter the product price.');
      return;
    }
    if (!productName.trim()) {
      flash(lang === 'ko' ? '상품명을 입력해 주세요.' : 'Please enter the product name.');
      return;
    }
    calc(price, qty);
    setShowBreakdown(true);
  }

  function addToCart() {
    if (!breakdown) return;
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    cart.push({
      productName,
      url: productUrl,
      priceKrw: parseFloat(priceKrw),
      quantity: qty,
      exchangeRate: EXCHANGE_RATE,
      priceUsd: breakdown.priceUsd,
      serviceFee: breakdown.serviceFee,
      total: breakdown.total,
      totalKrw: breakdown.totalKrw,
    });
    localStorage.setItem('maum_cart', JSON.stringify(cart));
    setCartCount(cart.length);
    flash(lang === 'ko' ? '장바구니에 담겼습니다.' : 'Added to cart.');
    setTimeout(() => router.push('/cart'), 1200);
  }

  function addMore() {
    setProductName('');
    setProductUrl('');
    setPriceKrw('');
    setQty(1);
    setShowBreakdown(false);
    setBreakdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    flash(lang === 'ko' ? '상품을 추가해 주세요.' : 'Add another item.');
  }

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  const s = lang === 'ko' ? {
    heroTitle: '한국으로 마음을 전합니다.',
    heroDes: '원하시는 쿠팡 상품 정보를 아래에 직접 입력해 주세요.',
    heroDes2: '주문 금액과 수수료를 바로 확인하실 수 있습니다.',
    labelOrder: '주문 정보 입력',
    lblUrl: '쿠팡 상품 링크',
    lblOptional: '(선택사항)',
    lblName: '상품명',
    lblPrice: '쿠팡 판매가 (원)',
    lblQty: '수량',
    btnCalc: '가격 확인하기',
    lblKrw: '쿠팡 상품가 (원)',
    lblUsdProd: '상품가 (USD)',
    lblFee: '서비스 수수료',
    lblTotal: '총 결제금액',
    notice1: '※ 환율은 실시간 기준이며, 실제 결제 금액과 소폭 차이가 있을 수 있습니다.',
    notice2: '※ 한국 내 배송비는 포함되어 있습니다. 도서산간 지역은 추가 배송비가 발생할 수 있습니다.',
    btnCart: '장바구니 담기',
    btnMore: '+ 상품 더 추가하기',
    howTitle: '이용 방법',
    step1: '쿠팡에서 원하는 상품을 찾아 링크를 복사하거나 상품 정보를 직접 입력하세요',
    step2: '가격과 수수료를 확인하고 결제를 진행하세요',
    step3: '저희가 직접 구매하여 한국의 받으시는 분께 배송해 드립니다',
    step4: '부모님과 가족에게 마음을 전하세요',
    cartLabel: '장바구니',
    contact: '문의하기',
  } : {
    heroTitle: 'Send your heart to Korea.',
    heroDes: 'Enter the Coupang product details below.',
    heroDes2: "We'll calculate the total including our service fee.",
    labelOrder: 'Order Details',
    lblUrl: 'Coupang Product Link',
    lblOptional: '(optional)',
    lblName: 'Product Name',
    lblPrice: 'Coupang Price (KRW)',
    lblQty: 'Quantity',
    btnCalc: 'Calculate Price',
    lblKrw: 'Coupang Price (KRW)',
    lblUsdProd: 'Product Price (USD)',
    lblFee: 'Service Fee',
    lblTotal: 'Total',
    notice1: '※ Exchange rate is based on real-time data and may vary slightly.',
    notice2: '※ Korean domestic shipping is included. Remote areas may incur additional fees.',
    btnCart: 'Add to Cart',
    btnMore: '+ Add Another Item',
    howTitle: 'How It Works',
    step1: 'Find your item on Coupang, copy the link or enter the details manually',
    step2: 'Review the price and service fee, then proceed to checkout',
    step3: 'We purchase the item and ship it to your recipient in Korea',
    step4: 'Share your love with family back home',
    cartLabel: 'Cart',
    contact: 'Contact',
  };

  return (
    <>
      <Head>
        <title>MAUM — 한국으로 마음을 전합니다</title>
        <meta name="description" content="미주 한인을 위한 쿠팡 대리구매 서비스" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', sans-serif; background: #fafaf8; color: #1a1a1a; min-height: 100vh; }
        header { padding: 36px 48px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; }
        .logo { font-size: 13px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase; color: #1a1a1a; cursor: pointer; background: none; border: none; font-family: inherit; }
        nav { display: flex; align-items: center; gap: 32px; }
        nav a { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #999; text-decoration: none; }
        nav a:hover { color: #1a1a1a; }
        .cart-badge { font-size: 9px; background: #1a1a1a; color: #fff; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; vertical-align: top; margin-top: -2px; }
        .lang-toggle { display: flex; align-items: center; border: 1px solid #e8e8e8; border-radius: 3px; overflow: hidden; margin-left: 4px; }
        .lang-toggle button { padding: 3px 8px; font-size: 10px; letter-spacing: 0.08em; border: none; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .lang-toggle button.active { background: #1a1a1a; color: #fff; }
        .lang-toggle button:not(.active) { background: transparent; color: #aaa; }
        .hero { text-align: center; padding: 80px 24px 48px; }
        .hero h1 { font-family: 'Noto Serif KR', serif; font-size: clamp(28px, 5vw, 48px); font-weight: 200; line-height: 1.4; color: #1a1a1a; margin-bottom: 16px; }
        .hero-sub { font-size: 13px; color: #888; margin-bottom: 4px; }
        .hero-sub2 { font-size: 12px; color: #bbb; margin-bottom: 56px; }
        .form-card { max-width: 560px; margin: 0 auto; padding: 0 24px 80px; }
        .step-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #bbb; margin-bottom: 24px; }
        .field-group { margin-bottom: 28px; }
        .field-label { display: block; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
        .optional { font-size: 10px; color: #ccc; text-transform: none; letter-spacing: 0; margin-left: 6px; }
        input[type="text"], input[type="number"], input[type="url"] { width: 100%; border: none; border-bottom: 1px solid #e0e0e0; background: transparent; padding: 10px 0; font-size: 14px; font-family: 'Noto Sans KR', sans-serif; font-weight: 300; color: #1a1a1a; outline: none; transition: border-color 0.2s; }
        input[type="text"]:focus, input[type="number"]:focus, input[type="url"]:focus { border-bottom-color: #1a1a1a; }
        input::placeholder { color: #ccc; }
        .field-row { display: flex; gap: 24px; }
        .field-row .field-group { flex: 1; }
        .input-prefix-wrap { display: flex; align-items: center; border-bottom: 1px solid #e0e0e0; transition: border-color 0.2s; }
        .input-prefix-wrap:focus-within { border-bottom-color: #1a1a1a; }
        .input-prefix { font-size: 14px; color: #aaa; font-weight: 300; padding: 10px 6px 10px 0; user-select: none; }
        .input-prefix-wrap input { border: none; flex: 1; }
        .qty-wrap { display: flex; align-items: center; border-bottom: 1px solid #e0e0e0; width: fit-content; }
        .qty-btn { width: 32px; height: 38px; background: none; border: none; cursor: pointer; font-size: 18px; color: #aaa; display: flex; align-items: center; justify-content: center; transition: color 0.15s; }
        .qty-btn:hover { color: #1a1a1a; }
        .qty-num { font-size: 16px; font-weight: 300; min-width: 32px; text-align: center; padding: 10px 4px; }
        .btn-calc { width: 100%; padding: 16px; background: #f5f5f3; border: 1px solid #e8e8e8; font-family: 'Noto Sans KR', sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #666; cursor: pointer; margin-top: 8px; transition: background 0.15s, color 0.15s; }
        .btn-calc:hover { background: #efefed; color: #1a1a1a; }
        .divider { border: none; border-top: 1px solid #f0f0f0; margin: 36px 0; }
        .price-box { padding: 28px 0 0; }
        .price-row { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
        .price-row:last-child { border-bottom: none; }
        .pr-label { font-size: 12px; color: #999; letter-spacing: 0.05em; }
        .pr-value { font-size: 13px; color: #555; font-weight: 300; }
        .price-row.total { margin-top: 8px; padding-top: 20px; border-top: 1px solid #e8e8e8; border-bottom: none; }
        .price-row.total .pr-label { font-size: 13px; color: #1a1a1a; font-weight: 400; }
        .price-row.total .pr-value { font-size: 18px; color: #1a1a1a; font-weight: 400; }
        .notice { font-size: 11px; color: #bbb; margin-top: 12px; line-height: 1.7; }
        .btn-cart { width: 100%; padding: 18px; background: #1a1a1a; border: none; font-family: 'Noto Sans KR', sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #fff; cursor: pointer; margin-top: 28px; transition: background 0.15s; }
        .btn-cart:hover { background: #333; }
        .btn-more { width: 100%; padding: 16px; background: transparent; border: 1px solid #e8e8e8; font-family: 'Noto Sans KR', sans-serif; font-size: 12px; letter-spacing: 0.1em; color: #999; cursor: pointer; margin-top: 12px; transition: border-color 0.15s, color 0.15s; }
        .btn-more:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .how-strip { background: #f5f5f3; border-top: 1px solid #ebebea; padding: 48px 24px; text-align: center; }
        .how-strip h2 { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #bbb; margin-bottom: 36px; }
        .steps { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; max-width: 640px; margin: 0 auto; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 140px; }
        .step-num { font-size: 10px; letter-spacing: 0.2em; color: #ccc; }
        .step-icon { font-size: 22px; }
        .step-text { font-size: 12px; color: #777; line-height: 1.6; text-align: center; }
        footer { padding: 32px 48px; border-top: 1px solid #f0f0f0; }
        .footer-inner { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .footer-links a { font-size: 11px; letter-spacing: 0.05em; color: #bbb; text-decoration: none; }
        .footer-links a:hover { color: #555; }
        .copyright { font-size: 11px; color: #ccc; }
        .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px); background: #1a1a1a; color: #fff; padding: 12px 24px; font-size: 12px; letter-spacing: 0.05em; border-radius: 2px; opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; pointer-events: none; white-space: nowrap; z-index: 999; }
        .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        @media (max-width: 600px) { header { padding: 24px 20px; } .form-card { padding: 0 20px 60px; } .field-row { flex-direction: column; gap: 0; } .steps { gap: 28px; } footer { padding: 24px 20px; } }
      `}</style>

      <header>
        <button className="logo" onClick={() => router.push('/')}>MAUM</button>
        <nav>
          <a href="/cart">{s.cartLabel}{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</a>
          <a href="/contact">{s.contact}</a>
          <div className="lang-toggle">
            <button className={lang === 'ko' ? 'active' : ''} onClick={() => setLang('ko')}>KO</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
        </nav>
      </header>

      <div className="hero">
        <h1>{s.heroTitle}</h1>
        <p className="hero-sub">{s.heroDes}</p>
        <p className="hero-sub2">{s.heroDes2}</p>
      </div>

      <div className="form-card">
        <p className="step-label">{s.labelOrder}</p>

        <div className="field-group">
          <label className="field-label">
            {s.lblUrl} <span className="optional">{s.lblOptional}</span>
          </label>
          <input
            type="url"
            value={productUrl}
            onChange={e => setProductUrl(e.target.value)}
            placeholder="https://www.coupang.com/vp/products/..."
          />
        </div>

        <div className="field-group">
          <label className="field-label">{s.lblName}</label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder={lang === 'ko' ? '예: 제주 삼다수 2L 24개' : 'e.g. Jeju Samdasoo 2L x24'}
          />
        </div>

        <div className="field-row">
          <div className="field-group">
            <label className="field-label">{s.lblPrice}</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">₩</span>
              <input
                type="number"
                value={priceKrw}
                onChange={e => setPriceKrw(e.target.value)}
                placeholder="25000"
                min="0"
              />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">{s.lblQty}</label>
            <div className="qty-wrap">
              <button className="qty-btn" onClick={() => changeQty(-1)}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => changeQty(1)}>+</button>
            </div>
          </div>
        </div>

        <button className="btn-calc" onClick={calculate}>{s.btnCalc}</button>

        {showBreakdown && breakdown && (
          <div className="price-box">
            <hr className="divider" />
            <div className="price-row">
              <span className="pr-label">{s.lblKrw}</span>
              <span className="pr-value">₩{breakdown.totalKrw.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span className="pr-label">{s.lblUsdProd}</span>
              <span className="pr-value">${breakdown.priceUsd.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span className="pr-label">{s.lblFee} <span style={{color:'#ccc',fontSize:'11px'}}>(10%)</span></span>
              <span className="pr-value">${breakdown.serviceFee.toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span className="pr-label">{s.lblTotal}</span>
              <span className="pr-value">${breakdown.total.toFixed(2)} USD</span>
            </div>
            <p className="notice">{s.notice1}<br />{s.notice2}</p>
            <button className="btn-cart" onClick={addToCart}>{s.btnCart}</button>
            <button className="btn-more" onClick={addMore}>{s.btnMore}</button>
          </div>
        )}
      </div>

      <div className="how-strip">
        <h2>{s.howTitle}</h2>
        <div className="steps">
          <div className="step">
            <span className="step-num">01</span>
            <span className="step-icon">🔗</span>
            <p className="step-text">{s.step1}</p>
          </div>
          <div className="step">
            <span className="step-num">02</span>
            <span className="step-icon">💰</span>
            <p className="step-text">{s.step2}</p>
          </div>
          <div className="step">
            <span className="step-num">03</span>
            <span className="step-icon">📦</span>
            <p className="step-text">{s.step3}</p>
          </div>
          <div className="step">
            <span className="step-num">04</span>
            <span className="step-icon">❤️</span>
            <p className="step-text">{s.step4}</p>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-inner">
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/how-it-works">이용 방법</a>
            <a href="/terms">이용약관</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/contact">문의하기</a>
          </div>
          <span className="copyright">© 2026 Maum Concierge</span>
        </div>
      </footer>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
