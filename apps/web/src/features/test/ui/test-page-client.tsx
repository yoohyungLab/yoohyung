'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { TestIntro } from './shared/test-intro';
import { Loading } from '@/shared/ui/loading';
import { BalanceGameQuestionContainer } from './balance-game/balance-game-question';
import { QuizQuestionContainer } from './quiz';
import { PsychologyQuestionContainer } from './psychology';
import { colorThemes, saveTestResult, getGrade } from '../lib';
import { addBalanceGameAnswer, clearBalanceGameAnswers, getBalanceGameAnswers } from '../lib/session-storage';
import { optimizedBalanceGameStatsService } from '@/shared/api/services';

interface TestPageClientProps {
	test: TestWithNestedDetails;
}

type TestType = 'balance' | 'quiz' | 'psychology';

interface IAnswer {
	questionId: string;
	choiceId: string;
	code?: string;
}

// Main Component

export function TestPageClient({ test }: TestPageClientProps) {
	const router = useRouter();
	const testType: TestType = (test.test?.type as TestType) || 'psychology';

	const [isStarting, setIsStarting] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<IAnswer[]>([]);
	const [userGender, setUserGender] = useState<'male' | 'female' | undefined>(undefined);

	const theme = colorThemes[0];
	const totalQuestions = test.questions.length;
	const currentQuestion = test.questions[currentIndex];
	const isLastQuestion = currentIndex >= totalQuestions - 1;

	console.log('[TestPageClient] 테스트 데이터 구조:', {
		testType,
		testId: test.test?.id,
		questionsCount: test.questions.length,
		firstQuestionChoices: test.questions[0]?.choices?.map((c) => ({
			id: c.id,
			text: c.choice_text,
			code: (c as { code?: string })?.code,
		})),
	});

	// Event Handlers

	const handleStartTest = (gender?: 'male' | 'female') => {
		setUserGender(gender);
		setIsStarting(false);
	};

	const handleAnswer = async (choiceId: string, questionId?: string) => {
		const qId = questionId || (currentQuestion.id as string);
		const selectedChoice = currentQuestion.choices?.find((c) => c.id === choiceId);
		const code = (selectedChoice as { code?: string })?.code;

		console.log('[handleAnswer] 선택지 정보:', {
			choiceId,
			selectedChoice,
			code,
			allChoices: currentQuestion.choices?.map((c) => ({
				id: c.id,
				text: c.choice_text,
				code: (c as { code?: string })?.code,
			})),
		});

		const newAnswers = [
			...answers.filter((a) => a.questionId !== qId),
			{ questionId: qId, choiceId, ...(code && { code }) },
		];

		setAnswers(newAnswers);

		// 밸런스 게임인 경우 로컬에 누적 저장 (DB 저장은 마지막에 한번에)
		if (testType === 'balance') {
			addBalanceGameAnswer(test.test?.id as string, qId, choiceId);
		}

		if (isLastQuestion) {
			console.log('[handleAnswer] 마지막 질문 - 저장할 답변:', newAnswers);
			await saveResult(newAnswers);
			router.push(`/tests/${test.test?.id}/result`);
		} else {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrevious =
		testType === 'psychology' && currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined;

	// Helper Functions

	const saveResult = async (finalAnswers: IAnswer[]) => {
		try {
			if (testType === 'balance') {
				await saveBalanceGameResult(finalAnswers);
			} else if (testType === 'quiz') {
				saveQuizResult(finalAnswers);
			} else if (testType === 'psychology') {
				savePsychologyResult(finalAnswers);
			}
		} catch (err) {
			console.error('Error saving test result:', err);
		}
	};

	const saveBalanceGameResult = async (finalAnswers: IAnswer[]) => {
		try {
			// 1. 로컬에 누적된 모든 선택값을 DB에 일괄 저장
			const localAnswers = getBalanceGameAnswers(test.test?.id as string);
			const choiceIds = localAnswers.map((a) => a.choiceId);

			console.log('[saveBalanceGameResult] DB 일괄 저장 시작:', {
				choiceIds,
				localAnswers,
			});

			await optimizedBalanceGameStatsService.batchIncrementChoices(choiceIds);

			// 2. 세션 스토리지에 답변 저장 (결과 페이지에서 사용)
			saveTestResult({
				testId: test.test?.id,
				answers: finalAnswers,
			});

			// 3. 로컬 누적 답변 초기화
			clearBalanceGameAnswers(test.test?.id as string);

			console.log('[saveBalanceGameResult] 밸런스 게임 결과 저장 완료');
		} catch (error) {
			console.error('[saveBalanceGameResult] 저장 실패:', error);
			// 에러가 발생해도 세션 스토리지에는 저장
			saveTestResult({
				testId: test.test?.id,
				answers: finalAnswers,
			});
		}
	};

	const saveQuizResult = (finalAnswers: IAnswer[]) => {
		// 정답 개수 계산 및 상세 답변 정보 생성
		const detailedAnswers = test.questions.map((q) => {
			const userAnswer = finalAnswers.find((a) => a.questionId === q.id);
			const correctChoice = q.choices?.find((c) => (c as { is_correct?: boolean }).is_correct);
			const isCorrect = userAnswer?.choiceId === correctChoice?.id;

			// 사용자가 선택한 답변과 정답 텍스트
			const userChoice = q.choices?.find((c) => c.id === userAnswer?.choiceId);

			return {
				questionId: q.id as string,
				questionType: 'multiple_choice' as const,
				userAnswer: userChoice?.choice_text || '',
				isCorrect,
				correctAnswer: correctChoice?.choice_text || '',
			};
		});

		const correctCount = detailedAnswers.filter((a) => a.isCorrect).length;
		const score = Math.round((correctCount / totalQuestions) * 100);

		saveTestResult({
			test_id: test.test?.id,
			test_title: test.test?.title || '',
			total_questions: totalQuestions,
			correct_count: correctCount,
			score,
			grade: getGrade(score),
			answers: detailedAnswers,
			completion_time: 0,
		});
	};

	const savePsychologyResult = (finalAnswers: IAnswer[]) => {
		const totalScore = test.questions.reduce((sum, q) => {
			const userAnswer = finalAnswers.find((a) => a.questionId === q.id);
			if (!userAnswer) return sum;

			const selectedChoice = q.choices?.find((c) => c.id === userAnswer.choiceId);
			const choiceScore = (selectedChoice as { score?: number })?.score || 0;

			return sum + choiceScore;
		}, 0);

		const codes = finalAnswers.map((a) => a.code).filter((c): c is string => Boolean(c));

		console.log('[savePsychologyResult] 결과 저장:', {
			finalAnswers,
			extractedCodes: finalAnswers.map((a) => a.code),
			filteredCodes: codes,
			totalScore,
			testId: test.test?.id,
		});

		saveTestResult({
			testId: test.test?.id,
			answers: finalAnswers,
			totalScore,
			codes,
			gender: userGender,
			resultId: 'temp',
		});
	};

	// Render

	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={handleStartTest} />;
	}

	if (currentIndex >= totalQuestions || !currentQuestion) {
		return <Loading variant="result" />;
	}

	if (testType === 'balance') {
		return (
			<BalanceGameQuestionContainer
				key={currentIndex}
				question={currentQuestion}
				currentIndex={currentIndex}
				totalQuestions={totalQuestions}
				testId={test.test?.id as string}
				onAnswer={(choiceId: string) => handleAnswer(choiceId, currentQuestion.id as string)}
				theme={theme}
			/>
		);
	}

	if (testType === 'quiz') {
		return (
			<QuizQuestionContainer
				question={currentQuestion}
				currentIndex={currentIndex}
				totalQuestions={totalQuestions}
				onAnswer={handleAnswer}
				previousAnswer={answers.find((a) => a.questionId === currentQuestion.id)?.choiceId}
				theme={theme}
			/>
		);
	}

	return (
		<PsychologyQuestionContainer
			question={currentQuestion}
			currentIndex={currentIndex}
			totalQuestions={totalQuestions}
			onAnswer={handleAnswer}
			onPrevious={handlePrevious}
			theme={theme}
		/>
	);
}
