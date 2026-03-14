import Head from 'next/head';
import { useRouter } from 'next/router';
import useLanguage from '../lib/useLanguage';
import tr from '../lib/translations';

export default function HowItWorksPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = { ...tr.common[lang], ...tr.howItWorks[lang] };

  const LangToggle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1px', border: '1px solid #e8e8e8', borderRadius: '3px', overflow: 'hidden', marginLeft: '16px' }}>
      <button onClick={() => setLang('ko')} style={{ padding: '3px 8px', fontSize: '10px', letterSpacing: '0.08em', background: lang === 'ko' ? '#1a1a1a' : 'transparent', color: lang === 'ko' ? '#fff' : '#aaa', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>KO</button>
      <button onClick={() => setLang('en')} style={{ padding: '3px 8px', fontSize: '10px', letterSpacing: '0.08em', background: lang === 'en' ? '#1a1a1a' : 'transparent', color: lang === 'en' ? '#fff' : '#aaa', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>EN</button>
    </div>
  );

  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: '"Noto Sans KR", sans-serif', color: '#1a1a1a' }}>
        <header style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>Maum</button>
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="/about" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>{t.about}</a>
            <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>{t.contact}</a>
            {LangToggle}
          </nav>
        </header>

        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>{t.label}</p>
            <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 200, lineHeight: 1.5, margin: 0 }}>
              {t.heading.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h1>
          </div>

          {t.steps.map((step) => (
            <div key={step.number} style={{ display: 'flex', gap: '32px', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#ccc', fontWeight: 300, minWidth: '24px', paddingTop: '2px' }}>{step.number}</span>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 400, marginBottom: '10px', letterSpacing: '0.02em' }}>{step.title}</h2>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}

          <div style={{ background: '#f5f5f3', padding: '24px 28px', marginTop: '16px', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: '12px', fontWeight: 400 }}>{t.noticeTitle}</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8, fontWeight: 300, margin: 0, whiteSpace: 'pre-line' }}>{t.noticeBody}</p>
          </div>

          <button onClick={() => router.push('/')} style={{ width: '100%', padding: '18px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {t.cta}
          </button>
        </main>

        <footer style={{ padding: '32px 48px', borderTop: '1px solid #f0f0f0', background: '#fafaf8' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <a href="/about" style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#999', textDecoration: 'none' }}>{t.about}</a>
              <a href="/how-it-works" style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#999', textDecoration: 'none' }}>{t.howItWorks}</a>
              <a href="/terms" style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#999', textDecoration: 'none' }}>{t.terms}</a>
              <a href="/privacy" style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#999', textDecoration: 'none' }}>{t.privacy}</a>
              <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#999', textDecoration: 'none' }}>{t.contact}</a>
            </div>
            <span style={{ fontSize: '11px', color: '#bbb' }}>{t.copyright}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
