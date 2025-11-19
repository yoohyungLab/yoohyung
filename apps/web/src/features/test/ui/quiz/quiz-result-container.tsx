'use client';

import { getBackgroundGradient } from '@/shared/lib/color-utils';
import { QuizResultHeader } from './quiz-result-header';
import { QuizResultContent } from './quiz-result-content';
import type { IQuizResult } from '../../model/types/quiz';
import type { IPopularTest } from '@/shared/types';

interface IQuizResultContainerProps {
	quizResult: IQuizResult;
	resultMessage: {
		result_name?: string;
		description?: string;
		theme_color?: string;
	} | null;
	hotTestsData: IPopularTest[];
}

export function QuizResultContainer(props: IQuizResultContainerProps) {
	const { quizResult, resultMessage, hotTestsData } = props;

	const themeColor = resultMessage?.theme_color || '#F43F5E';

	return (
		<div className="relative min-h-screen font-sans pt-6 pb-8" style={{ background: getBackgroundGradient(themeColor) }}>
			<QuizResultHeader quizResult={quizResult} themeColor={themeColor} grade={quizResult.grade} />
			<QuizResultContent quizResult={quizResult} themeColor={themeColor} hotTestsData={hotTestsData} />
		</div>
	);
}
