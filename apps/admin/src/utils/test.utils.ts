import type { QuestionWithChoices, TestResult } from '@pickid/supabase';
import type { QuestionData, ResultData, ChoiceData } from '../types/test.types';
import { DEFAULT_BASIC_INFO } from '../constants/test';

export function calculateTestStats(questions: unknown[] = [], results: unknown[] = []) {
	return {
		totalQuestions: questions.length,
		totalResults: results.length,
	};
}

export function getCategoryNames(
	categoryIds: string[] | null | undefined,
	categories: Array<{ id: string; name: string }>
): string[] {
	if (!categoryIds || categoryIds.length === 0) {
		return [];
	}

	return categoryIds
		.map((id) => {
			const category = categories.find((cat) => cat.id === id);
			return category?.name || '';
		})
		.filter((name) => name !== '');
}

export const convertQuestionsData = (questionsData: QuestionWithChoices[]): QuestionData[] => {
	if (!questionsData || questionsData.length === 0) {
		return [
			{
				question_text: '',
				question_order: 0,
				image_url: null,
				question_type: 'multiple_choice',
				correct_answers: null,
				explanation: null,
				choices: [
					{
						choice_text: '',
						choice_order: 0,
						score: 0,
						is_correct: false,
						response_count: 0,
						last_updated: null,
						code: null,
					},
					{
						choice_text: '',
						choice_order: 1,
						score: 1,
						is_correct: false,
						response_count: 0,
						last_updated: null,
						code: null,
					},
				],
			},
		];
	}

	const converted = questionsData.map((q) => {
		return {
			id: q.id,
			question_text: q.question_text || '',
			question_order: q.question_order || 0,
			image_url: q.image_url,
			question_type: q.question_type || 'multiple_choice',
			correct_answers: q.correct_answers || null,
			explanation: q.explanation || null,
			choices:
				q.choices?.map((c) => {
					const choiceData: ChoiceData = {
						id: c.id,
						choice_text: c.choice_text || '',
						choice_order: c.choice_order || 0,
						score: c.score ?? 0,
						is_correct: c.is_correct ?? false,
						code: (c as { code?: string | null }).code ?? null,
						response_count: (c as { response_count?: number | null }).response_count ?? 0,
						last_updated: (c as { last_updated?: string | null }).last_updated ?? null,
					};
					return choiceData;
				}) || [],
		};
	});

	return converted;
};

export const convertResultsData = (resultsData: TestResult[]): ResultData[] => {
	if (!resultsData || resultsData.length === 0) {
		return [
			{
				result_name: '',
				result_order: 0,
				description: null,
				match_conditions: { type: 'score', min: 0, max: 30 },
				background_image_url: null,
				theme_color: '#3B82F6',
				features: {},
				target_gender: null,
			},
		];
	}

	return resultsData.map((r) => ({
		result_name: r.result_name || '',
		result_order: r.result_order || 0,
		description: r.description,
		match_conditions: r.match_conditions || {
			type: 'score' as const,
			min: 0,
			max: 30,
		},
		background_image_url: r.background_image_url,
		theme_color: r.theme_color || '#3B82F6',
		features: r.features || {},
		target_gender: r.target_gender || null,
	}));
};

export const generateShortCode = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

export const generateSlug = (title: string): string => {
	if (!title || title.trim() === '') {
		return `test-${Date.now()}-${generateShortCode().toLowerCase()}`;
	}

	return title
		.toLowerCase()
		.replace(/[^a-z0-9가-힣\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.substring(0, 50);
};

export const createBasicInfoWithShortCode = () => ({
	...DEFAULT_BASIC_INFO,
	short_code: generateShortCode(),
});






