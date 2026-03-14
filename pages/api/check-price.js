export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let html = null;

  // 방법 1: 직접 fetch
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.coupang.com/',
      },
      redirect: 'follow',
    });
    if (r.ok) html = await r.text();
  } catch (_) {}

  // 방법 2: allorigins 프록시
  if (!html || html.length < 1000) {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const r = await fetch(proxyUrl);
      const data = await r.json();
      if (data.contents && data.contents.length > 1000) html = data.contents;
    } catch (_) {}
  }

  // 방법 3: corsproxy.io
  if (!html || html.length < 1000) {
    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const r = await fetch(proxyUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
      });
      if (r.ok) html = await r.text();
    } catch (_) {}
  }

  if (!html || html.length < 1000) {
    return res.status(422).json({ error: 'fetch_failed', message: '상품 페이지를 불러오지 못했어요.' });
  }

  // 가격 추출
  let price = null;
  const pricePatterns = [
    /"finalPrice"\s*:\s*(\d+)/,
    /"salePrice"\s*:\s*(\d+)/,
    /"totalPrice"\s*:\s*(\d+)/,
    /"price"\s*:\s*(\d+)/,
    /"priceValue"\s*:\s*(\d+)/,
    /class="[^"]*total-price[^"]*"[^>]*>[^<]*<[^>]*>([\d,]+)/,
    /priceStr['"\s]*:['"\s]*(\d[\d,]+)/,
  ];
  for (const pat of pricePatterns) {
    const m = html.match(pat);
    if (m) {
      const val = parseInt(m[1].replace(/,/g, ''));
      if (val > 100 && val < 100000000) { price = val; break; }
    }
  }

  // 상품명 추출
  let productName = '쿠팡 상품';
  const namePatterns = [
    /"productName"\s*:\s*"([^"]{5,})"/,
    /"name"\s*:\s*"([^"]{5,})"/,
    /<title>([^<|\-]{5,})/,
  ];
  for (const pat of namePatterns) {
    const m = html.match(pat);
    if (m) {
      const name = m[1].trim().replace(/\s*[:|\-].*$/, '').trim();
      if (name.length > 4) { productName = name; break; }
    }
  }

  // 이미지 추출
  let imageUrl = null;
  const imgPatterns = [
    /"representativeImageUrl"\s*:\s*"([^"]+)"/,
    /"imageUrl"\s*:\s*"([^"]+\.(?:jpg|png|webp))"/i,
  ];
  for (const pat of imgPatterns) {
    const m = html.match(pat);
    if (m) { imageUrl = m[1]; break; }
  }

  if (!price) {
    return res.status(422).json({ error: 'price_not_found', message: '가격을 찾을 수 없어요. 쿠팡 링크를 확인해주세요.' });
  }

  // 환율 (KRW → USD)
  let exchangeRate = 1350;
  try {
    const fxRes = await fetch('https://api.exchangerate-api.com/v4/latest/KRW');
    const fxData = await fxRes.json();
    exchangeRate = Math.round(1 / fxData.rates.USD);
  } catch (_) {}

  const priceUsd = price / exchangeRate;
  const serviceFee = priceUsd * 0.1;
  const total = priceUsd + serviceFee;

  res.json({
    productName,
    imageUrl,
    priceKrw: price,
    priceUsd: Math.round(priceUsd * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    total: Math.round(total * 100) / 100,
    exchangeRate,
  });
}
