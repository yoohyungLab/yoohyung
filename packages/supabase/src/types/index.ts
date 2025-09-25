// Supabase 생성 타입 import
export type { Database, Json } from './database';
import type { Database } from './database';

// Admin 전용 타입들
export * from './admin';

// Helper type for table operations
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

// Export Tables type
export type { Tables };

// 편의 타입 정의
export type Category = Tables<'categories'>['Row'];
export type CategoryInsert = Tables<'categories'>['Insert'];
export type CategoryUpdate = Tables<'categories'>['Update'];

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

// Enum 타입들 (실제 데이터에서 사용되는 값들)
export type TestType = 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';
export type TestStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type FeedbackStatus = 'pending' | 'in_progress' | 'completed' | 'replied' | 'rejected';
export type UserStatus = 'active' | 'inactive' | 'deleted';

// 확장 타입들 (Admin에서 사용)
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
	createdAt: string;
	updatedAt: string;
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

// TestListItem은 TestWithDetails와 중복이므로 제거

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

// ProfileActivity는 ProfileActivityItem과 중복이므로 제거

export interface UserActivityStats {
	total_responses: number;
	unique_tests: number;
	avg_completion_rate: number;
	avg_duration_sec: number;
	top_result_type: string | null;
	activity_score: number;
}

// 실제 user_test_responses 테이블 기반으로 수정
export interface UserActivityItem {
	id: string;
	user_id: string | null;
	test_id: string | null;
	result_id: string | null;
	responses: Database['public']['Tables']['user_test_responses']['Row']['responses'];
	score: number | null;
	started_at: string | null;
	completed_at: string | null;
	created_at: string | null;
	created_date: string | null;
	// UI에서 추가로 필요한 필드들
	test_title?: string;
	test_category?: number | string | null;
	test_emoji?: string;
	status?: 'completed' | 'in_progress';
	duration_sec?: number;
	result_type?: string;
}

// PartialTestForActivity는 내부적으로만 사용되므로 제거

// 필터링 인터페이스들
export interface UserFilters {
	search?: string;
	status?: 'all' | UserStatus;
	provider?: 'all' | 'email' | 'google' | 'kakao';
}

export interface FeedbackFilters {
	search?: string;
	status?: 'all' | FeedbackStatus;
	category?: string;
	page?: number;
	pageSize?: number;
}

export interface TestFilters {
	search?: string;
	status?: 'all' | TestStatus;
	type?: 'all' | TestType;
	category?: 'all' | string;
}

export interface CategoryFilters {
	search?: string;
	status?: 'all' | 'active' | 'inactive';
}

// 통계는 쿼리로 동적으로 가져옴 (RPC 함수 없음)

// 폼 데이터 인터페이스들
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
