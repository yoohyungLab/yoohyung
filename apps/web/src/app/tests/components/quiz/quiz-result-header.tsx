'use client';

import type { IQuizResult } from '../../types/quiz';

interface IQuizResultHeaderProps {
	quizResult: IQuizResult;
	themeColor: string;
	grade: string;
}

export function QuizResultHeader({ quizResult, themeColor, grade }: IQuizResultHeaderProps) {
	const percentage = quizResult.total_questions > 0
		? ((quizResult.correct_count / quizResult.total_questions) * 100).toFixed(0)
		: 0;

	return (
		<header className="px-5 py-4 text-center">
			<p className="text-sm font-semibold text-white/80 mb-2">{quizResult.test_title}</p>

			<h1 className="text-3xl font-extrabold text-white mb-6">당신의 퀴즈 결과</h1>

			<div className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-xs mx-auto mb-6">
				<p className="text-sm font-bold text-gray-500 mb-2">획득 점수</p>

				<p className="text-8xl font-black leading-none mb-2 text-[#DC2626]">
					{quizResult.score}
				</p>

				<div
					className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
					style={{ backgroundColor: themeColor }}
				>
					{grade} Grade
				</div>
			</div>

			<p className="text-lg font-medium text-white/90">
				<span className="font-bold">정답 개수:</span> {quizResult.correct_count} / {quizResult.total_questions} 문항
			</p>
			<p className="text-xl font-extrabold text-white">정답률: {percentage}%</p>
		</header>
	);
}
