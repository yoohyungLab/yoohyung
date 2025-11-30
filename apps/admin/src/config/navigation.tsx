import { LayoutDashboard, FileText, Plus, Tag, Users, BarChart3, TrendingUp, User, MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';

export const navigation = [
	{
		type: 'item',
		name: '대시보드',
		href: '/',
		icon: <LayoutDashboard className="w-4 h-4" />,
		description: '전체 현황 및 통계',
		match: ['/'],
	},

	{ type: 'section', name: '콘텐츠 운영' },
	{
		type: 'item',
		name: '테스트 관리',
		href: '/tests',
		icon: <FileText className="w-4 h-4" />,
		description: '테스트 목록 및 관리',
		match: ['/tests', '/tests/create'],
	},
	{
		type: 'item',
		name: '테스트 생성',
		href: '/tests/create',
		icon: <Plus className="w-4 h-4" />,
		description: '새로운 테스트 만들기',
		match: ['/tests/create'],
	},
	{
		type: 'item',
		name: '카테고리 관리',
		href: '/categories',
		icon: <Tag className="w-4 h-4" />,
		description: '테스트 카테고리 관리',
		match: ['/categories'],
	},

	{ type: 'section', name: '데이터 & 분석' },
	{
		type: 'item',
		name: '사용자 응답',
		href: '/responses',
		icon: <Users className="w-4 h-4" />,
		description: '사용자 응답 관리',
		match: ['/responses'],
	},
	{
		type: 'item',
		name: '테스트 성과 분석',
		href: '/analytics',
		icon: <BarChart3 className="w-4 h-4" />,
		description: '테스트 성과 분석 및 인사이트',
		match: ['/analytics', '/analytics/tests'],
	},

	{
		type: 'item',
		name: '성장 분석',
		href: '/growth',
		icon: <TrendingUp className="w-4 h-4" />,
		description: '유입·퍼널·가입 분석',
		match: ['/growth', '/growth/funnel', '/growth/channels', '/growth/landings', '/growth/cohorts'], // 필요시 라우트에 맞춰 조정
	},

	{ type: 'section', name: '유저 & 커뮤니티' },
	{
		type: 'item',
		name: '유저 관리',
		href: '/users',
		icon: <User className="w-4 h-4" />,
		description: '유저 정보 한눈에',
		match: ['/users'],
	},
	{
		type: 'item',
		name: '건의사항 관리',
		href: '/feedbacks',
		icon: <MessageSquare className="w-4 h-4" />,
		description: '건의사항 관리',
		match: ['/feedbacks'],
	},
] as const;

export type NavEntry = (typeof navigation)[number];

// 헬퍼 함수
export function isActivePath(pathname: string, entry: NavEntry) {
	if (entry.type !== 'item') return false;
	if (entry.href === '/') return pathname === '/';
	const prefixes = entry.match ?? [entry.href];
	return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

