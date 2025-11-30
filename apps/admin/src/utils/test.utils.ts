import type { QuestionWithChoices, TestResult, TestType, TestStatus } from '@pickid/supabase';
import type {
	TestFormQuestion as QuestionData,
	TestFormChoice as ChoiceData,
	TestFormResult as ResultData,
} from '../types/test-form';
import { DEFAULT_BASIC_INFO } from '../constants/test';

// 테스트 타입/상태 정보

export const TEST_TYPE_CONFIG = {
	psychology: {
		name: '심리형',
		description: 'MBTI, 색상/동물 등 성향 분석',
	},
	balance: {
		name: '밸런스형',
		description: '2지선다/다지선다 선택',
	},
	character: {
		name: '캐릭터 매칭형',
		description: '특정 IP/캐릭터와 매칭',
	},
	quiz: {
		name: '퀴즈형',
		description: '지식/정답 기반',
	},
	meme: {
		name: '밈형',
		description: '밈/이모지 매칭',
	},
	lifestyle: {
		name: '라이프스타일형',
		description: '취향 기반',
	},
} as const;

export const TEST_STATUS_CONFIG = {
	draft: {
		name: '초안',
	},
	published: {
		name: '공개',
	},
	scheduled: {
		name: '예약',
	},
	archived: {
		name: '보관',
	},
} as const;

export function getTestTypeInfo(type: TestType | string) {
	return (
		TEST_TYPE_CONFIG[type as TestType] || {
			name: '알 수 없음',
			description: '알 수 없는 테스트 유형',
		}
	);
}

export function getTestStatusInfo(status: TestStatus | string) {
	return (
		TEST_STATUS_CONFIG[status as TestStatus] || {
			name: '알 수 없음',
		}
	);
}

// 테스트 통계 계산
export function calculateTestStats(questions: unknown[] = [], results: unknown[] = []) {
	return {
		totalQuestions: questions.length,
		totalResults: results.length,
	};
}

// 카테고리 ID 배열을 카테고리 이름 배열로 변환
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

// 데이터 변환 유틸리티

/**
 * 질문 데이터를 UI용으로 변환
 */
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

/**
 * 결과 데이터를 UI용으로 변환
 */
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

	return resultsData.map((r) => {
		let matchConditions: ResultData['match_conditions'] = null;

		if (r.match_conditions) {
			// match_conditions가 객체인 경우 타입 확인
			if (typeof r.match_conditions === 'object' && !Array.isArray(r.match_conditions)) {
				if ('type' in r.match_conditions && r.match_conditions.type === 'score') {
					matchConditions = {
						type: 'score',
						min:
							typeof (r.match_conditions as { min?: number }).min === 'number'
								? (r.match_conditions as { min: number }).min
								: 0,
						max:
							typeof (r.match_conditions as { max?: number }).max === 'number'
								? (r.match_conditions as { max: number }).max
								: 30,
					};
				} else if ('type' in r.match_conditions && r.match_conditions.type === 'code') {
					matchConditions = {
						type: 'code',
						codes: Array.isArray((r.match_conditions as { codes?: unknown }).codes)
							? (r.match_conditions as { codes: string[] }).codes
							: [],
					};
				}
			}
		}

		if (!matchConditions) {
			matchConditions = {
				type: 'score' as const,
				min: 0,
				max: 30,
			};
		}

		return {
			result_name: r.result_name || '',
			result_order: r.result_order || 0,
			description: r.description,
			match_conditions: matchConditions,
			background_image_url: r.background_image_url,
			theme_color: r.theme_color || '#3B82F6',
			features: r.features || {},
			target_gender: r.target_gender || null,
		};
	});
};

// 코드 생성 유틸리티

/**
 * 짧은 코드 생성
 */
export const generateShortCode = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

/**
 * URL 슬러그 생성 (제목 기반)
 */
export const generateSlug = (title: string): string => {
	if (!title || title.trim() === '') {
		// 제목이 없으면 랜덤 슬러그 생성
		return `test-${Date.now()}-${generateShortCode().toLowerCase()}`;
	}

	// 한글, 영문, 숫자, 하이픈만 허용하고 공백은 하이픈으로 변환
	return title
		.toLowerCase()
		.replace(/[^a-z0-9가-힣\s-]/g, '') // 특수문자 제거
		.replace(/\s+/g, '-') // 공백을 하이픈으로 변환
		.replace(/-+/g, '-') // 연속된 하이픈을 하나로 변환
		.replace(/^-|-$/g, '') // 앞뒤 하이픈 제거
		.substring(0, 50); // 최대 50자로 제한
};

/**
 * 기본 정보와 함께 짧은 코드 생성
 */
export const createBasicInfoWithShortCode = () => ({
	...DEFAULT_BASIC_INFO,
	short_code: generateShortCode(),
});

// 데이터 검증 유틸리티

/**
 * 질문 데이터 유효성 검사
 */
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

/**
 * 결과 데이터 유효성 검사
 */
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

/**
 * 기본 정보 유효성 검사
 */
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
