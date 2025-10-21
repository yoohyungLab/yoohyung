'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { TestTakingInterfaceProps, TestCompletionResult } from '@/shared/types';
import { generateThemeFromTestId } from '@/shared/lib/balance-game';
import { TestIntro } from '../test-intro';
import { TestQuestion } from '../test-question';
import { BalanceGameQuestion } from './balance-game-question';

export function BalanceGameContainer({ test, onComplete }: TestTakingInterfaceProps) {
	const [isStarting, setIsStarting] = useState(true);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<string[]>([]);

	const theme = useMemo(() => generateThemeFromTestId(test?.test?.id || 'default'), [test?.test?.id]);

	useEffect(() => {
		if (test?.test?.id) {
			setIsStarting(true);
			setCurrentQuestionIndex(0);
			setUserAnswers([]);
		}
	}, [test?.test?.id]);

	const completeTest = useCallback(
		(answers: string[]) => {
			const testResult: TestCompletionResult = {
				test_id: test?.test?.id || '',
				resultId: '',
				answers: answers.map((answer, index) => ({
					questionId: test?.questions?.[index]?.id || '',
					choiceId: answer,
					score: 1,
					answeredAt: Date.now(),
				})),
				totalScore: answers.length,
				score: answers.length,
				completedAt: new Date().toISOString(),
				duration: 0,
				created_at: new Date().toISOString(),
			};

			onComplete?.(testResult);
		},
		[test?.test?.id, test?.questions, onComplete]
	);

	const handleStart = useCallback(() => setIsStarting(false), []);

	const handleAnswer = useCallback(
		(choiceId: string) => {
			setUserAnswers((prevAnswers) => {
				const newAnswers = [...prevAnswers, choiceId];
				const totalQuestions = test?.questions?.length || 0;
				const nextQuestionIndex = currentQuestionIndex + 1;

				if (nextQuestionIndex < totalQuestions) {
					setCurrentQuestionIndex(nextQuestionIndex);
				} else {
					completeTest(newAnswers);
				}

				return newAnswers;
			});
		},
		[currentQuestionIndex, test?.questions?.length, completeTest]
	);

	const handlePrevious = useCallback(() => {
		setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
	}, []);

	const handleNext = useCallback(() => {
		const totalQuestions = test?.questions?.length || 0;
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	}, [currentQuestionIndex, test?.questions?.length]);

	if (!test?.questions?.length) {
		return <div>테스트를 찾을 수 없습니다.</div>;
	}

	if (isStarting) {
		return (
			<TestIntro
				test={test}
				theme={{ ...theme, name: 'balance', button: theme.gradient, background: theme.gradient }}
				onStart={handleStart}
			/>
		);
	}

	// 테스트 완료 처리는 handleAnswer에서 이미 수행됨
	if (currentQuestionIndex >= test.questions.length) {
		return <div className="flex items-center justify-center min-h-screen">결과를 불러오는 중...</div>;
	}

	const currentQuestion = test.questions[currentQuestionIndex];
	const totalQuestions = test.questions.length;
	const canGoBack = currentQuestionIndex > 0;
	const isFirstQuestion = currentQuestionIndex === 0;
	const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

	if (currentQuestion.choices?.length === 2) {
		return (
			<BalanceGameQuestion
				key={`question-${currentQuestionIndex}`}
				question={currentQuestion}
				onAnswer={handleAnswer}
				questionNumber={currentQuestionIndex + 1}
				totalQuestions={totalQuestions}
				onPrevious={canGoBack ? handlePrevious : () => {}}
				onNext={handleNext}
				isFirstQuestion={isFirstQuestion}
				isLastQuestion={isLastQuestion}
				testId={test?.test?.id}
			/>
		);
	}

	return (
		<TestQuestion
			progress={{
				currentQuestionIndex: currentQuestionIndex + 1,
				totalQuestions,
				answers: userAnswers.map((answer, index) => ({
					questionId: test?.questions?.[index]?.id || '',
					choiceId: answer,
					score: 1,
					answeredAt: Date.now(),
				})),
				startTime: Date.now(),
				isCompleted: false,
			}}
			currentQuestion={currentQuestion}
			onAnswer={handleAnswer}
			onPrevious={canGoBack ? handlePrevious : () => {}}
			theme={{ ...theme, name: 'balance', button: theme.gradient, background: theme.gradient }}
		/>
	);
}
