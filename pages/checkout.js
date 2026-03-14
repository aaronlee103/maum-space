import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    senderName: '', senderEmail: '',
    recipientName: '', recipientPhone: '',
    recipientAddress: '', recipientPostcode: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    if (saved.length === 0) router.push('/');
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    localStorage.removeItem('maum_cart');
    setSubmitted(true);
    setLoading(false);
  };

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Sans KR", sans-serif', padding: '0 24px' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 40px', borderBottom: '1px solid #f0f0f0' },
    logo: { fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300, color: '#1a1a1a', cursor: 'pointer', background: 'none', border: 'none' },
    container: { maxWidth: 560, margin: '0 auto', paddingTop: 48, paddingBottom: 80 },
    title: { fontFamily: '"Noto Serif KR", serif', fontSize: 22, fontWeight: 200, marginBottom: 8, color: '#1a1a1a' },
    subtitle: { fontSize: 11, color: '#999', letterSpacing: '0.1em', marginBottom: 40 },
    section: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: 20, marginTop: 40 },
    field: { marginBottom: 24 },
    label: { fontSize: 11, letterSpacing: '0.1em', color: '#999', display: 'block', marginBottom: 8 },
    input: { width: '100%', padding: '14px 0', fontSize: 14, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', backgroundColor: 'transparent', color: '#1a1a1a', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '14px 0', fontSize: 14, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', backgroundColor: 'transparent', color: '#1a1a1a', resize: 'none', boxSizing: 'border-box' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    divider: { borderTop: '1px solid #f0f0f0', margin: '40px 0' },
    orderItem: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 12 },
    orderName: { maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 500, color: '#1a1a1a', paddingTop: 20, borderTop: '1px solid #1a1a1a', marginTop: 8 },
    submitBtn: { width: '100%', padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', marginTop: 32, fontFamily: '"Noto Sans KR", sans-serif' },
    note: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 16, lineHeight: 1.8 },
    successBox: { textAlign: 'center', paddingTop: 80 },
    successTitle: { fontFamily: '"Noto Serif KR", serif', fontSize: 24, fontWeight: 200, marginBottom: 16, color: '#1a1a1a' },
    successText: { fontSize: 13, color: '#999', lineHeight: 1.8, marginBottom: 40 },
    homeBtn: { fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', background: 'none', border: '1px solid #1a1a1a', padding: '16px 40px', fontFamily: '"Noto Sans KR", sans-serif' },
  };

  if (submitted) return (
    <>
      <Head><title>주문 완료 — Maum</title></Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <button style={s.logo} onClick={() => router.push('/')}>Maum</button>
        </nav>
        <div style={{ ...s.container, ...s.successBox }}>
          <h1 style={s.successTitle}>마음이 전달되고 있습니다.</h1>
          <p style={s.successText}>
            주문이 접수되었습니다.<br />
            {form.senderEmail}으로 확인 메일을 보내드릴게요.<br />
            보통 1-2 영업일 내에 연락드립니다.
          </p>
          <button style={s.homeBtn} onClick={() => router.push('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>체크아웃 — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <nav style={s.nav}>
          <button style={s.logo} onClick={() => router.push('/')}>Maum</button>
          <span style={{ fontSize: 12, letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase' }}>Checkout</span>
        </nav>

        <div style={s.container}>
          <h1 style={s.title}>배송 정보</h1>
          <p style={s.subtitle}>주문자 정보와 한국 수령인 정보를 입력해주세요</p>

          <form onSubmit={handleSubmit}>
            <p style={s.section}>주문자 정보</p>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>이름</label>
                <input style={s.input} name="senderName" value={form.senderName} onChange={handleChange} placeholder="홍길동" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>이메일</label>
                <input style={s.input} type="email" name="senderEmail" value={form.senderEmail} onChange={handleChange} placeholder="email@example.com" required />
              </div>
            </div>

            <p style={s.section}>한국 수령인 정보</p>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>수령인 이름</label>
                <input style={s.input} name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="홍길순" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>연락처</label>
                <input style={s.input} name="recipientPhone" value={form.recipientPhone} onChange={handleChange} placeholder="010-0000-0000" required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>우편번호</label>
              <input style={s.input} name="recipientPostcode" value={form.recipientPostcode} onChange={handleChange} placeholder="06000" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>주소</label>
              <input style={s.input} name="recipientAddress" value={form.recipientAddress} onChange={handleChange} placeholder="서울시 강남구 테헤란로 123" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>메시지 (선택)</label>
              <textarea style={s.textarea} name="message" value={form.message} onChange={handleChange} placeholder="함께 전할 메시지를 적어주세요" rows={3} />
            </div>

            <div style={s.divider} />

            <p style={s.section}>주문 요약</p>
            {cart.map((item, i) => (
              <div key={i} style={s.orderItem}>
                <span style={s.orderName}>{item.productName}</span>
                <span>${item.total.toFixed(2)}</span>
              </div>
            ))}
            <div style={s.totalRow}>
              <span>총 결제 금액</span>
              <span>${total.toFixed(2)} USD</span>
            </div>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? '주문 접수 중...' : '주문 접수하기'}
            </button>
            <p style={s.note}>
              주문 접수 후 담당자가 확인하여 결제 안내를 드립니다.<br />
              배송비는 별도로 안내드립니다.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
