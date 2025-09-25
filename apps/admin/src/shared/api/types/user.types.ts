import type { User, UserWithActivity, UserActivityItem, Feedback } from '@repo/supabase';

// Re-export types for convenience
export type { UserWithActivity, UserActivityItem, Feedback };

export interface UserFilters {
	search?: string;
	status?: 'all' | 'active' | 'inactive' | 'deleted';
	provider?: 'all' | 'email' | 'google' | 'kakao';
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

export interface UserActivityStats {
	total_responses: number;
	unique_tests: number;
	avg_completion_rate: number;
	avg_duration_sec: number;
	top_result_type: string | null;
	activity_score: number;
}
