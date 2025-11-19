import { useState } from 'react';
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

type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

export const useTestCreation = (): UseTestCreationReturn => {
	const [step, setStep] = useState(1);
	const [type, setType] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [basicInfo, setBasicInfo] = useState<BasicInfo>(createBasicInfoWithShortCode());
	const [questions, setQuestions] = useState<QuestionData[]>([DEFAULT_QUESTION]);
	const [results, setResults] = useState<ResultData[]>([DEFAULT_RESULT]);

	const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

	const updateBasicInfo = (updates: Partial<BasicInfo>) => {
		setBasicInfo((prev) => ({ ...prev, ...updates }));
	};

	const updateResultVariantRules = (rules: ResultVariantRules) => {
		setBasicInfo((prev) => ({
			...prev,
			features: {
				...prev.features,
				result_variant_rules: rules,
			},
		}));
	};

	const addQuestion = () => {
		setQuestions((prev) => [...prev, { ...DEFAULT_QUESTION, question_order: prev.length }]);
	};

	const removeQuestion = (index: number) => {
		setQuestions((prev) => prev.filter((_, i) => i !== index));
	};

	const updateQuestion = (index: number, updates: Partial<QuestionData>) => {
		setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
	};

	const addChoice = (questionIndex: number) => {
		setQuestions((prev) =>
			prev.map((q, i) =>
				i === questionIndex
					? {
							...q,
							choices: [...q.choices, { choice_text: '', choice_order: q.choices.length, score: 0, is_correct: false }],
					  }
					: q
			)
		);
	};

	const removeChoice = (questionIndex: number, choiceIndex: number) => {
		setQuestions((prev) =>
			prev.map((q, i) => (i === questionIndex ? { ...q, choices: q.choices.filter((_, ci) => ci !== choiceIndex) } : q))
		);
	};

	const updateChoice = (questionIndex: number, choiceIndex: number, updates: Partial<QuestionData['choices'][0]>) => {
		setQuestions((prev) =>
			prev.map((q, i) =>
				i === questionIndex
					? { ...q, choices: q.choices.map((choice, ci) => (ci === choiceIndex ? { ...choice, ...updates } : choice)) }
					: q
			)
		);
	};

	const addResult = () => {
		setResults((prev) => [...prev, { ...DEFAULT_RESULT, result_order: prev.length }]);
	};

	const removeResult = (index: number) => {
		setResults((prev) => prev.filter((_, i) => i !== index));
	};

	const updateResult = (index: number, updates: Partial<ResultData>) => {
		setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
	};

	const saveTest = async (testId?: string) => {
		try {
			setIsLoading(true);

			const finalShortCode = basicInfo.short_code || generateShortCode();
			const finalSlug = basicInfo.slug || generateSlug(basicInfo.title || '');
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
				requires_gender: Boolean(basicInfo.requires_gender),
				estimated_time: basicInfo.estimated_time || 5,
				max_score: basicInfo.max_score || 100,
				intro_text: basicInfo.intro_text || null,
				thumbnail_url: basicInfo.thumbnail_url || null,
				description: basicInfo.description || null,
			} as TestInsert;

			const questionsData: TestQuestionInsert[] = questions.map((q, index) => ({
				question_text: q.question_text,
				question_order: index,
				image_url: q.image_url,
				question_type: q.question_type || 'multiple_choice',
				correct_answers: q.correct_answers || null,
				explanation: q.explanation || null,
				choices: q.choices.map((c, choiceIndex) => ({
					choice_text: c.choice_text,
					choice_order: choiceIndex,
					score: c.score,
					is_correct: c.is_correct,
					code: (c as { code?: string | null }).code || null,
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
				target_gender: r.target_gender || null,
			}));

			return await testService.saveCompleteTest(testData, questionsData, resultsData);
		} catch (error) {
			console.error('테스트 저장 실패:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setStep(1);
		setType(null);
		setBasicInfo(createBasicInfoWithShortCode());
		setQuestions([DEFAULT_QUESTION]);
		setResults([DEFAULT_RESULT]);
	};

	return {
		step,
		type,
		basicInfo,
		questions,
		results,
		isLoading,
		setStep,
		setType,
		nextStep,
		prevStep,
		updateBasicInfo,
		updateResultVariantRules,
		setQuestions,
		addQuestion,
		removeQuestion,
		updateQuestion,
		addChoice,
		removeChoice,
		updateChoice,
		setResults,
		addResult,
		removeResult,
		updateResult,
		saveTest,
		resetForm,
		generateShortCode,
	};
};
