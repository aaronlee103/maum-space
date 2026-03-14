export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const SCRAPINGBEE_KEY = '8ME8HXUHINKJG08JIUJTBP7ACDQFKTGLXRQ4P0U9UWAS5H3HJ3LYA283OR71XIKE6QSABMQX3RIBSYA8';

  try {
    const sbUrl = 'https://app.scrapingbee.com/api/v1?api_key=' + SCRAPINGBEE_KEY + '&url=' + encodeURIComponent(url) + '&render_js=true&wait=3000&block_resources=false';
    const response = await fetch(sbUrl, { headers: { 'Accept': 'text/html' } });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ScrapingBee error:', response.status, errText);
      return res.status(500).json({ error: 'scraping_failed', detail: errText });
    }

    const html = await response.text();

    // Extract price - try multiple patterns
    let priceKrw = null;

    // Pattern 1: discount-price class
    const discountMatch = html.match(/class="[^"]*discount-price[^"]*"[^>]*>[sS]*?([0-9,]+)s*원/);
    if (discountMatch) priceKrw = parseInt(discountMatch[1].replace(/,/g, ''), 10);

    // Pattern 2: sale-price
    if (!priceKrw) {
      const saleMatch = html.match(/sale-price[^>]*>[sS]{0,100}?([0-9,]{3,})s*원/);
      if (saleMatch) priceKrw = parseInt(saleMatch[1].replace(/,/g, ''), 10);
    }

    // Pattern 3: totalPrice in JSON
    if (!priceKrw) {
      const totalMatch = html.match(/totalPrice["':\s]+([0-9,]+)/);
      if (totalMatch) priceKrw = parseInt(totalMatch[1].replace(/,/g, ''), 10);
    }

    // Pattern 4: "price" in JSON
    if (!priceKrw) {
      const jsonMatch = html.match(/"price"\s*:\s*([0-9]+)/);
      if (jsonMatch) priceKrw = parseInt(jsonMatch[1], 10);
    }

    // Pattern 5: number followed by Korean Won unicode
    if (!priceKrw) {
      const wonMatch = html.match(/([0-9]{1,3}(?:,[0-9]{3})+)s*원/);
      if (wonMatch) priceKrw = parseInt(wonMatch[1].replace(/,/g, ''), 10);
    }

    if (!priceKrw || priceKrw <= 0) {
      return res.status(200).json({ error: 'price_not_found' });
    }

    // Extract product name from title tag
    let productName = 'Coupang Product';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      let t = titleMatch[1].trim();
      // Remove site name suffix (split on | or -)
      const pipeIdx = t.lastIndexOf(' | ');
      if (pipeIdx > 0) t = t.substring(0, pipeIdx).trim();
      const dashIdx = t.lastIndexOf(' - ');
      if (dashIdx > 0) t = t.substring(0, dashIdx).trim();
      if (t.length > 1) productName = t;
    }

    // Extract product image
    let imageUrl = null;
    const imgPatterns = [
      /id="mainImage"[^>]*src="([^"]+)"/i,
      /productImageUrl["':\s]+"([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
      /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
    ];
    for (const pat of imgPatterns) {
      const m = html.match(pat);
      if (m) { imageUrl = m[1]; break; }
    }

    // Get live KRW to USD exchange rate
    let exchangeRate = 1350;
    try {
      const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/KRW');
      const rateData = await rateRes.json();
      if (rateData.rates && rateData.rates.USD) {
        exchangeRate = 1 / rateData.rates.USD;
      }
    } catch (e) {
      console.log('Exchange rate fallback used');
    }

    const priceUsd = priceKrw / exchangeRate;
    const serviceFee = priceUsd * 0.1;
    const total = priceUsd + serviceFee;

    return res.status(200).json({
      productName,
      imageUrl,
      priceKrw,
      priceUsd: parseFloat(priceUsd.toFixed(2)),
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      exchangeRate: parseFloat(exchangeRate.toFixed(2)),
    });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
