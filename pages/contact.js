import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    // mailto 방식으로 이메일 클라이언트 열기
    const subject = encodeURIComponent(`[Maum 문의] ${form.name}`);
    const body = encodeURIComponent(
      `이름: ${form.name}\n이메일: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:maumsupport@gmail.com?subject=${subject}&body=${body}`;
    setLoading(false);
    setSent(true);
  };

  const inputStyle = {
    width: '100%', padding: '12px 0', fontSize: '14px', border: 'none',
    borderBottom: '1px solid #ddd', outline: 'none', background: 'transparent', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: '11px', letterSpacing: '.1em', color: '#999', textTransform: 'uppercase',
    display: 'block', marginBottom: '4px',
  };

  return (
    <>
      <Head><title>문의하기 — Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>

        {/* 홈으로 버튼 */}
        <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.05em' }}>
            ← 홈으로
          </button>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>
        <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>문의하기</p>

        {sent ? (
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✉️</div>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>이메일 클라이언트가 열렸습니다.</p>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '32px' }}>
              이메일 앱에서 전송을 눌러주세요.<br />
              또는 직접 <a href="mailto:maumsupport@gmail.com" style={{ color: '#1a1a1a' }}>maumsupport@gmail.com</a>으로 문의해 주세요.
            </p>
            <button onClick={() => router.push('/')} style={{ padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: 'pointer' }}>
              홈으로
            </button>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '480px' }}>
            {/* 직접 이메일 안내 */}
            <div style={{ background: '#f5f5f3', padding: '16px 20px', marginBottom: '32px', borderRadius: '2px' }}>
              <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                이메일로 직접 문의하실 수 있습니다:{' '}
                <a href="mailto:maumsupport@gmail.com" style={{ color: '#1a1a1a', fontWeight: 400 }}>
                  maumsupport@gmail.com
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>이름</label>
                <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="홍길동" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>이메일</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>문의 내용</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', paddingTop: '8px', fontFamily: 'inherit' }}
                  placeholder="문의 내용을 입력해 주세요."
                />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: 'pointer' }}>
                이메일로 문의하기
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
