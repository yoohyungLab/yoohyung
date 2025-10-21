import { Check, ChevronLeft } from 'lucide-react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { TestProgress } from '@/shared/types';
import type { ColorTheme } from '../lib/themes';

interface TestQuestionProps {
	progress: TestProgress;
	currentQuestion: TestWithNestedDetails['questions'][0];
	onAnswer: (choiceId: string) => void;
	onPrevious: () => void;
	theme: ColorTheme;
}

export function TestQuestion(props: TestQuestionProps) {
	const { progress, currentQuestion, onAnswer, onPrevious, theme } = props;

	const progressPercentage = (progress.currentQuestionIndex / progress.totalQuestions) * 100;
	const canGoBack = progress.currentQuestionIndex > 0;

	return (
		<div className={`min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
				{/* 배경 장식 */}
				<div className="absolute inset-0 opacity-5 pointer-events-none">
					<div className={`absolute top-0 left-0 w-40 h-40 bg-${theme.accent}-400 rounded-full blur-3xl`} />
					<div className={`absolute bottom-0 right-0 w-40 h-40 bg-${theme.primary}-400 rounded-full blur-3xl`} />
				</div>

				{/* 진행률 헤더 */}
				<header className="relative mb-6">
					<div className="flex items-center justify-between mb-3">
						<span className={`text-xs font-bold text-${theme.primary}-600`}>
							{progress.currentQuestionIndex + 1} / {progress.totalQuestions}
						</span>
						{canGoBack && (
							<button
								onClick={onPrevious}
								className={`flex items-center gap-1 px-3 py-1.5 bg-${theme.primary}-100 text-${theme.primary}-700 rounded-full text-xs font-bold hover:bg-${theme.primary}-200 active:scale-95 transition-all`}
							>
								<ChevronLeft className="w-3 h-3" />
								이전
							</button>
						)}
					</div>
					<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full bg-gradient-to-r ${theme.progress} rounded-full transition-all duration-500`}
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</header>

				{/* 질문 */}
				<section className={`bg-gradient-to-br ${theme.question} rounded-xl p-6 mb-8 relative`}>
					<h2 className="text-lg font-bold text-center text-gray-800 leading-relaxed">
						{currentQuestion.question_text}
					</h2>
				</section>

				{/* 선택지 */}
				<section className="space-y-3">
					{currentQuestion.choices?.map((choice: { id: string; choice_text: string }) => (
						<button
							key={choice.id}
							onClick={() => onAnswer(choice.id)}
							className={`w-full bg-white border border-${theme.choice}-200 rounded-xl p-4 text-left hover:border-${theme.choice}-400 hover:bg-${theme.choice}-50 hover:shadow-md transition-all duration-200 active:scale-98 shadow-sm flex items-center gap-3 group`}
						>
							<div
								className={`w-5 h-5 rounded-full border-2 border-${theme.choice}-300 flex-shrink-0 flex items-center justify-center group-hover:border-${theme.choice}-500 group-hover:bg-${theme.choice}-100 group-hover:scale-110 transition-all duration-200`}
							>
								<Check
									className={`w-3 h-3 text-${theme.choice}-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
								/>
							</div>
							<span className="text-sm font-medium text-gray-800">{choice.choice_text}</span>
						</button>
					))}
				</section>
			</article>
		</div>
	);
}
