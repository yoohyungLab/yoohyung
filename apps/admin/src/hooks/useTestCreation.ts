import { useState, useCallback } from 'react';
import { testService } from '@/shared/api';
import type { TestQuestion, TestChoice, TestResult, Database } from '@pickid/supabase';
import type { ResultVariantRules, BasicInfo } from '@/components/test/test-create/types';

// ============================================================================
// 타입 정의
// ============================================================================

type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

interface QuestionData extends Omit<TestQuestion, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	choices: Omit<TestChoice, 'id' | 'question_id' | 'created_at'>[];
}

interface ResultData extends Omit<TestResult, 'id' | 'test_id' | 'created_at' | 'updated_at'> {
	match_conditions: { type: 'score'; min: number; max: number };
	target_gender: string | null;
}

// ============================================================================
// 상수
// ============================================================================

const DEFAULT_BASIC_INFO: BasicInfo = {
	title: '',
	description: '',
	slug: '',
	thumbnail_url: '',
	category_ids: [],
	short_code: '',
	intro_text: '',
	status: 'draft',
	estimated_time: 5,
	scheduled_at: null,
	max_score: 100,
	type: 'psychology',
	published_at: null,
	requires_gender: false,
	features: {
		scoring: {
			mode: 'score_range',
			max_score: 100,
			base_types: [],
		},
	},
};

const DEFAULT_QUESTION: QuestionData = {
	question_text: '',
	question_order: 0,
	image_url: null,
	choices: [
		{ choice_text: '', choice_order: 0, score: 1, is_correct: false },
		{ choice_text: '', choice_order: 1, score: 2, is_correct: false },
	],
};

const DEFAULT_RESULT: ResultData = {
	result_name: '',
	result_order: 0,
	description: null,
	match_conditions: { type: 'score', min: 0, max: 30 },
	background_image_url: null,
	theme_color: '#3B82F6',
	features: {},
	target_gender: null,
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

const generateShortCode = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

const createBasicInfoWithShortCode = (): BasicInfo => ({
	...DEFAULT_BASIC_INFO,
	short_code: generateShortCode(),
});

// ============================================================================
// 테스트 생성 훅
// ============================================================================

export const useTestCreation = () => {
	const [step, setStep] = useState(1);
	const [type, setType] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// 상태 관리
	const [basicInfo, setBasicInfo] = useState<BasicInfo>(createBasicInfoWithShortCode());
	const [questions, setQuestions] = useState<QuestionData[]>([DEFAULT_QUESTION]);
	const [results, setResults] = useState<ResultData[]>([DEFAULT_RESULT]);

	// ============================================================================
	// 스텝 관리
	// ============================================================================

	const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, 5)), []);
	const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

	// ============================================================================
	// 기본 정보 관리
	// ============================================================================

	const updateBasicInfo = useCallback((updates: Partial<BasicInfo>) => {
		setBasicInfo((prev) => ({ ...prev, ...updates }));
	}, []);

	const updateResultVariantRules = useCallback((rules: ResultVariantRules) => {
		setBasicInfo((prev) => ({
			...prev,
			features: {
				...prev.features,
				result_variant_rules: rules,
			},
		}));
	}, []);

	// ============================================================================
	// 질문 관리
	// ============================================================================

	const addQuestion = useCallback(() => {
		setQuestions((prev) => [
			...prev,
			{
				...DEFAULT_QUESTION,
				question_order: prev.length,
			},
		]);
	}, []);

	const removeQuestion = useCallback((index: number) => {
		setQuestions((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateQuestion = useCallback((index: number, updates: Partial<QuestionData>) => {
		setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
	}, []);

	// ============================================================================
	// 선택지 관리
	// ============================================================================

	const addChoice = useCallback((questionIndex: number) => {
		setQuestions((prev) =>
			prev.map((q, i) =>
				i === questionIndex
					? {
							...q,
							choices: [
								...q.choices,
								{
									choice_text: '',
									choice_order: q.choices.length,
									score: 1,
									is_correct: false,
								},
							],
					  }
					: q
			)
		);
	}, []);

	const removeChoice = useCallback((questionIndex: number, choiceIndex: number) => {
		setQuestions((prev) =>
			prev.map((q, i) => (i === questionIndex ? { ...q, choices: q.choices.filter((_, ci) => ci !== choiceIndex) } : q))
		);
	}, []);

	const updateChoice = useCallback(
		(questionIndex: number, choiceIndex: number, updates: Partial<QuestionData['choices'][0]>) => {
			setQuestions((prev) =>
				prev.map((q, i) =>
					i === questionIndex
						? {
								...q,
								choices: q.choices.map((choice, ci) => (ci === choiceIndex ? { ...choice, ...updates } : choice)),
						  }
						: q
				)
			);
		},
		[]
	);

	// ============================================================================
	// 결과 관리
	// ============================================================================

	const addResult = useCallback(() => {
		setResults((prev) => [
			...prev,
			{
				...DEFAULT_RESULT,
				result_order: prev.length,
			},
		]);
	}, []);

	const removeResult = useCallback((index: number) => {
		setResults((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateResult = useCallback((index: number, updates: Partial<ResultData>) => {
		setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
	}, []);

	// ============================================================================
	// 테스트 저장
	// ============================================================================

	const saveTest = useCallback(
		async (testId?: string) => {
			try {
				setIsLoading(true);

				// short_code 생성
				let finalShortCode = basicInfo.short_code;
				if (!finalShortCode || finalShortCode.trim() === '') {
					finalShortCode = generateShortCode();
					updateBasicInfo({ short_code: finalShortCode });
				}

				// 테스트 데이터 준비
				const testData: TestInsert = {
					...basicInfo,
					short_code: finalShortCode,
					id: testId,
					type: type || 'psychology',
					status: basicInfo.status || 'published',
					published_at: basicInfo.status === 'published' ? new Date().toISOString() : null,
					category_ids: basicInfo.category_ids || [],
					requires_gender: Boolean(basicInfo.requires_gender), // 명시적으로 boolean 변환
					estimated_time: basicInfo.estimated_time || 5,
					max_score: basicInfo.max_score || 100,
					intro_text: basicInfo.intro_text || null,
					thumbnail_url: basicInfo.thumbnail_url || null,
					description: basicInfo.description || null,
					slug: basicInfo.slug || '',
				} as TestInsert;

				// 질문 데이터 준비
				const questionsData: TestQuestionInsert[] = questions.map((q, index) => ({
					question_text: q.question_text,
					question_order: index,
					image_url: q.image_url,
					choices: q.choices.map((c, choiceIndex) => ({
						choice_text: c.choice_text,
						choice_order: choiceIndex,
						score: c.score,
						is_correct: c.is_correct,
					})),
				}));

				// 결과 데이터 준비
				const resultsData: TestResultInsert[] = results.map((r, index) => ({
					result_name: r.result_name,
					description: r.description,
					result_order: index,
					background_image_url: r.background_image_url,
					theme_color: r.theme_color,
					match_conditions: r.match_conditions,
					features: r.features,
					target_gender: r.target_gender || null,
				}));

				const result = await testService.saveCompleteTest(testData, questionsData, resultsData);
				return result;
			} catch (error) {
				console.error('테스트 저장 실패:', error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[basicInfo, type, questions, results, updateBasicInfo]
	);

	// ============================================================================
	// 폼 초기화
	// ============================================================================

	const resetForm = useCallback(() => {
		setStep(1);
		setType(null);
		setBasicInfo(createBasicInfoWithShortCode());
		setQuestions([DEFAULT_QUESTION]);
		setResults([DEFAULT_RESULT]);
	}, []);

	// ============================================================================
	// 반환값
	// ============================================================================

	return {
		// 상태
		step,
		type,
		basicInfo,
		questions,
		results,
		isLoading,

		// 스텝 관리
		setStep,
		setType,
		nextStep,
		prevStep,

		// 기본 정보 관리
		updateBasicInfo,
		updateResultVariantRules,

		// 질문 관리
		setQuestions,
		addQuestion,
		removeQuestion,
		updateQuestion,

		// 선택지 관리
		addChoice,
		removeChoice,
		updateChoice,

		// 결과 관리
		setResults,
		addResult,
		removeResult,
		updateResult,

		// 저장 및 초기화
		saveTest,
		resetForm,

		// 유틸리티
		generateShortCode,
	};
};
