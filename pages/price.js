import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function PricePage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = sessionStorage.getItem('coupang_url');
    if (!url) { router.push('/'); return; }

    fetch('/api/check-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.message || '가격을 불러오지 못했어요.');
        else setProduct({ ...data, url });
        setLoading(false);
      })
      .catch(() => { setError('네트워크 오류가 발생했어요.'); setLoading(false); });
  }, []);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    cart.push(product);
    localStorage.setItem('maum_cart', JSON.stringify(cart));
    sessionStorage.removeItem('coupang_url');
    router.push('/');
  };

  const checkout = () => {
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    const existing = cart.find(i => i.url === product.url);
    if (!existing) cart.push(product);
    localStorage.setItem('maum_cart', JSON.stringify(cart));
    router.push('/checkout');
  };

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Sans KR", sans-serif', padding: '0 24px' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 40px', borderBottom: '1px solid #f0f0f0' },
    logo: { fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300, color: '#1a1a1a', cursor: 'pointer', textDecoration: 'none' },
    container: { maxWidth: 560, margin: '0 auto', paddingTop: 56 },
    img: { width: '100%', height: 280, objectFit: 'contain', backgroundColor: '#fafafa', marginBottom: 32 },
    productName: { fontFamily: '"Noto Serif KR", serif', fontSize: 18, fontWeight: 300, color: '#1a1a1a', marginBottom: 32, lineHeight: 1.6 },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: 40 },
    row: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '16px 0', fontSize: 14, color: '#666', fontWeight: 300 },
    tdRight: { padding: '16px 0', fontSize: 14, color: '#1a1a1a', textAlign: 'right', fontWeight: 400 },
    totalRow: { borderTop: '1px solid #1a1a1a' },
    totalTd: { padding: '20px 0', fontSize: 15, color: '#1a1a1a', fontWeight: 500 },
    totalTdRight: { padding: '20px 0', fontSize: 18, color: '#1a1a1a', textAlign: 'right', fontWeight: 500 },
    btnPrimary: { width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12 },
    btnSecondary: { width: '100%', padding: '20px', backgroundColor: '#fff', color: '#1a1a1a', border: '1px solid #1a1a1a', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' },
    note: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 16, letterSpacing: '0.05em' },
    loading: { textAlign: 'center', paddingTop: 120, fontSize: 13, color: '#999', letterSpacing: '0.1em' },
    errorBox: { textAlign: 'center', paddingTop: 80 },
    errorText: { fontSize: 14, color: '#999', marginBottom: 32 },
    backBtn: { fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' },
  };

  return (
    <>
      <Head>
        <title>가격 확인 — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <a style={s.logo} onClick={() => router.push('/')}>Maum</a>
          <span style={{ fontSize: 12, letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase' }}>Price Check</span>
        </nav>

        <div style={s.container}>
          {loading && <div style={s.loading}>가격을 불러오는 중...</div>}

          {error && (
            <div style={s.errorBox}>
              <p style={s.errorText}>{error}</p>
              <button style={s.backBtn} onClick={() => router.push('/')}>← 다시 시도</button>
            </div>
          )}

          {product && !loading && (
            <>
              {product.imageUrl && (
                <img src={product.imageUrl.startsWith('//') ? 'https:' + product.imageUrl : product.imageUrl}
                  alt={product.productName} style={s.img} />
              )}
              <p style={s.productName}>{product.productName}</p>

              <table style={s.table}>
                <tbody>
                  <tr style={s.row}>
                    <td style={s.td}>쿠팡 상품 가격</td>
                    <td style={s.tdRight}>₩{product.priceKrw.toLocaleString()}</td>
                  </tr>
                  <tr style={s.row}>
                    <td style={s.td}>환율 적용 (₩{product.exchangeRate} / $1)</td>
                    <td style={s.tdRight}>${product.priceUsd.toFixed(2)}</td>
                  </tr>
                  <tr style={s.row}>
                    <td style={s.td}>서비스 수수료 (10%)</td>
                    <td style={s.tdRight}>${product.serviceFee.toFixed(2)}</td>
                  </tr>
                  <tr style={s.totalRow}>
                    <td style={s.totalTd}>총 결제 금액</td>
                    <td style={s.totalTdRight}>${product.total.toFixed(2)} USD</td>
                  </tr>
                </tbody>
              </table>

              <button style={s.btnPrimary} onClick={checkout}>바로 체크아웃</button>
              <button style={s.btnSecondary} onClick={addToCart}>장바구니에 담고 더 쇼핑하기</button>
              <p style={s.note}>배송비는 별도입니다 · 결제는 체크아웃에서 진행됩니다</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
