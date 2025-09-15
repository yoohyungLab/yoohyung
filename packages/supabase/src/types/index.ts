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

export type Profile = Tables<'profiles'>['Row'];
export type ProfileInsert = Tables<'profiles'>['Insert'];
export type ProfileUpdate = Tables<'profiles'>['Update'];

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
export type ProfileStatus = 'active' | 'inactive' | 'deleted';

// 확장 타입들 (Admin에서 사용)
export interface TestWithDetails extends Test {
    category?: Category;
    questions?: TestQuestion[];
    results?: TestResult[];
    questionCount?: number;
    resultCount?: number;
    responseCount?: number;
    completionRate?: number;
    // 기존 Admin 인터페이스 호환을 위한 추가 필드들
    isPublished?: boolean;
    thumbnailImage?: string;
    emoji?: string;
    scheduledAt?: string;
    updatedAt?: string;
}

export interface ProfileWithActivity extends Profile {
    activity?: {
        total_responses: number;
        last_activity: string;
        activity_score: number;
    };
}

// 필터링 인터페이스들
export interface ProfileFilters {
    search?: string;
    status?: 'all' | ProfileStatus;
    provider?: 'all' | 'email' | 'google' | 'kakao';
}

export interface FeedbackFilters {
    search?: string;
    status?: 'all' | FeedbackStatus;
    category?: 'all' | string;
}

export interface TestFilters {
    search?: string;
    status?: 'all' | TestStatus;
    type?: 'all' | TestType;
    category?: 'all' | string;
}

// 통계 인터페이스들
export interface ProfileStats {
    total: number;
    active: number;
    inactive: number;
    deleted: number;
    today: number;
    this_week: number;
    this_month: number;
    email_signups: number;
    google_signups: number;
    kakao_signups: number;
}

export interface FeedbackStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    replied: number;
    rejected: number;
    today: number;
    this_week: number;
    this_month: number;
}

export interface TestStats {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    responses: number;
    today: number;
    this_week: number;
    this_month: number;
}

// 폼 데이터 인터페이스들
export interface FeedbackFormData extends Omit<FeedbackInsert, 'id' | 'created_at' | 'updated_at' | 'status' | 'views'> {}

export interface TestFormData extends Omit<TestInsert, 'id' | 'created_at' | 'updated_at'> {
    questions?: TestQuestionFormData[];
    results?: TestResultFormData[];
}

export interface TestQuestionFormData extends Omit<TestQuestionInsert, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
    choices?: TestChoiceFormData[];
}

export interface TestChoiceFormData extends Omit<TestChoiceInsert, 'id' | 'question_id' | 'created_at'> {}

export interface TestResultFormData extends Omit<TestResultInsert, 'id' | 'test_id' | 'created_at' | 'updated_at'> {}
