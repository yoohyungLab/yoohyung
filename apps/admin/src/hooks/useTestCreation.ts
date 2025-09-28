import { useState, useCallback } from 'react';
import { testService } from '@/shared/api';
import type { TestInsert, TestQuestionInsert, TestResultInsert } from '@repo/supabase';

// 간단한 타입 정의
interface QuestionData {
	question_text: string;
	question_order: number;
	image_url: string | null;
	choices: {
		choice_text: string;
		choice_order: number;
		score: number;
		is_correct: boolean;
	}[];
}

interface ResultData {
	result_name: string;
	result_order: number;
	description: string | null;
	match_conditions: { type: 'score'; min: number; max: number };
	background_image_url: string | null;
	theme_color: string;
	features: Record<string, unknown>;
}

export const useTestCreation = () => {
	const [step, setStep] = useState(1);
	const [type, setType] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// short_code 생성 함수
	const generateShortCode = useCallback(() => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 6; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}, []);

	// 기본 정보
	const [basicInfo, setBasicInfo] = useState<Partial<TestInsert>>({
		title: '',
		description: '',
		slug: '',
		thumbnail_url: '',
		response_count: 0,
		view_count: 0,
		category_ids: [],
		short_code: generateShortCode(),
		intro_text: '',
		status: 'draft',
		estimated_time: 5,
		scheduled_at: null,
		max_score: 100,
		type: 'psychology',
		published_at: null,
	});

	// 질문들
	const [questions, setQuestions] = useState<QuestionData[]>([
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

	// 결과들
	const [results, setResults] = useState<ResultData[]>([
		{
			result_name: '',
			result_order: 0,
			description: null,
			match_conditions: { type: 'score', min: 0, max: 30 },
			background_image_url: null,
			theme_color: '#3B82F6',
			features: {},
		},
	]);

	// 스텝 관리
	const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, 5)), []);
	const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

	// 기본 정보 업데이트
	const updateBasicInfo = useCallback((updates: Partial<TestInsert>) => {
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

	const updateQuestion = useCallback((index: number, updates: Partial<QuestionData>) => {
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

	// 결과 관리
	const addResult = useCallback(() => {
		setResults((prev) => [
			...prev,
			{
				result_name: '',
				result_order: prev.length,
				description: null,
				match_conditions: { type: 'score', min: 0, max: 30 },
				background_image_url: null,
				theme_color: '#3B82F6',
				features: {},
			},
		]);
	}, []);

	const removeResult = useCallback((index: number) => {
		setResults((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateResult = useCallback((index: number, updates: Partial<ResultData>) => {
		setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
	}, []);

	// 테스트 저장
	const saveTest = useCallback(
		async (testId?: string) => {
			try {
				setIsLoading(true);

				// short_code가 비어있으면 새로 생성
				let finalShortCode = basicInfo.short_code;
				if (!finalShortCode || finalShortCode.trim() === '') {
					finalShortCode = generateShortCode();
					updateBasicInfo({ short_code: finalShortCode });
				}

				const testData: TestInsert = {
					...basicInfo,
					short_code: finalShortCode,
					id: testId,
					type: type || 'psychology',
					status: 'published',
					published_at: new Date().toISOString(),
				} as TestInsert;

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

				const resultsData: TestResultInsert[] = results.map((r, index) => ({
					result_name: r.result_name,
					description: r.description,
					result_order: index,
					background_image_url: r.background_image_url,
					theme_color: r.theme_color,
					match_conditions: r.match_conditions,
					features: r.features,
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
		[basicInfo, type, questions, results, generateShortCode, updateBasicInfo]
	);

	// 폼 초기화
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
			short_code: generateShortCode(),
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
				match_conditions: { type: 'score', min: 0, max: 30 },
				background_image_url: null,
				theme_color: '#3B82F6',
				features: {},
			},
		]);
	}, [generateShortCode]);

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

		// 유틸리티
		generateShortCode,
	};
};
