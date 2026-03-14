export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const SCRAPINGBEE_KEY = '8ME8HXUHINKJG08JIUJTBP7ACDQFKTGLXRQ4P0U9UWAS5H3HJ3LYA283OR71XIKE6QSABMQX3RIBSYA8';

  // HTML에서 가격/상품명 추출 (공통 로직)
  function extractData(html) {
    let priceKrw = null;

    const patterns = [
      /"finalPrice"\s*:\s*([0-9]{4,7})/,
      /"salePrice"\s*:\s*([0-9]{4,7})/,
      /"discountedPrice"\s*:\s*([0-9]{4,7})/,
      /"productPrice"\s*:\s*([0-9]{4,7})/,
      /(?:finalPrice|salePrice|discountPrice|productPrice)[^0-9]{0,20}([0-9]{4,7})/,
    ];

    for (const pattern of patterns) {
      const m = html.match(pattern);
      if (m) {
        const val = parseInt(m[1], 10);
        if (val >= 1000) { priceKrw = val; break; }
      }
    }

    if (!priceKrw) return null;

    let productName = 'Coupang Product';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      let t = titleMatch[1].trim();
      const pipeIdx = t.lastIndexOf(' | ');
      if (pipeIdx > 0) t = t.substring(0, pipeIdx).trim();
      if (t.length > 1) productName = t;
    }

    // 이미지 URL 추출 시도
    let imageUrl = null;
    const imgMatch = html.match(/"(?:mainImageUrl|itemImageUrl|imageUrl)"\s*:\s*"([^"]+)"/);
    if (imgMatch) imageUrl = imgMatch[1];

    return { priceKrw, productName, imageUrl };
  }

  // ScrapingBee 호출
  async function fetchViaBee(renderJs) {
    const params = new URLSearchParams({
      api_key: SCRAPINGBEE_KEY,
      url: url,
      render_js: renderJs ? 'true' : 'false',
      country_code: 'kr',
    });
    if (renderJs) {
      params.set('wait', '1500'); // stealth 제거, wait 단축 → 5크레딧
    }
    const sbUrl = `https://app.scrapingbee.com/api/v1?${params.toString()}`;
    const response = await fetch(sbUrl, { signal: AbortSignal.timeout(9000) });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`bee_${response.status}: ${errText.substring(0, 150)}`);
    }
    return response.text();
  }

  try {
    let data = null;
    let source = '';

    // ── 1단계: 직접 fetch (비용 0) ──────────────────────────────────
    try {
      const directRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          'Referer': 'https://www.coupang.com/',
        },
        signal: AbortSignal.timeout(4000),
      });
      if (directRes.ok) {
        const html = await directRes.text();
        data = extractData(html);
        if (data) source = 'direct';
      }
    } catch (e) {
      console.log('direct fetch failed:', e.message);
    }

    // ── 2단계: ScrapingBee render_js=false (1크레딧) ─────────────────
    if (!data) {
      try {
        const html = await fetchViaBee(false);
        data = extractData(html);
        if (data) source = 'bee_nojs';
      } catch (e) {
        console.log('bee no-js failed:', e.message);
      }
    }

    // ── 3단계: ScrapingBee render_js=true (5크레딧) ──────────────────
    if (!data) {
      const html = await fetchViaBee(true);
      data = extractData(html);
      if (data) source = 'bee_js';
    }

    console.log('source:', source, '| price:', data?.priceKrw);

    if (!data) {
      return res.status(200).json({ error: 'price_not_found' });
    }

    // 환율
    let exchangeRate = 1350;
    try {
      const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/KRW', { signal: AbortSignal.timeout(3000) });
      const rateData = await rateRes.json();
      if (rateData.rates?.USD) exchangeRate = 1 / rateData.rates.USD;
    } catch (e) {}

    const priceUsd = data.priceKrw / exchangeRate;
    const serviceFee = priceUsd * 0.1;
    const total = priceUsd + serviceFee;

    return res.status(200).json({
      productName: data.productName,
      imageUrl: data.imageUrl,
      priceKrw: data.priceKrw,
      priceUsd: parseFloat(priceUsd.toFixed(2)),
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      exchangeRate: parseFloat(exchangeRate.toFixed(2)),
      source,
    });

  } catch (err) {
    console.error('handler error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
