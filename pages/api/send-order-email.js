import { Resend } from 'resend';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { orderData, cart } = req.body;
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'Resend not configured' });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const total = cart.reduce((s, i) => s + (i.total || 0), 0).toFixed(2);
  const rows = cart.map(item => '<tr style="border-bottom:1px solid #f5f5f5"><td style="padding:12px 0;color:#333">' + item.productName + '</td><td style="padding:12px 0;text-align:right">$' + (item.total||0).toFixed(2) + '</td></tr>').join('');
  const html = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1a1a1a">'
    + '<h1 style="font-size:20px;font-weight:300;letter-spacing:.1em;margin-bottom:8px">Maum</h1>'
    + '<p style="color:#999;font-size:13px;margin-bottom:40px">\uC8FC\uBB38 \uD655\uC778</p>'
    + '<p style="font-size:14px">\uC548\uB155\uD558\uC138\uC694, ' + orderData.senderName + '\uB2D8.</p>'
    + '<p style="font-size:14px;color:#555;line-height:1.8">\uC8FC\uBB38\uC774 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2F4\uB2F9\uC790\uAC00 \uD655\uC778 \uD6C4 \uBE60\uB978 \uC2DC\uC77C \uB0B4\uC5D0 \uC5F0\uB77D\uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4.</p>'
    + '<hr style="border:none;border-top:1px solid #eee;margin:32px 0">'
    + '<h2 style="font-size:13px;letter-spacing:.15em;color:#999;text-transform:uppercase;margin-bottom:16px">\uC8FC\uBB38 \uB0B4\uC5ED</h2>'
    + '<table style="width:100%;border-collapse:collapse;font-size:14px">' + rows + '</table>'
    + '<div style="border-top:2px solid #1a1a1a;margin-top:8px;padding-top:12px;display:flex;justify-content:space-between">'
    + '<span style="font-size:14px">\uC900\uACC4</span>'
    + '<span style="font-size:14px">$' + total + '</span>'
    + '</div>'
    + '<hr style="border:none;border-top:1px solid #eee;margin:32px 0">'
    + '<h2 style="font-size:13px;letter-spacing:.15em;color:#999;text-transform:uppercase;margin-bottom:16px">\uBC30\uC1A1 \uC815\uBCF4</h2>'
    + '<p style="font-size:14px;color:#555;line-height:1.8">'
    + '<strong>\uBC1B\uB294 \uBD84</strong>: ' + orderData.recipientName + '<br>'
    + '<strong>\uC8FC\uC18C</strong>: ' + orderData.recipientAddress + ' ' + (orderData.recipientAddressDetail || '') + '<br>'
    + '<strong>\uC5F0\uB77D\uCC98</strong>: ' + orderData.recipientPhone + '</p>'
    + '<hr style="border:none;border-top:1px solid #eee;margin:32px 0">'
    + '<p style="font-size:12px;color:#aaa;line-height:1.8">'
    + '\uBB34\uB8CC\uBC30\uC1A1 \uC0C1\uD488\uC758 \uACBD\uC6B0 \uCD94\uAC00 \uBC30\uC1A1\uBE44\uAC00 \uC5C6\uC73C\uBA70,<br>'
    + '\uC720\uB8CC\uBC30\uC1A1 \uC0C1\uD488\uC758 \uACBD\uC6B0 \uC2E4\uC81C \uBC30\uC1A1\uBE44\uAC00 \uBC1C\uC0DD\uD558\uBA74 \uBCC4\uB3C4\uB85C \uC548\uB0B4\uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4.</p>'
    + '<p style="font-size:12px;color:#aaa">\uBB38\uC758: <a href="mailto:hello@maum.space" style="color:#555">hello@maum.space</a></p>'
    + '</div>';
  try {
    await resend.emails.send({
      from: 'Maum <onboarding@resend.dev>',
      to: [orderData.senderEmail],
      subject: '\uC8FC\uBB38 \uD655\uC778 \u2014 Maum',
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
