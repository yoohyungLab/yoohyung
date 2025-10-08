'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { TestProgress, TestAnswer, TestCompletionResult, TestConfig } from '@/shared/types';

/**
 * 테스트 진행 ViewModel
 * - 질문 답변 처리
 * - 진행 상태 관리
 * - 이전/다음 네비게이션
 * - 자동 완료 처리
 * - 도메인 규칙 적용
 */
export function useTestTakingVM({
	test,
	config = {},
	onComplete,
	onExit,
}: {
	test: TestWithNestedDetails | null;
	config?: Partial<TestConfig>;
	onComplete?: (result: TestCompletionResult) => void;
	onExit?: () => void;
}) {
	const mergedConfig: TestConfig = {
		allowBackNavigation: true,
		showProgress: true,
		showQuestionNumbers: true,
		requireAllAnswers: true,
		...config,
	};

	const [progress, setProgress] = useState<TestProgress>({
		currentQuestionIndex: 0,
		totalQuestions: test?.questions?.length || 0,
		answers: [],
		startTime: Date.now(),
		isCompleted: false,
	});

	// 성별 정보 상태 추가
	const [selectedGender, setSelectedGender] = useState<string>('');

	// 테스트가 변경되면 진행 상태 초기화
	useEffect(() => {
		if (test) {
			setProgress({
				currentQuestionIndex: 0,
				totalQuestions: test.questions?.length || 0,
				answers: [],
				startTime: Date.now(),
				isCompleted: false,
			});
		}
	}, [test]);

	const currentQuestion = useMemo(() => {
		if (!test?.questions || test.questions.length === 0) return null;
		return test.questions[progress.currentQuestionIndex];
	}, [test?.questions, progress.currentQuestionIndex]);

	const canGoBack = useMemo(() => {
		return mergedConfig.allowBackNavigation && progress.currentQuestionIndex > 0;
	}, [mergedConfig.allowBackNavigation, progress.currentQuestionIndex]);

	const handleAnswer = useCallback(
		(choiceId: string) => {
			if (!currentQuestion || !test?.questions) return;

			// 선택지 찾기
			const choice = currentQuestion.choices?.find((c) => c.id === choiceId);
			if (!choice) return;

			// 기존 답변 제거 (같은 질문에 대한 답변)
			const filteredAnswers = progress.answers.filter((answer) => answer.questionId !== currentQuestion.id);

			// 새 답변 추가
			const newAnswer: TestAnswer = {
				questionId: currentQuestion.id,
				choiceId: choice.id,
				score: choice.score || 0,
				answeredAt: Date.now(),
			};

			const newAnswers = [...filteredAnswers, newAnswer];

			// 마지막 질문인지 확인
			const isLastQuestion = progress.currentQuestionIndex === test.questions.length - 1;

			if (isLastQuestion) {
				// 마지막 질문이면 완료 처리
				const totalScore = newAnswers.reduce((sum, answer) => sum + answer.score, 0);
				const duration = Math.round((Date.now() - progress.startTime) / 1000);

				const result: TestCompletionResult = {
					testId: test.test.id,
					resultId: test.results?.[0]?.id || '',
					totalScore,
					answers: newAnswers,
					completedAt: new Date().toISOString(),
					duration,
					gender: selectedGender,
				};

				setProgress((prev) => ({
					...prev,
					answers: newAnswers,
					isCompleted: true,
				}));

				onComplete?.(result);
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

	const handlePrevious = useCallback(() => {
		if (!canGoBack) return;

		setProgress((prev) => {
			const newIndex = prev.currentQuestionIndex - 1;
			// 현재 질문의 답변 제거
			const filteredAnswers = prev.answers.filter((answer, index) => index < newIndex);

			return {
				...prev,
				currentQuestionIndex: newIndex,
				answers: filteredAnswers,
			};
		});
	}, [canGoBack]);

	const handleExit = useCallback(() => {
		onExit?.();
	}, [onExit]);

	const resetTest = useCallback(() => {
		setProgress({
			currentQuestionIndex: 0,
			totalQuestions: test?.questions?.length || 0,
			answers: [],
			startTime: Date.now(),
			isCompleted: false,
		});
	}, [test?.questions?.length]);

	return {
		progress,
		currentQuestion,
		canGoBack,
		handleAnswer,
		handlePrevious,
		handleExit,
		resetTest,
		onComplete,
		onExit,
		setSelectedGender,
	};
}
