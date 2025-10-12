'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@pickid/supabase';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { TestProgress, TestAnswer, TestCompletionResult, TestConfig } from '@/shared/types';

// ============================================================================
// 타입 정의
// ============================================================================

interface ITestTakingVMProps {
	test: TestWithNestedDetails | null;
	config?: Partial<TestConfig>;
	onComplete?: (result: TestCompletionResult) => void;
	onExit?: () => void;
}

interface ITestTakingVMReturn {
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

// ============================================================================
// 기본 설정
// ============================================================================

const DEFAULT_CONFIG: TestConfig = {
	allowBackNavigation: true,
	showProgress: true,
	showQuestionNumbers: true,
	requireAllAnswers: true,
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

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

// 테스트 결과 저장 (간소화 버전 - 필수만)
const saveTestResult = async (result: TestCompletionResult) => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const sessionId = user?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// 응답 저장
		await supabase.from('user_test_responses').insert([
			{
				test_id: result.testId,
				user_id: user?.id || null,
				session_id: sessionId,
				result_id: result.resultId,
				total_score: result.totalScore,
				responses: result.answers,
				gender: result.gender || null,
				started_at: new Date(new Date(result.completedAt).getTime() - result.duration * 1000).toISOString(),
				completed_at: result.completedAt,
				completion_time_seconds: result.duration,
				created_date: new Date().toISOString().split('T')[0],
			},
		]);

		// 응답수 증가
		try {
			await supabase.rpc('increment_test_response', { test_uuid: result.testId });
		} catch (e) {
			console.warn('Failed to increment response_count:', e);
		}
	} catch (error) {
		console.error('Error saving test result:', error);
	}
};

// ============================================================================
// 테스트 진행 ViewModel
// ============================================================================

export function useTestTakingVM({ test, config = {}, onComplete, onExit }: ITestTakingVMProps): ITestTakingVMReturn {
	const mergedConfig = { ...DEFAULT_CONFIG, ...config };

	const [progress, setProgress] = useState<TestProgress>(() => createInitialProgress(test));
	const [selectedGender, setSelectedGender] = useState<string>('');

	// 테스트 변경 시 진행 상태 초기화
	useEffect(() => {
		if (test) {
			setProgress(createInitialProgress(test));
		}
	}, [test]);

	// 현재 질문
	const currentQuestion = useMemo(() => {
		if (!test?.questions?.length) return null;
		return test.questions[progress.currentQuestionIndex];
	}, [test?.questions, progress.currentQuestionIndex]);

	// 이전 질문으로 갈 수 있는지
	const canGoBack = useMemo(() => {
		return mergedConfig.allowBackNavigation && progress.currentQuestionIndex > 0;
	}, [mergedConfig.allowBackNavigation, progress.currentQuestionIndex]);

	// 답변 처리
	const handleAnswer = useCallback(
		(choiceId: string) => {
			if (!currentQuestion || !test?.questions) return;

			const choice = currentQuestion.choices?.find((c) => c.id === choiceId);
			if (!choice) return;

			// 기존 답변 제거 후 새 답변 추가
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
				// 마지막 질문 - 완료 처리
				const result: TestCompletionResult = {
					testId: test.test.id,
					resultId: test.results?.[0]?.id || '',
					totalScore: calculateTotalScore(newAnswers),
					answers: newAnswers,
					completedAt: new Date().toISOString(),
					duration: calculateDuration(progress.startTime),
					gender: selectedGender,
				};

				setProgress((prev) => ({
					...prev,
					answers: newAnswers,
					isCompleted: true,
				}));

				// 완료 콜백 실행 후 백그라운드로 저장
				onComplete?.(result);
				saveTestResult(result);
			} else {
				// 다음 질문으로 이동
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

	// 이전 질문으로 이동
	const handlePrevious = useCallback(() => {
		if (!canGoBack) return;

		setProgress((prev) => {
			const newIndex = prev.currentQuestionIndex - 1;
			const filteredAnswers = prev.answers.filter((_, index) => index < newIndex);

			return {
				...prev,
				currentQuestionIndex: newIndex,
				answers: filteredAnswers,
			};
		});
	}, [canGoBack]);

	// 테스트 종료
	const handleExit = useCallback(() => {
		onExit?.();
	}, [onExit]);

	// 테스트 초기화
	const resetTest = useCallback(() => {
		setProgress(createInitialProgress(test));
	}, [test]);

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
