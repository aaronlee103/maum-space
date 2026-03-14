export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const SCRAPINGBEE_KEY = '8ME8HXUHINKJG08JIUJTBP7ACDQFKTGLXRQ4P0U9UWAS5H3HJ3LYA283OR71XIKE6QSABMQX3RIBSYA8';

  // CSS selector extraction rules for Coupang
  const extractRules = JSON.stringify({
    price1: { selector: '.total-price strong', type: 'text' },
    price2: { selector: '.prod-coupon-price-value', type: 'text' },
    price3: { selector: '#productPrice', type: 'text' },
    price4: { selector: '.prod-price .price', type: 'text' },
    price5: { selector: '[class*="discount-price"]', type: 'text' },
    price6: { selector: '[class*="sale-price"]', type: 'text' },
    name1: { selector: 'h1.prod-title', type: 'text' },
    name2: { selector: '.prod-title', type: 'text' },
    name3: { selector: 'h1', type: 'text' },
    image1: { selector: '#mainImage', type: 'attribute', attribute: 'src' },
    image2: { selector: '.prod-atf-main-img-area img', type: 'attribute', attribute: 'src' },
    image3: { selector: '.prod-image img', type: 'attribute', attribute: 'src' },
  });

  try {
    const sbUrl = 'https://app.scrapingbee.com/api/v1?api_key=' + SCRAPINGBEE_KEY
      + '&url=' + encodeURIComponent(url)
      + '&render_js=true&wait=3000'
      + '&extract_rules=' + encodeURIComponent(extractRules);

    const response = await fetch(sbUrl, { headers: { 'Accept': 'application/json' } });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ScrapingBee error:', response.status, errText.substring(0, 200));
      return res.status(500).json({ error: 'scraping_failed', detail: errText.substring(0, 200) });
    }

    const data = await response.json();
    console.log('ScrapingBee extracted:', JSON.stringify(data));

    // Find the first non-null price
    let rawPrice = data.price1 || data.price2 || data.price3 || data.price4 || data.price5 || data.price6;

    if (!rawPrice) {
      return res.status(200).json({ error: 'price_not_found', debug: JSON.stringify(data) });
    }

    // Parse price — remove all non-digit characters
    const priceKrw = parseInt(rawPrice.replace(/[^0-9]/g, ''), 10);
    if (!priceKrw || priceKrw <= 0) {
      return res.status(200).json({ error: 'price_not_found' });
    }

    // Product name
    let productName = data.name1 || data.name2 || data.name3 || 'Coupang Product';
    productName = productName.trim().substring(0, 100);

    // Product image
    const imageUrl = data.image1 || data.image2 || data.image3 || null;

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
