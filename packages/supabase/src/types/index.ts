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

// ===== Enum 타입들 =====
export type TestType = Database['public']['Enums']['test_type'];
export type TestStatus = Database['public']['Enums']['test_status'];
export type FeedbackStatus = Database['public']['Enums']['feedback_status'];
export type UserStatus = Database['public']['Enums']['user_status'];
export type CategoryStatus = Database['public']['Enums']['category_status'];

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

// Marketing RPC 함수 반환 타입들
export type MarketingFunnel = Database['public']['Functions']['get_marketing_funnel']['Returns'];
export type ChannelPerformance = Database['public']['Functions']['get_channel_performance']['Returns'];
export type LandingPerformance = Database['public']['Functions']['get_landing_performance']['Returns'];
export type PopularTest = Database['public']['Functions']['get_popular_tests']['Returns'][0];

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
