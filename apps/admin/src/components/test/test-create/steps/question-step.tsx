import React from 'react';
import { DefaultInput, DefaultTextarea, Label, Switch, IconButton, DefaultSelect, Badge } from '@pickid/ui';
import { Plus, Trash2, X } from 'lucide-react';
import { ImageUpload } from '../components';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import { useTestForm } from '@/providers/TestCreationFormProvider';
import { useFieldArray } from 'react-hook-form';
import { DEFAULT_CHOICE } from '@/constants/test';
import type { TestFormChoice } from '@/types/test-form';

export const QuestionStep = () => {
	const { watch, control, setValue } = useTestForm();
	const selectedType = watch('type');
	const { fields: questions, append: addQuestion, remove: removeQuestion, update: updateQuestion } = useFieldArray({
		control,
		name: 'questions',
	});

	const handleAddChoice = (questionIndex: number) => {
		const question = questions[questionIndex];
		updateQuestion(questionIndex, {
			...question,
			choices: [...question.choices, DEFAULT_CHOICE],
		});
	};

	const handleRemoveChoice = (questionIndex: number, choiceIndex: number) => {
		const question = questions[questionIndex];
		updateQuestion(questionIndex, {
			...question,
			choices: question.choices.filter((_, idx) => idx !== choiceIndex),
		});
	};

	const handleUpdateChoice = (questionIndex: number, choiceIndex: number, updates: Partial<TestFormChoice>) => {
		const question = questions[questionIndex];
		const updatedChoices = [...question.choices];
		updatedChoices[choiceIndex] = { ...updatedChoices[choiceIndex], ...updates };
		updateQuestion(questionIndex, {
			...question,
			choices: updatedChoices,
		});
	};

	const handleUpdateQuestion = (questionIndex: number, updates: Record<string, unknown>) => {
		const question = questions[questionIndex];
		updateQuestion(questionIndex, {
			...question,
			...updates,
		});
	};

	const handleAddQuestion = () => {
		addQuestion({
			question_text: '',
			question_order: questions.length,
			image_url: null,
			question_type: 'multiple_choice',
			correct_answers: null,
			explanation: null,
			choices: [DEFAULT_CHOICE, DEFAULT_CHOICE],
		});
	};

	return (
		<div className="space-y-6">
			{selectedType === 'quiz' && (
				<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
					<h4 className="font-semibold text-indigo-900 mb-2">📌 퀴즈형 채점 방식</h4>
					<p className="text-sm text-indigo-800">
						각 문제는 <strong>동일한 배점(1점)</strong>으로 계산됩니다. 10문제 중 8개 정답 = 80점으로 자동 환산됩니다.
					</p>
				</div>
			)}

			<IconButton
				onClick={handleAddQuestion}
				icon={<Plus className="w-4 h-4" />}
				text="질문 추가"
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
										onClick={() => removeQuestion(questionIndex)}
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
							{selectedType === 'quiz' && (
								<div>
									<Label className="text-sm font-medium mb-2">질문 타입</Label>
									<DefaultSelect
										value={question.question_type || 'multiple_choice'}
										onValueChange={(value) =>
											handleUpdateQuestion(questionIndex, {
												question_type: value,
												...(value === 'short_answer'
													? { correct_answers: [], choices: [] }
													: { correct_answers: null }),
											})
										}
										options={[
											{ value: 'multiple_choice', label: '📝 객관식 (Multiple Choice)' },
											{ value: 'short_answer', label: '✏️ 주관식 (Short Answer)' },
										]}
									/>
									<p className="text-xs text-gray-500 mt-1">객관식: 선택지 중 정답 선택 | 주관식: 텍스트로 답변 입력</p>
								</div>
							)}

							<DefaultTextarea
								label="질문 내용"
								required
								value={question.question_text}
								onChange={(e) =>
									handleUpdateQuestion(questionIndex, {
										question_text: e.target.value,
									})
								}
								placeholder="질문을 입력하세요"
								rows={3}
							/>

							{selectedType === 'quiz' && (
								<DefaultTextarea
									label="해설 (선택사항)"
									value={question.explanation || ''}
									onChange={(e) =>
										handleUpdateQuestion(questionIndex, {
											explanation: e.target.value,
										})
									}
									placeholder="정답에 대한 해설을 입력하세요 (결과 페이지에서 표시됩니다)"
									rows={2}
								/>
							)}

							<ImageUpload
								imageUrl={question.image_url || ''}
								onUpdateImage={(url: string) => handleUpdateQuestion(questionIndex, { image_url: url })}
								label="질문 이미지"
								desc="질문과 관련된 이미지를 추가하세요 (선택사항)"
							/>

							{selectedType === 'quiz' && question.question_type === 'short_answer' ? (
								<div>
									<Label className="text-sm font-medium mb-2">
										정답 목록 <span className="text-red-500">*</span>
									</Label>
									<p className="text-xs text-gray-500 mb-3">
										여러 정답을 추가할 수 있습니다. 대소문자는 무시되며 공백은 자동으로 제거됩니다.
									</p>
									<div className="space-y-3">
										<div className="flex gap-2">
											<DefaultInput
												placeholder="정답을 입력하세요 (예: 서울)"
												onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
													if (e.key === 'Enter') {
														e.preventDefault();
														const input = e.currentTarget;
														const value = input.value.trim();
														if (value) {
															const currentAnswers = question.correct_answers || [];
															if (!currentAnswers.includes(value)) {
																handleUpdateQuestion(questionIndex, {
																	correct_answers: [...currentAnswers, value],
																});
																input.value = '';
															}
														}
													}
												}}
											/>
										</div>
										<div className="flex flex-wrap gap-2">
											{(question.correct_answers || []).map((answer: string, answerIndex: number) => (
												<Badge key={answerIndex} variant="secondary" className="flex items-center gap-1 px-3 py-1">
													{answer}
													<button
														onClick={() => {
															const newAnswers = (question.correct_answers || []).filter(
																(_: string, idx: number) => idx !== answerIndex
															);
															handleUpdateQuestion(questionIndex, {
																correct_answers: newAnswers,
															});
														}}
														className="ml-1 hover:text-red-500"
														type="button"
													>
														<X className="w-3 h-3" />
													</button>
												</Badge>
											))}
										</div>
										{(!question.correct_answers || question.correct_answers.length === 0) && (
											<p className="text-sm text-orange-600">⚠️ 최소 1개 이상의 정답을 추가해주세요</p>
										)}
									</div>
								</div>
							) : (
								<div>
									<div className="flex items-center justify-between mb-4">
										<Label className="text-sm font-medium">
											선택지 <span className="text-red-500">*</span>
										</Label>
										<IconButton
											onClick={() => handleAddChoice(questionIndex)}
											icon={<Plus className="w-3 h-3" />}
											text="선택지 추가"
											variant="outline"
											size="sm"
										/>
									</div>

									<div className="space-y-3">
										{question.choices.map((choice, choiceIndex: number) => (
											<div key={choiceIndex} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
												<div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
													{String.fromCharCode(65 + choiceIndex)}
												</div>

												<div className="flex-1">
													<DefaultInput
														value={choice.choice_text}
														onChange={(e) =>
															handleUpdateChoice(questionIndex, choiceIndex, {
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
															checked={!!choice.is_correct}
															onCheckedChange={(checked) =>
																handleUpdateChoice(questionIndex, choiceIndex, {
																	is_correct: checked,
																	score: null,
																})
															}
														/>
													</div>
												) : selectedType === 'psychology' ? (
													<>
														<div className="flex items-center gap-2">
															<Label className="text-sm">점수</Label>
															<DefaultInput
																type="number"
																value={choice.score || ''}
																onChange={(e) =>
																	handleUpdateChoice(questionIndex, choiceIndex, {
																		score: parseInt(e.target.value) || null,
																	})
																}
																className="w-20"
																min="0"
															/>
														</div>
														<div className="flex items-center gap-2">
															<Label className="text-sm">코드</Label>
															<DefaultInput
																value={choice.code || ''}
																onChange={(e) =>
																	handleUpdateChoice(questionIndex, choiceIndex, {
																		code: e.target.value.toUpperCase(),
																	})
																}
																placeholder="E, I, S..."
																className="w-16"
																maxLength={2}
															/>
														</div>
													</>
												) : (
													<div className="flex items-center gap-2">
														<Label className="text-sm">점수</Label>
														<DefaultInput
															type="number"
															value={choice.score || ''}
															onChange={(e) =>
																handleUpdateChoice(questionIndex, choiceIndex, {
																	score: parseInt(e.target.value) || null,
																})
															}
															className="w-20"
															min="0"
														/>
													</div>
												)}

												{question.choices.length > 2 && (
													<IconButton
														onClick={() => handleRemoveChoice(questionIndex, choiceIndex)}
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
							)}
						</AdminCardContent>
					</AdminCard>
				))}
			</div>
		</div>
	);
};
