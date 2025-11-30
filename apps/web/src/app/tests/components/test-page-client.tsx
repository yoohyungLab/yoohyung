'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TestWithNestedDetails, TestQuestion, TestChoice } from '@pickid/supabase';
import { TestIntro } from './shared/test-intro';
import { Loading } from '@/components/loading';
import { BalanceGameQuestionContainer } from './balance-game/balance-game-question';
import { QuizQuestionContainer } from './quiz';
import { PsychologyQuestionContainer } from './psychology';
import { COLOR_THEMES, TColorTheme } from '@pickid/ui/constants/colors';
import { saveTestResult, getGrade } from '../utils';
import { useBalanceGame } from '../hooks/useTestBalanceGame';
import type { QuestionWithChoices } from '@/app/tests/types/balance-game'; // Add this import

interface TestPageClientProps {
	test: TestWithNestedDetails;
}

type TestType = 'balance' | 'quiz' | 'psychology';

interface IAnswer {
	questionId: string;
	choiceId: string;
	code?: string;
}

/**
 * 밸런스 게임 플레이를 위한 전용 컴포넌트
 */
function BalanceGamePlayer({
	test,
	theme,
	onComplete,
}: {
	test: TestWithNestedDetails;
	theme: TColorTheme;
	onComplete: (answers: Map<string, string>) => void;
}) {
	const {
		currentQuestion,
		currentQuestionIndex,
		totalQuestions,
		currentQuestionStats,
		handleSelectChoice,
		isLoading,
		isCompleted,
		submitAnswers,
		answers,
	} = useBalanceGame({ testId: test.test?.id ?? '', questions: test.questions as QuestionWithChoices[] });

	const [showResult, setShowResult] = useState(false);
	const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

	const handleChoice = (choiceId: string) => {
		if (!currentQuestion) return;
		setSelectedChoiceId(choiceId);
		handleSelectChoice(currentQuestion.id, choiceId);
		setShowResult(true);
	};

	const handleNext = () => {
		setShowResult(false);
		setSelectedChoiceId(null);
		// The useBalanceGame hook automatically increments the index via handleSelectChoice
	};

	useEffect(() => {
		if (isCompleted) {
			submitAnswers(); // 서버에 최종 답변 일괄 제출 (fire and forget)
			onComplete(answers); // 부모 컴포넌트에 완료 및 답변 전달
		}
	}, [isCompleted, submitAnswers, onComplete, answers]);

	if (isLoading) return <Loading />;
	if (!currentQuestion) return <Loading variant="result" />;

	return (
		<BalanceGameQuestionContainer
			question={currentQuestion as TestQuestion & { choices: TestChoice[] }}
			questionStats={currentQuestionStats}
			currentIndex={currentQuestionIndex}
			totalQuestions={totalQuestions}
			onSelectChoice={handleChoice}
			theme={theme}
			isResultVisible={showResult}
			selectedChoiceId={selectedChoiceId}
			onNext={handleNext}
		/>
	);
}

/**
 * 테스트 유형에 따라 적절한 문제 컴포넌트를 렌더링하는 클라이언트 컨트롤러
 */
export function TestPageClient({ test }: TestPageClientProps) {
	const router = useRouter();
	const testType: TestType = (test.test?.type as TestType) || 'psychology';

	const [isStarting, setIsStarting] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<IAnswer[]>([]);
	const [userGender, setUserGender] = useState<'male' | 'female' | undefined>(undefined);

	const theme = { name: 'rose', ...COLOR_THEMES.rose };
	const totalQuestions = test.questions.length;
	const currentQuestion = test.questions[currentIndex];
	const isLastQuestion = currentIndex >= totalQuestions - 1;

	const handleStartTest = (gender?: 'male' | 'female') => {
		setUserGender(gender);
		setIsStarting(false);
	};

	// 퀴즈, 심리테스트용 답변 처리기
	const handleAnswer = async (choiceId: string, questionId?: string) => {
		const qId = questionId || (currentQuestion.id as string);
		const selectedChoice = currentQuestion.choices?.find((c) => c.id === choiceId);
		const code = (selectedChoice as { code?: string })?.code;

		const newAnswers = [
			...answers.filter((a) => a.questionId !== qId),
			{ questionId: qId, choiceId, ...(code && { code }) },
		];
		setAnswers(newAnswers);

		if (isLastQuestion) {
			await saveResult(newAnswers);
			router.push(`/tests/${test.test?.id}/result`);
		} else {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrevious =
		testType === 'psychology' && currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined;

	// 결과 저장 로직 (밸런스 게임 제외)
	const saveResult = async (finalAnswers: IAnswer[]) => {
		try {
			if (testType === 'quiz') {
				saveQuizResult(finalAnswers);
			} else if (testType === 'psychology') {
				savePsychologyResult(finalAnswers);
			}
		} catch (err) {
			console.error('Error saving test result:', err);
		}
	};

	// 밸런스 게임 완료시 호출될 콜백
	const handleBalanceGameComplete = (finalAnswers: Map<string, string>) => {
		saveTestResult({
			testId: test.test?.id,
			answers: Array.from(finalAnswers.entries()).map(([questionId, choiceId]) => ({ questionId, choiceId })),
		});
		router.push(`/tests/${test.test?.id}/result`);
	};

	const saveQuizResult = (finalAnswers: IAnswer[]) => {
		const detailedAnswers = test.questions.map((q) => {
			const userAnswer = finalAnswers.find((a) => a.questionId === q.id);
			const correctChoice = q.choices?.find((c) => (c as { is_correct?: boolean }).is_correct);
			const isCorrect = userAnswer?.choiceId === correctChoice?.id;
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
			testId: test.test?.id,
			test_title: test.test?.title || '',
			total_questions: totalQuestions,
			correct_count: correctCount,
			score,
			grade: getGrade(score),
			answers: detailedAnswers,
		});
	};

	const savePsychologyResult = (finalAnswers: IAnswer[]) => {
		const totalScore = finalAnswers.reduce((sum, answer) => {
			const question = test.questions.find((q) => q.id === answer.questionId);
			const choice = question?.choices?.find((c) => c.id === answer.choiceId);
			return sum + ((choice as { score?: number })?.score || 0);
		}, 0);
		const codes = finalAnswers.map((a) => a.code).filter((c): c is string => Boolean(c));
		saveTestResult({
			testId: test.test?.id,
			answers: finalAnswers,
			totalScore,
			codes,
			gender: userGender,
		});
	};

	if (isStarting) {
		return <TestIntro test={test} theme={theme} onStart={handleStartTest} />;
	}

	if (!currentQuestion) {
		return <Loading variant="result" />;
	}

	// 테스트 타입에 따라 다른 컴포넌트 렌더링
	switch (testType) {
		case 'balance':
			return <BalanceGamePlayer test={test} theme={theme} onComplete={handleBalanceGameComplete} />;
		case 'quiz':
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
		case 'psychology':
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
		default:
			return <div>지원하지 않는 테스트 타입입니다.</div>;
	}
}
