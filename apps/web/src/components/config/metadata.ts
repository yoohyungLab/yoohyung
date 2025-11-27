// 메타데이터 중앙 관리 (단일 소스)
//
// 타이틀 패턴 (일관성):
// - 메인 페이지: "픽키드 | 나를 알아가는 심리테스트"
// - 서브 페이지: "페이지명 | 픽키드" (layout.tsx template 적용)

export const SITE_CONFIG = {
	name: '픽키드',
	title: '픽키드 | 나를 알아가는 심리테스트',
	description: '심리테스트, 성격분석, 밸런스게임으로 진짜 나를 발견하세요. Z세대를 위한 테스트 플랫폼.',
	url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pickid.co.kr',
	ogImage: '/og-image.png',
	keywords: [
		'심리테스트',
		'성격분석',
		'밸런스게임',
		'MBTI',
		'DISC',
		'자기계발',
		'픽키드',
		'pickid',
		'Z세대',
		'성격유형검사',
	],
};

export const SOCIAL = {
	twitter: '@pickid',
} as const;

export const VERIFICATION = {
	google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
	naver: process.env.NEXT_PUBLIC_NAVER_VERIFICATION,
} as const;
