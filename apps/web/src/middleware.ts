import { NextRequest, NextResponse } from 'next/server';

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|images|assets|favicon.ico|sitemap.xml|robots.txt|icons|.*.svg|.*.png|.*.jpg|.*.jpeg|.*.gif|.*.ico).*)',
	],
};

// 로그인이 필요한 페이지들
const PROTECTED_ROUTES = ['/feedback/create', '/feedback/:id', '/feedback'];

export default async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;
	const search = req.nextUrl.search;

	// 로그인이 필요한 페이지인지 확인
	const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

	if (!isProtected) {
		return NextResponse.next();
	}

	// 클라이언트에서 설정하는 인증 플래그 쿠키 검사
	const isAuthenticated = req.cookies.get('pickid_auth')?.value === '1';
	if (isAuthenticated) {
		return NextResponse.next();
	}

	// 미인증 사용자는 로그인 페이지로 즉시 리다이렉트 (클라이언트에서 세션 확인 후 복귀)
	const loginUrl = new URL(`/auth/login?redirectTo=${encodeURIComponent(pathname + search)}`, req.url);
	return NextResponse.redirect(loginUrl);
}
