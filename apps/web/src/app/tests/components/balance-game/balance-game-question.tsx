'use client';

import { Button } from '@pickid/ui';
import Image from 'next/image';
import type { TColorTheme } from '@pickid/ui/constants/colors';
import { QuestionLayout } from '../shared';
import type { TestQuestion, TestChoice } from '@pickid/supabase';

// 훅에서 전달받는 통계 데이터 타입
interface ChoiceStat {
	id: string;
	choice_text: string;
	count: number;
	percentage: number;
}

// 컴포넌트 Props 정의
interface BalanceGameQuestionProps {
	question: TestQuestion & { choices: TestChoice[] };
	questionStats: ChoiceStat[] | null;
	currentIndex: number;
	totalQuestions: number;
	onSelectChoice: (choiceId: string) => void;
	theme: TColorTheme;
	isResultVisible: boolean;
	selectedChoiceId: string | null;
	onNext: () => void;
}

export function BalanceGameQuestionContainer(props: BalanceGameQuestionProps) {
	const {
		question,
		questionStats,
		currentIndex,
		totalQuestions,
		onSelectChoice,
		theme,
		isResultVisible,
		selectedChoiceId,
		onNext,
	} = props;

	const progress = {
		current: currentIndex + 1,
		total: totalQuestions,
		percentage: ((currentIndex + 1) / totalQuestions) * 100,
		isLast: currentIndex + 1 === totalQuestions,
	};

	// 선택 전 UI
	if (!isResultVisible) {
		return (
			<QuestionLayout {...progress} theme={theme}>
				<section className={`bg-gradient-to-br ${theme.question} rounded-xl p-6 mb-8`}>
					<h2 className="text-lg font-bold text-center text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
						{question.question_text}
					</h2>
					{question.image_url && (
						<div className="mt-4 relative w-full max-w-[360px] mx-auto aspect-video">
							<Image
								src={question.image_url}
								alt="질문 이미지"
								fill
								sizes="(max-width: 768px) 100vw, 360px"
								className="object-contain rounded-2xl border border-gray-200 shadow-sm bg-white"
								priority={currentIndex === 0}
							/>
						</div>
					)}
				</section>

				<div className="grid grid-cols-2 gap-4">
					{question.choices?.map((choice, index) => (
						<Button
							key={choice.id}
							onClick={() => onSelectChoice(choice.id)}
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
								<p className="text-sm font-semibold text-gray-800 leading-snug break-words">{choice.choice_text}</p>
							</div>
						</Button>
					))}
				</div>
			</QuestionLayout>
		);
	}

	// 선택 후 통계 UI
	return (
		<QuestionLayout {...progress} theme={theme}>
			<section className={`bg-gradient-to-br ${theme.question} rounded-xl p-6 mb-8`}>
				<h2 className="text-lg font-bold text-center text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
					{question.question_text}
				</h2>
			</section>

			<div className="space-y-3 mb-6">
				{question.choices?.map((choice, index) => {
					const stat = questionStats?.find((s) => s.id === choice.id);
					const percentage = stat?.percentage ?? 0;
					const count = stat?.count ?? 0;
					const isSelected = selectedChoiceId === choice.id;

					return (
						<div
							key={choice.id}
							className={`relative rounded-2xl p-4 transition-all ${
								isSelected
									? index === 0
										? 'bg-gradient-to-br from-rose-50 to-amber-50 border-2 border-rose-200'
										: 'bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-200'
									: 'bg-gray-50 border border-gray-200'
							}`}
						>
							<div className="flex items-start justify-between mb-2 gap-2">
								<div className="flex items-start gap-3 flex-1 min-w-0">
									<span className="text-xs font-bold flex-shrink-0 mt-0.5 text-gray-700">
										{index === 0 ? 'A' : 'B'}
									</span>
									<span className="text-sm font-semibold break-words text-gray-900">{choice.choice_text}</span>
									{isSelected && (
										<span
											className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
												index === 0 ? 'bg-rose-200 text-rose-700' : 'bg-amber-200 text-amber-700'
											}`}
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
								className={`h-2 rounded-full overflow-hidden ${
									isSelected ? (index === 0 ? 'bg-rose-100' : 'bg-amber-100') : 'bg-gray-200'
								}`}
							>
								<div
									className={`h-full transition-all duration-1000 ${
										isSelected
											? index === 0
												? 'bg-gradient-to-r from-pink-400 to-amber-400'
												: 'bg-gradient-to-r from-amber-400 to-rose-400'
											: 'bg-gray-400'
									}`}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<Button
				onClick={onNext}
				size="xl"
				className={`w-full font-bold rounded-2xl bg-gradient-to-r ${theme.button} text-white shadow-lg hover:shadow-xl`}
				text={progress.isLast ? '결과 보기' : '다음 질문'}
			/>
		</QuestionLayout>
	);
}