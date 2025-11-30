import type { QuestionWithChoices, TestResult, TestStatus, TestType } from '@pickid/supabase';
import type { QuestionData, ResultData, ChoiceData } from '../types/test.types';
import { DEFAULT_BASIC_INFO } from '../constants/test';

const TEST_TYPE_CONFIG = {
	psychology: { name: '심리형', description: 'MBTI, 색상/동물 등 성향 분석' },
	balance: { name: '밸런스형', description: '2지선다/다지선다 선택' },
	character: { name: '캐릭터 매칭형', description: '특정 IP/캐릭터와 매칭' },
	quiz: { name: '퀴즈형', description: '지식/정답 기반' },
	meme: { name: '밈형', description: '밈/이모지 매칭' },
	lifestyle: { name: '라이프스타일형', description: '취향 기반' },
} as const;

const TEST_STATUS_CONFIG = {
	draft: { name: '초안' },
	published: { name: '공개' },
	scheduled: { name: '예약' },
	archived: { name: '보관' },
} as const;

export function getTestTypeInfo(type: TestType | string) {
	return TEST_TYPE_CONFIG[type as TestType] || { name: '알 수 없음', description: '알 수 없는 테스트 유형' };
}

export function getTestStatusInfo(status: TestStatus | string) {
	return TEST_STATUS_CONFIG[status as TestStatus] || { name: '알 수 없음' };
}

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

export const validateQuestionData = (question: QuestionData): string[] => {
	const errors: string[] = [];

	if (!question.question_text.trim()) {
		errors.push('질문 내용을 입력해주세요.');
	}

	if (question.choices.length < 2) {
		errors.push('최소 2개의 선택지가 필요합니다.');
	}

	const emptyChoices = question.choices.filter((choice) => !choice.choice_text.trim());
	if (emptyChoices.length > 0) {
		errors.push('모든 선택지에 내용을 입력해주세요.');
	}

	return errors;
};

export const validateResultData = (result: ResultData): string[] => {
	const errors: string[] = [];

	if (!result.result_name.trim()) {
		errors.push('결과 이름을 입력해주세요.');
	}

	if (!result.match_conditions || typeof result.match_conditions !== 'object') {
		errors.push('매칭 조건을 설정해주세요.');
	}

	return errors;
};

export const validateBasicInfo = (basicInfo: Record<string, unknown>): string[] => {
	const errors: string[] = [];

	if (!String(basicInfo.title || '').trim()) {
		errors.push('테스트 제목을 입력해주세요.');
	}

	if (!String(basicInfo.slug || '').trim()) {
		errors.push('URL 슬러그를 입력해주세요.');
	}

	if (Number(basicInfo.estimated_time || 0) < 1) {
		errors.push('예상 소요시간은 1분 이상이어야 합니다.');
	}

	return errors;
};
