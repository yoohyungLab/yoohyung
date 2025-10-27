'use client';

import { useState, useMemo, useCallback } from 'react';
import type { TestTakingInterfaceProps, TestCompletionResult } from '@/shared/types';
import { colorThemes } from '@/features/test/lib/themes';
import { TestIntro } from '../psychology/test-intro';
import { BalanceGameQuestion } from './balance-game-question';
import { Loading } from '@/shared/ui/loading';

export function BalanceGameContainer({ test, onComplete }: TestTakingInterfaceProps) {
	const [isStarting, setIsStarting] = useState(true);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Array<{ questionId: string; choiceId: string }>>([]);

	const theme = useMemo(() => colorThemes[0], []);

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
		(questionId: string, choiceId: string) => {
			const totalQuestions = test?.questions?.length || 0;
			const nextQuestionIndex = currentQuestionIndex + 1;

			setAnswers((prev) => {
				const filtered = prev.filter((a) => a.questionId !== questionId);
				return [...filtered, { questionId, choiceId }];
			});

			if (nextQuestionIndex < totalQuestions) {
				setCurrentQuestionIndex(nextQuestionIndex);
			} else {
				try {
					if (typeof window !== 'undefined') {
						const payload = {
							testId: test?.test?.id || '',
							answers: [...answers, { questionId, choiceId }],
							resultId: 'temp',
						};
						sessionStorage.setItem('testResult', JSON.stringify(payload));
					}
				} catch {}

				const finalChoiceIds = [...answers, { questionId, choiceId }].map((a) => a.choiceId);
				completeTest(finalChoiceIds);
			}
		},
		[currentQuestionIndex, test?.questions, completeTest, answers, test?.test?.id]
	);

	const handlePrevious = useCallback(() => {
		setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
	}, []);

	if (!test?.questions?.length) return <div>테스트를 찾을 수 없습니다.</div>;

	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={handleStart} />;
	}

	if (currentQuestionIndex >= test.questions.length) {
		return <Loading variant="result" />;
	}

	const currentQuestion = test.questions[currentQuestionIndex];

	return (
		<BalanceGameQuestion
			key={`question-${currentQuestionIndex}`}
			question={currentQuestion}
			onAnswer={handleAnswer}
			questionNumber={currentQuestionIndex + 1}
			totalQuestions={test.questions.length}
			onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
			testId={test?.test?.id}
		/>
	);
}
