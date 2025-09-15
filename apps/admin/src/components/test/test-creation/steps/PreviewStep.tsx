import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@repo/ui';
import { Target, Heart, Clock, AlertCircle, Check } from 'lucide-react';
import { categories, testTypes } from '../../../../constants/testData';

interface PreviewStepProps {
    testData: any;
    questions: any[];
    results: any[];
    selectedType: any;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ testData, questions, results, selectedType }) => {
    const getTypeConfig = () => testTypes.find((t) => t.id === selectedType);

    const checklistItems = [
        { check: testData.title.trim(), text: '테스트 제목이 입력되었나요?' },
        { check: testData.category_ids.length > 0, text: '카테고리가 선택되었나요?' },
        { check: questions.length >= 3, text: '질문이 3개 이상 작성되었나요?' },
        { check: results.length >= 2, text: '결과가 2개 이상 설정되었나요?' },
        { check: questions.every((q: any) => q.choices.length >= 2), text: '모든 질문에 선택지가 2개 이상인가요?' },
        {
            check: results.every((r: any) => r.description.length > 20),
            text: '모든 결과에 충분한 내용이 있나요?',
        },
    ];

    return (
        <div className="space-y-8">
            {/* 테스트 정보 카드 */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-2xl text-blue-900">{testData.title}</CardTitle>
                            <p className="text-blue-700 mt-2">{testData.description}</p>
                            {testData.intro_text && <p className="text-blue-600 mt-2 text-sm">{testData.intro_text}</p>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline" className="bg-white">
                            {getTypeConfig()?.name}
                        </Badge>
                        {testData.category_ids.map((id: number) => {
                            const category = categories.find((c) => c.id === id);
                            return (
                                <Badge key={id} variant="outline" className="bg-white">
                                    {category?.display_name}
                                </Badge>
                            );
                        })}
                        <Badge variant="outline" className="bg-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {testData.estimated_time}분
                        </Badge>
                        <Badge
                            variant={testData.status === 'published' ? 'default' : 'secondary'}
                            className={testData.status === 'published' ? 'bg-green-600' : ''}
                        >
                            {testData.status === 'published' ? '공개' : '비공개'}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 질문 요약 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            질문 요약 ({questions.length}개)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {questions.slice(0, 3).map((question: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{question.text}</p>
                                            <p className="text-sm text-gray-500 mt-1">{question.choices.length}개 선택지</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {questions.length > 3 && (
                                <div className="text-center text-gray-500 text-sm p-2">... 외 {questions.length - 3}개 질문</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 결과 요약 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-green-600" />
                            결과 유형 ({results.length}개)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results.map((result: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                                            style={{ backgroundColor: result.theme_color }}
                                        ></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{result.name}</p>
                                            <p className="text-sm text-gray-600 mt-1">{result.description.substring(0, 60)}...</p>
                                            {selectedType === 'psychology' && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {result.condition.min}-{result.condition.max}점
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 검증 체크리스트 */}
            <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-5 h-5" />
                        발행 전 체크리스트
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {checklistItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                        item.check ? 'bg-green-500 text-white' : 'bg-gray-300'
                                    }`}
                                >
                                    {item.check && <Check className="w-3 h-3" />}
                                </div>
                                <span className={item.check ? 'text-green-800' : 'text-gray-600'}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
