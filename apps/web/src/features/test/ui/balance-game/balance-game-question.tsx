'use client';

import { useState, useCallback } from 'react';
import { useBalanceGameQuestionStats, useOptimizedBalanceGameChoiceCount } from '@/shared/hooks';
import { Button } from '@pickid/ui';
import { calculateProgress, findChoiceStat } from '@/shared/lib/balance-game';
import type { IBalanceGameQuestionProps } from '@/shared/types';

export function BalanceGameQuestion({
	question,
	onAnswer,
	questionNumber,
	totalQuestions,
	testId,
}: IBalanceGameQuestionProps) {
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);

	const {
		data: stats,
		isLoading: statsLoading,
		error: statsError,
	} = useBalanceGameQuestionStats(testId || '', question.id);
	const { stats: choiceStats, incrementChoiceCount } = useOptimizedBalanceGameChoiceCount(question.id);

	const progressPercentage = calculateProgress(questionNumber, totalQuestions);

	const handleChoiceSelect = useCallback(
		(choiceId: string) => {
			setSelectedChoice(choiceId);
			incrementChoiceCount(choiceId);

			setTimeout(() => {
				setShowResult(true);
			}, 300);
		},
		[incrementChoiceCount]
	);

	const handleNext = useCallback(() => {
		if (selectedChoice) {
			onAnswer(question.id, selectedChoice);
		}
	}, [selectedChoice, onAnswer, question.id]);

	const renderProgressHeader = () => (
		<header className="relative mb-6">
			<div className="flex items-center justify-between mb-3">
				<span className="text-xs font-bold text-purple-600">
					{questionNumber} / {totalQuestions}
				</span>
			</div>
			<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
				<div
					className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
					style={{ width: `${progressPercentage}%` }}
				/>
			</div>
		</header>
	);

	const renderQuestionSection = () => (
		<section className="relative mb-8 text-center">
			<h2 className="text-lg font-bold text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
				{question.question_text}
			</h2>
		</section>
	);

	const renderChoiceButton = (choice: { id: string; choice_text: string; emoji?: string }, index: number) => (
		<Button
			key={choice.id}
			onClick={() => handleChoiceSelect(choice.id)}
			variant="outline"
			className="group relative h-full p-0 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-gray-900 rounded-3xl transition-all hover:shadow-lg"
		>
			<div className="w-full h-full p-6 flex items-center">
				<div className="text-center space-y-3 w-full">
					<div
						className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
							index === 0 ? 'bg-purple-100' : 'bg-pink-100'
						}`}
					>
						<span className={`font-bold text-sm ${index === 0 ? 'text-purple-600' : 'text-pink-600'}`}>
							{index === 0 ? 'A' : 'B'}
						</span>
					</div>
					<p className="text-sm font-semibold text-gray-800 leading-snug break-words whitespace-pre-wrap">
						{choice.choice_text}
					</p>
				</div>
			</div>
		</Button>
	);

	const renderResultChoice = (choice: { id: string; choice_text: string; emoji?: string }, index: number) => {
		const isSelected = selectedChoice === choice.id;

		const { percentage, count } = findChoiceStat(
			choice.id,
			choiceStats?.choiceStats?.map((cs) => ({
				id: cs.choiceId,
				choice_text: cs.choiceText,
				choiceId: cs.choiceId,
				choiceText: cs.choiceText,
				responseCount: cs.responseCount,
				percentage: cs.percentage,
			})),
			stats?.choiceStats?.map((cs) => ({
				id: cs.choiceId,
				choice_text: cs.choiceText,
				choiceId: cs.choiceId,
				choiceText: cs.choiceText,
				responseCount: cs.count,
				percentage: cs.percentage,
			}))
		);

		return (
			<div
				key={choice.id}
				className={`relative rounded-2xl p-4 transition-all ${
					isSelected
						? index === 0
							? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
							: 'bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200'
						: 'bg-gray-50 border border-gray-200'
				}`}
			>
				<div className="flex items-start justify-between mb-2 gap-2">
					<div className="flex items-start gap-3 flex-1 min-w-0">
						<span
							className={`text-xs font-bold flex-shrink-0 mt-0.5 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}
						>
							{index === 0 ? 'A' : 'B'}
						</span>
						<span className={`text-sm font-semibold break-words ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
							{choice.choice_text}
						</span>
						{isSelected && (
							<span
								className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
									index === 0 ? 'bg-purple-200 text-purple-700' : 'bg-pink-200 text-pink-700'
								}`}
							>
								선택
							</span>
						)}
					</div>
					<div className="text-right flex-shrink-0">
						<span className={`text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>{percentage}%</span>
						<span className={`text-xs ml-1 ${isSelected ? 'text-gray-600' : 'text-gray-600'}`}>
							({count.toLocaleString()}명)
						</span>
					</div>
				</div>
				<div
					className={`h-2 rounded-full overflow-hidden ${
						isSelected ? (index === 0 ? 'bg-purple-100' : 'bg-pink-100') : 'bg-gray-200'
					}`}
				>
					<div
						className={`h-full transition-all duration-1000 ${
							isSelected
								? index === 0
									? 'bg-gradient-to-r from-purple-400 to-pink-400'
									: 'bg-gradient-to-r from-pink-400 to-rose-400'
								: 'bg-gray-400'
						}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		);
	};

	const renderResultSection = () => (
		<div className="space-y-6">
			{renderQuestionSection()}

			{statsLoading && (
				<section className="space-y-3">
					<div className="animate-pulse">
						<div className="h-16 bg-gray-200 rounded-2xl mb-3"></div>
						<div className="h-16 bg-gray-200 rounded-2xl"></div>
					</div>
				</section>
			)}

			{statsError && (
				<section className="space-y-3">
					<div className="text-center py-4">
						<p className="text-sm text-gray-500">통계를 불러올 수 없습니다</p>
					</div>
				</section>
			)}

			{!statsLoading && !statsError && (
				<section className="space-y-3">{question.choices?.map(renderResultChoice)}</section>
			)}

			<Button
				onClick={handleNext}
				variant="default"
				size="xl"
				className="w-full font-bold rounded-2xl hover:shadow-lg transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
			>
				{questionNumber < totalQuestions ? '다음 질문' : '결과 보기'}
			</Button>
		</div>
	);

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 via-white to-pink-100">
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-30" />
				<div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-30" />

				{renderProgressHeader()}

				{!showResult ? (
					<>
						{renderQuestionSection()}
						<div className="grid grid-cols-2 gap-4 items-stretch">{question.choices?.map(renderChoiceButton)}</div>
					</>
				) : (
					renderResultSection()
				)}
			</article>
		</div>
	);
}
