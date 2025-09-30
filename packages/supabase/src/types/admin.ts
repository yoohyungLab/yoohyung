import type { Database } from './database';
import type {
	Feedback,
	User,
	Test,
	Category,
	TestType,
	TestStatus,
	FeedbackStatus,
	UserStatus,
	CategoryStatus,
} from './index';

// 기본 타입들 정의
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

// 통계 타입들
export interface FeedbackStats {
	total: number;
	pending: number;
	in_progress: number;
	completed: number;
	replied: number;
	rejected: number;
}

export interface UserStats {
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

export interface TestStats {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	archived: number;
}

export interface CategoryStats {
	total: number;
	active: number;
	inactive: number;
}

// 필터 타입들
export interface FeedbackFilters {
	search?: string;
	status?: 'all' | FeedbackStatus;
	category?: string;
	page?: number;
	pageSize?: number;
}

export interface UserFilters {
	search?: string;
	status?: 'all' | UserStatus;
	provider?: 'all' | 'email' | 'google' | 'kakao';
}

export interface TestFilters {
	search?: string;
	status?: 'all' | TestStatus;
	type?: 'all' | TestType;
	category?: 'all' | string;
}

export interface CategoryFilters {
	search?: string;
	status?: 'all' | CategoryStatus;
}

// Admin API 응답 타입들
export interface AdminFeedbackResponse {
	feedbacks: Feedback[];
	total: number;
	totalPages: number;
	currentPage: number;
}

export interface AdminUserResponse {
	users: User[];
	total: number;
	totalPages: number;
	currentPage: number;
}

// Admin에서만 사용하는 확장 타입들
export interface FeedbackWithStats extends Feedback {
	reply_count?: number;
	avg_rating?: number;
}
