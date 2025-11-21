'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useProgress } from '../../hooks';
import type { ColorTheme } from '../../lib/themes';
import { QuestionLayout } from '../shared';

type QuizChoice = { id: string; choice_text: string; choice_order: number; is_correct?: boolean | null };

interface IQuestionForQuiz {
	id: string;
	question_text: string;
	image_url: string | null;
	choices?: QuizChoice[];
}

interface QuizQuestionContainerProps {
	question: IQuestionForQuiz;
	currentIndex: number;
	totalQuestions: number;
	onAnswer: (answer: string) => void;
	onPrevious?: () => void;
	previousAnswer?: string;
	theme: ColorTheme;
}

export function QuizQuestionContainer(props: QuizQuestionContainerProps) {
	const { question, currentIndex, totalQuestions, onAnswer, previousAnswer, onPrevious, theme } = props;

	const [selectedChoice, setSelectedChoice] = useState<string>(previousAnswer || '');
	const [shortAnswer, setShortAnswer] = useState<string>(previousAnswer || '');

	const progress = useProgress(currentIndex, totalQuestions);
	const choices = (question.choices || []) as QuizChoice[];
	const isMultipleChoice = choices.length > 0;
	const canSubmit = isMultipleChoice ? selectedChoice !== '' : shortAnswer.trim() !== '';

	// 객관식: 선택 즉시 제출 (마지막 문제 제외)
	const handleChoiceSelect = (choiceId: string) => {
		setSelectedChoice(choiceId);
		if (!progress.isLast) {
			onAnswer(choiceId);
		}
	};

	// 주관식 or 마지막 문제 제출
	const handleSubmit = () => {
		const answer = isMultipleChoice ? selectedChoice : shortAnswer.trim();
		if (answer) onAnswer(answer);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && canSubmit) handleSubmit();
	};

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
				{question.image_url && (
					<div className="mt-4 relative w-full max-w-[360px] mx-auto aspect-video">
						<Image
							src={question.image_url}
							alt="질문 이미지"
							fill
							sizes="(max-width: 768px) 100vw, 360px"
							className="object-contain rounded-2xl border border-gray-200 shadow-sm bg-white"
							priority={currentIndex === 0}
						loading={currentIndex === 0 ? 'eager' : 'lazy'}
						/>
					</div>
				)}
			</section>

			{/* 답변 영역 */}
			{isMultipleChoice ? (
				<div className={`space-y-3 ${progress.isLast ? 'mb-8' : ''}`}>
					{choices
						.sort((a, b) => a.choice_order - b.choice_order)
						.map((choice) => (
							<button
								key={choice.id}
								onClick={() => handleChoiceSelect(choice.id)}
								className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 hover:bg-gray-50 hover:shadow-md transition-all duration-200 active:scale-98 shadow-sm flex items-center gap-3 group"
							>
								<div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center group-hover:bg-gray-100 transition-all duration-200">
									{selectedChoice === choice.id && (
										<div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-amber-500" />
									)}
								</div>
								<span className="text-sm font-medium text-gray-800">{choice.choice_text}</span>
							</button>
						))}
				</div>
			) : (
				<div className="mb-8">
					<input
						type="text"
						value={shortAnswer}
						onChange={(e) => setShortAnswer(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="답변을 입력하세요"
						className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-sm"
						autoFocus
					/>
					<p className="text-xs text-gray-500 mt-2">Enter 키를 눌러 제출할 수 있습니다</p>
				</div>
			)}

			{/* 제출 버튼 (마지막 문제 or 주관식만) */}
			{(progress.isLast || !isMultipleChoice) && (
				<button
					onClick={handleSubmit}
					disabled={!canSubmit}
					className={`w-full py-3 rounded-2xl font-bold text-base transition-all ${
						canSubmit
							? `bg-gradient-to-r ${theme.button} text-white shadow-lg hover:shadow-xl active:scale-98`
							: 'bg-gray-300 text-gray-500 cursor-not-allowed'
					}`}
				>
					제출하기
				</button>
			)}
		</QuestionLayout>
	);
}
