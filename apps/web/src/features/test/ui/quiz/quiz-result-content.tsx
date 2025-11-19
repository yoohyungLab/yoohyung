'use client';

import { PopularTestsSection } from '../shared';
import { QuizDetailedResultsSection } from './sections';
import type { IQuizResult } from '../../model/types/quiz';
import type { IPopularTest } from '@/shared/types';

interface IQuizResultContentProps {
	quizResult: IQuizResult;
	themeColor: string;
	hotTestsData: IPopularTest[];
}

export function QuizResultContent(props: IQuizResultContentProps) {
	const { quizResult, themeColor, hotTestsData } = props;

	return (
		<div className="max-w-lg mx-auto px-5">
			<div className="space-y-3">
				<QuizDetailedResultsSection answers={quizResult.answers || []} themeColor={themeColor} />
				<PopularTestsSection hotTests={hotTestsData.slice(0, 3)} error={null} />
			</div>
		</div>
	);
}
