import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('비밀번호가 일치하지 않습니다.');
    if (form.password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.');
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name } },
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: form.name,
          email: form.email,
        });
      }
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

  return (
    <>
      <Head><title>회원가입 — Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>
        <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.05em' }}>
            ← 홈으로
          </button>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>
        <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>회원가입</p>

        {done ? (
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✓</div>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>회원가입이 완료되었습니다.</p>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '32px' }}>이메일 인증이 필요한 경우 발송된 메일을 확인해 주세요.</p>
            <button onClick={() => router.push('/login')} style={{ padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: 'pointer' }}>
              로그인
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>이름</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="홍길동" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>이메일</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>비밀번호</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="6자 이상" />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>비밀번호 확인</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} placeholder="비밀번호 다시 입력" />
            </div>
            {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '처리 중...' : '가입하기'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
              이미 회원이신가요?{' '}
              <a href="/login" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>로그인</a>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
