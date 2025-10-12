import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');
	const origin = requestUrl.origin;

	if (code) {
		// Supabase auth callback 처리
		const { createServerClient } = await import('@pickid/supabase');
		const supabase = createServerClient();

		await supabase.auth.exchangeCodeForSession(code);
	}

	// 홈으로 리다이렉트
	return NextResponse.redirect(`${origin}/`);
}
