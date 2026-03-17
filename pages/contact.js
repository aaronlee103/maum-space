import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useLanguage from '../lib/useLanguage';

export default function ContactPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || lang === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <Head><title>{lang === 'ko' ? '문의하기' : 'Contact Us'} - Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>
        <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.05em' }}>
            ← 홈으로
          </button>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>
        <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>문의 하기</p>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '24px' }}>문의가 접수되었습니다. lang === 'ko' ? '감사합니다' : 'Thank you'.</p>
            <button onClick={() => router.push('/')} style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.05em' }}>← 홈으로</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '570px' }}>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>이 름 <span style={{ color: '#c00' }}>*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="홍길동" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>{lang === 'ko' ? '이메일' : 'Email'} <span style={{ color: '#c00' }}>*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="example@email.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>{lang === 'ko' ? '전화번호' : 'Phone'} <span style={{ color: '#c00' }}>*</span></label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="010-0000-0000" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '40px' }}>
              <label style={labelStyle}>{lang === 'ko' ? '문의 내용' : 'Message'} <span style={{ color: '#c00' }}>*</span></label>
              <textarea name="message" value={form.message} onChange={handleChange} required placeholder={lang === 'ko' ? '문의 내용을 입력해 주세요.' : 'Please enter your message.'} rows={5}
                style={{ ...inputStyle, resize: 'vertical', paddingTop: '12px' }} />
            </div>
            {error && <p style={{ color: '#c00', fontSize: '12px', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? '전송 중...' : 'lang === 'ko' ? '문의 남기기' : 'Send Message''}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
