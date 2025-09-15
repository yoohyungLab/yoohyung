import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Label, Badge } from '@repo/ui';
import { Plus, Trash2, Wand2, Upload, Image, X } from 'lucide-react';
import { testTypes } from '../../../../constants/testData';

interface ResultsStepProps {
    results: any[];
    selectedType: any;
    onGenerateTemplate: () => void;
    onAddResult: () => void;
    onRemoveResult: (resultId: number) => void;
    onUpdateResult: (resultId: number, updates: any) => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({
    results,
    selectedType,
    onGenerateTemplate,
    onAddResult,
    onRemoveResult,
    onUpdateResult,
}) => {
    const getTypeConfig = () => testTypes.find((t) => t.id === selectedType);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">결과 설정</h3>
                    <p className="text-gray-600 mt-1">{getTypeConfig()?.name} 테스트 결과를 정의하세요</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={onGenerateTemplate} variant="outline" className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        템플릿 생성
                    </Button>
                    <Button onClick={onAddResult} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        결과 추가
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {results.map((result, resultIndex) => (
                    <Card key={result.id} className="border-l-4 border-l-green-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg">결과 {resultIndex + 1}</CardTitle>
                                    {selectedType === 'psychology' && (
                                        <Badge variant="outline" className="bg-blue-50">
                                            {result.condition.min}-{result.condition.max}점
                                        </Badge>
                                    )}
                                </div>
                                {results.length > 1 && (
                                    <Button
                                        onClick={() => onRemoveResult(result.id)}
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-base font-medium">
                                            결과 제목 <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={result.name}
                                            onChange={(e) => onUpdateResult(result.id, { name: e.target.value })}
                                            placeholder="예: 외향적인 리더형"
                                            className="mt-2"
                                        />
                                    </div>

                                    {selectedType === 'psychology' && (
                                        <div>
                                            <Label className="text-base font-medium">점수 구간</Label>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <Input
                                                    type="number"
                                                    value={result.condition.min}
                                                    onChange={(e) =>
                                                        onUpdateResult(result.id, {
                                                            condition: {
                                                                ...result.condition,
                                                                min: parseInt(e.target.value) || 0,
                                                            },
                                                        })
                                                    }
                                                    placeholder="최소점수"
                                                />
                                                <Input
                                                    type="number"
                                                    value={result.condition.max}
                                                    onChange={(e) =>
                                                        onUpdateResult(result.id, {
                                                            condition: {
                                                                ...result.condition,
                                                                max: parseInt(e.target.value) || 10,
                                                            },
                                                        })
                                                    }
                                                    placeholder="최대점수"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label className="text-base font-medium">테마 색상</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                type="color"
                                                value={result.theme_color}
                                                onChange={(e) => onUpdateResult(result.id, { theme_color: e.target.value })}
                                                className="w-16 h-10"
                                            />
                                            <Input
                                                value={result.theme_color}
                                                onChange={(e) => onUpdateResult(result.id, { theme_color: e.target.value })}
                                                placeholder="#3B82F6"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-base font-medium">
                                        결과 설명 <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        value={result.description}
                                        onChange={(e) => onUpdateResult(result.id, { description: e.target.value })}
                                        placeholder="결과에 대한 자세한 설명을 입력하세요"
                                        className="mt-2"
                                        rows={8}
                                    />
                                </div>

                                <div>
                                    <Label className="text-base font-medium">결과 이미지</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                                        {result.bg_image_url ? (
                                            <div className="relative">
                                                <img src={result.bg_image_url} alt="결과" className="w-full h-32 object-cover rounded" />
                                                <Button
                                                    onClick={() => onUpdateResult(result.id, { bg_image_url: '' })}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">
                                                <Image className="w-12 h-12 mx-auto mb-2" />
                                                <p>결과 이미지</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Upload className="w-3 h-3 mr-1" />
                                            업로드
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Wand2 className="w-3 h-3 mr-1" />
                                            AI 생성
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
