import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('maum_cart') || '[]');
    setCartCount(cart.length);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let trimmed = url.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = 'https://' + trimmed;
    }
    sessionStorage.setItem('coupang_url', trimmed);
    setLoading(true);
    router.push('/price');
  };

  return (
    <>
      <Head>
        <title>Maum \u2014 \uD55C\uAD6D\uC73C\uB85C \uB9C8\uC74C\uC744 \uC804\uD569\uB2C8\uB2E4</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', fontFamily: '"Noto Sans KR", sans-serif', color: '#1a1a1a' }}>
        <header style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Maum</span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {cartCount > 0 && (
              <button onClick={() => router.push('/cart')} style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>
                \uC7A5\uBC14\uAD6C\uB2C8 ({cartCount})
              </button>
            )}
            {user ? (
              <button onClick={() => router.push('/mypage')} style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>
                \uB9C8\uC774\uD398\uC774\uC9C0
              </button>
            ) : (
              <>
                <button onClick={() => router.push('/login')} style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>
                  \uB85C\uADF8\uC778
                </button>
                <button onClick={() => router.push('/signup')} style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: '1px solid #1a1a1a', cursor: 'pointer', color: '#1a1a1a', padding: '6px 14px' }}>
                  \uD68C\uC6D0\uAC00\uC785
                </button>
              </>
            )}
          </div>
        </header>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 48px 80px' }}>
          <div style={{ width: '100%', maxWidth: '640px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 200, marginBottom: '16px', lineHeight: 1.4 }}>
                \uD55C\uAD6D\uC73C\uB85C \uB9C8\uC74C\uC744 \uC804\uD569\uB2C8\uB2E4.
              </h1>
              <p style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', fontWeight: 300 }}>
                Coupang Concierge Service
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="\uCFE0\uD329 \uC0C1\uD488 \uB9C1\uD06C\uB97C \uC785\uB825\uD558\uC138\uC694"
                required
                style={{ width: '100%', padding: '16px 0', fontSize: '14px', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, border: 'none', borderBottom: '1px solid #ccc', outline: 'none', backgroundColor: 'transparent', color: '#1a1a1a', boxSizing: 'border-box', marginBottom: '0' }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '20px', marginTop: '24px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300 }}>
                {loading ? '\uD655\uC778 \uC911...' : 'Check Price'}
              </button>
            </form>
          </div>
        </main>
        <footer style={{ padding: '24px 48px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#999' }}>Maum.space</span>
          <span style={{ fontSize: '11px', color: '#999' }}>\u00A9 2026 Maum Concierge</span>
          <span style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#999' }}>How it works \u00B7 Privacy</span>
        </footer>
      </div>
    </>
  );
}
