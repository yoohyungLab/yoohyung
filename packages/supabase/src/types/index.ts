// Supabase 생성 타입 import
export type { Database, Json } from './database';
import type { Database } from './database';

// Admin 전용 타입들
export * from './admin';

// Helper type for table operations
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

// Export Tables type
export type { Tables };

// ===== 기본 테이블 타입들 (Supabase에서 자동 생성) =====
export type Category = Tables<'categories'>['Row'];
export type CategoryInsert = Tables<'categories'>['Insert'];
export type CategoryUpdate = Tables<'categories'>['Update'];

// 뷰에서 사용할 가공된 카테고리 타입
export interface ProcessedCategory {
	id: string;
	label: string;
	icon: string;
	color: string;
	count: number;
	slug: string;
}

export type Test = Tables<'tests'>['Row'];
export type TestInsert = Tables<'tests'>['Insert'];
export type TestUpdate = Tables<'tests'>['Update'];

export type User = Tables<'users'>['Row'];
export type UserInsert = Tables<'users'>['Insert'];
export type UserUpdate = Tables<'users'>['Update'];

export type Feedback = Tables<'feedbacks'>['Row'];
export type FeedbackInsert = Tables<'feedbacks'>['Insert'];
export type FeedbackUpdate = Tables<'feedbacks'>['Update'];

export type AdminUser = Tables<'admin_users'>['Row'];
export type AdminUserInsert = Tables<'admin_users'>['Insert'];
export type AdminUserUpdate = Tables<'admin_users'>['Update'];

export type TestQuestion = Tables<'test_questions'>['Row'];
export type TestQuestionInsert = Tables<'test_questions'>['Insert'];
export type TestQuestionUpdate = Tables<'test_questions'>['Update'];

export type TestChoice = Tables<'test_choices'>['Row'];
export type TestChoiceInsert = Tables<'test_choices'>['Insert'];
export type TestChoiceUpdate = Tables<'test_choices'>['Update'];

export type TestResult = Tables<'test_results'>['Row'];
export type TestResultInsert = Tables<'test_results'>['Insert'];
export type TestResultUpdate = Tables<'test_results'>['Update'];

export type UserTestResponse = Tables<'user_test_responses'>['Row'];
export type UserTestResponseInsert = Tables<'user_test_responses'>['Insert'];
export type UserTestResponseUpdate = Tables<'user_test_responses'>['Update'];

export type Favorite = Tables<'favorites'>['Row'];
export type FavoriteInsert = Tables<'favorites'>['Insert'];
export type FavoriteUpdate = Tables<'favorites'>['Update'];

export type Upload = Tables<'uploads'>['Row'];
export type UploadInsert = Tables<'uploads'>['Insert'];
export type UploadUpdate = Tables<'uploads'>['Update'];

// ===== Enum 타입들 (Supabase에서 가져온 타입들) =====
export type TestType = Database['public']['Enums']['test_type'];
export type TestStatus = Database['public']['Enums']['test_status'];
export type FeedbackStatus = Database['public']['Enums']['feedback_status'];
export type UserStatus = Database['public']['Enums']['user_status'];
export type CategoryStatus = Database['public']['Enums']['category_status'];

// ===== 확장 타입들 (Admin에서 사용) =====

// Test 확장 타입들
export interface TestWithDetails extends Test {
	category?: Category;
	questions?: TestQuestion[];
	results?: TestResult[];
	question_count?: number;
	result_count?: number;
	completion_rate?: number;
	// Admin UI 호환 필드들 (실제 DB 컬럼이 아닌 UI용)
	category_name?: string;
	emoji?: string;
	thumbnailImage?: string;
	startMessage?: string;
	scheduledAt?: string;
	responseCount?: number;
	completionRate?: number;
	estimatedTime?: number;
	createdBy?: string;
	isPublished?: boolean;
	// UI 호환용 필드들 (실제 DB에는 없음)
	category_string?: string;
	share_count?: number;
	completion_count?: number;
}

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

export interface UserActivityStats {
	total_responses: number;
	unique_tests: number;
	avg_completion_rate: number;
	avg_duration_sec: number;
	top_result_type: string | null;
	activity_score: number;
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

// Feedback 확장 타입들
export interface FeedbackWithStats extends Feedback {
	reply_count?: number;
	avg_rating?: number;
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

// AnalyticsStats는 DashboardOverviewStats와 동일하므로 별도 정의 불필요
export type AnalyticsStats = DashboardOverviewStats;

// ===== RPC 함수 반환 타입들 (직접 정의) =====
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

export type TestAnalyticsData = {
	test_id: string;
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

export type UserResponseStats = {
	total_responses: number;
	completed_responses: number;
	completion_rate: number;
	avg_completion_time: number;
	unique_users: number;
};

export type ExportData = {
	response_id: string;
	test_id: string;
	session_id: string;
	created_at: string;
	completed_at: string | null;
	completion_time_seconds: number | null;
	device_type: string | null;
	user_agent: string | null;
};

// Marketing RPC 함수 반환 타입들
export type MarketingFunnel = Database['public']['Functions']['get_marketing_funnel']['Returns'];
export type ChannelPerformance = Database['public']['Functions']['get_channel_performance']['Returns'];
export type LandingPerformance = Database['public']['Functions']['get_landing_performance']['Returns'];
export type CohortAnalysis = Database['public']['Functions']['get_cohort_analysis']['Returns'];
export type MarketingInsights = Database['public']['Functions']['get_marketing_insights']['Returns'];
export type ExportMarketingData = Database['public']['Functions']['export_marketing_data']['Returns'];

// Popular Tests RPC 함수 반환 타입
export type PopularTest = Database['public']['Functions']['get_popular_tests']['Returns'][0];

// Tests List RPC 함수 반환 타입들
export type TestListItem = Database['public']['Functions']['get_tests_list']['Returns'][0];
export type TestWithCategoriesItem = Database['public']['Functions']['get_tests_list_with_categories']['Returns'][0];

// 차트 데이터는 클라이언트에서 변환하므로 별도 타입 정의
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

// ===== Export 타입들 =====
export interface ExportFilters {
	test_id?: string;
	date_from?: string;
	date_to?: string;
}

// ===== 폼 데이터 인터페이스들 =====
export interface FeedbackFormData
	extends Omit<FeedbackInsert, 'id' | 'created_at' | 'updated_at' | 'status' | 'views'> {}

export interface TestFormData extends Omit<TestInsert, 'id' | 'created_at' | 'updated_at'> {
	questions?: TestQuestionFormData[];
	results?: TestResultFormData[];
}

export interface TestQuestionFormData extends Omit<TestQuestionInsert, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	choices?: TestChoiceFormData[];
}

export interface TestChoiceFormData extends Omit<TestChoiceInsert, 'id' | 'question_id' | 'created_at'> {}

export interface TestResultFormData extends Omit<TestResultInsert, 'id' | 'test_id' | 'created_at' | 'updated_at'> {}

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
