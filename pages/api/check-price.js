export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const SCRAPINGBEE_KEY = '8ME8HXUHINKJG08JIUJTBP7ACDQFKTGLXRQ4P0U9UWAS5H3HJ3LYA283OR71XIKE6QSABMQX3RIBSYA8';

  // CSS selector extraction rules - type must be 'item' or 'list'
  const extractRules = JSON.stringify({
    price1: { selector: '.total-price strong', type: 'item' },
    price2: { selector: '.prod-coupon-price-value', type: 'item' },
    price3: { selector: '#productPrice', type: 'item' },
    price4: { selector: '.prod-price .price', type: 'item' },
    price5: { selector: '[class*="discount-price"]', type: 'item' },
    price6: { selector: '[class*="sale-price"]', type: 'item' },
    name1: { selector: 'h1.prod-title', type: 'item' },
    name2: { selector: '.prod-title', type: 'item' },
    name3: { selector: 'h1', type: 'item' },
    image1: { selector: '#mainImage', type: 'item', attribute: 'src' },
    image2: { selector: '.prod-atf-main-img-area img', type: 'item', attribute: 'src' },
  });

  try {
    const sbUrl = 'https://app.scrapingbee.com/api/v1?api_key=' + SCRAPINGBEE_KEY
      + '&url=' + encodeURIComponent(url)
      + '&render_js=true&wait=3000'
      + '&extract_rules=' + encodeURIComponent(extractRules);

    const response = await fetch(sbUrl);

    if (!response.ok) {
      const errText = await response.text();
      console.error('ScrapingBee error:', response.status, errText.substring(0, 300));
      return res.status(500).json({ error: 'scraping_failed', detail: errText.substring(0, 300) });
    }

    const data = await response.json();
    console.log('ScrapingBee extracted:', JSON.stringify(data));

    // Find the first non-null/non-empty price
    let rawPrice = data.price1 || data.price2 || data.price3 || data.price4 || data.price5 || data.price6;

    if (!rawPrice) {
      return res.status(200).json({ error: 'price_not_found', debug: JSON.stringify(data).substring(0, 500) });
    }

    // Parse price - strip everything except digits
    const priceKrw = parseInt(String(rawPrice).replace(/[^0-9]/g, ''), 10);
    if (!priceKrw || priceKrw <= 0) {
      return res.status(200).json({ error: 'price_not_found' });
    }

    // Product name
    let productName = data.name1 || data.name2 || data.name3 || 'Coupang Product';
    productName = String(productName).trim().substring(0, 100);

    // Product image
    const imageUrl = data.image1 || data.image2 || null;

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
