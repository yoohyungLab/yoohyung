import { useState, useCallback } from 'react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { IQuizQuestion, IQuizResult, TQuestionType } from '../model/types/quiz';
import { useQuizGrading } from './use-quiz-grading';

interface UseQuizTakingProps {
	test: TestWithNestedDetails;
	onComplete: (result: IQuizResult) => void;
}

export function useQuizTaking({ test, onComplete }: UseQuizTakingProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
	const [startTime] = useState(Date.now());

	// 질문을 IQuizQuestion 타입으로 변환
	const questions: IQuizQuestion[] = (test?.questions || []).map((q) => {
		// question_type 변환: 'subjective' -> 'short_answer', 기본값은 'multiple_choice'
		let questionType: TQuestionType = 'multiple_choice';
		const rawType = q.question_type as string | null;

		if (rawType === 'short_answer' || rawType === 'subjective') {
			questionType = 'short_answer';
		} else if (rawType === 'multiple_choice') {
			questionType = 'multiple_choice';
		}

		const question: IQuizQuestion = {
			id: q.id as string,
			question_text: q.question_text as string,
			image_url: q.image_url as string | null,
			question_type: questionType,
			correct_answers: (q.correct_answers as string[] | null) || null,
			explanation: (q.explanation as string | null) || null,
			choices: (q.choices || []).map((c) => ({
				id: c.id as string,
				choice_text: c.choice_text as string,
				choice_order: c.choice_order as number,
				is_correct: (c.is_correct as boolean) || false,
			})),
		};

		return question;
	});

	const currentQuestion = questions[currentQuestionIndex];
	const totalQuestions = questions.length;
	const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

	const { gradedAnswers, correctCount, score, grade } = useQuizGrading({
		questions,
		userAnswers,
	});

	const handleAnswer = useCallback(
		(answer: string) => {
			// 답변 저장
			const newAnswers = new Map(userAnswers);
			newAnswers.set(currentQuestion.id, answer);
			setUserAnswers(newAnswers);

			// 마지막 질문이면 완료 처리
			if (isLastQuestion) {
				const completionTime = Math.floor((Date.now() - startTime) / 1000);

				// 채점 결과 생성
				const result: IQuizResult = {
					test_id: (test?.test?.id as string) || '',
					test_title: (test?.test?.title as string) || '',
					total_questions: totalQuestions,
					correct_count: correctCount,
					score,
					grade,
					answers: gradedAnswers,
					completion_time: completionTime,
				};

				// 세션 스토리지에 저장
				try {
					if (typeof window !== 'undefined') {
						sessionStorage.setItem('quizResult', JSON.stringify(result));
					}
				} catch (e) {
					console.error('Failed to save quiz result:', e);
				}

				onComplete(result);
			} else {
				// 다음 질문으로
				setCurrentQuestionIndex((prev) => prev + 1);
			}
		},
		[
			currentQuestion,
			isLastQuestion,
			userAnswers,
			test,
			totalQuestions,
			correctCount,
			score,
			grade,
			gradedAnswers,
			startTime,
			onComplete,
		]
	);

	const handlePrevious = useCallback(() => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	}, [currentQuestionIndex]);

	const progress = {
		current: currentQuestionIndex + 1,
		total: totalQuestions,
		percentage: Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100),
		isCompleted: false,
	};

	return {
		currentQuestion,
		currentQuestionIndex,
		totalQuestions,
		userAnswers,
		progress,
		handleAnswer,
		handlePrevious,
	};
}
