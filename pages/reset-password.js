import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the token in the URL hash on redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      } else {
        // Try to exchange the hash token
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          setReady(true);
        } else {
          router.replace('/login');
        }
      }
    });
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('비밀번호가 일치하지 않습니다.');
    if (form.password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.');
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: form.password });
      if (updateError) throw updateError;
      setDone(true);
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

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999' }}>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <Head><title>비밀번호 재설정 — Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>
        <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>비밀번호 재설정</p>

        {done ? (
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✓</div>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '32px' }}>비밀번호가 변경되었습니다.</p>
            <button onClick={() => router.push('/')} style={{ padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: 'pointer' }}>
              홈으로
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>새 비밀번호</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="6자 이상" />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>비밀번호 확인</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} placeholder="비밀번호 다시 입력" />
            </div>
            {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '처리 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
