'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { useQuizTaking } from '../../hooks/use-quiz-taking';
import { TestIntro } from '../psychology/test-intro';
import { QuizQuestion } from './quiz-question';
import { Loading } from '@/shared/ui/loading';
import { colorThemes } from '../../lib/themes';

interface QuizContainerProps {
	test: TestWithNestedDetails;
}

export function QuizContainer({ test }: QuizContainerProps) {
	const router = useRouter();
	const onComplete = useCallback(() => {
		router.push(`/tests/${test.test?.id}/result`);
	}, [router, test.test?.id]);
	const [isStarting, setIsStarting] = useState(true);

	const theme = useMemo(() => colorThemes[0], []);

	const { currentQuestion, currentQuestionIndex, totalQuestions, userAnswers, progress, handleAnswer, handlePrevious } =
		useQuizTaking({
			test,
			onComplete,
		});

	const handleStart = useCallback(() => {
		setIsStarting(false);
	}, []);

	if (!test?.questions?.length) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
				<article className="w-full max-w-[420px] bg-white rounded-[2rem] p-6 shadow-2xl text-center">
					<h2 className="text-lg font-bold text-gray-800 mb-2">질문이 없습니다</h2>
					<p className="text-sm text-gray-600">퀴즈가 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요.</p>
				</article>
			</div>
		);
	}

	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={handleStart} />;
	}

	if (progress.isCompleted) {
		return <Loading variant="result" />;
	}

	if (!currentQuestion) {
		return <Loading variant="result" />;
	}

	return (
		<QuizQuestion
			question={currentQuestion}
			currentIndex={currentQuestionIndex}
			totalQuestions={totalQuestions}
			onAnswer={handleAnswer}
			onPrevious={handlePrevious}
			previousAnswer={userAnswers.get(currentQuestion.id)}
			theme={theme}
		/>
	);
}
