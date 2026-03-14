import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 0', fontSize: '14px',
    border: 'none', borderBottom: '1px solid #ddd', outline: 'none',
    background: 'transparent', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '11px', letterSpacing: '.1em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' };

  return (
    <>
      <Head><title>\uB85C\uADF8\uC778 \u2014 Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>
        <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>\uB85C\uADF8\uC778</p>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>\uC774\uBA54\uC77C</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>\uBE44\uBC00\uBC88\uD638</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="â¢â¢â¢â¢â¢â¢" />
          </div>
          {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '\uCC98\uB9AC \uC911...' : '\uB85C\uADF8\uC778'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
            \uCC98\uC75C \uBC29\uBB38\uD558\uC138\uC694?{' '}
            <a href="/signup" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>\uD68C\uC6D0\uAC00\uC785</a>
          </p>
        </form>
      </div>
    </>
  );
}
