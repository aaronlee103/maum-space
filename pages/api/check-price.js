export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.coupang.com/',
      },
      redirect: 'follow',
    });

    const html = await response.text();

    let price = null;
    const pricePatterns = [
      /"finalPrice"\s*:\s*(\d+)/,
      /"salePrice"\s*:\s*(\d+)/,
      /"price"\s*:\s*(\d+)/,
      /"priceValue"\s*:\s*(\d+)/,
    ];
    for (const pat of pricePatterns) {
      const m = html.match(pat);
      if (m) { price = parseInt(m[1].replace(/,/g, '')); break; }
    }

    let productName = '쿠팡 상품';
    const namePatterns = [
      /"productName"\s*:\s*"([^"]+)"/,
      /<title>([^<|\-]+)/,
    ];
    for (const pat of namePatterns) {
      const m = html.match(pat);
      if (m) {
        productName = m[1].trim();
        if (productName.length > 3) break;
      }
    }

    let imageUrl = null;
    const imgPatterns = [
      /"representativeImageUrl"\s*:\s*"([^"]+)"/,
      /"imageUrl"\s*:\s*"([^"]+)"/,
    ];
    for (const pat of imgPatterns) {
      const m = html.match(pat);
      if (m) { imageUrl = m[1]; break; }
    }

    if (!price) {
      return res.status(422).json({ error: 'price_not_found', message: '가격을 찾을 수 없어요. 쿠팡 링크를 확인해주세요.' });
    }

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
  } catch (err) {
    res.status(500).json({ error: 'fetch_failed', message: '상품 정보를 가져오지 못했어요.' });
  }
}
