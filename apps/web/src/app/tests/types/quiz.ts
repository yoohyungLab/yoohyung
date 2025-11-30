export type TQuestionType = 'multiple_choice' | 'short_answer';

export interface IQuizAnswer {
	questionId: string;
	questionText?: string;
	questionType?: TQuestionType;
	userAnswer: string;
	correctAnswer: string;
	isCorrect: boolean;
	explanation?: string | null;
}

export interface IQuizQuestion {
	id: string;
	question_text: string;
	image_url?: string | null;
	question_type: TQuestionType;
	choices?: Array<{
		id: string;
		choice_text: string;
		choice_order?: number;
		is_correct: boolean;
	}>;
	correct_answers?: string | string[] | null;
	explanation?: string | null;
}

export interface IQuizResult {
	test_id: string;
	test_title: string;
	total_questions: number;
	correct_count: number;
	score: number;
	grade: string;
	answers: IQuizAnswer[];
	completion_time: number;
}
