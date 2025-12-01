import type { Test, TestStatus } from '@pickid/supabase';

// TODO: 필터 supabase에서 가져오기
export interface TestFilters {
	search: string;
	status: 'all' | TestStatus;
}

export interface TestStats {
	total: number;
	published: number;
	draft: number;
	scheduled: number;
	archived: number;
	responses: number;
}

export type TabType = 'basic' | 'questions' | 'results' | 'stats' | 'preview';

export interface TestDetailModalProps {
	test: Test;
	onClose: () => void;
	onTogglePublish: (testId: string, currentStatus: boolean) => void;
	onDelete: (testId: string) => void;
}

export interface FeatureInput {
	key: string;
	value: string;
}

export interface ChoiceData {
	id: string;
	choice_text: string;
	choice_order: number;
	score: number;
	is_correct: boolean;
	code: string | null;
	response_count: number;
	last_updated: string | null;
}

export interface QuestionData {
	id?: string;
	question_text: string;
	question_order: number;
	image_url: string | null;
	question_type: string;
	correct_answers: string[] | null;
	explanation: string | null;
	choices: ChoiceData[];
}

export interface ResultData {
	result_name: string;
	result_order: number;
	description: string | null;
	match_conditions: {
		type: string;
		min: number;
		max: number;
	};
	background_image_url: string | null;
	theme_color: string;
	features: Record<string, unknown>;
	target_gender: string | null;
}
