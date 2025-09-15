import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, DefaultSelect, Switch, Textarea } from '@repo/ui';
import { Image, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { categoryService, Category } from '../../../../api/category.service';

interface BasicInfoStepProps {
    testData: any;
    selectedType: any;
    onUpdateTestData: (data: any) => void;
    onUpdateTitle: (title: string) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ testData, selectedType, onUpdateTestData, onUpdateTitle }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getActiveCategories();
                setCategories(data);
            } catch (error) {
                console.error('카테고리 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 왼쪽: 기본 정보 */}
                <div className="space-y-6">
                    <div>
                        <Label className="text-base font-medium">
                            테스트 제목 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={testData.title}
                            onChange={(e) => onUpdateTitle(e.target.value)}
                            placeholder="예: 나는 어떤 MBTI 유형일까?"
                            className="mt-2 text-lg"
                        />
                        {testData.slug && <p className="text-sm text-gray-500 mt-1">URL: /tests/{testData.slug}</p>}
                    </div>

                    <div>
                        <Label className="text-base font-medium">테스트 설명</Label>
                        <Textarea
                            value={testData.description}
                            onChange={(e) => onUpdateTestData({ ...testData, description: e.target.value })}
                            placeholder="테스트에 대한 간단한 설명을 입력하세요 (SNS 공유시 표시됩니다)"
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label className="text-base font-medium">시작 문구</Label>
                        <Textarea
                            value={testData.intro_text}
                            onChange={(e) => onUpdateTestData({ ...testData, intro_text: e.target.value })}
                            placeholder="테스트 시작 전 사용자에게 보여줄 문구를 입력하세요"
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-base font-medium">예상 소요 시간</Label>
                            <DefaultSelect
                                value={testData.estimated_time.toString()}
                                onValueChange={(value: string) => onUpdateTestData({ ...testData, estimated_time: parseInt(value) })}
                                options={[
                                    { value: '1', label: '1분 (초단편)' },
                                    { value: '3', label: '3분 (빠른 테스트)' },
                                    { value: '5', label: '5분 (표준)' },
                                    { value: '10', label: '10분 (상세)' },
                                    { value: '15', label: '15분 (심화)' },
                                ]}
                                placeholder="소요 시간을 선택하세요"
                                className="mt-2"
                            />
                        </div>

                        {selectedType === 'psychology' && (
                            <div>
                                <Label className="text-base font-medium">최대 점수</Label>
                                <Input
                                    type="number"
                                    value={testData.max_score}
                                    onChange={(e) => onUpdateTestData({ ...testData, max_score: parseInt(e.target.value) || 100 })}
                                    className="mt-2"
                                    min="10"
                                    max="1000"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 오른쪽: 비주얼 설정 */}
                <div className="space-y-6">
                    <div>
                        <Label className="text-base font-medium">대표 이미지</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                            {testData.thumbnail_url ? (
                                <div className="relative">
                                    <img src={testData.thumbnail_url} alt="대표이미지" className="w-full h-40 object-cover rounded" />
                                    <Button
                                        onClick={() => onUpdateTestData({ ...testData, thumbnail_url: '' })}
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <Image className="w-16 h-16 mx-auto mb-4" />
                                    <p className="text-lg font-medium">대표 이미지를 추가하세요</p>
                                    <p className="text-sm">SNS 공유 시 표시되는 썸네일입니다</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button variant="outline" className="flex-1">
                                <Upload className="w-4 h-4 mr-2" />
                                직접 업로드
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-medium">
                            카테고리 <span className="text-red-500">*</span>
                        </Label>
                        {loading ? (
                            <div className="text-center py-4 text-gray-500">카테고리를 불러오는 중...</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            const newIds = testData.category_ids.includes(category.id)
                                                ? testData.category_ids.filter((id: number) => id !== category.id)
                                                : [...testData.category_ids, category.id];
                                            onUpdateTestData({ ...testData, category_ids: newIds });
                                        }}
                                        className={`p-3 border rounded-lg text-left transition-all ${
                                            testData.category_ids.includes(category.id)
                                                ? 'border-blue-500 bg-blue-50 text-blue-800'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div>
                                            <span className="text-sm font-medium">{category.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 발행 설정 */}
            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle className="text-lg">발행 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-medium">즉시 공개</Label>
                            <p className="text-sm text-gray-600">테스트를 바로 공개할지 설정합니다</p>
                        </div>
                        <Switch
                            checked={testData.status === 'published'}
                            onCheckedChange={(checked) =>
                                onUpdateTestData({
                                    ...testData,
                                    status: checked ? 'published' : 'draft',
                                })
                            }
                        />
                    </div>

                    {testData.status === 'draft' && (
                        <div>
                            <Label className="text-base font-medium">예약 발행</Label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    type="datetime-local"
                                    value={testData.scheduled_at || ''}
                                    onChange={(e) => onUpdateTestData({ ...testData, scheduled_at: e.target.value })}
                                    className="flex-1"
                                />
                                <Button variant="outline" onClick={() => onUpdateTestData({ ...testData, scheduled_at: null })}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">지정한 시간에 자동으로 공개됩니다</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
