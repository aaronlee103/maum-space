export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const SCRAPINGBEE_KEY = '8ME8HXUHINKJG08JIUJTBP7ACDQFKTGLXRQ4P0U9UWAS5H3HJ3LYA283OR71XIKE6QSABMQX3RIBSYA8';

  try {
    // Use stealth proxy + render_js to bypass Coupang bot detection
    // Return raw HTML so we can inspect the structure
    const sbUrl = 'https://app.scrapingbee.com/api/v1?api_key=' + SCRAPINGBEE_KEY
      + '&url=' + encodeURIComponent(url)
      + '&render_js=true&wait=4000'
      + '&stealth_proxy=true'
      + '&country_code=kr';

    const response = await fetch(sbUrl);

    if (!response.ok) {
      const errText = await response.text();
      console.error('ScrapingBee error:', response.status, errText.substring(0, 300));
      return res.status(500).json({ error: 'scraping_failed', detail: errText.substring(0, 300) });
    }

    const html = await response.text();
    console.log('HTML length:', html.length);
    console.log('HTML snippet:', html.substring(0, 500));

    // Try to find price in HTML using multiple patterns
    let priceKrw = null;

    // Look for price in script tags (JSON data)
    const scriptPriceMatch = html.match(/"finalPrice"\s*:\s*([0-9]+)/)
      || html.match(/"price"\s*:\s*([0-9]+)/)
      || html.match(/"salePrice"\s*:\s*([0-9]+)/)
      || html.match(/"totalPrice"\s*:\s*([0-9]+)/);
    if (scriptPriceMatch) {
      priceKrw = parseInt(scriptPriceMatch[1], 10);
      console.log('Found price via JSON:', priceKrw);
    }

    // Korean won pattern in HTML
    if (!priceKrw) {
      const wonMatches = html.match(/([0-9]{1,3}(?:,[0-9]{3})+)(?:<\/span>|<\/strong>|<\/em>|\s*<)/g);
      if (wonMatches && wonMatches.length > 0) {
        const prices = wonMatches.map(m => parseInt(m.replace(/[^0-9]/g, ''), 10)).filter(p => p > 1000 && p < 10000000);
        if (prices.length > 0) {
          priceKrw = Math.min(...prices);
          console.log('Found price via pattern:', priceKrw, 'from', prices);
        }
      }
    }

    if (!priceKrw || priceKrw <= 0) {
      // Return debug info
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const bodySnippet = html.substring(0, 1000);
      console.log('Title:', titleMatch ? titleMatch[1] : 'not found');
      return res.status(200).json({
        error: 'price_not_found',
        htmlLength: html.length,
        title: titleMatch ? titleMatch[1] : '',
        snippet: bodySnippet.substring(0, 300)
      });
    }

    // Product name from title
    let productName = 'Coupang Product';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      let t = titleMatch[1].trim();
      const pipeIdx = t.lastIndexOf(' | ');
      if (pipeIdx > 0) t = t.substring(0, pipeIdx).trim();
      if (t.length > 1) productName = t;
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
      imageUrl: null,
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
