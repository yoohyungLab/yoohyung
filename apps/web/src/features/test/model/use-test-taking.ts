'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { testService } from '@/shared/api/services/test.service';
import type { TestWithNestedDetails } from '@pickid/supabase';

import type { TestAnswer, TestCompletionResult, TestConfig, TestProgress } from '@/shared/types';

interface ITestTakingProps {
	test: TestWithNestedDetails | null;
	config?: Partial<TestConfig>;
	onComplete?: (result: TestCompletionResult) => void;
	onExit?: () => void;
}

interface ITestTakingReturn {
	progress: TestProgress;
	currentQuestion: TestWithNestedDetails['questions'][0] | null;
	canGoBack: boolean;
	selectedGender: string;
	handleAnswer: (choiceId: string) => void;
	handlePrevious: () => void;
	handleExit: () => void;
	resetTest: () => void;
	setSelectedGender: (gender: string) => void;
}

const DEFAULT_CONFIG: TestConfig = {
	allowBackNavigation: true,
	showProgress: true,
	showQuestionNumbers: true,
	requireAllAnswers: true,
};

const createInitialProgress = (test: TestWithNestedDetails | null): TestProgress => ({
	currentQuestionIndex: 0,
	totalQuestions: test?.questions?.length || 0,
	answers: [],
	startTime: Date.now(),
	isCompleted: false,
});

const calculateTotalScore = (answers: TestAnswer[]): number => {
	return answers.reduce((sum, answer) => sum + answer.score, 0);
};

const calculateDuration = (startTime: number): number => {
	return Math.round((Date.now() - startTime) / 1000);
};

const saveTestResult = async (result: TestCompletionResult) => {
	try {
		await testService.saveUserTestResponse(result);
		if (result.test_id) {
			await testService.incrementTestResponse(result.test_id);
		}
	} catch (error) {
		console.error('Error saving test result:', error);
	}
};

export function useTestTaking({ test, config = {}, onComplete, onExit }: ITestTakingProps): ITestTakingReturn {
	const mergedConfig = { ...DEFAULT_CONFIG, ...config };
	const [progress, setProgress] = useState<TestProgress>(() => createInitialProgress(test));
	const [selectedGender, setSelectedGender] = useState<string>('');

	useEffect(() => {
		if (test) setProgress(createInitialProgress(test));
	}, [test]);

	const currentQuestion = useMemo(() => {
		if (!test?.questions?.length) return null;
		return test.questions[progress.currentQuestionIndex];
	}, [test?.questions, progress.currentQuestionIndex]);

	const canGoBack = useMemo(() => {
		return mergedConfig.allowBackNavigation && progress.currentQuestionIndex > 0;
	}, [mergedConfig.allowBackNavigation, progress.currentQuestionIndex]);

	const handleAnswer = useCallback(
		(choiceId: string) => {
			if (!currentQuestion || !test?.questions) return;

			const choice = currentQuestion.choices?.find((c) => c.id === choiceId);
			if (!choice) return;

			const filteredAnswers = progress.answers.filter((answer) => answer.questionId !== currentQuestion.id);
			const newAnswer: TestAnswer = {
				questionId: currentQuestion.id,
				choiceId: choice.id,
				score: choice.score || 0,
				answeredAt: Date.now(),
			};

			const newAnswers = [...filteredAnswers, newAnswer];
			const isLastQuestion = progress.currentQuestionIndex === test.questions.length - 1;

			if (isLastQuestion) {
				const result: TestCompletionResult = {
					test_id: test.test.id,
					resultId: test.results?.[0]?.id || '',
					totalScore: calculateTotalScore(newAnswers),
					score: calculateTotalScore(newAnswers),
					answers: newAnswers,
					completedAt: new Date().toISOString(),
					duration: calculateDuration(progress.startTime),
					gender: selectedGender,
					created_at: new Date().toISOString(),
				};


			// Save to sessionStorage for immediate access on result page
			try {
				if (typeof window !== 'undefined') {
					const payload = {
						testId: test.test.id,
						resultId: result.resultId,
						totalScore: result.totalScore,
						gender: result.gender,
						answers: result.answers,
						completedAt: result.completedAt,
					};
					sessionStorage.setItem('testResult', JSON.stringify(payload));
				}
			} catch (error) {
				console.error('Failed to save to sessionStorage:', error);
			}
			setProgress((prev) => ({ ...prev, answers: newAnswers, isCompleted: true }));
			onComplete?.(result);
			saveTestResult(result);
			} else {
				setProgress((prev) => ({
					...prev,
					answers: newAnswers,
					currentQuestionIndex: prev.currentQuestionIndex + 1,
				}));
			}
		},
		[
			currentQuestion,
			progress.answers,
			progress.currentQuestionIndex,
			progress.startTime,
			test,
			onComplete,
			selectedGender,
		]
	);

	const handlePrevious = useCallback(() => {
		if (!canGoBack) return;

		setProgress((prev) => {
			const newIndex = prev.currentQuestionIndex - 1;
			const filteredAnswers = prev.answers.filter((_, index) => index < newIndex);
			return { ...prev, currentQuestionIndex: newIndex, answers: filteredAnswers };
		});
	}, [canGoBack]);

	const handleExit = useCallback(() => onExit?.(), [onExit]);
	const resetTest = useCallback(() => setProgress(createInitialProgress(test)), [test]);

	return {
		progress,
		currentQuestion,
		canGoBack,
		selectedGender,
		handleAnswer,
		handlePrevious,
		handleExit,
		resetTest,
		setSelectedGender,
	};
}
