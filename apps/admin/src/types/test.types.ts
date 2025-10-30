import type { Test, TestQuestion, TestChoice, TestResult, Database } from '@pickid/supabase';
import type { TEST_TYPES } from '@/constants/test.constants';

// ============================================================================
// 상수 기반 타입 추론
// ============================================================================

export type TestType = (typeof TEST_TYPES)[number];

// ============================================================================
// 기본 타입 정의 (Supabase Database 타입 기반)
// ============================================================================

// Supabase Insert 타입들
export type TestInsert = Database['public']['Tables']['tests']['Insert'];
export type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
export type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

// Match conditions 타입 정의
export interface MatchConditions {
	type: 'score' | 'choice';
	min?: number;
	max?: number;
	choices?: string[];
}

// Features 타입 정의
export interface ResultFeatures {
	[key: string]: string | number | boolean | null;
}

// ============================================================================
// 테스트 생성 관련 타입 (Supabase 기본 타입 기반)
// ============================================================================

// 질문 데이터 (Supabase TestQuestion 기반)
export interface QuestionData extends Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	question_type?: string | null;
	correct_answers?: string[] | null;
	explanation?: string | null;
	choices: ChoiceData[];
}

// 선택지 데이터 (Supabase TestChoice 기반)
export interface ChoiceData extends Omit<TestChoice, 'id' | 'question_id' | 'created_at'> {
	id?: string;
	is_correct?: boolean | null;
}

// 결과 데이터 (Supabase TestResult 기반)
export interface ResultData extends Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	match_conditions: MatchConditions | null;
	target_gender: string | null;
}

// ============================================================================
// 데이터 변환 관련 타입 (Supabase 기본 타입 기반)
// ============================================================================

// 선택지 포함 질문 (TestQuestion + TestChoice 조합)
export interface QuestionWithChoices {
	id: string;
	question_text: string;
	question_order: number;
	image_url: string | null;
	question_type?: string | null;
	correct_answers?: string[] | null;
	explanation?: string | null;
	test_choices?: Array<{
		id: string;
		choice_text: string;
		choice_order: number;
		score: number;
		is_correct: boolean;
	}>;
}

// 상세 정보 포함 결과 (TestResult 확장)
export interface ResultWithDetails {
	id: string;
	result_name: string;
	result_order: number;
	description: string | null;
	match_conditions: MatchConditions | null;
	background_image_url: string | null;
	theme_color: string | null;
	features: ResultFeatures | null;
	target_gender: string | null;
	created_at: string | null;
	updated_at: string | null;
	test_id: string | null;
}

// ============================================================================
// 기본 정보 타입 (Supabase Test 타입 기반)
// ============================================================================

export interface BasicInfo {
	id?: string;
	title: string;
	description: string | null;
	slug: string;
	thumbnail_url: string | null;
	category_ids: string[];
	short_code: string;
	intro_text: string | null;
	status: 'draft' | 'published' | 'archived';
	estimated_time: number;
	scheduled_at: string | null;
	max_score: number;
	type: 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';
	published_at: string | null;
	requires_gender: boolean;
	features: {
		scoring: {
			mode: 'score_range';
			max_score: number;
			base_types: string[];
		};
		result_variant_rules?: ResultVariantRules;
	};
}

export interface ResultVariantRules {
	// 결과 변형 규칙 정의
	[key: string]: unknown;
}

// ============================================================================
// 테스트 생성 훅 타입
// ============================================================================

export interface UseTestCreationReturn {
	// 상태
	step: number;
	type: string | null;
	basicInfo: BasicInfo;
	questions: QuestionData[];
	results: ResultData[];
	isLoading: boolean;

	// 스텝 관리
	setStep: (step: number) => void;
	setType: (type: string | null) => void;
	nextStep: () => void;
	prevStep: () => void;

	// 기본 정보 관리
	updateBasicInfo: (updates: Partial<BasicInfo>) => void;
	updateResultVariantRules: (rules: ResultVariantRules) => void;

	// 질문 관리
	setQuestions: (questions: QuestionData[]) => void;
	addQuestion: () => void;
	removeQuestion: (index: number) => void;
	updateQuestion: (index: number, updates: Partial<QuestionData>) => void;

	// 선택지 관리
	addChoice: (questionIndex: number) => void;
	removeChoice: (questionIndex: number, choiceIndex: number) => void;
	updateChoice: (questionIndex: number, choiceIndex: number, updates: Partial<ChoiceData>) => void;

	// 결과 관리
	setResults: (results: ResultData[]) => void;
	addResult: () => void;
	removeResult: (index: number) => void;
	updateResult: (index: number, updates: Partial<ResultData>) => void;

	// 저장 및 초기화
	saveTest: (testId?: string) => Promise<unknown>;
	resetForm: () => void;

	// 유틸리티
	generateShortCode: () => string;
}

// ============================================================================
// 테스트 목록 관련 타입 (Supabase Test 타입 기반)
// ============================================================================

// 필터 타입
export interface TestFilters {
	search: string;
	status: 'all' | 'draft' | 'published' | 'scheduled';
}

// 통계 타입
export interface TestStats {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	responses: number;
}

// 상세 정보 포함 테스트 (Supabase Test 확장)
export interface TestWithDetails extends Test {
	category_name: string;
	emoji: string;
	status: 'draft' | 'published' | 'scheduled' | 'archived';
	type: 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';
	thumbnailImage: string;
	startMessage: string;
	scheduledAt: string;
	responseCount: number;
	completionRate: number;
	estimatedTime: number;
	share_count: number;
	completion_count: number;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	isPublished: boolean;
	question_count: number;
	result_count: number;
	response_count: number;
	questions: unknown[];
	results: unknown[];
}

// ============================================================================
// 모달 관련 타입 (UI 컴포넌트용)
// ============================================================================

export type TabType = 'basic' | 'questions' | 'results' | 'stats' | 'preview';

// 테스트 상세 모달 Props (Supabase Test 타입 사용)
export interface TestDetailModalProps {
	test: Test;
	onClose: () => void;
	onTogglePublish: (testId: string, currentStatus: boolean) => void;
	onDelete: (testId: string) => void;
}

// ============================================================================
// 컴포넌트 Props 타입 (UI 컴포넌트용)
// ============================================================================

export interface QuestionStepProps {
	questions: QuestionData[];
	selectedType: string;
	onAddQuestion: () => void;
	onRemoveQuestion: (questionIndex: number) => void;
	onUpdateQuestion: (questionIndex: number, updates: Partial<QuestionData>) => void;
	onAddChoice: (questionIndex: number) => void;
	onRemoveChoice: (questionIndex: number, choiceIndex: number) => void;
	onUpdateChoice: (questionIndex: number, choiceIndex: number, updates: Partial<ChoiceData>) => void;
}

export interface EditTestPageState {
	initialTest: Test | null;
	loadingTest: boolean;
	error: string | null;
}

// ============================================================================
// ResultStep 컴포넌트 관련 타입
// ============================================================================

export interface ResultStepProps {
	results: ResultData[];
	selectedType: string;
	onAddResult: () => void;
	onRemoveResult: (resultIndex: number) => void;
	onUpdateResult: (resultIndex: number, updates: Partial<ResultData>) => void;
}

export interface FeatureInput {
	key: string;
	value: string;
}
