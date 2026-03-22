import { supabaseAdmin } from '../../lib/supabase-admin';
import {
  checkRateLimit,
  requireMethod,
  verifyOrigin,
  sanitizeString,
  isValidEmail,
  isValidPhone,
} from '../../lib/security';

export default async function handler(req, res) {
  // ── 1. 메서드 검증 ──────────────────────────────────────
  if (!requireMethod(req, res, 'POST')) return;

  // ── 2. Rate Limiting (IP당 분당 3회 — 스팸 방지) ────────
  if (!checkRateLimit(req, res, 3, 60_000)) return;

  // ── 3. Origin 검증 (CSRF 방어) ─────────────────────────
  if (!verifyOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ── 4. 입력 추출 및 검증 ────────────────────────────────
  const { name, email, phone, message } = req.body;

  const cleanName = sanitizeString(name, 100);
  const cleanEmail = sanitizeString(email, 254);
  const cleanPhone = sanitizeString(phone, 20);
  const cleanMessage = sanitizeString(message, 2000);

  if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) {
    return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: '유효한 이메일을 입력해주세요.' });
  }

  if (!isValidPhone(cleanPhone)) {
    return res.status(400).json({ error: '유효한 전화번호를 입력해주세요.' });
  }

  // ── 5. DB 저장 ──────────────────────────────────────────
  const { error } = await supabaseAdmin.from('inquiries').insert({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
  });

  if (error) {
    console.error('Inquiry insert error:', error);
    return res.status(500).json({ error: '문의 저장에 실패했습니다.' });
  }

  return res.status(200).json({ ok: true });
}
