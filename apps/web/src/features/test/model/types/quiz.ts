import type { TestChoice, TestQuestion } from '@pickid/supabase';

// ============================================================================
// 퀴즈 질문 타입
// ============================================================================

export type TQuestionType = 'multiple_choice' | 'short_answer';

export interface IQuizQuestion {
	id: string;
	question_text: string;
	image_url: string | null;
	question_type: TQuestionType;
	correct_answers: string[] | null; // 주관식 정답 배열
	explanation: string | null; // 해설
	choices: Array<{
		id: string;
		choice_text: string;
		choice_order: number;
		is_correct: boolean; // 객관식 정답 여부
	}>;
}

// ============================================================================
// 퀴즈 답변 타입
// ============================================================================

export interface IQuizAnswer {
	questionId: string;
	questionType: TQuestionType;
	userAnswer: string; // 객관식: choiceId, 주관식: 입력 텍스트
	isCorrect: boolean;
	correctAnswer?: string; // 정답 (표시용)
}

// ============================================================================
// 퀴즈 결과 타입
// ============================================================================

export interface IQuizResult {
	test_id: string;
	test_title: string;
	total_questions: number;
	correct_count: number;
	score: number; // 0-100
	grade: TQuizGrade;
	answers: IQuizAnswer[];
	completion_time: number; // 초
}

export type TQuizGrade = 'S' | 'A' | 'B' | 'C' | 'D';

// ============================================================================
// 퀴즈 통계 타입
// ============================================================================

export interface IQuizStats {
	average_score: number;
	total_attempts: number;
	perfect_score_count: number;
	question_stats: Array<{
		question_id: string;
		correct_rate: number;
	}>;
}

// ============================================================================
// 등급 기준
// ============================================================================

export const QUIZ_GRADE_THRESHOLDS = {
	S: 95,
	A: 85,
	B: 70,
	C: 50,
	D: 0,
} as const;

export const QUIZ_GRADE_EMOJI = {
	S: '🏆',
	A: '🥇',
	B: '🥈',
	C: '🥉',
	D: '📝',
} as const;

export const QUIZ_GRADE_LABEL = {
	S: '완벽!',
	A: '우수',
	B: '양호',
	C: '보통',
	D: '노력 필요',
} as const;
