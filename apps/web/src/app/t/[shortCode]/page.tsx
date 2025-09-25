// /t/sVnyiiTIHi-love-language-test 또는 /t/sVnyiiTIHi 처리
import { redirect } from 'next/navigation';
import { supabase } from '@repo/shared';

export default async function TestPage({ params }: { params: { shortCode: string } }) {
	const { shortCode } = params;

	// shortCode로 테스트 찾기
	const { data: test } = await supabase.from('tests').select('*').eq('short_code', shortCode).single();

	if (!test) {
		return <div>테스트를 찾을 수 없습니다.</div>;
	}

	// 정규 URL로 리다이렉트
	const canonicalUrl = `/t/${test.short_code}-${test.slug}`;
	const currentUrl = `/t/${shortCode}`;

	if (currentUrl !== canonicalUrl) {
		redirect(canonicalUrl, 301);
	}

	// 테스트 페이지 렌더링
	return <div>테스트 페이지: {test.title}</div>;
}
