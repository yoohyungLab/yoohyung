// Balance Game Constants
// 밸런스 게임 관련 상수 정의


export const BALANCE_GAME_COLORS = {
	A: {
		background: 'bg-red-100',
		gradient: 'bg-gradient-to-br from-red-100 to-red-200',
		border: 'border-red-300',
		gradientBarBg: 'bg-red-100',
		gradientBar: 'bg-gradient-to-r from-red-400 to-red-500',
		badge: 'bg-red-500 text-white',
	},
	B: {
		background: 'bg-blue-100',
		gradient: 'bg-gradient-to-br from-blue-100 to-blue-200',
		border: 'border-blue-300',
		gradientBarBg: 'bg-blue-100',
		gradientBar: 'bg-gradient-to-r from-blue-400 to-blue-500',
		badge: 'bg-blue-500 text-white',
	},
	neutral: {
		background: 'bg-gray-50',
		border: 'border-gray-200',
		gradientBarBg: 'bg-gray-100',
		gradientBar: 'bg-gradient-to-r from-gray-400 to-gray-500',
	},
	vs: {
		background: 'bg-white',
		border: 'border-2 border-gray-200',
	},
} as const;


export const BALANCE_GAME_DEFAULTS = {
	percentageA: 50,
	percentageB: 50,
	totalVotes: 0,
} as const;


export const BALANCE_GAME_TEXT = {
	loading: '🔥 이번주 핫한 밸런스',
	vsLabel: 'VS',
	selectedBadge: '선택',
	otherTestsButton: '💬 다른 테스트 하기',
	retryButton: '🔄 다시 선택',
	moreGames: '밸런스 게임 더보기 →',
	otherTestsHref: '/tests?category=balance',
	moreGamesHref: '/tests?category=balance',
} as const;
