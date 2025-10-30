import { useMemo } from 'react';
import type { IQuizQuestion, IQuizAnswer, TQuizGrade } from '../model/types/quiz';
import { QUIZ_GRADE_THRESHOLDS } from '../model/types/quiz';

// ============================================================================
// 채점 유틸리티 함수
// ============================================================================

/**
 * 주관식 답변 정답 여부 판단
 * - 대소문자 무시
 * - 앞뒤 공백 제거
 */
const checkShortAnswer = (userAnswer: string, correctAnswers: string[]): boolean => {
	const normalized = userAnswer.trim().toLowerCase();
	return correctAnswers.some((answer) => answer.trim().toLowerCase() === normalized);
};

/**
 * 객관식 답변 정답 여부 판단
 */
const checkMultipleChoice = (choiceId: string, question: IQuizQuestion): boolean => {
	const choice = question.choices.find((c) => c.id === choiceId);
	return choice?.is_correct || false;
};

/**
 * 점수를 등급으로 변환
 */
const getGrade = (score: number): TQuizGrade => {
	if (score >= QUIZ_GRADE_THRESHOLDS.S) return 'S';
	if (score >= QUIZ_GRADE_THRESHOLDS.A) return 'A';
	if (score >= QUIZ_GRADE_THRESHOLDS.B) return 'B';
	if (score >= QUIZ_GRADE_THRESHOLDS.C) return 'C';
	return 'D';
};

// ============================================================================
// 훅
// ============================================================================

interface UseQuizGradingProps {
	questions: IQuizQuestion[];
	userAnswers: Map<string, string>; // questionId -> answer (choiceId or text)
}

export function useQuizGrading({ questions, userAnswers }: UseQuizGradingProps) {
	const gradedAnswers = useMemo<IQuizAnswer[]>(() => {
		return questions.map((question) => {
			const userAnswer = userAnswers.get(question.id) || '';
			let isCorrect = false;
			let correctAnswer = '';

			if (question.question_type === 'short_answer') {
				// 주관식 채점
				isCorrect = checkShortAnswer(userAnswer, question.correct_answers || []);
				correctAnswer = question.correct_answers?.[0] || '';
			} else {
				// 객관식 채점
				isCorrect = checkMultipleChoice(userAnswer, question);
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
	}, [questions, userAnswers]);

	const correctCount = useMemo(() => {
		return gradedAnswers.filter((a) => a.isCorrect).length;
	}, [gradedAnswers]);

	const score = useMemo(() => {
		if (questions.length === 0) return 0;
		return Math.round((correctCount / questions.length) * 100);
	}, [correctCount, questions.length]);

	const grade = useMemo(() => getGrade(score), [score]);

	return {
		gradedAnswers,
		correctCount,
		totalQuestions: questions.length,
		score,
		grade,
	};
}
