import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured. Add STRIPE_SECRET_KEY to Vercel environment variables.' });
  }

  const { cart, orderData } = req.body;
  if (!cart || cart.length === 0) return res.status(400).json({ error: 'Empty cart' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const total = cart.reduce((s, i) => s + (i.total || 0), 0);

    // 1. Save order to Supabase BEFORE Stripe (so we have an order_id)
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending_payment',
        items: cart,
        total_usd: parseFloat(total.toFixed(2)),
        sender_name: orderData.senderName || '',
        sender_email: orderData.senderEmail || '',
        recipient_name: orderData.recipientName || '',
        recipient_phone: orderData.recipientPhone || '',
        recipient_postcode: orderData.recipientPostcode || '',
        recipient_address: orderData.recipientAddress || '',
        recipient_address_detail: orderData.recipientAddressDetail || '',
        delivery_method: orderData.deliveryMethod || '',
        entrance_type: orderData.entranceType || '',
        entrance_code: orderData.entranceCode || '',
        message: orderData.message || '',
      })
      .select()
      .single();

    if (dbError) throw new Error('DB error: ' + dbError.message);

    // 2. Create Stripe session with order_id in metadata
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: (item.productName || 'Coupang Product').substring(0, 200),
        },
        unit_amount: Math.round((item.total || 0) * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: req.headers.origin + '/order-complete?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: req.headers.origin + '/checkout',
      customer_email: orderData.senderEmail,
      metadata: {
        order_id: order.id,
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    return res.status(500).json({ error: err.message });
  }
}
