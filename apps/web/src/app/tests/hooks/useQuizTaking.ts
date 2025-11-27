import { useState, useCallback } from 'react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { saveTestResult } from '../utils/session-storage';
import { checkShortAnswer, getGrade, calculateQuizScore } from '../utils/quiz-utils';
import type { IQuizQuestion, IQuizResult, TQuestionType, IQuizAnswer } from '../types/quiz';

interface UseQuizTakingProps {
	test: TestWithNestedDetails;
	onComplete: (result: IQuizResult) => void;
}

function convertToQuizQuestion(q: TestWithNestedDetails['questions'][0]): IQuizQuestion {
	let questionType: TQuestionType = 'multiple_choice';
	const rawType = q.question_type as string | null;

	if (rawType === 'short_answer' || rawType === 'subjective') {
		questionType = 'short_answer';
	} else if (rawType === 'multiple_choice') {
		questionType = 'multiple_choice';
	}

	return {
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
}

// 퀴즈 답변 채점 (순수 함수)
function gradeQuizAnswers(questions: IQuizQuestion[], userAnswers: Map<string, string>): IQuizAnswer[] {
	return questions.map((question) => {
		const userAnswer = userAnswers.get(question.id) || '';
		let isCorrect = false;
		let correctAnswer = '';

		if (question.question_type === 'short_answer') {
			isCorrect = checkShortAnswer(userAnswer, question.correct_answers || []);
			correctAnswer = question.correct_answers?.[0] || '';
		} else {
			const selectedChoice = question.choices.find((c) => c.id === userAnswer);
			isCorrect = selectedChoice?.is_correct || false;
			const correctChoice = question.choices.find((c) => c.is_correct);
			correctAnswer = correctChoice?.choice_text || '';
		}

		return {
			questionId: question.id,
			questionType: question.question_type,
			userAnswer,
			isCorrect,
			correctAnswer,
		};
	});
}

export function useQuizTaking({ test, onComplete }: UseQuizTakingProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
	const [startTime] = useState(Date.now());

	const questions: IQuizQuestion[] = (test?.questions || []).map(convertToQuizQuestion);
	const currentQuestion = questions[currentQuestionIndex];
	const totalQuestions = questions.length;
	const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

	const handleAnswer = useCallback(
		(answer: string) => {
			const newAnswers = new Map(userAnswers);
			newAnswers.set(currentQuestion.id, answer);
			setUserAnswers(newAnswers);

			if (isLastQuestion) {
				const completionTime = Math.floor((Date.now() - startTime) / 1000);

				// 채점
				const gradedAnswers = gradeQuizAnswers(questions, newAnswers);
				const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
				const score = calculateQuizScore(correctCount, totalQuestions);
				const grade = getGrade(score);

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

				saveTestResult(result);
				onComplete(result);
			} else {
				setCurrentQuestionIndex((prev) => prev + 1);
			}
		},
		[currentQuestion, isLastQuestion, userAnswers, test, questions, totalQuestions, startTime, onComplete]
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
