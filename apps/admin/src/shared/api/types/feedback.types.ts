import type { Feedback } from '@repo/supabase';

export interface FeedbackFilters {
	search?: string;
	status?: 'all' | 'pending' | 'in_progress' | 'completed' | 'replied' | 'rejected';
	category?: string;
	page?: number;
	pageSize?: number;
}

export interface FeedbackStats {
	total: number;
	pending: number;
	in_progress: number;
	completed: number;
	replied: number;
	rejected: number;
}

export interface FeedbackWithStats extends Feedback {
	reply_count?: number;
	avg_rating?: number;
}

export interface AdminFeedbackResponse {
	feedbacks: Feedback[];
	total: number;
	totalPages: number;
	currentPage: number;
}
