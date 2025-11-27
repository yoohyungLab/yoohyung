import { NextRequest, NextResponse } from 'next/server';

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|images|assets|favicon.ico|sitemap.xml|robots.txt|icons|.*.svg|.*.png|.*.jpg|.*.jpeg|.*.gif|.*.ico).*)',
	],
};

// 로그인이 필요한 페이지 패턴
const PROTECTED_PATTERNS = [
	'/feedback', // /feedback, /feedback/create, /feedback/123 등 모두 보호
];

export default async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl;

	// 로그인이 필요한 페이지인지 확인
	const isProtected = PROTECTED_PATTERNS.some((pattern) => pathname.startsWith(pattern));

	if (!isProtected) {
		return NextResponse.next();
	}

	// 인증 쿠키 확인
	const isAuthenticated = req.cookies.get('pickid_auth')?.value === '1';

	if (isAuthenticated) {
		return NextResponse.next();
	}

	// 미인증 시 로그인 페이지로 리다이렉트
	const loginUrl = new URL(`/auth/login?redirectTo=${encodeURIComponent(pathname + search)}`, req.url);
	return NextResponse.redirect(loginUrl);
}
