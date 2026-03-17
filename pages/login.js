import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (loginError) throw loginError;
      const redirect = router.query.redirect || '/mypage';
      router.push(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async e => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetLoading(false);
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
      <Head><title>로그인 — Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>
        <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
          <button onClick={() => router.push('/mypage')} style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.05em' }}>
            ← 홈으로
          </button>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>

        {resetMode ? (
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '40px', textAlign: 'center' }}>비밀번호 재설정</p>
            {resetSent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>✓</div>
                <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>재설정 이메일을 발송했습니다.</p>
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '32px' }}>메일함을 확인해 주세요.</p>
                <button onClick={() => { setResetMode(false); setResetSent(false); }} style={{ fontSize: '13px', color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  로그인으로 돌아가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: '32px' }}>
                  <label style={labelStyle}>이메일</label>
                  <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required style={inputStyle} placeholder="you@example.com" />
                </div>
                {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
                <button type="submit" disabled={resetLoading} style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: resetLoading ? 'not-allowed' : 'pointer', opacity: resetLoading ? 0.7 : 1 }}>
                  {resetLoading ? '처리 중...' : '재설정 이메일 보내기'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button type="button" onClick={() => { setResetMode(false); setError(''); }} style={{ fontSize: '13px', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>
                    로그인으로 돌아가기
                  </button>
                </p>
              </form>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>로그인</p>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>이메일</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={labelStyle}>비밀번호</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="••••••" />
              </div>
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <button type="button" onClick={() => { setResetMode(true); setError(''); }} style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.02em' }}>
                  비밀번호를 잊으셨나요?
                </button>
              </div>
              {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? '처리 중...' : '로그인'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
                처음 방문하세요?{' '}
                <a href="/signup" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>회원가입</a>
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
