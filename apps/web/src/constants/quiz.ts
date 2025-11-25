/**
 * Quiz Constants
 *
 * 퀴즈 등급, 임계값, 레이블 등을 정의합니다.
 */

export type TQuizGrade = 'S' | 'A' | 'B' | 'C' | 'D';

// 등급별 임계값 (점수 %)
export const QUIZ_GRADE_THRESHOLDS = {
	S: 95,
	A: 85,
	B: 70,
	C: 50,
	D: 0,
} as const;

// 등급별 이모지
export const QUIZ_GRADE_EMOJI = {
	S: '🏆',
	A: '🥇',
	B: '🥈',
	C: '🥉',
	D: '📝',
} as const;

// 등급별 레이블
export const QUIZ_GRADE_LABEL = {
	S: '완벽!',
	A: '우수',
	B: '양호',
	C: '보통',
	D: '노력 필요',
} as const;

// 등급별 색상
export const QUIZ_GRADE_COLOR = {
	S: 'from-yellow-400 to-amber-500',
	A: 'from-blue-400 to-indigo-500',
	B: 'from-green-400 to-emerald-500',
	C: 'from-orange-400 to-amber-500',
	D: 'from-gray-400 to-slate-500',
} as const;
