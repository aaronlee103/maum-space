import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured. Add STRIPE_SECRET_KEY to Vercel environment variables.' });
  }
  const { cart, orderData } = req.body;
  if (!cart || cart.length === 0) return res.status(400).json({ error: 'Empty cart' });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
      metadata: {
        orderInfo: JSON.stringify(orderData).substring(0, 500),
      },
    });
    return res.json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
                    }
