/**
 * 보안 유틸리티 모듈
 * - Rate Limiting (메모리 기반)
 * - 입력 검증 / 정제(Sanitize)
 * - SSRF 방어
 * - CSRF 검증
 */

// ═══════════════════════════════════════════════════════════════
// 1. Rate Limiter (메모리 기반 — Vercel Serverless 환경에 적합)
// ═══════════════════════════════════════════════════════════════
const rateLimitMap = new Map();

/**
 * @param {string} key   - 식별 키 (IP 등)
 * @param {number} limit - 허용 횟수
 * @param {number} windowMs - 윈도우 (밀리초)
 * @returns {boolean} true = 허용, false = 차단
 */
export function rateLimit(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.start > windowMs) {
    rateLimitMap.set(key, { start: now, count: 1 });
    return true;
  }

  record.count++;
  if (record.count > limit) return false;
  return true;
}

/**
 * API 라우트에서 사용하는 Rate Limit 미들웨어
 * @param {object} req
 * @param {object} res
 * @param {number} limit
 * @param {number} windowMs
 * @returns {boolean} true = 허용됨
 */
export function checkRateLimit(req, res, limit = 10, windowMs = 60_000) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  const key = `${req.url}:${ip}`;

  if (!rateLimit(key, limit, windowMs)) {
    res.status(429).json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' });
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════
// 2. 입력 정제 (Sanitize)
// ═══════════════════════════════════════════════════════════════

/**
 * HTML 엔티티로 이스케이프 (XSS 방어)
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 문자열 길이 제한 + 트림
 */
export function sanitizeString(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
}

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
}

/**
 * 전화번호 형식 검증 (한국식)
 */
export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const re = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return re.test(phone.replace(/\s/g, ''));
}

// ═══════════════════════════════════════════════════════════════
// 3. SSRF 방어 — URL 검증
// ═══════════════════════════════════════════════════════════════

const ALLOWED_DOMAINS = [
  'www.coupang.com',
  'coupang.com',
  'm.coupang.com',
];

/**
 * URL이 허용된 도메인인지 검사
 */
export function isAllowedUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:') return false;
    return ALLOWED_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. 요청 출처(Origin) 검증
// ═══════════════════════════════════════════════════════════════

const ALLOWED_ORIGINS = [
  'https://maum.space',
  'https://www.maum.space',
  'https://maum-space.vercel.app',
];

/**
 * 요청의 Origin 또는 Referer가 허용된 출처인지 확인
 */
export function verifyOrigin(req) {
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';

  if (origin && ALLOWED_ORIGINS.includes(origin)) return true;

  for (const allowed of ALLOWED_ORIGINS) {
    if (referer.startsWith(allowed)) return true;
  }

  return false;
}

/**
 * HTTP 메서드 검증 미들웨어
 */
export function requireMethod(req, res, method) {
  if (req.method !== method) {
    res.setHeader('Allow', method);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return false;
  }
  return true;
}
