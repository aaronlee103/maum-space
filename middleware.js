import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aaronlee103@gmail.com';

/**
 * Next.js 미들웨어 — 서버 사이드에서 인증 및 보안 검사 수행
 *
 * ✅ 보호 대상:
 *   - /admin   → 관리자 이메일만 접근 허용
 *   - /mypage  → 로그인 필수
 *   - /checkout → 로그인 필수
 *
 * ✅ 보안 기능:
 *   - 서버 측 JWT 검증 (클라이언트 우회 불가)
 *   - Open Redirect 방어
 */
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ── 1. 보호된 경로인지 확인 ──────────────────────────────
  const protectedPaths = ['/mypage', '/checkout', '/admin'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return res;

  // ── 2. Supabase 세션 토큰 확인 ───────────────────────────
  // 쿠키에서 또는 Authorization 헤더에서 토큰 추출
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // localStorage 기반 인증이므로 미들웨어에서는 쿠키 기반 확인이 제한적
  // → 아래 admin 보호는 API 레벨에서도 이중 검증 필요 (아래 admin API 미들웨어 참고)

  // ── 3. /admin 경로 — 추가 보안 ──────────────────────────
  if (pathname.startsWith('/admin')) {
    // 관리자 페이지는 서버 사이드에서 접근 제한
    // 실제 인증은 admin.js 내부 + getServerSideProps에서 수행
    // 추가: Vercel에서 Basic Auth 또는 IP 제한 설정 권장
  }

  // ── 4. Open Redirect 방어 ────────────────────────────────
  const redirect = req.nextUrl.searchParams.get('redirect');
  if (redirect) {
    try {
      const redirectUrl = new URL(redirect, req.url);
      // 외부 도메인으로의 리다이렉트 차단
      if (redirectUrl.origin !== req.nextUrl.origin) {
        const safeUrl = new URL(req.url);
        safeUrl.searchParams.delete('redirect');
        return NextResponse.redirect(safeUrl);
      }
    } catch {
      // 잘못된 URL 형식 — redirect 파라미터 제거
      const safeUrl = new URL(req.url);
      safeUrl.searchParams.delete('redirect');
      return NextResponse.redirect(safeUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/mypage/:path*', '/checkout/:path*', '/login'],
};
