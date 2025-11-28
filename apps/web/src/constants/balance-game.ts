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
