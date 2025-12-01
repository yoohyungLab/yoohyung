// ============================================
// constants/quiz.ts
// 퀴즈 관련 설정
// ============================================

export const QUIZ_GRADES = {
	S: { threshold: 95, label: '완벽!', emoji: '🏆' },
	A: { threshold: 85, label: '우수', emoji: '🥇' },
	B: { threshold: 70, label: '양호', emoji: '🥈' },
	C: { threshold: 50, label: '보통', emoji: '🥉' },
	D: { threshold: 0, label: '노력 필요', emoji: '📝' },
} as const;

export type QuizGrade = keyof typeof QUIZ_GRADES;

// 점수로 등급 계산 (유틸이지만 여기가 자연스러움)
export function getQuizGrade(score: number): QuizGrade {
	if (score >= 95) return 'S';
	if (score >= 85) return 'A';
	if (score >= 70) return 'B';
	if (score >= 50) return 'C';
	return 'D';
}
