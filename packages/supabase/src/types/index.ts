// Supabase 생성 타입 import
export type { Database, Json } from './database';
import type { Database } from './database';

// Admin 전용 타입들
export * from './admin';

// Helper type for table operations
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

// ===== 기본 테이블 타입들 (Supabase에서 자동 생성) =====
export type Category = Tables<'categories'>['Row'];
export type Test = Tables<'tests'>['Row'];
export type User = Tables<'users'>['Row'];
export type Feedback = Tables<'feedbacks'>['Row'];
export type AdminUser = Tables<'admin_users'>['Row'];
export type TestQuestion = Tables<'test_questions'>['Row'];
export type TestChoice = Tables<'test_choices'>['Row'];
export type TestResult = Tables<'test_results'>['Row'];
export type UserTestResponse = Tables<'user_test_responses'>['Row'];
export type HomeBalanceGame = Tables<'home_balance_games'>['Row'];
export type HomeBalanceVote = Tables<'home_balance_votes'>['Row'];

// ===== Enum 타입들 =====
// 실제 DB에 있는 Enums
export type CategoryStatus = Database['public']['Enums']['category_status'];
export type GenderType = Database['public']['Enums']['gender_type'];

// DB에 Enum이 없어서 수동 정의
export type TestType = 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';
export type TestStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type FeedbackStatus = 'pending' | 'in_progress' | 'completed' | 'replied' | 'rejected';
export type UserStatus = 'active' | 'inactive' | 'deleted';

// ===== 확장 타입들 (실제 사용되는 것들만) =====

// 중첩된 테스트 데이터 타입 (RPC 함수용)
export interface TestWithNestedDetails {
	test: Test;
	questions: QuestionWithChoices[];
	results: TestResult[];
}

export interface QuestionWithChoices {
	id: string;
	question_text: string;
	question_order: number;
	image_url: string | null;
	created_at: string;
	updated_at: string;
	choices: TestChoice[];
}

// User 활동 관련 타입들 (Admin에서 사용)
export interface UserWithActivity extends User {
	activity?: {
		total_responses: number;
		unique_tests: number;
		avg_completion_rate: number;
		avg_duration_sec: number;
		top_result_type: string | null;
		activity_score: number;
	};
}

// UserTestResponse를 확장한 UI용 타입
export interface UserActivityItem extends UserTestResponse {
	// UI에서 추가로 필요한 필드들
	test_title?: string;
	test_category?: number | string | null;
	test_emoji?: string;
	status?: 'completed' | 'in_progress';
	duration_sec?: number;
	result_type?: string;
}

// ===== 필터링 인터페이스들 (admin.ts에서 가져옴) =====
export type { UserFilters, FeedbackFilters, TestFilters, CategoryFilters } from './admin';

// ===== 통계 타입들 (admin.ts에서 가져옴) =====
export type { FeedbackStats, UserStats, TestStats, CategoryStats } from './admin';

// ===== Analytics 관련 타입들 =====
export interface AnalyticsFilters {
	search?: string;
	status?: 'all' | TestStatus;
	category?: 'all' | 'personality' | 'career' | 'relationship';
	timeRange?: 'today' | '7d' | '30d' | 'custom';
	// RPC 함수용 필터들
	test_id?: string;
	category_id?: string;
	device_type?: string;
	date_from?: string;
	date_to?: string;
	days_back?: number;
}

// RPC 함수 반환 타입들
export type TestDetailedStats = {
	test_id: string;
	title: string;
	total_responses: number;
	completed_responses: number;
	completion_rate: number;
	avg_completion_time: number;
	device_breakdown: {
		mobile: number;
		desktop: number;
		tablet: number;
	};
	daily_responses: Array<{
		date: string;
		count: number;
	}>;
	response_trends: {
		trend: string;
		growth_rate: number;
	};
};

export type DashboardOverviewStats = {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	totalResponses: number;
	totalCompletions: number;
	completionRate: number;
	avgCompletionTime: number;
	anomalies: number;
};

export type TestBasicStats = {
	test_id: string;
	title: string;
	status: string;
	total_responses: number;
	completion_rate: number;
	avg_completion_time: number;
};

export type UserResponseStats = {
	total_responses: number;
	completed_responses: number;
	completion_rate: number;
	avg_completion_time: number;
	unique_users: number;
};

// Marketing 관련 타입들 (RPC 함수가 없어서 수동 정의)
export type MarketingFunnel = {
	visits: number;
	test_starts: number;
	test_completes: number;
	sign_ups: number;
	start_rate: number;
	complete_rate: number;
	sign_up_rate: number;
};

export type ChannelPerformance = {
	source: string;
	medium: string;
	campaign: string;
	sessions: number;
	start_rate: number;
	complete_rate: number;
	sign_up_rate: number;
	avg_dwell_time: number;
	avg_question_depth: number;
	share_rate: number;
};

export type LandingPerformance = {
	url: string;
	sessions: number;
	bounce_rate: number;
	start_rate: number;
	complete_rate: number;
	avg_dwell_time: number;
	conversion_value: number;
};

export type PopularTest = {
	id: string;
	title: string;
	slug: string;
	thumbnail_url: string;
	type: string;
	response_count: number;
	start_count: number;
};

// 차트 데이터
export interface ResponseChartData {
	labels: string[];
	datasets: Array<{
		label: string;
		data: number[];
		backgroundColor: string;
		borderColor: string;
		fill: boolean;
	}>;
}

// ===== Admin API 응답 타입들 (admin.ts에서 가져옴) =====
export type { AdminFeedbackResponse, AdminUserResponse } from './admin';

// ===== UI 컴포넌트용 타입들 =====
export interface FunnelDataItem {
	questionId: string;
	question: string;
	reached: number;
	completed: number;
	dropoff: number;
	avgTime: number;
	order: number;
}

// ===== Service Layer Types =====
// Auth Service Types
export type AuthResponse = {
	data: {
		user: import('@supabase/supabase-js').User | null;
		session: import('@supabase/supabase-js').Session | null;
	} | null;
	error: null;
};

export type SignUpResponse = {
	data: {
		user: import('@supabase/supabase-js').User | null;
		session: import('@supabase/supabase-js').Session | null;
	} | null;
	error: null;
};

export type SignOutResponse = {
	error: null;
};

export type SessionResponse = {
	data: {
		session: import('@supabase/supabase-js').Session | null;
	};
	error: null;
};

// Balance Game Stats Types
export type ChoiceStats = {
	choiceId: string;
	choiceText: string;
	count: number;
	percentage: number;
};

export type QuestionStats = {
	questionId: string;
	questionText: string;
	choiceStats: ChoiceStats[];
	totalResponses: number;
};

export type PopularQuestion = {
	questionId: string;
	questionText: string;
	aChoiceText: string;
	bChoiceText: string;
	aPercentage: number;
	bPercentage: number;
	totalResponses: number;
};

export type BalanceGameStats = {
	testId: string;
	totalParticipants: number;
	questionStats: QuestionStats[];
	popularQuestions: PopularQuestion[];
	mostControversialQuestion: PopularQuestion | null;
};

export type OptimizedChoiceStats = {
	choiceId: string;
	choiceText: string;
	responseCount: number;
	percentage: number;
};

export type OptimizedQuestionStats = {
	questionId: string;
	questionText: string;
	choiceStats: OptimizedChoiceStats[];
	totalResponses: number;
};

// Category Service Types
export type CategoryWithTestCount = Category & { test_count: number };

export type CategoryPageData = {
	category: Category;
	allCategories: Category[];
	tests: Test[];
};

export type AllCategoriesData = {
	allCategories: Category[];
	allTests: Test[];
};

// Home Balance Game Types
export type HomeBalanceGameStats = {
	totalVotes: number;
	votesA: number;
	votesB: number;
	percentageA: number;
	percentageB: number;
};

export type VoteResult = {
	success: boolean;
	message: string;
	choice: 'A' | 'B';
	stats: HomeBalanceGameStats;
};

export type HomeBalanceGameResponse = Pick<
	HomeBalanceGame,
	| 'id'
	| 'title'
	| 'option_a_emoji'
	| 'option_a_label'
	| 'option_b_emoji'
	| 'option_b_label'
	| 'total_votes'
	| 'votes_a'
	| 'votes_b'
	| 'week_number'
> & {
	optionAEmoji: string;
	optionALabel: string;
	optionBEmoji: string;
	optionBLabel: string;
	totalVotes: number;
	votesA: number;
	votesB: number;
	weekNumber: number;
};

// Home Service Types
export type TestCard = Pick<
	Test,
	'id' | 'title' | 'description' | 'thumbnail_url' | 'slug' | 'category_ids' | 'type' | 'status'
> & {
	image: string;
	tags: string[];
	starts: number | null;
	completions: number | null;
};

export type HomePageData = {
	tests: TestCard[];
	categories: Category[];
	popularTests: TestCard[];
	recommendedTests: TestCard[];
	topByType: TestCard[];
};

// Popular Service Types
export type PopularPageData = {
	tests: Array<{
		id: string;
		title: string;
		description: string;
		thumbnail_url: string;
		thumbnailUrl: string;
		created_at: string;
		category_ids?: string[] | null;
		completions: number;
		starts: number;
	}>;
	categories: Category[];
};
