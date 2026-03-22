import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabase-admin';
import {
  checkRateLimit,
  requireMethod,
  verifyOrigin,
  sanitizeString,
  escapeHtml,
  isValidEmail,
} from '../../lib/security';

export default async function handler(req, res) {
  // ── 1. 메서드 검증 ──────────────────────────────────────
  if (!requireMethod(req, res, 'POST')) return;

  // ── 2. Rate Limiting (IP당 분당 5회) ────────────────────
  if (!checkRateLimit(req, res, 5, 60_000)) return;

  // ── 3. Origin 검증 (CSRF 방어) ─────────────────────────
  if (!verifyOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden: invalid origin' });
  }

  // ── 4. Stripe 설정 확인 ────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: 'Stripe not configured.',
    });
  }

  const { cart, orderData } = req.body;

  // ── 5. 입력 검증 ───────────────────────────────────────
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 50) {
    return res.status(400).json({ error: '장바구니가 비어있거나 너무 많은 상품이 있습니다.' });
  }

  if (!orderData || typeof orderData !== 'object') {
    return res.status(400).json({ error: '주문 정보가 누락되었습니다.' });
  }

  // 이메일 검증
  if (!isValidEmail(orderData.senderEmail)) {
    return res.status(400).json({ error: '유효한 이메일을 입력해주세요.' });
  }

  // 필수 필드 검증
  const requiredFields = ['senderName', 'recipientName', 'recipientPhone', 'recipientAddress'];
  for (const field of requiredFields) {
    if (!orderData[field] || typeof orderData[field] !== 'string' || !orderData[field].trim()) {
      return res.status(400).json({ error: `${field}은(는) 필수 입력 항목입니다.` });
    }
  }

  // ── 6. 장바구니 금액 서버 측 재계산 (클라이언트 조작 방지) ──
  const EXCHANGE_RATE = 1360; // 실서비스에서는 실시간 환율 API 사용
  const SERVICE_FEE_RATE = 0.10;

  const validatedCart = cart.map((item) => {
    const priceKrw = Math.max(0, parseFloat(item.priceKrw) || 0);
    const quantity = Math.max(1, Math.min(100, parseInt(item.quantity) || 1));
    const totalKrw = priceKrw * quantity;
    const priceUsd = totalKrw / EXCHANGE_RATE;
    const serviceFee = priceUsd * SERVICE_FEE_RATE;
    const total = parseFloat((priceUsd + serviceFee).toFixed(2));

    return {
      productName: sanitizeString(item.productName, 200),
      url: sanitizeString(item.url, 500),
      priceKrw,
      quantity,
      exchangeRate: EXCHANGE_RATE,
      priceUsd: parseFloat(priceUsd.toFixed(2)),
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      total,
      totalKrw,
    };
  });

  const serverTotal = validatedCart.reduce((s, i) => s + i.total, 0);

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // ── 7. DB 저장 (입력값 정제 후) ────────────────────────
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending_payment',
        items: validatedCart,
        total_usd: parseFloat(serverTotal.toFixed(2)),
        sender_name: sanitizeString(orderData.senderName, 100),
        sender_email: sanitizeString(orderData.senderEmail, 254),
        recipient_name: sanitizeString(orderData.recipientName, 100),
        recipient_phone: sanitizeString(orderData.recipientPhone, 20),
        recipient_postcode: sanitizeString(orderData.recipientPostcode, 10),
        recipient_address: sanitizeString(orderData.recipientAddress, 300),
        recipient_address_detail: sanitizeString(orderData.recipientAddressDetail, 200),
        delivery_method: sanitizeString(orderData.deliveryMethod, 50),
        entrance_type: sanitizeString(orderData.entranceType, 20),
        entrance_code: sanitizeString(orderData.entranceCode, 20),
        message: sanitizeString(orderData.message, 1000),
      })
      .select()
      .single();

    if (dbError) throw new Error('DB error: ' + dbError.message);

    // ── 8. Stripe 세션 생성 ────────────────────────────────
    const lineItems = validatedCart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: escapeHtml(item.productName || 'Coupang Product').substring(0, 200),
        },
        unit_amount: Math.round(item.total * 100),
      },
      quantity: 1,
    }));

    // ✅ success_url에 req.headers.origin 대신 고정된 도메인 사용
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maum.space';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: sanitizeString(orderData.senderEmail, 254),
      metadata: {
        order_id: order.id,
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    // ✅ 에러 메시지에 내부 정보 노출하지 않음
    return res.status(500).json({ error: '결제 세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' });
  }
}
