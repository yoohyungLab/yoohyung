import { useState, useCallback } from 'react';
import { testService } from '@/shared/api';
import type { Database } from '@pickid/supabase';
import type {
	BasicInfo,
	QuestionData,
	ResultData,
	ResultVariantRules,
	UseTestCreationReturn,
} from '../types/test.types';
import { DEFAULT_QUESTION, DEFAULT_RESULT } from '../constants/test.constants';
import { generateShortCode, generateSlug, createBasicInfoWithShortCode } from '../utils/test.utils';

// 타입 별칭 정의
type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

// ============================================================================
// 테스트 생성 훅
// ============================================================================

export const useTestCreation = (): UseTestCreationReturn => {
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
									score: 0,
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

				// slug 생성 (제목 기반)
				let finalSlug = basicInfo.slug;
				if (!finalSlug || finalSlug.trim() === '') {
					finalSlug = generateSlug(basicInfo.title || '');
					updateBasicInfo({ slug: finalSlug });
				}

				// 테스트 데이터 준비
				const finalStatus = basicInfo.status || 'published';
				const testData: TestInsert = {
					...basicInfo,
					short_code: finalShortCode,
					slug: finalSlug,
					id: testId,
					type: type || 'psychology',
					status: finalStatus,
					published_at: finalStatus === 'published' ? new Date().toISOString() : null,
					category_ids: basicInfo.category_ids || [],
					requires_gender: Boolean(basicInfo.requires_gender), // 명시적으로 boolean 변환
					estimated_time: basicInfo.estimated_time || 5,
					max_score: basicInfo.max_score || 100,
					intro_text: basicInfo.intro_text || null,
					thumbnail_url: basicInfo.thumbnail_url || null,
					description: basicInfo.description || null,
				} as TestInsert;

				// 질문 데이터 준비
				console.log('질문 데이터 준비 중:', questions);
				const questionsData: TestQuestionInsert[] = questions.map((q, index) => {
					console.log(`질문 ${index + 1} 변환:`, {
						question_text: q.question_text,
						choicesCount: q.choices.length,
						choices: q.choices.map((c) => ({
							choice_text: c.choice_text,
							score: c.score,
							is_correct: c.is_correct,
						})),
					});

					return {
						question_text: q.question_text,
						question_order: index,
						image_url: q.image_url,
						choices: q.choices.map((c, choiceIndex) => ({
							choice_text: c.choice_text,
							choice_order: choiceIndex,
							score: c.score,
							is_correct: c.is_correct,
						})),
					};
				});
				console.log('최종 질문 데이터:', questionsData);

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
