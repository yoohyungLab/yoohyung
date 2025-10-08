import type { TestWithNestedDetails } from '@pickid/supabase';

// ============================================================================
// 테스트 진행 관련 타입
// ============================================================================

// 사용자 답변
export interface TestAnswer {
	questionId: string;
	choiceId: string;
	score: number;
	answeredAt: number;
}

// 테스트 진행 상태
export interface TestProgress {
	currentQuestionIndex: number;
	totalQuestions: number;
	answers: TestAnswer[];
	startTime: number;
	isCompleted: boolean;
}

// 테스트 완료 결과
export interface TestCompletionResult {
	testId: string;
	resultId: string;
	totalScore: number;
	answers: TestAnswer[];
	completedAt: string;
	duration: number; // 초 단위
	gender?: string; // 성별 정보 (선택사항)
}

// ============================================================================
// 컴포넌트 Props 타입
// ============================================================================

// 테스트 진행 인터페이스 Props
export interface TestTakingInterfaceProps {
	test: TestWithNestedDetails;
	onComplete: (result: TestCompletionResult) => void;
	onExit: () => void;
	initialProgress?: Partial<TestProgress>;
}

// 테스트 진행 훅 반환 타입
export interface UseTestTakingReturn {
	progress: TestProgress;
	currentQuestion: TestWithNestedDetails['questions'][0] | null;
	canProceed: boolean;
	canGoBack: boolean;
	handleAnswer: (choiceId: string) => void;
	handleNext: () => void;
	handlePrevious: () => void;
	handleComplete: () => void;
	handleExit: () => void;
	resetTest: () => void;
}

// ============================================================================
// 설정 및 유틸리티 타입
// ============================================================================

// 테스트 설정
export interface TestConfig {
	allowBackNavigation: boolean;
	showProgress: boolean;
	showQuestionNumbers: boolean;
	requireAllAnswers: boolean;
	timeLimit?: number; // 초 단위
	theme?: {
		primaryColor: string;
		secondaryColor: string;
		backgroundColor: string;
	};
}
