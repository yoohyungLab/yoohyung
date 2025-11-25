// TODO: 이거 왜 있어야하는지??? 단순 타입인데..?
export type NavEntry =
	| {
			type: 'section';
			name: string;
	  }
	| {
			type: 'item';
			name: string;
			href: string;
			icon: string;
			description?: string;
			badge?: string;
			// 활성 매칭 우선순위 향상을 위한 prefix(여러 개 가능)
			match?: string[];
	  };

		// TODO: match, href는 상수화되어 있는거 가져다쓰고 href match? 이게 각각 뭘 의미하는지 꼭 필요한건지?
export const navigation: NavEntry[] = [
	{
		type: 'item',
		name: '대시보드',
		href: '/',
		icon: '📊',
		description: '전체 현황 및 통계',
		match: ['/'],
	},

	{ type: 'section', name: '콘텐츠 운영' },
	{
		type: 'item',
		name: '테스트 관리',
		href: '/tests',
		icon: '📝',
		description: '테스트 목록 및 관리',
		match: ['/tests', '/tests/create'],
	},
	{
		type: 'item',
		name: '테스트 생성',
		href: '/tests/create',
		icon: '➕',
		description: '새로운 테스트 만들기',
		match: ['/tests/create'],
	},
	{
		type: 'item',
		name: '카테고리 관리',
		href: '/categories',
		icon: '🏷️',
		description: '테스트 카테고리 관리',
		match: ['/categories'],
	},

	{ type: 'section', name: '데이터 & 분석' },
	{
		type: 'item',
		name: '사용자 응답',
		href: '/responses',
		icon: '👥',
		description: '사용자 응답 관리',
		match: ['/responses'],
	},
	{
		type: 'item',
		name: '테스트 성과 분석',
		href: '/analytics',
		icon: '📈',
		description: '테스트 성과 분석 및 인사이트',
		match: ['/analytics', '/analytics/tests'],
	},

	// ✅ 신규: 마케팅 분석 (유입·퍼널·가입 중심, 결과 분석과 별개)
	{
		type: 'item',
		name: '성장 분석',
		href: '/growth',
		icon: '📣',
		description: '유입·퍼널·가입 분석',
		match: ['/growth', '/growth/funnel', '/growth/channels', '/growth/landings', '/growth/cohorts'], // 필요시 라우트에 맞춰 조정
	},

	{ type: 'section', name: '유저 & 커뮤니티' },
	{
		type: 'item',
		name: '유저 관리',
		href: '/users',
		icon: '🧑‍💼',
		description: '유저 정보 한눈에',
		match: ['/users'],
	},
	{
		type: 'item',
		name: '건의사항 관리',
		href: '/feedbacks',
		icon: '💬',
		description: '건의사항 관리',
		match: ['/feedbacks'],
	},
];

// 헬퍼 함수
export function isActivePath(pathname: string, entry: NavEntry) {
	if (entry.type !== 'item') return false;
	if (entry.href === '/') return pathname === '/';
	const prefixes = entry.match ?? [entry.href];
	return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
