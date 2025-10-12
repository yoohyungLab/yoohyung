// ============================================================================
// 홈페이지 관련 타입 정의
// ============================================================================

// 기본 테스트 카드 타입 (홈페이지용 간소화된 버전)
export interface TestCard {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	type: string | null;
	status: string | null;
	slug: string;
	category_ids: string[] | null;
	thumbnail_url: string | null;
	starts: number | null; // 시작 횟수 ("시작하기" 버튼 클릭 기준)
	completions: number | null; // 완료 횟수 (결과 완료 기준)
}

// 배너 타입
export interface Banner {
	id: string;
	image: string;
	title?: string;
	description?: string;
	ctaAction?: () => void;
}

// 밸런스 게임 옵션 타입
export interface BalanceOption {
	id: 'A' | 'B';
	emoji: string;
	label: string;
	percentage: number;
}

// 테스트 카드 컴포넌트 props 타입
export interface TestCardProps extends TestCard {
	isFavorite?: boolean;
	onToggleFavorite?: (id: string) => void;
}
