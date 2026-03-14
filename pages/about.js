import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AboutPage() {
  const router = useRouter();

  const sectionStyle = { marginBottom: '48px' };
  const h2Style = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '16px', fontWeight: 400 };
  const pStyle = { fontSize: '14px', color: '#444', lineHeight: 1.9, fontWeight: 300, margin: 0 };

  return (
    <>
      <Head>
        <title>About — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: '"Noto Sans KR", sans-serif', color: '#1a1a1a' }}>
        <header style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>Maum</button>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="/how-it-works" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>방법 안내</a>
            <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>문의하기</a>
          </nav>
        </header>

        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>About Us</p>
            <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 200, lineHeight: 1.5, margin: 0 }}>
              마음을 전하는 방법이<br />더 쉼워야 합니다.
            </h1>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>서비스 소개</h2>
            <p style={pStyle}>
              Maum은 해외에서 한국에 계신 가족, 친구, 소중한 분들께 쿠팡 상품을 대신 구매·배송해 드리는 콘시어지 서비스입니다.
              복잡한 해외 결제나 배송 문제 없이, 쿠팡 상품 링크 하나만으로 마음을 전할 수 있도록 돕습니다.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>우리의 미션</h2>
            <p style={pStyle}>
              해외에 거주하는 많은 분들이 한국의 가족에게 생일 선물을 보내거나, 생필품을 지원해 드리고 싶어도
              국제 배송의 복잡함과 높은 비용 때문에 포기하는 경우가 많습니다.
              Maum은 그 불편함을 해소하고, 쿠팡의 빠르고 합리적인 배송 인프라를 그대로 활용할 수 있게 합니다.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>운영 방식</h2>
            <p style={pStyle}>
              저희는 고객 대신 쿠팡에서 상품을 구매하고, 한국 수령인 주소로 직접 배송합니다.
              가격 확인부터 주문까지 모든 과정이 투명하게 진행되며, 고객이 직접 쿠팡을 이용하는 것과 동일한 조건으로 상품을 받을 수 있습니다.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>문의</h2>
            <p style={pStyle}>
              서비스에 대한 문의사항은 언제든지{' '}
              <a href="/contact" style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>문의하기</a>
              {' '}페이지 또는{' '}
              <a href="mailto:maumsupport@gmail.com" style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>maumsupport@gmail.com</a>
              으로 연락해 주세요.
            </p>
          </div>
        </main>

        <footer style={{ padding: '24px 48px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#999' }}>Maum.space</span>
          <span style={{ fontSize: '11px', color: '#999' }}>© 2026 Maum Concierge</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/terms" style={{ fontSize: '11px', color: '#999', textDecoration: 'none' }}>이용약관</a>
            <a href="/privacy" style={{ fontSize: '11px', color: '#999', textDecoration: 'none' }}>개인정보처리방침</a>
            <a href="/contact" style={{ fontSize: '11px', color: '#999', textDecoration: 'none' }}>문의하기</a>
          </div>
        </footer>
      </div>
    </>
  );
}
