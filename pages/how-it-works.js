import Head from 'next/head';
import { useRouter } from 'next/router';

const steps = [
  {
    number: '01',
    title: '쿠팡 링크 복사',
    desc: '쿠팡에서 원하는 상품 페이지를 열고 주소창에서 링크를 복사합니다. 해외에서도 쿠팡 사이트를 자유롭게 이용할 수 있습니다.',
  },
  {
    number: '02',
    title: '가격 확인',
    desc: 'Maum 메인 페이지에 링크를 붙여넣고 Check Price를 누르면 쿠팡 실시간 가격, 상품명, 이미지를 바로 확인할 수 있습니다.',
  },
  {
    number: '03',
    title: '수령인 정보 입력',
    desc: '한국 수령인의 이름, 전화번호, 주소를 입력합니다. 수령인이 직접 쿠팡에서 주문한 것과 동일한 방식으로 배송됩니다.',
  },
  {
    number: '04',
    title: '결제',
    desc: '해외 카드로 안전하게 결제합니다. Maum 서비스 수수료와 쿠팡 상품가가 합산되어 표시되며, 추가적인 쿠팡 멤버십 가입 없이 이용하실 수 있습니다.',
  },
  {
    number: '05',
    title: '한국 배송',
    desc: '저희가 쿠팡에 주문을 넣고, 쿠팡의 구매 확정 문자를 수령인에게 전달합니다. 이후 쿠팡의 일반 배송 일정대로 한국 수령인 주소로 직접 배송됩니다.',
  },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>How It Works — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: '"Noto Sans KR", sans-serif', color: '#1a1a1a' }}>
        <header style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>Maum</button>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="/about" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>About</a>
            <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>문의하기</a>
          </nav>
        </header>

        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ marginBottom: '72px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>How It Works</p>
            <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 200, lineHeight: 1.5, margin: 0 }}>
              5단계로 마음을<br />전하세요.
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '32px', paddingBottom: '48px', borderBottom: i < steps.length - 1 ? '1px solid #f0f0f0' : 'none', marginBottom: i < steps.length - 1 ? '48px' : '0' }}>
                <div style={{ flexShrink: 0, width: '32px' }}>
                  <span style={{ fontSize: '11px', color: '#ccc', letterSpacing: '0.1em', fontWeight: 300 }}>{step.number}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 400, marginBottom: '12px', letterSpacing: '0.05em' }}>{step.title}</h2>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '72px', background: '#f5f5f3', padding: '32px', borderRadius: '2px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>안내</p>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.9, fontWeight: 300, margin: '0 0 16px' }}>
              한국 배송이 시작된 이후에는 주문 취소가 불가능합니다. 쿠팡 보로 정도에 준하는 반품/교환 정책은 본 서비스에도 동일하게 적용됩니다.
            </p>
            <a href="/terms" style={{ fontSize: '12px', color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '0.05em' }}>이용약관 바로가기 →</a>
          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button onClick={() => router.push('/')} style={{ padding: '18px 48px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: '"Noto Sans KR", sans-serif' }}>
              시작하기
            </button>
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
