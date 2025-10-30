'use client';

import { useState, useCallback } from 'react';
import { useBalanceGameQuestionStats, useOptimizedBalanceGameChoiceCount } from '@/shared/hooks';
import { Button } from '@pickid/ui';
import { calculateProgress } from '@/shared/lib/balance-game';
import type { IBalanceGameQuestionProps } from '@/shared/types';
import Image from 'next/image';

export function BalanceGameQuestion({
	question,
	onAnswer,
	questionNumber,
	totalQuestions,
	testId,
}: IBalanceGameQuestionProps) {
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);

	const { data: stats, isLoading, error } = useBalanceGameQuestionStats(testId || '', question.id as string);
	const {
		stats: choiceStats,
		incrementChoiceCount,
		isLoading: isOptimizedLoading,
	} = useOptimizedBalanceGameChoiceCount(question.id as string);

	const progressPercentage = calculateProgress(questionNumber, totalQuestions);
	const handleChoiceSelect = useCallback(
		(choiceId: string) => {
			setSelectedChoice(choiceId);
			incrementChoiceCount(choiceId);
			setTimeout(() => setShowResult(true), 300);
		},
		[incrementChoiceCount]
	);

	const handleNext = useCallback(() => {
		if (selectedChoice) onAnswer(question.id as string, selectedChoice);
	}, [selectedChoice, onAnswer, question.id]);

	if (!showResult) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-rose-50 via-white to-amber-100">
				<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl">
					<header className="relative mb-6">
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs font-bold text-rose-600">
								{questionNumber} / {totalQuestions}
							</span>
						</div>
						<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-pink-500 to-amber-500 rounded-full transition-all duration-500"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
					</header>

					<section className="relative mb-8 text-center">
						<h2 className="text-lg font-bold text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
							{question.question_text as string}
						</h2>
						{question.image_url && (
							<div className="mb-4 relative w-full max-w-[360px] mx-auto aspect-video">
								<Image
									src={question.image_url as string}
									alt="질문 이미지"
									fill
									sizes="(max-width: 768px) 100vw, 360px"
									className="object-contain rounded-2xl border border-rose-100 shadow-sm bg-white"
									priority={false}
								/>
							</div>
						)}
					</section>

					<div className="grid grid-cols-2 gap-4">
						{question.choices?.map((choice, index) => (
							<Button
								key={choice.id as string}
								onClick={() => handleChoiceSelect(choice.id as string)}
								variant="outline"
								className="h-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-gray-900 rounded-3xl transition-all hover:shadow-lg"
							>
								<div className="text-center space-y-3">
									<div
										className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
											index === 0 ? 'bg-rose-100' : 'bg-amber-100'
										}`}
									>
										<span className={`font-bold text-sm ${index === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
											{index === 0 ? 'A' : 'B'}
										</span>
									</div>
									<p className="text-sm font-semibold text-gray-800 leading-snug break-words">
										{choice.choice_text as string}
									</p>
								</div>
							</Button>
						))}
					</div>
				</article>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-rose-50 via-white to-amber-100">
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl">
				<header className="relative mb-6">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-rose-600">
							{questionNumber} / {totalQuestions}
						</span>
					</div>
					<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-pink-500 to-amber-500 rounded-full transition-all duration-500"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</header>

				<section className="relative mb-8 text-center">
					<h2 className="text-lg font-bold text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
						{question.question_text as string}
					</h2>
				</section>

				{(isOptimizedLoading || isLoading) && !selectedChoice && (
					<div className="space-y-3 animate-pulse mb-6">
						<div className="h-16 bg-gray-200 rounded-2xl" />
						<div className="h-16 bg-gray-200 rounded-2xl" />
					</div>
				)}

				{error && (
					<div className="text-center py-4 mb-6">
						<p className="text-sm text-gray-500">통계를 불러올 수 없습니다</p>
					</div>
				)}

				<div className="space-y-3 mb-6">
					{(() => {
						// 1) 우선 데이터 소스 선택 (최적화 쿼리 우선)
						const baseStats =
							choiceStats?.choiceStats?.map((cs) => ({
								choiceId: cs.choiceId,
								responseCount: cs.responseCount,
							})) ||
							stats?.choiceStats?.map((cs) => ({
								choiceId: cs.choiceId,
								responseCount: cs.count,
							})) ||
							[];

						// 2) 로컬 낙관적 업데이트 (+1)
						const localStats = question.choices.map((c) => {
							const found = baseStats.find((s) => s.choiceId === c.id);
							const baseCount = found?.responseCount || 0;
							const adjusted = selectedChoice && c.id === selectedChoice ? baseCount + 1 : baseCount;
							return { choiceId: c.id, count: adjusted };
						});
						const total = localStats.reduce((sum, s) => sum + s.count, 0);
						const getDisplay = (choiceId: string) => {
							const entry = localStats.find((s) => s.choiceId === choiceId);
							const count = entry?.count || 0;
							const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
							return { count, percentage };
						};

						return question.choices?.map((choice, index) => {
							const isSelected = selectedChoice === choice.id;
							const { percentage, count } = getDisplay(choice.id as string);

							return (
								<div
									key={choice.id as string}
									className={
										'relative rounded-2xl p-4 transition-all ' +
										(isSelected
											? index === 0
												? 'bg-gradient-to-br from-rose-50 to-amber-50 border-2 border-rose-200'
												: 'bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-200'
											: 'bg-gray-50 border border-gray-200')
									}
								>
									<div className="flex items-start justify-between mb-2 gap-2">
										<div className="flex items-start gap-3 flex-1 min-w-0">
											<span className="text-xs font-bold flex-shrink-0 mt-0.5 text-gray-700">
												{index === 0 ? 'A' : 'B'}
											</span>
											<span className="text-sm font-semibold break-words text-gray-900">
												{choice.choice_text as string}
											</span>
											{isSelected && (
												<span
													className={
														'text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ' +
														(index === 0 ? 'bg-rose-200 text-rose-700' : 'bg-amber-200 text-amber-700')
													}
												>
													선택
												</span>
											)}
										</div>
										<div className="text-right flex-shrink-0">
											<span className="text-sm font-bold text-gray-900">{percentage}%</span>
											<span className="text-xs ml-1 text-gray-600">({count.toLocaleString()}명)</span>
										</div>
									</div>
									<div
										className={
											'h-2 rounded-full overflow-hidden ' +
											(isSelected ? (index === 0 ? 'bg-rose-100' : 'bg-amber-100') : 'bg-gray-200')
										}
									>
										<div
											className={
												'h-full transition-all duration-1000 ' +
												(isSelected
													? index === 0
														? 'bg-gradient-to-r from-pink-400 to-amber-400'
														: 'bg-gradient-to-r from-amber-400 to-rose-400'
													: 'bg-gray-400')
											}
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							);
						});
					})()}
				</div>

				<Button
					onClick={handleNext}
					size="xl"
					className="w-full font-bold rounded-2xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600"
				>
					{questionNumber < totalQuestions ? '다음 질문' : '결과 보기'}
				</Button>
			</article>
		</div>
	);
}
