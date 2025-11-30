import type { FeedbackStatus } from '@pickid/supabase';

export interface FeedbackFilters {
	search: string;
	status: 'all' | FeedbackStatus;
	category: 'all' | string;
}

export interface FeedbackStats {
	total: number;
	pending: number;
	in_progress: number;
	completed: number;
	replied: number;
	rejected: number;
}
