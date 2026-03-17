import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
  }
  const { error } = await supabase.from('inquiries').insert({ name, email, phone, message });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
