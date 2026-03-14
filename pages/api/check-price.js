export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const SCRAPINGBEE_KEY = '8ME8HXUHINKJG08JIUJTBP7ACDQFKTGLXRQ4P0U9UWAS5H3HJ3LYA283OR71XIKE6QSABMQX3RIBSYA8';

  try {
    const sbUrl = 'https://app.scrapingbee.com/api/v1?api_key=' + SCRAPINGBEE_KEY
      + '&url=' + encodeURIComponent(url)
      + '&render_js=true&wait=4000'
      + '&stealth_proxy=true'
      + '&country_code=kr';

    const response = await fetch(sbUrl);
    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'scraping_failed', detail: errText.substring(0, 300) });
    }

    const html = await response.text();

    // Strategy 1: Find finalPrice in JSON (most reliable for Coupang)
    let priceKrw = null;

    const finalPriceMatch = html.match(/"finalPrice"\s*:\s*([0-9]+)/);
    if (finalPriceMatch) {
      priceKrw = parseInt(finalPriceMatch[1], 10);
      console.log('Found finalPrice:', priceKrw);
    }

    // Strategy 2: salePrice in JSON
    if (!priceKrw) {
      const salePriceMatch = html.match(/"salePrice"\s*:\s*([0-9]+)/);
      if (salePriceMatch) {
        priceKrw = parseInt(salePriceMatch[1], 10);
        console.log('Found salePrice:', priceKrw);
      }
    }

    // Strategy 3: discountedPrice in JSON
    if (!priceKrw) {
      const discMatch = html.match(/"discountedPrice"\s*:\s*([0-9]+)/);
      if (discMatch) {
        priceKrw = parseInt(discMatch[1], 10);
        console.log('Found discountedPrice:', priceKrw);
      }
    }

    // Strategy 4: priceView patterns like 33,160 near price keywords in HTML
    if (!priceKrw) {
      // Look for price near "판매가" or "할인가" text
      const priceNearLabel = html.match(/(?:finalPrice|salePrice|discountPrice|productPrice)[^0-9]{0,20}([0-9]{4,7})/);
      if (priceNearLabel) {
        priceKrw = parseInt(priceNearLabel[1], 10);
        console.log('Found price near label:', priceKrw);
      }
    }

    // Strategy 5: vendorItemId-based search
    if (!priceKrw) {
      try {
        const urlObj = new URL(url);
        const vendorItemId = urlObj.searchParams.get('vendorItemId');
        if (vendorItemId) {
          const vendorRegex = new RegExp(vendorItemId + '[^}]{0,200}"price"\\s*:\\s*([0-9]+)');
          const vMatch = html.match(vendorRegex);
          if (vMatch) {
            priceKrw = parseInt(vMatch[1], 10);
            console.log('Found vendorItemId price:', priceKrw);
          }
        }
      } catch(e) {}
    }

    // Log all found prices for debugging
    const allPrices = [];
    const priceRegex = /"(?:finalPrice|salePrice|discountedPrice|price)"\s*:\s*([0-9]{4,7})/g;
    let m;
    while ((m = priceRegex.exec(html)) !== null) {
      allPrices.push({ key: m[0].split(':')[0].replace(/"/g,'').trim(), val: parseInt(m[1], 10) });
    }
    console.log('All JSON prices found:', JSON.stringify(allPrices.slice(0, 20)));

    if (!priceKrw || priceKrw < 1000) {
      return res.status(200).json({ error: 'price_not_found', allPrices: allPrices.slice(0, 20) });
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
      if (rateData.rates && rateData.rates.USD) exchangeRate = 1 / rateData.rates.USD;
    } catch (e) {}

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
