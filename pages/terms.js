import Head from 'next/head';
import { useRouter } from 'next/router';

const sections = [
  {
    title: '서비스 이용',
    content: `Maum은 해외 거주 고객이 쿠팡 상품을 한국 수령인에게 전달할 수 있도록 쿠팡 상품 대리 구매 및 배송을 대행하는 콘시어지 서비스입니다. 본 서비스는 18세 이상이며, 한국 수령이 가능한 주소를 보유한 분만 이용할 수 있습니다.`,
  },
  {
    title: '주문 및 결제',
    content: `• 고객은 쿠팡 상품 링크와 한국 수령인 정보를 제공하며 주문을 요청합니다.\n• 주문 확정 전 가격은 쿠팡 실시간 가격 + Maum 서비스 수수료의 합산으로 표시됩니다.\n• 결제는 신용카드 등 해외 결제 수단으로 진행되며, 쿠팡 상품 실제 주문 전에 고객의 주문 수락 확인을 요청합니다.\n• 쿠팡 실시간 재고 상황에 따라 주문 당시 가격과 차이가 발생할 수 있습니다. 이 경우 고객에게 사전 안내 후 진행 여부를 결정합니다.`,
  },
  {
    title: '취소 정책',
    content: `• 쿠팡 주문 완료 전: 고객 요청 시 주문을 취소하고 전액 환불하여 드립니다.\n• 쿠팡 주문 완료 후~한국 배송 시작 전: 주문 승인 후에는 쿠팡 내부 정책에 따라 취소가 제한될 수 있습니다. 취소 가능 여부를 확인 후 안내드립니다.\n• 한국 배송 시작 후: 한국 내 배송이 시작된 이후에는 주문 취소가 불가능합니다. 수령인이 배송을 받지 못한 경우 수령 거부 후 반송 절차를 통해 처리합니다.`,
  },
  {
    title: '상품 문제 및 반품/교환',
    content: `쿠팡에서 배송된 상품에 문제가 생긴 경우, 쿠팡의 일반 반품/교환 정책에 준하여 다음과 같이 처리됩니다.\n\n■ 반품/교환이 가능한 경우\n• 상품 배송일로부터 30일 이내, 상품이 미개제일 경우\n• 상품이 주문 내용과 다를 경우 (오발송)\n• 상품 본신 또는 구성 품목이 파손되거나 결함이 있는 경우\n\n■ 반품/교환 방법\n1. maumsupport@gmail.com 또는 문의하기 페이지를 통해 문제 상품 사진과 주문 번호를 쳊부하여 연락냈니다.\n2. 저희가 쿠팡 판매자와 반품/교환 절차를 진행합니다.\n3. 환불은 쿠팡 처리 완료 후 영업일 3-5일 이내 진행됩니다.\n\n■ 반품/교환이 불가한 경우\n• 배송 완료 후 30일 경과\n• 고객이 상품을 사용하거나 태그, 포장 제거 등 상품 설치 후인 경우\n• 의류류의 경우 다층 포장 제거가 시작된 경우`,
  },
  {
    title: '보증 및 앉이 불가',
    content: `• Maum은 쿠팡에서 제공하는 상품 정보를 기반으로 서비스를 제공하며, 쿠팡의 시스템 이슈 또는 재고 부족 등으로 발생하는 상풉뛌 실패에 대한 책임을 지지 않습니다.\n• 수령인의 주소 오기입력, 수령 거부 등 고객의 귀소사유로 인한 배송 실패에 대해서는 환불이 제한될 수 있습니다.\n• 쿠팡 내부 문제로 인한 주문 지연, 취소 상황 발생 시 고객에게 즉시 안내드립니다.`,
  },
  {
    title: '서비스 변경 및 종료',
    content: `Maum은 서비스 내용을 사전 통보 없이 변경하거나 종료할 수 있습니다. 중요 변경 사항은 가능한 한 웹사이트를 통해 공지합니다.`,
  },
  {
    title: '준거법',
    content: `본 이용약관은 대한민국 법률을 준거로 해석됩니다. 서비스 이용과 관련하여 분쟁이 발생할 경우 콘시어지 협의를 우선으로 합니다.`,
  },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>이용약관 — Maum</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300;400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: '"Noto Sans KR", sans-serif', color: '#1a1a1a' }}>
        <header style={{ padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => router.push('/')} style={{ fontSize: '13px', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a' }}>Maum</button>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="/privacy" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>개인정보</a>
            <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', textDecoration: 'none' }}>문의하기</a>
          </nav>
        </header>

        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Terms of Service</p>
            <h1 style={{ fontFamily: '"Noto Serif KR", serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 200, lineHeight: 1.5, margin: '0 0 16px' }}>
              이용약관
            </h1>
            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>시행일: 2026년 3월 14일</p>
          </div>

          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.9, fontWeight: 300, marginBottom: '56px' }}>
            본 약관은 Maum(이하 '회사') 서비스를 이용하시는 조건과 절차를 규정합니다. 서비스를 이용하시면 본 약관에 동의하신 것으로 간주합니다.
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

          <div style={{ background: '#f5f5f3', padding: '24px', borderRadius: '2px', marginTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.8, margin: 0 }}>
              이용약관에 대한 문의사항은{' '}
              <a href="mailto:maumsupport@gmail.com" style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>maumsupport@gmail.com</a>
              {' '}또는{' '}
              <a href="/contact" style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>문의하기</a>
              {' '}페이지를 이용해 주세요.
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
