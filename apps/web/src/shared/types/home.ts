/**
 * 홈페이지 관련 타입 정의
 */

// 기본 테스트 카드 타입
export interface TestCard {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
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

// 홈페이지 섹션별 테스트 데이터 타입
export interface HomeSectionData {
	trending: TestCard[];
	recommended: TestCard[];
	dynamic: TestCard[];
	topByType: TestCard[];
}

// 테스트 카드 컴포넌트 props 타입
export interface TestCardProps extends TestCard {
	isFavorite?: boolean;
	onToggleFavorite?: (id: string) => void;
}

// 섹션 컴포넌트 공통 props 타입
export interface SectionProps {
	tests: TestCard[];
	className?: string;
}
