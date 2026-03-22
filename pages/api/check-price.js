import {
  checkRateLimit,
  requireMethod,
  verifyOrigin,
  isAllowedUrl,
} from '../../lib/security';

export default async function handler(req, res) {
  // ── 1. 메서드 검증 ──────────────────────────────────────
  if (!requireMethod(req, res, 'POST')) return;

  // ── 2. Rate Limiting (IP당 분당 10회) ───────────────────
  if (!checkRateLimit(req, res, 10, 60_000)) return;

  // ── 3. Origin 검증 ─────────────────────────────────────
  if (!verifyOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // ── 4. ✅ SSRF 방어: 허용된 도메인만 접근 ─────────────
  if (!isAllowedUrl(url)) {
    return res.status(400).json({
      error: '쿠팡(coupang.com) 상품 링크만 사용 가능합니다.',
    });
  }

  const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_KEY;

  // HTML에서 가격/상품명 추출
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
      if (t.length > 1) productName = t.substring(0, 200);
    }

    let imageUrl = null;
    const imgMatch = html.match(/"(?:mainImageUrl|itemImageUrl|imageUrl)"\s*:\s*"([^"]+)"/);
    if (imgMatch) imageUrl = imgMatch[1];

    return { priceKrw, productName, imageUrl };
  }

  async function fetchViaBee(renderJs) {
    if (!SCRAPINGBEE_KEY) throw new Error('ScrapingBee not configured');

    const params = new URLSearchParams({
      api_key: SCRAPINGBEE_KEY,
      url: url,
      render_js: renderJs ? 'true' : 'false',
      country_code: 'kr',
    });
    if (renderJs) params.set('wait', '1500');

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

    // 1단계: 직접 fetch
    try {
      const directRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'ko-KR,ko;q=0.9',
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
      // 직접 fetch 실패 — 다음 단계로
    }

    // 2단계: ScrapingBee (no JS)
    if (!data && SCRAPINGBEE_KEY) {
      try {
        const html = await fetchViaBee(false);
        data = extractData(html);
        if (data) source = 'bee_nojs';
      } catch (e) { /* pass */ }
    }

    // 3단계: ScrapingBee (with JS)
    if (!data && SCRAPINGBEE_KEY) {
      const html = await fetchViaBee(true);
      data = extractData(html);
      if (data) source = 'bee_js';
    }

    if (!data) {
      return res.status(200).json({ error: 'price_not_found' });
    }

    // 환율 조회
    let exchangeRate = 1350;
    try {
      const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/KRW', {
        signal: AbortSignal.timeout(3000),
      });
      const rateData = await rateRes.json();
      if (rateData.rates?.USD) exchangeRate = 1 / rateData.rates.USD;
    } catch (e) { /* 기본 환율 사용 */ }

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
    console.error('check-price error:', err.message);
    // ✅ 내부 오류 메시지 숨김
    return res.status(500).json({ error: '가격 조회에 실패했습니다.' });
  }
}
