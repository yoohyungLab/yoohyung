'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pickid/ui';
import { Users } from 'lucide-react';

interface IPopularQuestion {
	question: string;
	aPercentage: number;
	bPercentage: number;
}

interface IPopularQuestionsSectionProps {
	questions: IPopularQuestion[];
	isLoading: boolean;
	error: Error | null;
}

export function PopularQuestionsSection({ questions, isLoading, error }: IPopularQuestionsSectionProps) {
	const renderLoadingSkeleton = () => (
		<div className="space-y-4">
			{Array.from({ length: 3 }).map((_, idx) => (
				<div key={idx} className="animate-pulse">
					<div className="h-4 bg-gray-200 rounded mb-2"></div>
					<div className="h-2 bg-gray-200 rounded mb-3"></div>
				</div>
			))}
		</div>
	);

	const renderError = () => (
		<div className="text-center py-4">
			<p className="text-sm text-gray-500">인기 질문을 불러올 수 없습니다</p>
		</div>
	);

	const renderQuestions = () => (
		<div className="space-y-4">
			{questions.map((item, idx) => (
				<div key={idx} className="space-y-2">
					<p className="text-[14px] font-medium text-gray-900">{item.question}</p>
					<div className="flex items-center gap-2">
						<div className="flex-1 space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">A</span>
								<span className="text-xs font-bold text-gray-900">{item.aPercentage}%</span>
							</div>
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div className="h-full bg-gray-900 transition-all" style={{ width: `${item.aPercentage}%` }} />
							</div>
						</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">B</span>
								<span className="text-xs font-bold text-gray-900">{item.bPercentage}%</span>
							</div>
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div className="h-full bg-gray-400 transition-all" style={{ width: `${item.bPercentage}%` }} />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<Card
			className="relative overflow-hidden"
			style={{
				border: '1px solid rgba(0, 0, 0, 0.06)',
				boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
			}}
		>
			<CardHeader className="pb-4">
				<div className="flex items-start gap-3">
					<Users className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
					<div className="flex-1">
						<CardTitle className="text-[17px] mb-1">다른 사람들의 선택</CardTitle>
						<CardDescription className="text-[14px]">가장 의견이 갈린 질문들이에요</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{isLoading && renderLoadingSkeleton()}
				{error && renderError()}
				{!isLoading && !error && questions.length > 0 && renderQuestions()}
			</CardContent>
		</Card>
	);
}
