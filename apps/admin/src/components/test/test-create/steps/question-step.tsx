import React from 'react';
import { DefaultInput, DefaultTextarea, Label, Switch, IconButton } from '@repo/ui';
import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../components';
import { ChoiceCreationData, QuestionCreationData } from '@/api';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';

interface QuestionStepProps {
	questions: QuestionCreationData[];
	selectedType: string;
	onAddQuestion: () => void;
	onRemoveQuestion: (questionIndex: number) => void;
	onUpdateQuestion: (questionIndex: number, updates: Partial<QuestionCreationData>) => void;
	onAddChoice: (questionIndex: number) => void;
	onRemoveChoice: (questionIndex: number, choiceIndex: number) => void;
	onUpdateChoice: (questionIndex: number, choiceIndex: number, updates: Partial<ChoiceCreationData>) => void;
}

export const QuestionStep = (props: QuestionStepProps) => {
	const {
		questions,
		selectedType,
		onAddQuestion,
		onRemoveQuestion,
		onUpdateQuestion,
		onAddChoice,
		onRemoveChoice,
		onUpdateChoice,
	} = props;

	return (
		<div className="space-y-6">
			<IconButton
				onClick={onAddQuestion}
				icon={<Plus className="w-4 h-4" />}
				label="질문 추가"
				className="bg-blue-600 hover:bg-blue-700 text-white"
			/>

			<div className="space-y-6">
				{questions.map((question, questionIndex) => (
					<AdminCard key={questionIndex} variant="bordered" padding="sm">
						<AdminCardHeader
							variant="modal"
							title={
								<div className="text-lg flex items-center gap-2">
									<span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
										{questionIndex + 1}
									</span>
									질문 {questionIndex + 1}
								</div>
							}
							action={
								questions.length > 1 && (
									<IconButton
										onClick={() => onRemoveQuestion(questionIndex)}
										icon={<Trash2 className="w-4 h-4" />}
										variant="outline"
										size="sm"
										className="text-red-600 hover:text-red-700"
										aria-label="질문 삭제"
									/>
								)
							}
						/>
						<AdminCardContent className="space-y-6">
							<DefaultTextarea
								label="질문 내용"
								required
								value={question.question_text}
								onChange={(e) =>
									onUpdateQuestion(questionIndex, {
										question_text: e.target.value,
									})
								}
								placeholder="질문을 입력하세요"
								rows={3}
							/>

							<ImageUpload
								imageUrl={question.image_url || ''}
								onUpdateImage={(url: string) => onUpdateQuestion(questionIndex, { image_url: url })}
								label="질문 이미지"
								desc="질문과 관련된 이미지를 추가하세요 (선택사항)"
							/>

							<div>
								<div className="flex items-center justify-between mb-4">
									<Label className="text-sm font-medium">
										선택지 <span className="text-red-500">*</span>
									</Label>
									<IconButton
										onClick={() => onAddChoice(questionIndex)}
										icon={<Plus className="w-3 h-3" />}
										label="선택지 추가"
										variant="outline"
										size="sm"
									/>
								</div>

								<div className="space-y-3">
									{question.choices.map((choice: any, choiceIndex: number) => (
										<div key={choiceIndex} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
											<div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
												{String.fromCharCode(65 + choiceIndex)}
											</div>

											<div className="flex-1">
												<DefaultInput
													value={choice.choice_text}
													onChange={(e) =>
														onUpdateChoice(questionIndex, choiceIndex, {
															choice_text: e.target.value,
														})
													}
													placeholder={`선택지 ${choiceIndex + 1}`}
												/>
											</div>

											{selectedType === 'quiz' ? (
												<div className="flex items-center gap-2">
													<Label className="text-sm">정답</Label>
													<Switch
														checked={choice.is_correct}
														onCheckedChange={(checked) =>
															onUpdateChoice(questionIndex, choiceIndex, {
																is_correct: checked,
															})
														}
													/>
												</div>
											) : (
												<div className="flex items-center gap-2">
													<Label className="text-sm">점수</Label>
													<DefaultInput
														type="number"
														value={choice.score}
														onChange={(e) =>
															onUpdateChoice(questionIndex, choiceIndex, {
																score: parseInt(e.target.value) || 1,
															})
														}
														className="w-20"
														min="1"
													/>
												</div>
											)}

											{question.choices.length > 2 && (
												<IconButton
													onClick={() => onRemoveChoice(questionIndex, choiceIndex)}
													icon={<Trash2 className="w-4 h-4" />}
													variant="outline"
													size="sm"
													className="text-red-600 hover:text-red-700"
													aria-label="선택지 삭제"
												/>
											)}
										</div>
									))}
								</div>
							</div>
						</AdminCardContent>
					</AdminCard>
				))}
			</div>
		</div>
	);
};
