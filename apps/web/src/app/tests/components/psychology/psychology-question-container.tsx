import { Check } from 'lucide-react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { useProgress } from '../../hooks';
import type { TColorTheme } from '@pickid/ui/constants/colors';
import { QuestionLayout } from '../shared';

interface PsychologyQuestionContainerProps {
	question: TestWithNestedDetails['questions'][0];
	currentIndex: number;
	totalQuestions: number;
	onAnswer: (choiceId: string) => void;
	onPrevious?: () => void;
	theme: TColorTheme;
}

export function PsychologyQuestionContainer(props: PsychologyQuestionContainerProps) {
	const { question, currentIndex, totalQuestions, onAnswer, onPrevious, theme } = props;

	const progress = useProgress(currentIndex, totalQuestions);
	const choices = question.choices as Array<{ id: string; choice_text: string }>;

	return (
		<QuestionLayout
			current={progress.current}
			total={progress.total}
			percentage={progress.percentage}
			onPrevious={onPrevious}
			theme={theme}
		>
			{/* 질문 */}
			<section className={`bg-gradient-to-br ${theme.question} rounded-xl p-6 mb-8`}>
				<h2 className="text-lg font-bold text-center text-gray-800 leading-relaxed">{question.question_text}</h2>
			</section>

			{/* 선택지 */}
			<section className="space-y-3">
				{choices?.map((choice) => (
					<button
						key={choice.id}
						onClick={() => onAnswer(choice.id)}
						className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-98 shadow-sm flex items-center gap-3 group cursor-pointer"
					>
						<div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center group-hover:bg-gray-100 transition-all duration-200">
							<Check className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
						</div>
						<span className="text-sm font-medium text-gray-800">{choice.choice_text}</span>
					</button>
				))}
			</section>
		</QuestionLayout>
	);
}
