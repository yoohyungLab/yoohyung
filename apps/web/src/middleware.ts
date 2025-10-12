import { NextRequest, NextResponse } from 'next/server';

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|images|assets|favicon.ico|sitemap.xml|robots.txt|icons|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.ico).*)',
	],
};

// 로그인이 필요한 페이지들
const PROTECTED_ROUTES = ['/feedback/create', '/mypage'];

export default async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	// 로그인이 필요한 페이지인지 확인
	const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

	// 로그인이 필요한 페이지가 아니면 통과
	if (!isProtected) {
		return NextResponse.next();
	}

	// Supabase 쿠키는 브라우저 도메인별로 자동 관리되며, 클라이언트에서 처리합니다.
	// 미들웨어 단계에서는 NextResponse.next()로 통과시키고, 각 페이지/컴포넌트에서 가드를 적용합니다.

	return NextResponse.next();
}
