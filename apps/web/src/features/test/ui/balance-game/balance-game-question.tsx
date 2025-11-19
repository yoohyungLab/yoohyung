'use client';

import { useState, useCallback } from 'react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { useTestBalanceGameQuestionStats } from '@/features/test/model';
import { applyOptimisticUpdate, calculatePercentages } from '@/shared/lib/balance-game';
import { Button } from '@pickid/ui';
import Image from 'next/image';
import type { ColorTheme } from '../../lib/themes';
import { useProgress } from '../../hooks';
import { QuestionLayout } from '../shared';

interface BalanceGameQuestionContainerProps {
	question: TestWithNestedDetails['questions'][0];
	currentIndex: number;
	totalQuestions: number;
	onAnswer: (questionId: string, choiceId: string) => void;
	theme: ColorTheme;
}

export function BalanceGameQuestionContainer(props: BalanceGameQuestionContainerProps) {
	const { question, currentIndex, totalQuestions, onAnswer, theme } = props;

	const progress = useProgress(currentIndex, totalQuestions);
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);

	// 중간 통계는 API 호출 없이 로컬만 사용 (enabled: false)
	// 최종 결과 페이지에서만 실제 DB 데이터 사용
	const { data: stats, isLoading, error } = useTestBalanceGameQuestionStats(question.id as string);

	const handleChoiceSelect = useCallback((choiceId: string) => {
		setSelectedChoice(choiceId);
		setShowResult(true);
	}, []);

	const handleNext = useCallback(() => {
		if (selectedChoice) onAnswer(question.id as string, selectedChoice);
	}, [selectedChoice, onAnswer, question.id]);

	// 질문 선택 화면
	if (!showResult) {
		return (
			<QuestionLayout current={progress.current} total={progress.total} percentage={progress.percentage} theme={theme}>
				{/* 질문 */}
				<section className={`bg-gradient-to-br ${theme.question} rounded-xl p-6 mb-8`}>
					<h2 className="text-lg font-bold text-center text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
						{question.question_text as string}
					</h2>
					{question.image_url && (
						<div className="mt-4 relative w-full max-w-[360px] mx-auto aspect-video">
							<Image
								src={question.image_url as string}
								alt="질문 이미지"
								fill
								sizes="(max-width: 768px) 100vw, 360px"
								className="object-contain rounded-2xl border border-gray-200 shadow-sm bg-white"
								priority={false}
							/>
						</div>
					)}
				</section>

				{/* 선택지 */}
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
			</QuestionLayout>
		);
	}

	// 중간 결과 화면 (낙관적 업데이트만 사용)
	return (
		<QuestionLayout current={progress.current} total={progress.total} percentage={progress.percentage} theme={theme}>
			{/* 질문 */}
			<section className={`bg-gradient-to-br ${theme.question} rounded-xl p-6 mb-8`}>
				<h2 className="text-lg font-bold text-center text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
					{question.question_text as string}
				</h2>
			</section>

			{/* 통계 로딩 */}
			{isLoading && !selectedChoice && (
				<div className="space-y-3 animate-pulse mb-6">
					<div className="h-16 bg-gray-200 rounded-2xl" />
					<div className="h-16 bg-gray-200 rounded-2xl" />
				</div>
			)}

			{/* 통계 에러 */}
			{error && (
				<div className="text-center py-4 mb-6">
					<p className="text-sm text-gray-500">통계를 불러올 수 없습니다</p>
				</div>
			)}

			{/* 통계 결과 */}
			<div className="space-y-3 mb-6">
				{(() => {
					// 기존 통계 데이터 준비
					const baseChoices =
						stats?.choiceStats?.map((cs) => ({
							choiceId: cs.choiceId,
							responseCount: cs.responseCount,
						})) ||
						question.choices.map((c) => ({
							choiceId: c.id as string,
							responseCount: 0,
						}));

					// 낙관적 업데이트 적용 (+1)
					const optimisticChoices = selectedChoice ? applyOptimisticUpdate(baseChoices, selectedChoice) : baseChoices;

					// 퍼센티지 계산
					const choicesWithPercentage = calculatePercentages(optimisticChoices);

					return question.choices?.map((choice, index) => {
						const isSelected = selectedChoice === choice.id;
						const stat = choicesWithPercentage.find((s) => s.choiceId === choice.id);
						const percentage = stat?.percentage || 0;
						const count = stat?.responseCount || 0;

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

			{/* 다음 버튼 */}
			<Button
				onClick={handleNext}
				size="xl"
				className={`w-full font-bold rounded-2xl bg-gradient-to-r ${theme.button} text-white shadow-lg hover:shadow-xl`}
			>
				{progress.isLast ? '결과 보기' : '다음 질문'}
			</Button>
		</QuestionLayout>
	);
}
