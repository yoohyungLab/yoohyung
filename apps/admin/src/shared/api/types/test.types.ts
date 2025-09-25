import type { Test, TestStatus, TestType } from '@repo/supabase';

export interface TestFilters {
	search?: string;
	status?: 'all' | TestStatus;
	type?: 'all' | TestType;
	category?: 'all' | string;
}

export interface TestStats {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	archived: number;
}

export interface TestWithDetails extends Test {
	category?: { name: string; is_active: boolean };
	questions?: Array<{
		id: string;
		question_text: string;
		question_order: number;
		image_url: string | null;
		created_at: string;
		updated_at: string;
		choices: Array<{
			id: string;
			choice_text: string;
			choice_order: number;
			is_correct: boolean | null;
			score: number | null;
		}>;
	}>;
	results?: Array<{
		id: string;
		result_name: string;
		result_order: number;
		description: string | null;
		background_image_url: string | null;
		theme_color: string | null;
		features: any;
		match_conditions: any;
	}>;
	question_count?: number;
	result_count?: number;
	completion_rate?: number;
	response_count?: number;
	isPublished?: boolean;
}
