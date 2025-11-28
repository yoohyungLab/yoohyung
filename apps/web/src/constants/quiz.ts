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
