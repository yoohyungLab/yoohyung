import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|images|assets|favicon.ico|sitemap.xml|robots.txt|icons|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.ico).*)',
	],
};

// 로그인이 필요한 페이지들
const PROTECTED_ROUTES = ['/feedback', '/mypage'];

export default async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	// 로그인이 필요한 페이지인지 확인
	const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

	// 로그인이 필요한 페이지가 아니면 통과
	if (!isProtected) {
		return NextResponse.next();
	}

	// 로그인 상태 확인
	const supabase = createSupabaseClient(req);
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// 로그인되지 않았으면 로그인 페이지로 리다이렉트
	if (!session) {
		return NextResponse.redirect(new URL('/auth/login', req.url));
	}

	return NextResponse.next();
}

// Supabase 클라이언트 생성 헬퍼
function createSupabaseClient(req: NextRequest) {
	const res = NextResponse.next();

	return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get(name: string) {
				return req.cookies.get(name)?.value;
			},
			set(name: string, value: string, options: Record<string, unknown>) {
				res.cookies.set({ name, value, ...options });
			},
			remove(name: string, options: Record<string, unknown>) {
				res.cookies.set({ name, value: '', ...options });
			},
		},
	});
}
