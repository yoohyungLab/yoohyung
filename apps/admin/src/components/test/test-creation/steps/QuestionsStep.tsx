import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Label, Switch } from '@repo/ui';
import { Plus, Trash2, Wand2, Image, GripVertical } from 'lucide-react';
import { testTypes } from '../../../../constants/testData';

interface QuestionsStepProps {
    questions: any[];
    selectedType: any;
    onGenerateTemplate: () => void;
    onAddQuestion: () => void;
    onRemoveQuestion: (questionId: number) => void;
    onUpdateQuestion: (questionId: number, updates: any) => void;
    onAddChoice: (questionId: number) => void;
    onRemoveChoice: (questionId: number, choiceIndex: number) => void;
    onUpdateChoice: (questionId: number, choiceIndex: number, updates: any) => void;
}

export const QuestionsStep: React.FC<QuestionsStepProps> = ({
    questions,
    selectedType,
    onGenerateTemplate,
    onAddQuestion,
    onRemoveQuestion,
    onUpdateQuestion,
    onAddChoice,
    onRemoveChoice,
    onUpdateChoice,
}) => {
    const getTypeConfig = () => testTypes.find((t) => t.id === selectedType);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">질문 목록</h3>
                    <p className="text-gray-600 mt-1">{getTypeConfig()?.name} 테스트에 맞는 질문을 작성하세요</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={onGenerateTemplate} variant="outline" className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        템플릿 생성
                    </Button>
                    <Button onClick={onAddQuestion} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        질문 추가
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((question, questionIndex) => (
                    <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                    <CardTitle className="text-lg">질문 {questionIndex + 1}</CardTitle>
                                </div>
                                {questions.length > 1 && (
                                    <Button
                                        onClick={() => onRemoveQuestion(question.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                <div className="lg:col-span-3">
                                    <Label className="text-base font-medium">
                                        질문 내용 <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        value={question.text}
                                        onChange={(e) => onUpdateQuestion(question.id, { text: e.target.value })}
                                        placeholder="질문을 입력하세요"
                                        className="mt-2"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium">질문 이미지</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                                        {question.image_url ? (
                                            <img src={question.image_url} alt="질문" className="w-full h-24 object-cover rounded" />
                                        ) : (
                                            <div className="text-gray-400">
                                                <Image className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-xs">이미지 추가</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-base font-medium">
                                        선택지 <span className="text-red-500">*</span>
                                    </Label>
                                    <Button onClick={() => onAddChoice(question.id)} variant="outline" size="sm">
                                        <Plus className="w-3 h-3 mr-1" />
                                        선택지 추가
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {question.choices.map((choice: any, choiceIndex: number) => (
                                        <div key={choiceIndex} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                {String.fromCharCode(65 + choiceIndex)}
                                            </div>

                                            <div className="flex-1">
                                                <Input
                                                    value={choice.text}
                                                    onChange={(e) => onUpdateChoice(question.id, choiceIndex, { text: e.target.value })}
                                                    placeholder={`선택지 ${choiceIndex + 1}`}
                                                />
                                            </div>

                                            {selectedType === 'quiz' ? (
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">정답</Label>
                                                    <Switch
                                                        checked={choice.correct}
                                                        onCheckedChange={(checked) =>
                                                            onUpdateChoice(question.id, choiceIndex, { correct: checked })
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">점수</Label>
                                                    <Input
                                                        type="number"
                                                        value={choice.score}
                                                        onChange={(e) =>
                                                            onUpdateChoice(question.id, choiceIndex, {
                                                                score: parseInt(e.target.value) || 1,
                                                            })
                                                        }
                                                        className="w-20"
                                                        min="1"
                                                    />
                                                </div>
                                            )}

                                            {question.choices.length > 2 && (
                                                <Button
                                                    onClick={() => onRemoveChoice(question.id, choiceIndex)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
