import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function OrderComplete() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const run = async () => {
      // Read order data before clearing
      let orderData = null;
      let cart = [];
      try {
        const raw = sessionStorage.getItem('maum_order');
        if (raw) orderData = JSON.parse(raw);
        const cartRaw = sessionStorage.getItem('maum_cart');
        if (cartRaw) cart = JSON.parse(cartRaw);
      } catch (e) {}

      // Clear storage
      localStorage.removeItem('maum_cart');
      sessionStorage.removeItem('maum_order');
      sessionStorage.removeItem('maum_cart');

      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Send confirmation email
      if (orderData && orderData.senderEmail && !emailSent) {
        try {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderData, cart }),
          });
          setEmailSent(true);
        } catch (e) {}
      }

      // Save order to DB if logged in
      if (user && orderData) {
        const sessionId = router.query.session_id || '';
        const total = cart.reduce((s, i) => s + (i.total || 0), 0);
        const productName = cart.map(i => i.productName).join(', ');
        await supabase.from('orders').insert({
          user_id: user.id,
          stripe_session_id: sessionId,
          product_name: productName,
          quantity: cart.reduce((s, i) => s + (i.quantity || 1), 0),
          total_usd: total,
          order_data: orderData,
        });
      }
    };
    run();
  }, [router.isReady]);

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Sans KR", sans-serif', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    box: { textAlign: 'center', maxWidth: 480 },
    check: { fontSize: 48, marginBottom: 24, color: '#1a1a1a' },
    title: { fontFamily: '"Noto Serif KR", serif', fontSize: 24, fontWeight: 200, marginBottom: 16, color: '#1a1a1a' },
    text: { fontSize: 13, color: '#999', lineHeight: 2, marginBottom: 40 },
    btn: { fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', background: 'none', border: '1px solid #1a1a1a', padding: '16px 40px', fontFamily: '"Noto Sans KR", sans-serif' },
  };

  return (
    <>
      <Head>
        <title>{'\uC8FC\uBB38 \uC644\uB8CC \u2014 Maum'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <div style={s.box}>
          <div style={s.check}>&#10003;</div>
          <h1 style={s.title}>{'\uB9C8\uC74C\uC774 \uC804\uB2EC\uB418\uACE0 \uC788\uC2B5\uB2C8\uB2E4.'}</h1>
          <p style={s.text}>
            {'\uACB0\uC81C\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.'}<br />
            {'\uB2F4\uB2F9\uC790\uAC00 \uC8FC\uBB38\uC744 \uD655\uC778\uD458\uACE0 \uBE60\uB978 \uC2DC\uC77C \uB0B4\uC5D0 \uC5F0\uB77D\uB4DC\uB9BD\uB2C8\uB2E4.'}<br />
            {'\uBB34\uB8CC\uBC30\uC1A1 \uC0C1\uD488\uC758 \uACBD\uC6B0 \uCD94\uAC00 \uBC30\uC1A1\uBE44\uAC00 \uC5C6\uC73C\uBA70,'}<br />
            {'\uC720\uB8CC\uBC30\uC1A1 \uC0C1\uD488\uC758 \uACBD\uC6B0 \uC2E4\uC81C \uBC30\uC1A1\uBE44\uAC00 \uBC1C\uC0DD\uD558\uBA74 \uBCC4\uB3C4\uB85C \uC548\uB0B4\uB4DC\uB9BD\uB2C8\uB2E4.'}
          </p>
          <button style={s.btn} onClick={() => router.push('/')}>{'\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30'}</button>

          {!user && (
            <div style={{ marginTop: 40, padding: '24px', border: '1px solid #eee', textAlign: 'left', background: '#fafaf8' }}>
              <p style={{ fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 1.8 }}>
                {'\uD68C\uC6D0\uAC00\uC785\uD458\uC2DC\uBA74 \uB2E4\uC74C \uC8FC\uBB38 \uC2DC \uAE30\uBCF8 \uC815\uBCF4\uB97C \uC790\uB3D9 \uC785\uB825\uD558\uACE0 \uC8FC\uBB38 \uB0B4\uC5ED\uC744 \uC870\uD68C\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.'}
              </p>
              <button onClick={() => router.push('/signup')}
                style={{ fontSize: 12, letterSpacing: '0.1em', color: '#fff', cursor: 'pointer', background: '#1a1a1a', border: 'none', padding: '12px 24px', fontFamily: '"Noto Sans KR", sans-serif', marginRight: 8 }}>
                {'\uD68C\uC6D0\uAC00\uC785'}
              </button>
              <button onClick={() => router.push('/login')}
                style={{ fontSize: 12, letterSpacing: '0.1em', color: '#1a1a1a', cursor: 'pointer', background: 'none', border: '1px solid #ddd', padding: '12px 24px', fontFamily: '"Noto Sans KR", sans-serif' }}>
                {'\uB85C\uADF8\uC778'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
