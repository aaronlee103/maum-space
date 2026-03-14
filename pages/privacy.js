import Head from 'next/head';
import { useRouter } from 'next/router';

const sections = [
  {
    title: '수집하는 개인정보',
    content: `Maum은 서비스 제공을 위해 다음 개인정보를 수집합니다.\n\n• 이름, 이메일 주소 (회원 가입 시)\n• 한국 수령인의 이름, 연락처, 배송 주소\n• 결제 정보 (카드사 위탁 처리, Maum은 카드정보를 직접 저장하지 않습니다)\n• 주문 이력 및 쿠팡 상품 링크\n• 서비스 이용 기록 (접속 시간, IP 주소 등)`,
  },
  {
    title: '개인정보의 이용 목적',
    content: `수집된 개인정보는 다음 목적으로만 사용됩니다.\n\n• 쿠팡 주문 대행 및 한국 배송 진행\n• 주문 확인 및 고객 서비스 제공\n• 서비스 이용 관련 안내 발송\n• 부정 행위 및 불법 이용 방지`,
  },
  {
    title: '제3자 공유',
    content: `Maum은 수령인의 주소 정보를 쿠팡 배송을 위해 쿠팡에 제공합니다. 이를 제외하고 고객의 사전 동의 없이 다음 경우를 제외하고 제3자에게 정보를 제공하지 않습니다.\n\n• 법령에 의한 공개가 요청되는 경우\n• 챔임 분석 등 법적 절차를 위해 필요한 경우`,
  },
  {
    title: '쿠키 및 추적 기술',
    content: `Maum 웹사이트는 서비스 품질 향상을 위해 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.`,
  },
  {
    title: '개인정보 보유 기간',
    content: `회원 탈퇴 시 또는 주문 완료 후 3년 이내 수집된 개인정보를 시스템에서 삭제합니다. 다만, 관련 법령에 따라 일정 기간 보관이 필요한 거래 정보는 해당 기간 동안 보관됩니다.`,
  },
  {
    title: '이용자의 권리',
    content: `고객은 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제를 요청할 수 있습니다. 요청사항은 maumsupport@gmail.com으로 문의해 주세요.`,
  },
  {
    title: '문의',
    content: `개인정보 처리에 관한 문의사항이 있으시면 maumsupport@gmail.com으로 연락해 주세요.`,
  },
];

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>개인정보처리방침 — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: '"Noto Sans KR", sans-serif', color: '#1a1a1a' }}>
        <header style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>Maum</button>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="/terms" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>이용약관</a>
            <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>문의하기</a>
          </nav>
        </header>

        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Privacy Policy</p>
            <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 200, lineHeight: 1.5, margin: '0 0 16px' }}>
              개인정보처리방침
            </h1>
            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>시행일: 2026년 3월 14일</p>
          </div>

          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.9, fontWeight: 300, marginBottom: '56px' }}>
            Maum(이하 '회사')'은 고객의 개인정보를 중요하게 생각하며, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」(정보통신망법)에 따라 개인정보를 보호합니다.
          </p>

          {sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: i < sections.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '16px', fontWeight: 400 }}>
                {String(i + 1).padStart(2, '0')}. {sec.title}
              </h2>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.9, fontWeight: 300, margin: 0, whiteSpace: 'pre-line' }}>
                {sec.content}
              </p>
            </div>
          ))}
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
