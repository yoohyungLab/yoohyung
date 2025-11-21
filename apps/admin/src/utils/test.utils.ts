import type { QuestionWithChoices, ResultWithDetails, QuestionData, ResultData, ChoiceData } from '../types/test.types';
import { DEFAULT_BASIC_INFO } from '../constants/test';

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
export const convertResultsData = (resultsData: ResultWithDetails[]): ResultData[] => {
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
 * 고유한 슬러그 생성 (중복 방지)
 */
export const generateUniqueSlug = async (title: string, existingSlugs: string[] = []): Promise<string> => {
	const baseSlug = generateSlug(title);
	let slug = baseSlug;
	let counter = 1;

	// 중복되지 않는 슬러그가 될 때까지 반복
	while (existingSlugs.includes(slug)) {
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
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

// 데이터 포맷팅 유틸리티

/**
 * 점수 범위 포맷팅
 */
export const formatScoreRange = (min: number, max: number): string => {
	return `${min}점 ~ ${max}점`;
};

/**
 * 카테고리 이름 가져오기
 */
export const getCategoryNames = (
	categoryIds: string[] | null,
	categories: Array<{ id: string; name: string }>
): string[] => {
	if (!categoryIds || categoryIds.length === 0) return ['미분류'];
	return categoryIds.map((id) => {
		const category = categories.find((cat) => cat.id === id);
		return category ? category.name : '알 수 없음';
	});
};

/**
 * 테스트 통계 계산
 */
export const calculateTestStats = (questions: QuestionData[], results: ResultData[]) => {
	return {
		totalQuestions: questions?.length || 0,
		totalResults: results?.length || 0,
		avgChoicesPerQuestion: questions?.length
			? Math.round((questions.reduce((sum, q) => sum + (q.choices?.length || 0), 0) / questions.length) * 10) / 10
			: 0,
		questionsWithImages: questions?.filter((q) => q.image_url).length || 0,
		resultsWithTheme: results?.filter((r) => r.theme_color).length || 0,
		resultsWithImages: results?.filter((r) => r.background_image_url).length || 0,
		completionRate: 0,
	};
};

// URL 및 링크 유틸리티

/**
 * 테스트 공유 URL 생성
 */
export const generateTestShareUrl = (testId: string, baseUrl: string = window.location.origin): string => {
	return `${baseUrl}/tests/${testId}`;
};

/**
 * 테스트 편집 URL 생성
 */
export const generateTestEditUrl = (testId: string): string => {
	return `/tests/${testId}/edit`;
};

// 로컬 스토리지 유틸리티

/**
 * 테스트 초안 저장
 */
export const saveTestDraft = (testId: string, data: unknown): void => {
	try {
		localStorage.setItem(`test_draft_${testId}`, JSON.stringify(data));
	} catch (error) {
		console.warn('테스트 초안 저장 실패:', error);
	}
};

/**
 * 테스트 초안 불러오기
 */
export const loadTestDraft = (testId: string): unknown | null => {
	try {
		const data = localStorage.getItem(`test_draft_${testId}`);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.warn('테스트 초안 불러오기 실패:', error);
		return null;
	}
};

/**
 * 테스트 초안 삭제
 */
export const clearTestDraft = (testId: string): void => {
	try {
		localStorage.removeItem(`test_draft_${testId}`);
	} catch (error) {
		console.warn('테스트 초안 삭제 실패:', error);
	}
};
