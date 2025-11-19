'use client';

import { XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getThemedColors, createCardStyles, hexToRgba } from '@/shared/lib/color-utils';

// ============================================================================
// Types
// ============================================================================

interface IQuizAnswer {
	questionId: string;
	isCorrect: boolean;
	userAnswer?: string;
	correctAnswer?: string;
}

interface IQuizDetailedResultsSectionProps {
	answers: IQuizAnswer[];
	themeColor?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 틀린 문제들을 랜덤으로 섞어서 반환
 */
const getRandomWrongAnswers = (answers: IQuizAnswer[]): IQuizAnswer[] => {
	const wrongAnswers = answers.filter((a) => !a.isCorrect);

	// Fisher-Yates 셔플 알고리즘
	const shuffled = [...wrongAnswers];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
};

// ============================================================================
// Main Component
// ============================================================================

export function QuizDetailedResultsSection({ answers, themeColor = '#3B82F6' }: IQuizDetailedResultsSectionProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	// 틀린 문제들만 랜덤으로 섞어서 메모이제이션
	const wrongAnswers = useMemo(() => getRandomWrongAnswers(answers), [answers]);

	// 틀린 문제가 없으면 섹션 전체를 숨김
	if (wrongAnswers.length === 0) {
		return null;
	}

	const displayedAnswers = isExpanded ? wrongAnswers : wrongAnswers.slice(0, 3);
	const hasMore = wrongAnswers.length > 3;
	const colors = getThemedColors(themeColor);
	const cardStyles = createCardStyles(colors);

	return (
		<div className="relative bg-white rounded-2xl p-5 overflow-hidden" style={cardStyles}>
			{/* 제목 */}
			<div className="flex items-center gap-2 mb-4">
				<div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
				<h3 className="font-bold text-gray-900 text-[17px]">틀린 문제</h3>
				<span className="text-sm font-medium text-gray-500">({wrongAnswers.length}문제)</span>
			</div>

			{/* 틀린 문제 목록 */}
			<div className="space-y-3">
				{displayedAnswers.map((answer) => {
					// 원래 문제 번호 찾기
					const originalIndex = answers.findIndex((a) => a.questionId === answer.questionId);

					return (
						<div
							key={answer.questionId}
							className="p-4 rounded-xl border transition-all"
							style={{
								backgroundColor: hexToRgba('#ef4444', 0.05),
								borderColor: hexToRgba('#ef4444', 0.2),
							}}
						>
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-0.5">
									<XCircle className="w-5 h-5 text-red-500" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-sm font-bold text-gray-700">문제 {originalIndex + 1}</span>
										<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">오답</span>
									</div>

									<div className="space-y-2 text-sm">
										<div className="flex items-start gap-2">
											<span className="font-medium text-gray-600 whitespace-nowrap">내 답변:</span>
											<span className="text-gray-800">{answer.userAnswer || '-'}</span>
										</div>
										<div className="flex items-start gap-2">
											<span className="font-medium text-green-600 whitespace-nowrap">정답:</span>
											<span className="text-green-700 font-medium">{answer.correctAnswer || '-'}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* 더보기/접기 버튼 */}
			{hasMore && (
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="mt-4 w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
					style={{
						backgroundColor: hexToRgba(themeColor, 0.1),
						color: themeColor,
						border: `1px solid ${hexToRgba(themeColor, 0.2)}`,
					}}
				>
					{isExpanded ? (
						<>
							접기
							<ChevronUp className="w-4 h-4" />
						</>
					) : (
						<>
							{wrongAnswers.length - 3}개 문제 더보기
							<ChevronDown className="w-4 h-4" />
						</>
					)}
				</button>
			)}
		</div>
	);
}
