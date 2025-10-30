'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { TestIntro } from './psychology/test-intro';
import { Loading } from '@/shared/ui/loading';
import { BalanceGameQuestion } from './balance-game/balance-game-question';
import { QuizQuestion } from './quiz/quiz-question';
import { TestQuestion as PsychologyQuestion } from './psychology/test-question';
import { colorThemes } from '../lib/themes';

interface TestPageClientProps {
	test: TestWithNestedDetails;
}

type TestType = 'balance' | 'quiz' | 'psychology';

/**
 * 테스트 진행 클라이언트 컴포넌트
 *
 * 서버 책임 (page.tsx):
 * - 데이터 fetch, 에러 처리, 초기 로딩
 *
 * 클라이언트 책임 (이 컴포넌트):
 * - 인트로 ↔ 문제 전환
 * - 문제 탐색
 * - 답변 수집
 */
export function TestPageClient({ test }: TestPageClientProps) {
	const router = useRouter();
	const testType: TestType = (test.test?.type as TestType) || 'psychology';

	const [isStarting, setIsStarting] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Array<{ questionId: string; choiceId: string }>>([]);

	const theme = colorThemes[0];
	const totalQuestions = test.questions.length;
	const currentQuestion = test.questions[currentIndex];
	const isLastQuestion = currentIndex >= totalQuestions - 1;

	// 인트로 화면
	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={() => setIsStarting(false)} />;
	}

	// 통합 로딩: 문제 완료 후 결과로 이동 중
	if (currentIndex >= totalQuestions || !currentQuestion) {
		return <Loading variant="result" />;
	}

	// 통합 답변 핸들러
	const handleAnswer = (choiceId: string, questionId?: string) => {
		const qId = questionId || (currentQuestion.id as string);
		const newAnswers = [...answers.filter((a) => a.questionId !== qId), { questionId: qId, choiceId }];

		setAnswers(newAnswers);

		if (isLastQuestion) {
			// Quiz는 채점 결과 저장
			if (testType === 'quiz') {
				try {
					const correctAnswers = test.questions.reduce((count, q) => {
						const userAnswer = newAnswers.find((a) => a.questionId === q.id);
						const correctChoice = q.choices?.find((c) => (c as { is_correct?: boolean }).is_correct);
						return count + (userAnswer?.choiceId === correctChoice?.id ? 1 : 0);
					}, 0);

					const score = Math.round((correctAnswers / totalQuestions) * 100);
					sessionStorage.setItem(
						'testResult',
						JSON.stringify({
							testId: test.test?.id,
							answers: newAnswers,
							correctCount: correctAnswers,
							score,
							totalQuestions,
						})
					);
				} catch {}
			}
			router.push(`/tests/${test.test?.id}/result`);
		} else {
			setCurrentIndex(currentIndex + 1);
		}
	};

	// 이전 버튼 (심리형만)
	const handlePrevious =
		testType === 'psychology' && currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined;

	// 밸런스 게임
	if (testType === 'balance') {
		return (
			<BalanceGameQuestion
				key={currentIndex}
				question={currentQuestion}
				questionNumber={currentIndex + 1}
				totalQuestions={totalQuestions}
				onAnswer={handleAnswer}
				testId={test.test?.id as string}
			/>
		);
	}

	// 퀴즈
	if (testType === 'quiz') {
		return (
			<QuizQuestion
				question={currentQuestion}
				currentIndex={currentIndex}
				totalQuestions={totalQuestions}
				onAnswer={handleAnswer}
				previousAnswer={answers.find((a) => a.questionId === currentQuestion.id)?.choiceId}
				theme={theme}
			/>
		);
	}

	// 심리/성격 테스트
	return (
		<PsychologyQuestion
			question={currentQuestion}
			currentIndex={currentIndex}
			totalQuestions={totalQuestions}
			onAnswer={handleAnswer}
			onPrevious={handlePrevious}
			theme={theme}
		/>
	);
}
