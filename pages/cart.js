import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    setCart(saved);
  }, []);

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('maum_cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Sans KR", sans-serif', padding: '0 24px' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 40px', borderBottom: '1px solid #f0f0f0' },
    logo: { fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300, color: '#1a1a1a', cursor: 'pointer', background: 'none', border: 'none' },
    container: { maxWidth: 600, margin: '0 auto', paddingTop: 48 },
    title: { fontFamily: '"Noto Serif KR", serif', fontSize: 22, fontWeight: 200, marginBottom: 40, color: '#1a1a1a' },
    item: { display: 'flex', alignItems: 'flex-start', gap: 20, padding: '24px 0', borderBottom: '1px solid #f0f0f0' },
    itemImg: { width: 80, height: 80, objectFit: 'contain', backgroundColor: '#fafafa', flexShrink: 0 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 13, color: '#1a1a1a', fontWeight: 300, marginBottom: 8, lineHeight: 1.5 },
    itemPrice: { fontSize: 14, color: '#1a1a1a', fontWeight: 400 },
    itemFee: { fontSize: 11, color: '#999', marginTop: 4 },
    removeBtn: { fontSize: 11, color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', padding: 0, marginTop: 8, textDecoration: 'underline' },
    summary: { padding: '32px 0', borderTop: '1px solid #1a1a1a', marginTop: 8 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#666' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f0f0', fontSize: 16, fontWeight: 500, color: '#1a1a1a' },
    checkoutBtn: { width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 24, fontFamily: '"Noto Sans KR", sans-serif' },
    moreBtn: { width: '100%', padding: '20px', backgroundColor: '#fff', color: '#1a1a1a', border: '1px solid #1a1a1a', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 12, fontFamily: '"Noto Sans KR", sans-serif' },
    empty: { textAlign: 'center', paddingTop: 80 },
    emptyText: { fontSize: 14, color: '#999', marginBottom: 32 },
  };

  return (
    <>
      <Head>
        <title>장바구니 — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <button style={s.logo} onClick={() => router.push('/')}>Maum</button>
          <span style={{ fontSize: 12, letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase' }}>Cart</span>
        </nav>

        <div style={s.container}>
          <h1 style={s.title}>장바구니</h1>

          {cart.length === 0 ? (
            <div style={s.empty}>
              <p style={s.emptyText}>장바구니가 비어있어요.</p>
              <button style={s.moreBtn} onClick={() => router.push('/')}>쇼핑 시작하기</button>
            </div>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} style={s.item}>
                  {item.imageUrl && (
                    <img src={item.imageUrl.startsWith('//') ? 'https:' + item.imageUrl : item.imageUrl}
                      alt={item.productName} style={s.itemImg} />
                  )}
                  <div style={s.itemInfo}>
                    <p style={s.itemName}>{item.productName}</p>
                    <p style={s.itemPrice}>${item.total.toFixed(2)} USD</p>
                    <p style={s.itemFee}>₩{item.priceKrw?.toLocaleString()} · 수수료 ${item.serviceFee?.toFixed(2)}</p>
                    <button style={s.removeBtn} onClick={() => removeItem(i)}>삭제</button>
                  </div>
                </div>
              ))}

              <div style={s.summary}>
                {cart.map((item, i) => (
                  <div key={i} style={s.summaryRow}>
                    <span style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div style={s.totalRow}>
                  <span>총 결제 금액</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>
              </div>

              <button style={s.checkoutBtn} onClick={() => router.push('/checkout')}>체크아웃</button>
              <button style={s.moreBtn} onClick={() => router.push('/')}>+ 상품 더 추가하기</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
