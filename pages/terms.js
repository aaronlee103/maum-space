import Head from 'next/head';
import { useRouter } from 'next/router';
import useLanguage from '../lib/useLanguage';
import tr from '../lib/translations';

export default function TermsPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = { ...tr.common[lang], ...tr.terms[lang] };

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
            <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>{t.contact}</a>
            {LangToggle}
          </nav>
        </header>

        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>{t.label}</p>
            <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 200, lineHeight: 1.4, margin: '0 0 12px' }}>{t.heading}</h1>
            <p style={{ fontSize: '12px', color: '#bbb', margin: 0 }}>{t.effective}</p>
          </div>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.9, fontWeight: 300, marginBottom: '48px' }}>{t.intro}</p>

          {t.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: '14px', fontWeight: 400 }}>{sec.title}</h2>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.9, fontWeight: 300, margin: 0, whiteSpace: 'pre-line' }}>{sec.body}</p>
            </div>
          ))}
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
