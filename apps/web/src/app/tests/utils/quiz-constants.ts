// Quiz 관련 상수

export type TQuizGrade = 'S' | 'A' | 'B' | 'C' | 'D';

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
