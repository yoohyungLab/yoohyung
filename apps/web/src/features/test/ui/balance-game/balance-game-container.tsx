'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { TestCompletionResult } from '@/shared/types';
import { colorThemes } from '@/features/test/lib/themes';
import { TestIntro } from '../psychology/test-intro';
import { BalanceGameQuestion } from './balance-game-question';
import { Loading } from '@/shared/ui/loading';

interface BalanceGameContainerProps {
	test: TestWithNestedDetails;
}

export function BalanceGameContainer({ test }: BalanceGameContainerProps) {
	const router = useRouter();
	const [isStarting, setIsStarting] = useState(true);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Array<{ questionId: string; choiceId: string }>>([]);

	const theme = useMemo(() => colorThemes[0], []);

	const completeTest = useCallback(
		(answers: string[]) => {
			const testResult: TestCompletionResult = {
				test_id: (test?.test?.id as string) || '',
				resultId: '',
				answers: answers.map((answer, index) => ({
					questionId: (test?.questions?.[index]?.id as string) || '',
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

			router.push(`/tests/${test.test?.id}/result`);
		},
		[test?.test?.id, test?.questions, router]
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
							testId: (test?.test?.id as string) || '',
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

	const currentQuestion = useMemo(() => {
		if (!test?.questions?.length || currentQuestionIndex >= test.questions.length) {
			return null;
		}
		const q = test.questions[currentQuestionIndex];

		return {
			id: q.id as string,
			question_text: q.question_text as string,
			image_url: q.image_url as string | null,
			choices: (q.choices || []).map((c) => ({
				id: (c as Record<string, unknown>).id as string,
				choice_text: (c as Record<string, unknown>).choice_text as string,
				choice_order: (c as Record<string, unknown>).choice_order as number,
			})),
		};
	}, [test?.questions, currentQuestionIndex]);

	if (!test?.questions?.length) return <div>테스트를 찾을 수 없습니다.</div>;

	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={handleStart} />;
	}

	if (currentQuestionIndex >= test.questions.length || !currentQuestion) {
		return <Loading variant="result" />;
	}

	return (
		<BalanceGameQuestion
			key={`question-${currentQuestionIndex}`}
			question={currentQuestion}
			onAnswer={handleAnswer}
			questionNumber={currentQuestionIndex + 1}
			totalQuestions={test.questions.length}
			onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
			testId={test?.test?.id as string}
		/>
	);
}
