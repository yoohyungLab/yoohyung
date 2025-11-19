/**
 * Quiz 관련 유틸리티 함수
 */

import { QUIZ_GRADE_THRESHOLDS, type TQuizGrade } from './quiz-constants';

/**
 * 주관식 답변 정답 여부 판단 (대소문자 무시, 공백 제거)
 */
export function checkShortAnswer(userAnswer: string, correctAnswers: string[]): boolean {
	const normalized = userAnswer.trim().toLowerCase();
	return correctAnswers.some((answer) => answer.trim().toLowerCase() === normalized);
}

/**
 * 점수를 등급으로 변환
 */
export function getGrade(score: number): TQuizGrade {
	if (score >= QUIZ_GRADE_THRESHOLDS.S) return 'S';
	if (score >= QUIZ_GRADE_THRESHOLDS.A) return 'A';
	if (score >= QUIZ_GRADE_THRESHOLDS.B) return 'B';
	if (score >= QUIZ_GRADE_THRESHOLDS.C) return 'C';
	return 'D';
}

/**
 * 퀴즈 점수 계산
 */
export function calculateQuizScore(correctCount: number, totalQuestions: number): number {
	if (totalQuestions === 0) return 0;
	return Math.round((correctCount / totalQuestions) * 100);
}
