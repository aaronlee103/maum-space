import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function PricePage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
        if (data.error) setError('\uAC00\uACA9\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.');
        else setProduct({ ...data, url });
        setLoading(false);
      })
      .catch(() => {
        setError('\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694.');
        setLoading(false);
      });
  }, []);

  const getAdj = (qty) => {
    if (!product) return { adjustedRate: 0, totalKrw: 0, priceUsd: 0, serviceFee: 0, total: 0 };
    const r = product.exchangeRate * 0.975;
    const krw = product.priceKrw * qty;
    const usd = krw / r;
    const fee = usd * 0.10;
    return {
      adjustedRate: parseFloat(r.toFixed(2)),
      totalKrw: krw,
      priceUsd: parseFloat(usd.toFixed(2)),
      serviceFee: parseFloat(fee.toFixed(2)),
      total: parseFloat((usd + fee).toFixed(2)),
    };
  };

  const adj = getAdj(quantity);
  const isHighValue = product && adj.totalKrw > 1000000;

  const addToCart = () => {
    const item = { ...product, quantity, ...adj };
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    cart.push(item);
    localStorage.setItem('maum_cart', JSON.stringify(cart));
    sessionStorage.removeItem('coupang_url');
    router.push('/');
  };

  const checkout = () => {
    const item = { ...product, quantity, ...adj };
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    if (!cart.find(i => i.url === product.url)) cart.push(item);
    localStorage.setItem('maum_cart', JSON.stringify(cart));
    router.push('/checkout');
  };

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Sans KR", sans-serif', padding: '0 24px' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 40px', borderBottom: '1px solid #f0f0f0' },
    logo: { fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300, color: '#1a1a1a', cursor: 'pointer', textDecoration: 'none' },
    container: { maxWidth: 560, margin: '0 auto', paddingTop: 56 },
    img: { width: '100%', height: 280, objectFit: 'contain', backgroundColor: '#fafafa', marginBottom: 32 },
    productName: { fontFamily: '"Noto Serif KR", serif', fontSize: 18, fontWeight: 300, color: '#1a1a1a', marginBottom: 24, lineHeight: 1.6 },
    qtyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' },
    qtyLabel: { fontSize: 14, color: '#666', fontWeight: 300 },
    qtyControls: { display: 'flex', alignItems: 'center' },
    qtyBtn: { width: 36, height: 36, border: '1px solid #ddd', backgroundColor: '#fff', fontSize: 20, cursor: 'pointer', color: '#1a1a1a', padding: 0, lineHeight: '36px', textAlign: 'center' },
    qtyNum: { width: 48, textAlign: 'center', fontSize: 16, fontWeight: 400, color: '#1a1a1a', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', height: 36, lineHeight: '36px', display: 'inline-block' },
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
    loadingSub: { marginTop: 16, fontSize: 12, color: '#bbb', letterSpacing: '0.05em', lineHeight: 1.8 },
    errorBox: { textAlign: 'center', paddingTop: 80 },
    errorText: { fontSize: 14, color: '#999', marginBottom: 32 },
    backBtn: { fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' },
    highValueBox: { backgroundColor: '#fff8f0', border: '1px solid #f0d0a0', borderRadius: 4, padding: '24px', marginBottom: 32, textAlign: 'center' },
    highValueText: { fontSize: 14, color: '#8a6020', lineHeight: 1.8, margin: 0 },
  };

  return (
    <>
      <Head>
        <title>{'\uAC00\uACA9 \uD655\uC778 \u2014 Maum'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <a style={s.logo} onClick={() => router.push('/')}>Maum</a>
          <span style={{ fontSize: 12, letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase' }}>Price Check</span>
        </nav>
        <div style={s.container}>
          {loading && (
            <div style={s.loading}>
              <div>{'\uAC00\uACA9\uC744 \uBD88\uB7EC\uC624\uB294 \uC911...'}</div>
              <div style={s.loadingSub}>{'\uCD5C\uB300 30\uCD08 \uC815\uB3C4 \uC18C\uC694\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.'}<br />{'\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824 \uC8FC\uC138\uC694.'}</div>
            </div>
          )}
          {error && (
            <div style={s.errorBox}>
              <p style={s.errorText}>{error}</p>
              <button style={s.backBtn} onClick={() => router.push('/')}>{'\u2190 \uB2E4\uC2DC \uC2DC\uB3C4'}</button>
            </div>
          )}
          {product && !loading && (
            <>
              {product.imageUrl && (
                <img src={product.imageUrl.startsWith('//') ? 'https:' + product.imageUrl : product.imageUrl} alt={product.productName} style={s.img} />
              )}
              <p style={s.productName}>{product.productName}</p>
              <div style={s.qtyRow}>
                <span style={s.qtyLabel}>{'\uC218\uB7C9'}</span>
                <div style={s.qtyControls}>
                  <button style={s.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <span style={s.qtyNum}>{quantity}</span>
                  <button style={s.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
              </div>
              {isHighValue ? (
                <div style={s.highValueBox}>
                  <p style={s.highValueText}>{'\uC8C4\uC1A1\uD569\uB2C8\uB2E4. \uD604\uC7AC \u20A91,000,000 \uC774\uC0C1\uC758 \uACE0\uAC00 \uC8FC\uBB38\uC740 \uC11C\uBE44\uC2A4\uB97C \uC81C\uACF5\uD558\uACE0 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.'}<br />{'\uC218\uB7C9\uC744 \uC904\uC5EC\uC8FC\uC138\uC694.'}</p>
                </div>
              ) : (
                <>
                  <table style={s.table}>
                    <tbody>
                      <tr style={s.row}>
                        <td style={s.td}>{'\uCFE0\uD32C \uC0C1\uD488 \uAC00\uACA9'}</td>
                        <td style={s.tdRight}>{'\u20A9'}{product.priceKrw.toLocaleString()}{quantity > 1 && (' \u00D7 ' + quantity)}</td>
                      </tr>
                      {quantity > 1 && (
                        <tr style={s.row}>
                          <td style={s.td}>{'\uC18C\uACC4'}</td>
                          <td style={s.tdRight}>{'\u20A9'}{adj.totalKrw.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr style={s.row}>
                        <td style={s.td}>{'\uD658\uC728 \uC801\uC6A9 (\u20A9' + adj.adjustedRate + ' / $1)'}</td>
                        <td style={s.tdRight}>{'$' + adj.priceUsd.toFixed(2)}</td>
                      </tr>
                      <tr style={s.row}>
                        <td style={s.td}>{'\uC11C\uBE44\uC2A4 \uC218\uC218\uB8CC (10%)'}</td>
                        <td style={s.tdRight}>{'$' + adj.serviceFee.toFixed(2)}</td>
                      </tr>
                      <tr style={s.totalRow}>
                        <td style={s.totalTd}>{'\uCD1D \uACB0\uC81C \uAE08\uC561'}</td>
                        <td style={s.totalTdRight}>{'$' + adj.total.toFixed(2) + ' USD'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button style={s.btnPrimary} onClick={checkout}>{'\uBC14\uB85C \uCCB4\uD06C\uC544\uC6C3'}</button>
                  <button style={s.btnSecondary} onClick={addToCart}>{'\uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uB2F4\uACE0 \uB354 \uC1FC\uD551\uD558\uAE30'}</button>
                  <p style={s.note}>{'\uBC30\uC1A1\uBE44\uB294 \uBCC4\uB3C4\uC785\uB2C8\uB2E4 \u00B7 \uACB0\uC81C\uB294 \uCCB4\uD06C\uC544\uC6C3\uC5D0\uC11C \uC9C4\uD589\uB429\uB2C8\uB2E4'}</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
    }
