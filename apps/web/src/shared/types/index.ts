// ============================================================================
// Supabase 타입 기반 확장 타입 정의
// ============================================================================

import type { Test, TestWithNestedDetails, TestResult } from '@pickid/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ============================================================================
// 테스트 관련 확장 타입
// ============================================================================

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
	ctaAction?: () => void;
}

// 밸런스 게임 옵션 (클라이언트 전용)
export interface BalanceOption {
	id: 'A' | 'B';
	emoji: string;
	label: string;
	percentage: number;
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
