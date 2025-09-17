import type {
    Feedback,
    FeedbackFilters as BaseFeedbackFilters,
    FeedbackStats,
    Profile,
    ProfileFilters as BaseProfileFilters,
    ProfileStats,
    Test,
    TestFilters as BaseTestFilters,
    TestStats,
    Category,
    CategoryFilters as BaseCategoryFilters,
} from './index';

// Admin API 응답 타입들
export interface AdminFeedbackResponse {
    feedbacks: Feedback[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface AdminProfileResponse {
    profiles: Profile[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// Admin에서만 사용하는 확장 타입들
export interface FeedbackWithStats extends Feedback {
    reply_count?: number;
    avg_rating?: number;
}

// Re-export common types for convenience
export type { Feedback, FeedbackStats, Profile, ProfileStats, Test, TestStats, Category } from './index';



