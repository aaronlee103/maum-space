import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OrderComplete() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('maum_cart');
    sessionStorage.removeItem('maum_order');
  }, []);

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
            {'\uB2F4\uB2F9\uC790\uAC00 \uC8FC\uBB38\uC744 \uD655\uC778\uD558\uACE0 \uBE60\uB978 \uC2DC\uC77C \uB0B4\uC5D0 \uC5F0\uB77D\uB4DC\uB9BD\uB2C8\uB2E4.'}<br />
            {'\uBC30\uC1A1\uBE44\uB294 \uBCC4\uB3C4\uB85C \uC548\uB0B4\uB4DC\uB9BD\uB2C8\uB2E4.'}
          </p>
          <button style={s.btn} onClick={() => router.push('/')}>{'\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30'}</button>
        </div>
      </div>
    </>
  );
}
