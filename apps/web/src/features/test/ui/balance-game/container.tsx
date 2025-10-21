'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { TestIntro } from '../test-intro';
import { TestQuestion } from '../test-question';
import { BalanceGameQuestion } from './question';
import type { TestTakingInterfaceProps, TestCompletionResult } from '@/shared/types';
import { generateThemeFromTestId } from '@/shared/lib/balance-game';

export function BalanceGameContainer({ test, onComplete }: TestTakingInterfaceProps) {
	const [isStarting, setIsStarting] = useState(true);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<string[]>([]);

	const theme = useMemo(() => {
		const testId = test?.test?.id || 'default';
		const balanceGameTheme = generateThemeFromTestId(testId);

		return {
			name: balanceGameTheme.primary,
			gradient: balanceGameTheme.gradient,
			primary: balanceGameTheme.primary,
			accent: balanceGameTheme.accent,
			secondary: balanceGameTheme.secondary,
			button: balanceGameTheme.progress,
			progress: balanceGameTheme.progress,
			question: balanceGameTheme.question,
			choice: balanceGameTheme.choice,
			background: balanceGameTheme.gradient,
		};
	}, [test?.test?.id]);

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
		if (currentQuestionIndex < (test?.questions?.length || 0) - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	}, [currentQuestionIndex, test?.questions?.length]);

	if (!test?.questions || test.questions.length === 0) {
		return <div>테스트를 찾을 수 없습니다.</div>;
	}

	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={handleStart} />;
	}

	if (currentQuestionIndex >= test.questions.length) {
		completeTest(userAnswers);
		return null;
	}

	const currentQuestion = test.questions[currentQuestionIndex];
	const canGoBack = currentQuestionIndex > 0;

	if (currentQuestion.choices && currentQuestion.choices.length === 2) {
		return (
			<BalanceGameQuestion
				key={`question-${currentQuestionIndex}`}
				question={currentQuestion}
				onAnswer={handleAnswer}
				questionNumber={currentQuestionIndex + 1}
				totalQuestions={test.questions.length}
				onPrevious={canGoBack ? handlePrevious : () => {}}
				onNext={handleNext}
				isFirstQuestion={currentQuestionIndex === 0}
				isLastQuestion={currentQuestionIndex === test.questions.length - 1}
				testId={test?.test?.id}
			/>
		);
	}

	return (
		<TestQuestion
			progress={{
				currentQuestionIndex: currentQuestionIndex + 1,
				totalQuestions: test.questions.length,
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
			theme={theme}
		/>
	);
}
