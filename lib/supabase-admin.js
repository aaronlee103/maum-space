/**
 * 서버 사이드 전용 Supabase Admin 클라이언트
 *
 * ⚠️ 중요: 이 파일은 반드시 서버(API 라우트)에서만 import할 것!
 *           클라이언트(브라우저)에 절대 노출되어서는 안 됨
 *
 * SUPABASE_SERVICE_ROLE_KEY는 NEXT_PUBLIC_ 접두사 없이 서버에서만 접근 가능
 */
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY — admin operations will fail');
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
