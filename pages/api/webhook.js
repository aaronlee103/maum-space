import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: disable body parser so Stripe can verify the raw body
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error('No order_id in Stripe metadata');
      return res.json({ received: true });
    }

    // Update order status in Supabase
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (dbError) {
      console.error('DB update error:', dbError);
      return res.status(500).json({ error: dbError.message });
    }

    const itemsHtml = (order.items || []).map(item =>
      `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;color:#333;font-size:14px">${item.productName || '상품'} × ${item.quantity || 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;color:#555;font-size:14px">$${(item.total || 0).toFixed(2)}</td>
      </tr>`
    ).join('');

    // Customer confirmation email
    try {
      await resend.emails.send({
        from: 'Maum <onboarding@resend.dev>',
        to: [order.sender_email],
        subject: '주문이 완료되었습니다 — Maum',
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
            <h1 style="font-size:20px;font-weight:300;letter-spacing:.25em;text-transform:uppercase;margin-bottom:6px">MAUM</h1>
            <p style="color:#aaa;font-size:11px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:48px">한국으로 마음을 전합니다</p>

            <p style="font-size:15px;color:#333;line-height:1.8;margin-bottom:8px">안녕하세요 <strong>${order.sender_name}</strong>님,</p>
            <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:32px">주문이 성공적으로 접수되었습니다. 영업일 기준 1–3일 내에 쿠팡에서 상품을 구매하여 배송해 드립니다.</p>

            <h2 style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#999;margin-bottom:12px">주문 상품</h2>
            <table style="width:100%;border-collapse:collapse">
              ${itemsHtml}
              <tr>
                <td style="padding:14px 8px 0;font-size:13px;font-weight:500">총 결제금액</td>
                <td style="padding:14px 8px 0;text-align:right;font-size:18px;font-weight:400">$${(order.total_usd || 0).toFixed(2)} USD</td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #eee;margin:32px 0">

            <h2 style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#999;margin-bottom:12px">배송 정보</h2>
            <p style="font-size:14px;color:#555;line-height:1.9">
              <strong>받는 분:</strong> ${order.recipient_name}<br>
              <strong>연락처:</strong> ${order.recipient_phone}<br>
              <strong>주소:</strong> [${order.recipient_postcode}] ${order.recipient_address} ${order.recipient_address_detail || ''}<br>
              ${order.message ? `<strong>메시지:</strong> ${order.message}` : ''}
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:32px 0">

            <p style="font-size:12px;color:#aaa;line-height:1.8">
              배송 진행 상황은 이메일로 별도 안내 드립니다.<br>
              문의사항: <a href="mailto:hello@maum.space" style="color:#555;text-decoration:none">hello@maum.space</a>
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Customer email error:', emailErr);
    }

    // Admin notification email
    try {
      const itemsText = (order.items || []).map(item =>
        `• ${item.productName} × ${item.quantity} — $${(item.total || 0).toFixed(2)}`
      ).join('<br>');

      await resend.emails.send({
        from: 'Maum Orders <onboarding@resend.dev>',
        to: ['aaronlee103@gmail.com'],
        subject: `[새 주문 🛍️] ${order.sender_name} — $${(order.total_usd || 0).toFixed(2)}`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
            <h1 style="font-size:16px;font-weight:500;margin-bottom:4px">새 주문이 들어왔습니다 🛍️</h1>
            <p style="color:#aaa;font-size:12px;margin-bottom:32px">Order ID: <code>${order.id}</code></p>

            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
              <tr style="background:#f9f9f9">
                <td style="padding:10px 12px;color:#999;width:120px">주문자</td>
                <td style="padding:10px 12px">${order.sender_name} (${order.sender_email})</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;color:#999">총 금액</td>
                <td style="padding:10px 12px;font-size:16px;font-weight:500">$${(order.total_usd || 0).toFixed(2)} USD</td>
              </tr>
              <tr style="background:#f9f9f9">
                <td style="padding:10px 12px;color:#999">받는 분</td>
                <td style="padding:10px 12px">${order.recipient_name} / ${order.recipient_phone}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;color:#999">배송지</td>
                <td style="padding:10px 12px">[${order.recipient_postcode}] ${order.recipient_address} ${order.recipient_address_detail || ''}</td>
              </tr>
              ${order.message ? `<tr style="background:#f9f9f9"><td style="padding:10px 12px;color:#999">메시지</td><td style="padding:10px 12px">${order.message}</td></tr>` : ''}
            </table>

            <h2 style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:12px">주문 상품</h2>
            <p style="font-size:14px;line-height:2">${itemsText}</p>

            <div style="margin-top:32px">
              <a href="https://maum.space/admin" style="display:inline-block;padding:12px 28px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:12px;letter-spacing:.1em">어드민에서 확인 →</a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Admin email error:', emailErr);
    }
  }

  res.json({ received: true });
}
