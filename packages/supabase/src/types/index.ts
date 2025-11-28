export type { Database, Json } from './database';
import type { Database } from './database';

type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
type Enum<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Categories
export type Category = TableRow<'categories'>;
export type CategoryInsert = TableInsert<'categories'>;
export type CategoryUpdate = TableUpdate<'categories'>;

// Tests
export type Test = TableRow<'tests'>;
export type TestInsert = TableInsert<'tests'>;
export type TestUpdate = TableUpdate<'tests'>;

// Users
export type User = TableRow<'users'>;
export type UserInsert = TableInsert<'users'>;
export type UserUpdate = TableUpdate<'users'>;

// Feedbacks
export type Feedback = TableRow<'feedbacks'>;
export type FeedbackInsert = TableInsert<'feedbacks'>;
export type FeedbackUpdate = TableUpdate<'feedbacks'>;

// Admin Users
export type AdminUser = TableRow<'admin_users'>;
export type AdminUserInsert = TableInsert<'admin_users'>;
export type AdminUserUpdate = TableUpdate<'admin_users'>;

// Test Questions
export type TestQuestion = TableRow<'test_questions'>;
export type TestQuestionInsert = TableInsert<'test_questions'>;
export type TestQuestionUpdate = TableUpdate<'test_questions'>;

// Test Choices
export type TestChoice = TableRow<'test_choices'>;
export type TestChoiceInsert = TableInsert<'test_choices'>;
export type TestChoiceUpdate = TableUpdate<'test_choices'>;

// Test Results
export type TestResult = TableRow<'test_results'>;
export type TestResultInsert = TableInsert<'test_results'>;
export type TestResultUpdate = TableUpdate<'test_results'>;

// User Test Responses
export type UserTestResponse = TableRow<'user_test_responses'>;
export type UserTestResponseInsert = TableInsert<'user_test_responses'>;
export type UserTestResponseUpdate = TableUpdate<'user_test_responses'>;

// Home Balance Games
export type HomeBalanceGame = TableRow<'home_balance_games'>;
export type HomeBalanceGameInsert = TableInsert<'home_balance_games'>;
export type HomeBalanceGameUpdate = TableUpdate<'home_balance_games'>;

// Home Balance Votes
export type HomeBalanceVote = TableRow<'home_balance_votes'>;
export type HomeBalanceVoteInsert = TableInsert<'home_balance_votes'>;
export type HomeBalanceVoteUpdate = TableUpdate<'home_balance_votes'>;

// ===== Enum 타입들 =====
export type CategoryStatus = Enum<'category_status'>;
export type GenderType = Enum<'gender_type'>;

// DB에 Enum이 없어서 수동 정의
export type TestType = 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';
export type TestStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type FeedbackStatus = 'pending' | 'in_progress' | 'completed' | 'replied' | 'rejected';
export type UserStatus = 'active' | 'inactive' | 'deleted';

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
	question_type: string;
	correct_answers: string[] | null;
	explanation: string | null;
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

// Analytics Service 반환 타입들 (RPC 함수가 없어서 수동 정의)
export type GetTestBasicStatsReturn = {
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgTime: number;
	avgScore: number;
	deviceBreakdown: {
		mobile: number;
		desktop: number;
		tablet: number;
	};
};

export type GetTestAnalyticsDataReturn = {
	testId: string;
	testTitle: string;
	period: string;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgScore: number;
	avgTime: number;
	dailyData: unknown[];
	scoreDistribution: unknown[];
};

// Marketing 관련 타입들 (RPC 함수가 없어서 수동 정의)

export type PopularTest = {
	id: string;
	title: string;
	slug: string;
	thumbnail_url: string;
	type: string;
	response_count: number;
	start_count: number;
};

// UI 컴포넌트용 타입들
export interface FunnelDataItem {
	questionId: string;
	question: string;
	reached: number;
	completed: number;
	dropoff: number;
	avgTime: number;
	order: number;
}

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
