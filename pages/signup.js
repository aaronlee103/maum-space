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
    if (form.password !== form.confirmPassword) return setError('\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.');
    if (form.password.length < 6) return setError('\uBE44\uBC00\uBC88\uD638\uB294 6\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.');
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
    width: '100%', padding: '12px 0', fontSize: '14px',
    border: 'none', borderBottom: '1px solid #ddd', outline: 'none',
    background: 'transparent', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '11px', letterSpacing: '.1em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '4px' };

  return (
    <>
      <Head><title>\uD68C\uC6D0\uAC00\uC785 \u2014 Maum</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafaf8' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 300, letterSpacing: '.15em', marginBottom: '8px' }}>Maum</h1>
        <p style={{ fontSize: '12px', color: '#999', letterSpacing: '.1em', marginBottom: '48px' }}>\uD68C\uC6D0\uAC00\uC785</p>

        {done ? (
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>&#10003;</div>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>\uD68C\uC6D0\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.</p>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '32px' }}>\uC774\uBA54\uC77C \uC778\uC99D\uC774 \uD544\uC694\uD55C \uACBD\uC6B0 \uBC1C\uC1A1\uB41C \uBA54\uC77C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.</p>
            <button onClick={() => router.push('/login')}
              style={{ padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: 'pointer' }}>
              \uB85C\uADF8\uC778
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>\uC774\uB984</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="\uD64D\uAE38\uB3D9" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>\uC774\uBA54\uC77C</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>\uBE44\uBC00\uBC88\uD638</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="6\uC790 \uC774\uC0C1" />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>\uBE44\uBC00\uBC88\uD638 \uD655\uC778</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} placeholder="\uBE44\uBC00\uBC88\uD638 \uB2E4\uC2DC \uC785\uB825" />
            </div>
            {error && <p style={{ color: '#c00', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '13px', letterSpacing: '.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '\uCC98\uB9AC \uC911...' : '\uAC00\uC785\uD558\uAE30'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
              \uC774\uBBF8 \uD68C\uC6D0\uC774\uC2E0\uAC00\uC694?{' '}
              <a href="/login" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>\uB85C\uADF8\uC778</a>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
