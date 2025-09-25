import { useState, useCallback } from 'react';
import { testService } from '@/shared/api';
import type { QuestionCreationData, ResultCreationData, CompleteTestData } from '@/shared/api/services/test.service';
import type { TestInsert } from '@repo/supabase';

/**
 * 새 테스트 생성 과정의 폼 상태 관리 훅
 * @returns 5단계 생성 프로세스의 상태와 메서드들
 */
export const useTestCreation = () => {
	// 테스트 생성 관련 상태
	const [step, setStep] = useState(1);
	const [type, setType] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [basicInfo, setBasicInfo] = useState<Partial<TestInsert>>({
		title: '',
		description: '',
		slug: '',
		thumbnail_url: '',
		response_count: 0,
		view_count: 0,
		category_ids: [],
		short_code: '',
		intro_text: '',
		status: 'draft',
		estimated_time: 5,
		scheduled_at: null,
		max_score: 100,
		type: 'psychology',
		published_at: null,
	});
	const [questions, setQuestions] = useState<QuestionCreationData[]>([
		{
			question_text: '',
			question_order: 0,
			image_url: null,
			choices: [
				{ choice_text: '', choice_order: 0, score: 1, is_correct: false },
				{ choice_text: '', choice_order: 1, score: 2, is_correct: false },
			],
		},
	]);
	const [results, setResults] = useState<ResultCreationData[]>([
		{
			result_name: '',
			result_order: 0,
			description: null,
			match_conditions: { type: 'score' as const, min: 0, max: 30 },
			background_image_url: null,
			theme_color: '#3B82F6',
			features: {},
		},
	]);

	// 스텝 관리
	const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, 5)), []);
	const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

	// 기본 정보 관리
	const updateBasicInfo = useCallback((updates: any) => {
		setBasicInfo((prev) => ({ ...prev, ...updates }));
	}, []);

	// 질문 관리
	const addQuestion = useCallback(() => {
		setQuestions((prev) => [
			...prev,
			{
				question_text: '',
				question_order: prev.length,
				image_url: null,
				choices: [
					{ choice_text: '', choice_order: 0, score: 1, is_correct: false },
					{ choice_text: '', choice_order: 1, score: 2, is_correct: false },
				],
			},
		]);
	}, []);

	const removeQuestion = useCallback((index: number) => {
		setQuestions((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateQuestion = useCallback((index: number, updates: Partial<QuestionCreationData>) => {
		setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
	}, []);

	// 선택지 관리
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
		(
			questionIndex: number,
			choiceIndex: number,
			updates: Partial<{
				choice_text: string;
				choice_order: number;
				score: number | null;
				is_correct: boolean | null;
			}>
		) => {
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

	// 결과 관리
	const addResult = useCallback(() => {
		setResults((prev) => [
			...prev,
			{
				result_name: '',
				result_order: prev.length,
				description: null,
				match_conditions: { type: 'score' as const, min: 0, max: 30 },
				background_image_url: null,
				theme_color: '#3B82F6',
				features: {},
			},
		]);
	}, []);

	const removeResult = useCallback((index: number) => {
		setResults((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateResult = useCallback((index: number, updates: Partial<ResultCreationData>) => {
		setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
	}, []);

	// 테스트 저장
	const saveTest = useCallback(
		async (testId?: string) => {
			try {
				setIsLoading(true);
				const completeData: CompleteTestData = {
					test: {
						...basicInfo,
						id: testId,
						type: type || 'psychology',
						status: 'published' as const,
						published_at: new Date().toISOString(),
					},
					questions,
					results,
				};

				const result = await testService.saveCompleteTest(completeData);
				return result;
			} catch (error) {
				console.error('❌ Test save failed:', error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[basicInfo, type, questions, results]
	);

	// 상태 초기화
	const resetForm = useCallback(() => {
		setStep(1);
		setType(null);
		setBasicInfo({
			title: '',
			description: '',
			slug: '',
			thumbnail_url: '',
			response_count: 0,
			view_count: 0,
			category_ids: [],
			short_code: '',
			intro_text: '',
			status: 'draft',
			estimated_time: 5,
			scheduled_at: null,
			max_score: 100,
			type: 'psychology',
			published_at: null,
		});
		setQuestions([
			{
				question_text: '',
				question_order: 0,
				image_url: null,
				choices: [
					{ choice_text: '', choice_order: 0, score: 1, is_correct: false },
					{ choice_text: '', choice_order: 1, score: 2, is_correct: false },
				],
			},
		]);
		setResults([
			{
				result_name: '',
				result_order: 0,
				description: null,
				match_conditions: { type: 'score' as const, min: 0, max: 30 },
				background_image_url: null,
				theme_color: '#3B82F6',
				features: {},
			},
		]);
	}, []);

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
	};
};
