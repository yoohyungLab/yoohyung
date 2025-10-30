'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { IQuizResult } from '../../model/types/quiz';
import { QUIZ_GRADE_EMOJI, QUIZ_GRADE_LABEL } from '../../model/types/quiz';
import { useQuizResult } from '../../hooks/use-quiz-result';
import { Loading } from '@/shared/ui/loading';
import { Button } from '@pickid/ui';
import { Share2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export function QuizResultContainer() {
	const router = useRouter();
	const params = useParams();
	const testId = params?.id as string;
	const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);

	const { resultMessage, isLoading: isLoadingMessage } = useQuizResult(testId);

	useEffect(() => {
		try {
			const savedResult = sessionStorage.getItem('quizResult');
			if (savedResult) {
				setQuizResult(JSON.parse(savedResult));
			}
		} catch (e) {
			console.error('Failed to load quiz result:', e);
		}
	}, []);

	const isLoading = isLoadingMessage;

	const handleRetry = () => {
		sessionStorage.removeItem('quizResult');
		router.refresh();
	};

	const handleShare = () => {
		if (quizResult) {
			const text = `${quizResult.test_title} 퀴즈 결과\n${quizResult.correct_count}/${
				quizResult.total_questions
			} 정답 (${quizResult.score}점)\n등급: ${QUIZ_GRADE_LABEL[quizResult.grade]} ${
				QUIZ_GRADE_EMOJI[quizResult.grade]
			}`;

			if (navigator.share) {
				navigator.share({
					title: '퀴즈 결과',
					text,
				});
			} else {
				navigator.clipboard.writeText(text);
				alert('결과가 클립보드에 복사되었습니다!');
			}
		}
	};

	if (isLoading) {
		return <Loading variant="result" />;
	}

	if (!quizResult) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
				<article className="w-full max-w-[420px] bg-white rounded-[2rem] p-6 shadow-2xl text-center">
					<h2 className="text-lg font-bold text-gray-800 mb-2">결과를 찾을 수 없습니다</h2>
					<p className="text-sm text-gray-600">퀴즈를 다시 시도해주세요.</p>
				</article>
			</div>
		);
	}

	const getGradeColor = (grade: string) => {
		switch (grade) {
			case 'S':
				return 'from-yellow-400 to-orange-400';
			case 'A':
				return 'from-blue-400 to-indigo-500';
			case 'B':
				return 'from-green-400 to-emerald-500';
			case 'C':
				return 'from-yellow-500 to-amber-500';
			default:
				return 'from-gray-400 to-gray-500';
		}
	};

	const getScoreMessage = (score: number) => {
		if (score >= 95) return '완벽합니다! 🏆';
		if (score >= 85) return '훌륭해요! 🌟';
		if (score >= 70) return '잘했어요! 👍';
		if (score >= 50) return '괜찮아요! 💪';
		return '다시 도전해보세요! 📚';
	};

	const gradeColor = getGradeColor(quizResult.grade);

	return (
		<div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<div className="max-w-3xl mx-auto space-y-6">
				{/* 점수 카드 */}
				<article className="bg-white rounded-[2rem] p-8 shadow-2xl">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-800 mb-4">{quizResult.test_title}</h1>

						<div className="mb-6">
							<div
								className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${gradeColor} text-white text-6xl font-bold shadow-xl`}
							>
								{QUIZ_GRADE_EMOJI[quizResult.grade]}
							</div>
						</div>

						{/* 점수 - 실제 시험지 스타일 */}
						<div className="mb-6">
							<div className="inline-block relative">
								<div
									className="text-7xl font-black text-red-600 mb-1 tracking-tight"
									style={{ fontFamily: 'Georgia, serif' }}
								>
									{quizResult.score}
									<span className="text-4xl align-super">점</span>
								</div>
								<div className="absolute -bottom-1 left-0 right-0 h-1 bg-red-600 rounded-full"></div>
							</div>
							<div className="text-lg text-gray-700 mt-4 font-semibold">
								{quizResult.correct_count} / {quizResult.total_questions} 정답
							</div>
							<div className="text-base text-indigo-600 mt-2 font-medium">{getScoreMessage(quizResult.score)}</div>
						</div>

						<div
							className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${gradeColor} text-white font-bold text-xl shadow-lg`}
						>
							{resultMessage?.result_name || `${quizResult.grade}등급 - ${QUIZ_GRADE_LABEL[quizResult.grade]}`}
						</div>

						{resultMessage?.description && (
							<div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
								<p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
									{resultMessage.description}
								</p>
							</div>
						)}

						<div className="mt-6 text-sm text-gray-500">소요 시간: {quizResult.completion_time}초</div>
					</div>

					{/* 버튼 */}
					<div className="flex gap-3 mt-8">
						<Button onClick={handleShare} variant="outline" className="flex-1 py-3 border-2">
							<Share2 className="w-5 h-5 mr-2" />
							공유하기
						</Button>
						<Button
							onClick={handleRetry}
							className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
						>
							<RefreshCw className="w-5 h-5 mr-2" />
							다시 풀기
						</Button>
					</div>
				</article>

				{/* 문제별 리뷰 */}
				<article className="bg-white rounded-[2rem] p-8 shadow-2xl">
					<h2 className="text-xl font-bold text-gray-900 mb-6">문제별 상세 결과</h2>

					<div className="space-y-4">
						{quizResult.answers.map((answer, index) => (
							<div
								key={answer.questionId}
								className={`p-5 rounded-xl border-2 ${
									answer.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
								}`}
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0">
										{answer.isCorrect ? (
											<CheckCircle className="w-6 h-6 text-green-600" />
										) : (
											<XCircle className="w-6 h-6 text-red-600" />
										)}
									</div>

									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span className="font-bold text-gray-700">문제 {index + 1}</span>
											<span
												className={`px-2 py-1 rounded-full text-xs font-semibold ${
													answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
												}`}
											>
												{answer.isCorrect ? '정답' : '오답'}
											</span>
										</div>

										{!answer.isCorrect && (
											<div className="text-sm space-y-1">
												<div className="text-gray-700">
													<span className="font-medium">당신의 답:</span> {answer.userAnswer}
												</div>
												<div className="text-green-700">
													<span className="font-medium">정답:</span> {answer.correctAnswer}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</article>
			</div>
		</div>
	);
}
