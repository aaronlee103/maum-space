import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientAddressDetail: '',
    recipientPostcode: '',
    deliveryMethod: '\uBB38 \uC55E',
    deliveryOtherText: '',
    entranceType: 'free',
    entranceCode: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    if (saved.length === 0) router.push('/');
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.total, 0);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openPostcode = () => {
    const doOpen = () => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setForm(f => ({
            ...f,
            recipientPostcode: data.zonecode,
            recipientAddress: data.roadAddress || data.jibunAddress,
          }));
        }
      }).open();
    };
    if (window.daum && window.daum.Postcode) {
      doOpen();
    } else {
      const s = document.createElement('script');
      s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      s.onload = doOpen;
      document.head.appendChild(s);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      sessionStorage.setItem('maum_order', JSON.stringify(form));
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, orderData: form }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || '\uACB0\uC81C \uC138\uC158 \uC0DD\uC131 \uC2E4\uD328');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deliveryOptions = [
    '\uBB38 \uC55E',
    '\uC9C1\uC811 \uBC1B\uACE0 \uBD80\uC7AC \uC2DC \uBB38 \uC55E',
    '\uACBD\uBE44\uC2E4',
    '\uD0DD\uBC30\uD568',
    '\uAE30\uD0C0\uC0AC\uD56D',
  ];

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Sans KR", sans-serif', padding: '0 24px' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 40px', borderBottom: '1px solid #f0f0f0' },
    logo: { fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300, color: '#1a1a1a', cursor: 'pointer', background: 'none', border: 'none', fontFamily: '"Noto Sans KR", sans-serif' },
    container: { maxWidth: 560, margin: '0 auto', paddingTop: 48, paddingBottom: 80 },
    title: { fontFamily: '"Noto Serif KR", serif', fontSize: 22, fontWeight: 200, marginBottom: 8, color: '#1a1a1a' },
    subtitle: { fontSize: 11, color: '#999', letterSpacing: '0.1em', marginBottom: 40 },
    section: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: 20, marginTop: 40 },
    field: { marginBottom: 24 },
    label: { fontSize: 11, letterSpacing: '0.1em', color: '#999', display: 'block', marginBottom: 8 },
    input: { width: '100%', padding: '14px 0', fontSize: 14, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', backgroundColor: 'transparent', color: '#1a1a1a', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '14px 0', fontSize: 14, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', backgroundColor: 'transparent', color: '#1a1a1a', resize: 'none', boxSizing: 'border-box' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    postcodeWrap: { marginBottom: 24 },
    postcodeRow: { display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid #e0e0e0', paddingBottom: 14 },
    postcodeInput: { flex: 1, padding: '0', fontSize: 14, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#1a1a1a', boxSizing: 'border-box' },
    postcodeBtn: { padding: '8px 14px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', fontSize: 11, color: '#555', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: '"Noto Sans KR", sans-serif', letterSpacing: '0.05em', flexShrink: 0 },
    radioGroup: { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 8 },
    radioItem: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
    radioLabel: { fontSize: 14, color: '#333', fontWeight: 300, cursor: 'pointer' },
    radioInput: { accentColor: '#1a1a1a', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 },
    entranceBox: { backgroundColor: '#fafafa', padding: '20px 24px', marginBottom: 8, border: '1px solid #f0f0f0' },
    entranceTitle: { fontSize: 11, letterSpacing: '0.15em', color: '#999', marginBottom: 16, marginTop: 0 },
    divider: { borderTop: '1px solid #f0f0f0', margin: '40px 0' },
    orderItem: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 12 },
    orderName: { maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 500, color: '#1a1a1a', paddingTop: 20, borderTop: '1px solid #1a1a1a', marginTop: 8 },
    submitBtn: { width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', marginTop: 32, fontFamily: '"Noto Sans KR", sans-serif' },
    note: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 16, lineHeight: 1.8 },
    errorText: { fontSize: 13, color: '#c00', textAlign: 'center', marginTop: 12 },
  };

  return (
    <>
      <Head>
        <title>{'\uCCB4\uD06C\uC544\uC6C3 \u2014 Maum'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <button style={s.logo} onClick={() => router.push('/')}>Maum</button>
          <span style={{ fontSize: 12, letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase' }}>Checkout</span>
        </nav>
        <div style={s.container}>
          <h1 style={s.title}>{'\uBC30\uC1A1 \uC815\uBCF4'}</h1>
          <p style={s.subtitle}>{'\uC8FC\uBB38\uC790 \uC815\uBCF4\uC640 \uD55C\uAD6D \uC218\uB839\uC778 \uC815\uBCF4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694'}</p>
          <form onSubmit={handleSubmit}>
            <p style={s.section}>{'\uC8FC\uBB38\uC790 \uC815\uBCF4'}</p>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>{'\uC774\uB984'}</label>
                <input style={s.input} name="senderName" value={form.senderName} onChange={handleChange} placeholder={'\uD64D\uAE38\uB3D9'} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>{'\uC774\uBA54\uC77C'}</label>
                <input style={s.input} type="email" name="senderEmail" value={form.senderEmail} onChange={handleChange} placeholder="email@example.com" required />
              </div>
            </div>
            <p style={s.section}>{'\uD55C\uAD6D \uC218\uB839\uC778 \uC815\uBCF4'}</p>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>{'\uC218\uB839\uC778 \uC774\uB984'}</label>
                <input style={s.input} name="recipientName" value={form.recipientName} onChange={handleChange} placeholder={'\uD64D\uAE38\uC21C'} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>{'\uC5F0\uB77D\uCC98'}</label>
                <input style={s.input} name="recipientPhone" value={form.recipientPhone} onChange={handleChange} placeholder="010-0000-0000" required />
              </div>
            </div>
            <div style={s.postcodeWrap}>
              <label style={s.label}>{'\uC6B0\uD3B8\uBC88\uD638'}</label>
              <div style={s.postcodeRow}>
                <input style={s.postcodeInput} name="recipientPostcode" value={form.recipientPostcode} onChange={handleChange} placeholder="06000" readOnly onClick={openPostcode} required />
                <button type="button" style={s.postcodeBtn} onClick={openPostcode}>{'\uC6B0\uD3B8\uBC88\uD638 \uCC3E\uAE30'}</button>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>{'\uC8FC\uC18C'}</label>
              <input style={s.input} name="recipientAddress" value={form.recipientAddress} onChange={handleChange} placeholder={'\uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 123'} readOnly onClick={openPostcode} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>{'\uC0C1\uC138\uC8FC\uC18C'}</label>
              <input style={s.input} name="recipientAddressDetail" value={form.recipientAddressDetail} onChange={handleChange} placeholder={'101\uB3D9 1002\uD638'} />
            </div>
            <p style={s.section}>{'\uBC30\uC1A1 \uC694\uCCAD'}</p>
            <div style={s.radioGroup}>
              {deliveryOptions.map(opt => (
                <label key={opt} style={s.radioItem}>
                  <input type="radio" style={s.radioInput} name="deliveryMethod" value={opt} checked={form.deliveryMethod === opt} onChange={handleChange} />
                  <span style={s.radioLabel}>{opt}</span>
                </label>
              ))}
            </div>
            {form.deliveryMethod === '\uAE30\uD0C0\uC0AC\uD56D' && (
              <div style={{ marginBottom: 16 }}>
                <input style={s.input} name="deliveryOtherText" value={form.deliveryOtherText} onChange={handleChange} placeholder={'\uAE30\uD0C0 \uC694\uCCAD\uC0AC\uD56D\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694'} />
              </div>
            )}
            <p style={s.section}>{'\uACF5\uB3D9\uD604\uAD00'}</p>
            <div style={s.entranceBox}>
              <p style={s.entranceTitle}>{'\uACF5\uB3D9\uD604\uAD00 \uCD9C\uC785\uBC88\uD638'}</p>
              <div style={s.radioGroup}>
                <label style={s.radioItem}>
                  <input type="radio" style={s.radioInput} name="entranceType" value="code" checked={form.entranceType === 'code'} onChange={handleChange} />
                  <span style={s.radioLabel}>{'\uCD9C\uC785\uBC88\uD638 \uC785\uB825'}</span>
                </label>
                <label style={s.radioItem}>
                  <input type="radio" style={s.radioInput} name="entranceType" value="free" checked={form.entranceType === 'free'} onChange={handleChange} />
                  <span style={s.radioLabel}>{'\uBE44\uBC00\uBC88\uD638\uC5C6\uC774 \uCD9C\uC785 \uAC00\uB2A5\uD574\uC694'}</span>
                </label>
              </div>
              {form.entranceType === 'code' && (
                <input style={{ ...s.input, marginTop: 8 }} name="entranceCode" value={form.entranceCode} onChange={handleChange} placeholder={'\uC608: #1234'} />
              )}
            </div>
            <div style={{ ...s.field, marginTop: 32 }}>
              <label style={s.label}>{'\uBA54\uC2DC\uC9C0 (\uC120\uD0DD)'}</label>
              <textarea style={s.textarea} name="message" value={form.message} onChange={handleChange} placeholder={'\uD568\uAED8 \uC804\uD560 \uBA54\uC2DC\uC9C0\uB97C \uC801\uC5B4\uC8FC\uC138\uC694'} rows={3} />
            </div>
            <div style={s.divider} />
            <p style={s.section}>{'\uC8FC\uBB38 \uC694\uC57D'}</p>
            {cart.map((item, i) => (
              <div key={i} style={s.orderItem}>
                <span style={s.orderName}>{item.productName}</span>
                <span>{'$' + item.total.toFixed(2)}</span>
              </div>
            ))}
            <div style={s.totalRow}>
              <span>{'\uCD1D \uACB0\uC81C \uAE08\uC561'}</span>
              <span>{'$' + total.toFixed(2) + ' USD'}</span>
            </div>
            {error && <p style={s.errorText}>{error}</p>}
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? '\uACB0\uC81C \uCC98\uB9AC \uC911...' : '\uACB0\uC81C\uD558\uAE30'}
            </button>
            <p style={s.note}>{'\uBC30\uC1A1\uBE44\uB294 \uBCC4\uB3C4\uB85C \uC548\uB0B4\uB4DC\uB9BD\uB2C8\uB2E4'}</p>
          </form>
        </div>
      </div>
    </>
  );
    }
