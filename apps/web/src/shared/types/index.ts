// ============================================================================
// Supabase 타입 기반 확장 타입 정의
// ============================================================================

import type { Test, TestWithNestedDetails, TestResult, TestQuestion, TestChoice } from '@pickid/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ============================================================================
// 테스트 관련 확장 타입 (UI/클라이언트 전용)
// ============================================================================

// 테스트 타입 정의 (DB에 Enum이 없어서 수동 정의)
export type TTestType = 'balance' | 'psychology' | 'personality';

// 테스트 타입별 설정 (UI 설정용)
export interface ITestTypeConfig {
	emoji: string;
	title: string;
	description: string;
	categoryPath: string;
}

// 테스트 타입별 설정 맵
export type TTestTypeConfigMap = Record<TTestType, ITestTypeConfig>;

// 테스트 카드 (홈페이지용 간소화된 버전) - Supabase Test 타입 기반
export type TestCard = Pick<
	Test,
	'id' | 'title' | 'description' | 'thumbnail_url' | 'slug' | 'category_ids' | 'type' | 'status'
> & {
	// Supabase에 없는 클라이언트 전용 필드들
	image: string;
	tags: string[];
	starts: number | null;
	completions: number | null;
};

// 테스트 카드 Props (즐겨찾기 기능 포함)
export interface TestCardProps extends TestCard {
	isFavorite?: boolean;
	onToggleFavorite?: (id: string) => void;
}

// 사용자 답변 (Supabase에 없는 클라이언트 전용 타입)
export interface TestAnswer {
	questionId: string;
	choiceId: string;
	score: number;
	answeredAt: number;
}

// 테스트 진행 상태 (클라이언트 전용)
export interface TestProgress {
	currentQuestionIndex: number;
	totalQuestions: number;
	answers: TestAnswer[];
	startTime: number;
	isCompleted: boolean;
}

// 테스트 완료 결과 (클라이언트 전용) - Supabase TestResult 타입 기반
export interface TestCompletionResult extends Pick<TestResult, 'test_id' | 'created_at'> {
	// Supabase에 없는 클라이언트 전용 필드들
	resultId: string;
	totalScore: number;
	score: number;
	answers: TestAnswer[];
	completedAt: string;
	duration: number;
	gender?: string;
}

// 테스트 진행 인터페이스 Props
export interface TestTakingInterfaceProps {
	test: TestWithNestedDetails;
	onComplete: (result: TestCompletionResult) => void;
	onExit: () => void;
	initialProgress?: Partial<TestProgress>;
}

// 테스트 설정 (클라이언트 전용)
export interface TestConfig {
	allowBackNavigation: boolean;
	showProgress: boolean;
	showQuestionNumbers: boolean;
	requireAllAnswers: boolean;
	timeLimit?: number;
	theme?: {
		primaryColor: string;
		secondaryColor: string;
		backgroundColor: string;
	};
}

// ============================================================================
// 홈페이지 관련 타입
// ============================================================================

// 배너 (클라이언트 전용)
export interface Banner {
	id: string;
	image: string;
	title?: string;
	description?: string;
	testId?: string; // 테스트 페이지로 연결할 테스트 ID
	ctaAction?: () => void;
}

// 밸런스 게임 옵션 (클라이언트 전용)
export interface BalanceOption {
	id: 'A' | 'B';
	emoji: string;
	label: string;
	percentage: number;
}

// 밸런스 게임 결과 데이터
export interface BalanceGameResult {
	// 사용자 선택 요약
	userChoiceSummary: {
		totalQuestions: number;
		aChoices: number;
		bChoices: number;
		aPercentage: number;
		bPercentage: number;
	};

	// 전체 통계와 비교
	comparisonStats: {
		userChoicePercentage: number; // 사용자가 선택한 비율이 전체에서 차지하는 비율
		isMinority: boolean; // 소수파인지 여부
		oppositePercentage: number; // 반대 선택 비율
	};

	// 주제별 전체 통계
	overallStats: {
		totalParticipants: number;
		mostPopularChoice: {
			question: string;
			choice: string;
			percentage: number;
		};
		mostControversialQuestion: {
			question: string;
			aPercentage: number;
			bPercentage: number;
		};
		averageTimeSpent: number; // 평균 소요 시간 (초)
	};

	// 테스트 메타데이터
	testMetadata: {
		testId: string;
		testTitle: string;
		category: string;
		completedAt: string;
	};

	// 사용자 답변 데이터
	userAnswers?: Array<{
		questionId: string;
		choiceId: string;
	}>;
}

// ============================================================================
// 인증 관련 타입 (Supabase Auth 확장)
// ============================================================================

// 인증 상태 - Supabase User 타입 기반
export interface AuthState {
	user: SupabaseUser | null;
	session: Session | null;
	loading: boolean;
	isAuthenticated: boolean;
}

// 인증 메서드
export interface AuthMethods {
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name?: string) => Promise<void>;
	logout: () => Promise<void>;
	signInWithKakao: () => Promise<void>;
	refreshSession: () => Promise<void>;
}

// 인증 컨텍스트
export interface AuthContextType extends AuthState, AuthMethods {}

// 인증 폼 데이터
export interface AuthFormData {
	email: string;
	password: string;
	name?: string;
	confirmPassword?: string;
}

// ============================================================================
// 밸런스 게임 관련 타입 (Supabase 기본 타입 기반)
// ============================================================================

// 밸런스 게임 질문 Props (TestQuestion, TestChoice 기반)
export interface IBalanceGameQuestionProps {
	testId: string;
	question: Pick<TestQuestion, 'id' | 'question_text'> & {
		choices: Array<Pick<TestChoice, 'id' | 'choice_text' | 'choice_order'>>;
	};
	questionNumber: number;
	totalQuestions: number;
	onAnswer: (questionId: string, choiceId: string) => void;
	onNext: () => void;
	onPrevious?: () => void;
	isFirstQuestion: boolean;
	isLastQuestion: boolean;
}

// 밸런스 게임 결과 데이터 Props
export interface IUseBalanceGameResultDataProps {
	testId: string;
	userAnswers: Array<{
		questionId: string;
		choiceId: string;
	}>;
	enabled?: boolean;
}

// 논란스러운 선택지 (통계 계산용, TestQuestion 기반)
export interface IControversialChoice extends Pick<TestQuestion, 'id' | 'question_text'> {
	questionId: string;
	questionText: string;
	choiceA: {
		text: string;
		percentage: number;
		count: number;
	};
	choiceB: {
		text: string;
		percentage: number;
		count: number;
	};
	totalResponses: number;
}

// 압도적인 선택지 (통계 계산용, TestQuestion 기반)
export interface IOverwhelmingChoice extends Pick<TestQuestion, 'id' | 'question_text'> {
	questionId: string;
	questionText: string;
	winningChoice: {
		text: string;
		percentage: number;
		count: number;
	};
	losingChoice: {
		text: string;
		percentage: number;
		count: number;
	};
	totalResponses: number;
}

// 인기 테스트 (Test 기반)
export interface IPopularTest extends Pick<Test, 'id' | 'title' | 'description' | 'thumbnail_url'> {
	testId: string;
	category?: string;
	thumbnailUrl: string;
	participantCount: number;
}

// 밸런스 게임 테마 (UI 설정용)
export interface IBalanceGameTheme {
	primary: string;
	accent: string;
	secondary: string;
	progress: string;
	question: string;
	choice: string;
	gradient: string;
}

// 밸런스 게임 통계 (TestChoice 기반)
export interface IBalanceGameStats extends Pick<TestChoice, 'id' | 'choice_text'> {
	choiceId: string;
	choiceText: string;
	responseCount: number;
	percentage: number;
}
