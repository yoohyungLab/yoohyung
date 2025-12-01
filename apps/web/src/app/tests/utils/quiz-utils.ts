import { QUIZ_GRADES, type QuizGrade } from '@/constants';

export function checkShortAnswer(userAnswer: string, correctAnswers: string[]): boolean {
	const normalized = userAnswer.trim().toLowerCase();
	return correctAnswers.some((answer) => answer.trim().toLowerCase() === normalized);
}

export function getGrade(score: number): QuizGrade {
	if (score >= QUIZ_GRADES.S.threshold) return 'S';
	if (score >= QUIZ_GRADES.A.threshold) return 'A';
	if (score >= QUIZ_GRADES.B.threshold) return 'B';
	if (score >= QUIZ_GRADES.C.threshold) return 'C';
	return 'D';
}
// 퀴즈 점수 계산
export function calculateQuizScore(correctCount: number, totalQuestions: number): number {
	if (totalQuestions === 0) return 0;
	return Math.round((correctCount / totalQuestions) * 100);
}
