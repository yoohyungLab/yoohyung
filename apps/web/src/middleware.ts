import { NextRequest, NextResponse } from 'next/server';

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

	// 간단한 쿠키 기반 인증 확인
	const sessionCookie = req.cookies.get('sb-pickid-auth-token');

	// 세션 쿠키가 없으면 로그인 페이지로 리다이렉트
	if (!sessionCookie) {
		return NextResponse.redirect(new URL('/auth/login', req.url));
	}

	return NextResponse.next();
}
