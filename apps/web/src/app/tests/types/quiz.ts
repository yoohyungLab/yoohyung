/**
 * Quiz 관련 타입 정의
 * 상수는 shared/constants/quiz.ts에 있음
 */

import type { TQuizGrade } from '@/constants';

export type TQuestionType = 'multiple_choice' | 'short_answer';

export interface IQuizQuestion {
	id: string;
	question_text: string;
	image_url: string | null;
	question_type: TQuestionType;
	correct_answers: string[] | null;
	explanation: string | null;
	choices: Array<{
		id: string;
		choice_text: string;
		choice_order: number;
		is_correct: boolean;
	}>;
}

export interface IQuizAnswer {
	questionId: string;
	questionType: TQuestionType;
	userAnswer: string;
	isCorrect: boolean;
	correctAnswer?: string;
}

export interface IQuizResult {
	test_id: string;
	test_title: string;
	total_questions: number;
	correct_count: number;
	score: number;
	grade: TQuizGrade;
	answers: IQuizAnswer[];
	completion_time: number;
}
