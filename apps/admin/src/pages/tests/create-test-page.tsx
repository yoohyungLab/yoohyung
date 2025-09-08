'use client';

import { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
    Badge,
} from '@typologylab/ui';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Eye, Save, RefreshCw, Lightbulb, Target, Image, Wand2, Upload, X } from 'lucide-react';

type Step = 'basic' | 'questions' | 'results' | 'preview';
type TestType = 'score' | 'matching' | 'category';

interface StepConfig {
    id: Step;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const steps: StepConfig[] = [
    {
        id: 'basic',
        title: '기본 정보',
        description: '테스트의 기본 정보와 비주얼을 설정하세요',
        icon: <Target className="w-5 h-5" />,
    },
    {
        id: 'questions',
        title: '질문 작성',
        description: '테스트에 포함될 질문들을 작성하세요',
        icon: <Lightbulb className="w-5 h-5" />,
    },
    {
        id: 'results',
        title: '결과 설정',
        description: '테스트 결과와 이미지를 정의하세요',
        icon: <Target className="w-5 h-5" />,
    },
    {
        id: 'preview',
        title: '미리보기',
        description: '작성한 테스트를 확인하고 발행하세요',
        icon: <Eye className="w-5 h-5" />,
    },
];

const testTypes = [
    { id: 'score', name: '점수형', description: 'MBTI, 성격 유형 등 점수로 결과 판정' },
    { id: 'matching', name: '매칭형', description: '포켓몬, 동물상 등 특정 결과와 매칭' },
    { id: 'category', name: '카테고리형', description: '직업, 취향 등 여러 카테고리로 분류' },
];

const categories = [
    { id: 1, name: 'personality', display_name: '성격/심리' },
    { id: 2, name: 'love', display_name: '연애/관계' },
    { id: 3, name: 'career', display_name: '직업/진로' },
    { id: 4, name: 'lifestyle', display_name: '라이프스타일' },
    { id: 5, name: 'entertainment', display_name: '엔터테인먼트' },
    { id: 6, name: 'knowledge', display_name: '지식/상식' },
];

export default function CreateTestPage() {
    const [currentStep, setCurrentStep] = useState<Step>('basic');
    const [loading, setLoading] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // 테스트 기본 정보
    const [testData, setTestData] = useState({
        title: '',
        description: '',
        test_type: 'score' as TestType,
        category_ids: [] as number[],
        status: 'draft' as 'draft' | 'published',
        estimated_time: 5,
        emoji: '🧠',
        slug: '',
        banner_image: '',
        background_image: '',
        max_score: 100, // 점수형일 때만 사용
    });

    // 질문 데이터 (유형별로 다른 구조)
    const [questions, setQuestions] = useState([
        {
            text: '',
            image_url: '',
            options: [
                { text: '', image_url: '', value: 1 }, // value는 점수 또는 결과 ID
                { text: '', image_url: '', value: 2 },
            ],
        },
    ]);

    // 결과 데이터 (유형별로 다른 구조)
    const [results, setResults] = useState([
        {
            id: 1,
            title: '',
            description: '',
            image_url: '',
            condition: { type: 'score', min: 0, max: 30 }, // 점수형
            // condition: { type: 'option_count', target_values: [1, 2] }, // 매칭형
        },
    ]);

    const getCurrentStepIndex = () => steps.findIndex((step) => step.id === currentStep);

    const canProceedToNext = () => {
        switch (currentStep) {
            case 'basic':
                return testData.title.trim() && testData.category_ids.length > 0 && testData.test_type;
            case 'questions':
                return questions.every((q) => q.text.trim() && q.options.every((o) => o.text.trim()) && q.options.length >= 2);
            case 'results':
                return results.every((r) => r.title.trim() && r.description.trim());
            default:
                return true;
        }
    };

    const nextStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex < steps.length - 1 && canProceedToNext()) {
            setCurrentStep(steps[currentIndex + 1].id);
        }
    };

    const prevStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
        }
    };

    const generateAIImage = async (type: 'banner' | 'background' | 'question' | 'result', prompt?: string) => {
        // AI 이미지 생성 로직
        console.log(`AI 이미지 생성: ${type}, 프롬프트: ${prompt || testData.title}`);
        // 실제 구현시 AI 이미지 생성 API 호출
    };

    const handleCategoryToggle = (categoryId: number) => {
        const newIds = testData.category_ids.includes(categoryId)
            ? testData.category_ids.filter((id) => id !== categoryId)
            : [...testData.category_ids, categoryId];
        setTestData({ ...testData, category_ids: newIds });
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: '',
                image_url: '',
                options: [
                    { text: '', image_url: '', value: 1 },
                    { text: '', image_url: '', value: 2 },
                ],
            },
        ]);
    };

    const addResult = () => {
        const newId = Math.max(...results.map((r) => r.id)) + 1;
        let newCondition;

        if (testData.test_type === 'score') {
            const lastResult = results[results.length - 1];
            const newMin = lastResult ? lastResult.condition.max + 1 : 0;
            newCondition = { type: 'score', min: newMin, max: newMin + 30 };
        } else {
            newCondition = { type: 'option_count', target_values: [newId] };
        }

        setResults([
            ...results,
            {
                id: newId,
                title: '',
                description: '',
                image_url: '',
                condition: newCondition,
            },
        ]);
    };

    const renderBasicInfo = () => (
        <div className="space-y-8">
            {/* 테스트 유형 선택 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    테스트 유형 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => setTestData({ ...testData, test_type: type.id as TestType })}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                testData.test_type === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <h3 className="font-semibold text-gray-900">{type.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* 기본 정보 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            테스트 제목 <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={testData.title}
                            onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                            placeholder="예: 나는 어떤 MBTI일까?"
                            className="text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">테스트 설명</label>
                        <Textarea
                            value={testData.description}
                            onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                            placeholder="테스트에 대한 간단한 설명을 입력하세요"
                            rows={4}
                        />
                    </div>

                    {/* 카테고리 선택 (다중 선택) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            카테고리 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => handleCategoryToggle(category.id)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                                        testData.category_ids.includes(category.id)
                                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-sm font-medium">{category.display_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 예상 시간 및 기타 설정 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                예상 시간
                                <span className="text-xs text-gray-500 ml-1">(사용자 진입률 향상)</span>
                            </label>
                            <Select
                                value={testData.estimated_time.toString()}
                                onValueChange={(value) => setTestData({ ...testData, estimated_time: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2분 (빠른 테스트)</SelectItem>
                                    <SelectItem value="3">3분 (일반적)</SelectItem>
                                    <SelectItem value="5">5분 (표준)</SelectItem>
                                    <SelectItem value="10">10분 (상세)</SelectItem>
                                    <SelectItem value="15">15분 (심화)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {testData.test_type === 'score' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">최대 점수</label>
                                <Input
                                    type="number"
                                    value={testData.max_score}
                                    onChange={(e) => setTestData({ ...testData, max_score: parseInt(e.target.value) || 100 })}
                                    placeholder="100"
                                    min="10"
                                    max="1000"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* 테스트 이모지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">테스트 아이콘</label>
                        <div className="grid grid-cols-6 gap-2">
                            {['🧠', '💕', '💼', '🎨', '🌟', '🎯', '🔥', '💎', '🎪', '🦄', '🌈', '⭐'].map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setTestData({ ...testData, emoji })}
                                    className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 ${
                                        testData.emoji === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 배너 이미지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지</label>
                        <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                {testData.banner_image ? (
                                    <div className="relative">
                                        <img src={testData.banner_image} alt="배너" className="w-full h-32 object-cover rounded" />
                                        <Button
                                            onClick={() => setTestData({ ...testData, banner_image: '' })}
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
                                        <p>배너 이미지를 추가해보세요</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">
                                    <Upload className="w-4 h-4 mr-2" />
                                    직접 업로드
                                </Button>
                                <Button onClick={() => generateAIImage('banner')} variant="outline" className="flex-1">
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    AI 생성
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 배경 이미지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지</label>
                        <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                {testData.background_image ? (
                                    <div className="relative">
                                        <img src={testData.background_image} alt="배경" className="w-full h-24 object-cover rounded" />
                                        <Button
                                            onClick={() => setTestData({ ...testData, background_image: '' })}
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        <Image className="w-8 h-8 mx-auto mb-1" />
                                        <p className="text-sm">배경 이미지 (선택사항)</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Upload className="w-3 h-3 mr-1" />
                                    업로드
                                </Button>
                                <Button onClick={() => generateAIImage('background')} variant="outline" size="sm" className="flex-1">
                                    <Wand2 className="w-3 h-3 mr-1" />
                                    AI 생성
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderQuestions = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">질문 목록</h3>
                    <p className="text-sm text-gray-500">
                        {testData.test_type === 'score' && '점수형: 각 선택지마다 점수를 설정하세요'}
                        {testData.test_type === 'matching' && '매칭형: 각 선택지가 특정 결과와 연결됩니다'}
                        {testData.test_type === 'category' && '카테고리형: 선택지를 카테고리별로 그룹화합니다'}
                    </p>
                </div>
                <Button onClick={addQuestion} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    질문 추가
                </Button>
            </div>

            <div className="space-y-6">
                {questions.map((question, questionIndex) => (
                    <Card key={questionIndex} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">질문 {questionIndex + 1}</CardTitle>
                                {questions.length > 1 && (
                                    <Button
                                        onClick={() => setQuestions(questions.filter((_, i) => i !== questionIndex))}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        질문 내용 <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                        value={question.text}
                                        onChange={(e) => {
                                            const updated = [...questions];
                                            updated[questionIndex].text = e.target.value;
                                            setQuestions(updated);
                                        }}
                                        placeholder="예: 친구들과 모임에서 나는?"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">질문 이미지</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        {question.image_url ? (
                                            <img src={question.image_url} alt="질문" className="w-full h-20 object-cover rounded" />
                                        ) : (
                                            <div className="text-gray-400">
                                                <Image className="w-8 h-8 mx-auto mb-1" />
                                                <p className="text-xs">이미지 추가</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                                            업로드
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                                            AI
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        선택지 <span className="text-red-500">*</span>
                                    </label>
                                    <Button
                                        onClick={() => {
                                            const updated = [...questions];
                                            updated[questionIndex].options.push({
                                                text: '',
                                                image_url: '',
                                                value: updated[questionIndex].options.length + 1,
                                            });
                                            setQuestions(updated);
                                        }}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        선택지 추가
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="col-span-1">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </div>
                                            </div>
                                            <div className="col-span-6">
                                                <Input
                                                    value={option.text}
                                                    onChange={(e) => {
                                                        const updated = [...questions];
                                                        updated[questionIndex].options[optionIndex].text = e.target.value;
                                                        setQuestions(updated);
                                                    }}
                                                    placeholder={`선택지 ${optionIndex + 1}`}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <div className="border border-gray-200 rounded p-2 text-center">
                                                    {option.image_url ? (
                                                        <img
                                                            src={option.image_url}
                                                            alt="선택지"
                                                            className="w-full h-8 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <Image className="w-4 h-4 mx-auto text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {testData.test_type === 'score' ? '점수:' : '결과:'}
                                                    </span>
                                                    <Input
                                                        type={testData.test_type === 'score' ? 'number' : 'text'}
                                                        value={option.value}
                                                        onChange={(e) => {
                                                            const updated = [...questions];
                                                            updated[questionIndex].options[optionIndex].value =
                                                                testData.test_type === 'score'
                                                                    ? parseInt(e.target.value) || 1
                                                                    : e.target.value;
                                                            setQuestions(updated);
                                                        }}
                                                        className="w-16 text-center text-sm"
                                                        min={testData.test_type === 'score' ? '1' : undefined}
                                                        placeholder={testData.test_type === 'score' ? '1' : 'A'}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                {question.options.length > 2 && (
                                                    <Button
                                                        onClick={() => {
                                                            const updated = [...questions];
                                                            updated[questionIndex].options.splice(optionIndex, 1);
                                                            setQuestions(updated);
                                                        }}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
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

    const renderResults = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">결과 설정</h3>
                    <p className="text-sm text-gray-500">
                        {testData.test_type === 'score' && '점수 구간별로 결과를 설정하세요'}
                        {testData.test_type === 'matching' && '각 결과 유형을 정의하세요'}
                        {testData.test_type === 'category' && '카테고리별 결과를 설정하세요'}
                    </p>
                </div>
                <Button onClick={addResult} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    결과 추가
                </Button>
            </div>

            <div className="grid gap-6">
                {results.map((result, resultIndex) => (
                    <Card key={result.id} className="border-l-4 border-l-green-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg">결과 {resultIndex + 1}</CardTitle>
                                    {testData.test_type === 'score' && (
                                        <Badge variant="outline">
                                            {result.condition.min}-{result.condition.max}점
                                        </Badge>
                                    )}
                                </div>
                                {results.length > 1 && (
                                    <Button
                                        onClick={() => setResults(results.filter((_, i) => i !== resultIndex))}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            결과 제목 <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={result.title}
                                            onChange={(e) => {
                                                const updated = [...results];
                                                updated[resultIndex].title = e.target.value;
                                                setResults(updated);
                                            }}
                                            placeholder="예: 외향적인 리더형"
                                        />
                                    </div>

                                    {testData.test_type === 'score' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">점수 구간</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    type="number"
                                                    value={result.condition.min}
                                                    onChange={(e) => {
                                                        const updated = [...results];
                                                        updated[resultIndex].condition.min = parseInt(e.target.value) || 0;
                                                        setResults(updated);
                                                    }}
                                                    placeholder="최소"
                                                    min="0"
                                                />
                                                <Input
                                                    type="number"
                                                    value={result.condition.max}
                                                    onChange={(e) => {
                                                        const updated = [...results];
                                                        updated[resultIndex].condition.max = parseInt(e.target.value) || 10;
                                                        setResults(updated);
                                                    }}
                                                    placeholder="최대"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        결과 설명 <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                        value={result.description}
                                        onChange={(e) => {
                                            const updated = [...results];
                                            updated[resultIndex].description = e.target.value;
                                            setResults(updated);
                                        }}
                                        placeholder="결과에 대한 자세한 설명을 입력하세요"
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">결과 이미지</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        {result.image_url ? (
                                            <div className="relative">
                                                <img src={result.image_url} alt="결과" className="w-full h-32 object-cover rounded" />
                                                <Button
                                                    onClick={() => {
                                                        const updated = [...results];
                                                        updated[resultIndex].image_url = '';
                                                        setResults(updated);
                                                    }}
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
                                                <p>결과 이미지 추가</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Upload className="w-3 h-3 mr-1" />
                                            업로드
                                        </Button>
                                        <Button
                                            onClick={() => generateAIImage('result', result.title)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
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

    const renderPreview = () => (
        <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{testData.emoji}</span>
                        <div>
                            <CardTitle className="text-xl">{testData.title}</CardTitle>
                            <CardDescription className="text-base">{testData.description}</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                        {testData.category_ids.map((id) => {
                            const category = categories.find((c) => c.id === id);
                            return (
                                <Badge key={id} variant="outline">
                                    {category?.display_name}
                                </Badge>
                            );
                        })}
                        <Badge variant="outline">{testData.estimated_time}분</Badge>
                        <Badge variant={testData.status === 'published' ? 'default' : 'secondary'}>
                            {testData.status === 'published' ? '공개' : '비공개'}
                        </Badge>
                        <Badge variant="secondary">{testTypes.find((t) => t.id === testData.test_type)?.name}</Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>질문 요약 ({questions.length}개)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {questions.slice(0, 3).map((question, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded">
                                    <p className="font-medium text-sm">
                                        Q{index + 1}. {question.text}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{question.options.length}개 선택지</p>
                                </div>
                            ))}
                            {questions.length > 3 && (
                                <div className="text-center text-gray-500 text-sm">... 외 {questions.length - 3}개 질문</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>결과 유형 ({results.length}개)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {results.map((result, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                            {result.image_url ? (
                                                <img src={result.image_url} alt="결과" className="w-full h-full object-cover rounded" />
                                            ) : (
                                                <Image className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{result.title}</p>
                                            {testData.test_type === 'score' && (
                                                <p className="text-xs text-gray-500">
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
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 'basic':
                return renderBasicInfo();
            case 'questions':
                return renderQuestions();
            case 'results':
                return renderResults();
            case 'preview':
                return renderPreview();
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">새 테스트 만들기</h1>
                    <p className="text-gray-600 mt-1">단계별로 테스트를 생성하세요</p>
                </div>
                <div className="flex items-center gap-3">
                    {autoSaveStatus === 'saving' && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            저장 중...
                        </div>
                    )}
                    {autoSaveStatus === 'saved' && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <Check className="w-4 h-4" />
                            자동 저장됨
                        </div>
                    )}
                    <Button variant="outline">취소</Button>
                </div>
            </div>

            {/* 스텝 네비게이션 */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = getCurrentStepIndex() > index;
                            const canAccess = index <= getCurrentStepIndex() || isCompleted;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => canAccess && setCurrentStep(step.id)}
                                        disabled={!canAccess}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                                : isCompleted
                                                ? 'bg-green-100 text-green-800 hover:bg-green-150'
                                                : canAccess
                                                ? 'hover:bg-gray-100'
                                                : 'opacity-50 cursor-not-allowed'
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : isCompleted
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-300'
                                            }`}
                                        >
                                            {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium">{step.title}</p>
                                            <p className="text-xs opacity-75">{step.description}</p>
                                        </div>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 스텝 콘텐츠 */}
            <Card>
                <CardHeader>
                    <CardTitle>{steps.find((s) => s.id === currentStep)?.title}</CardTitle>
                    <CardDescription>{steps.find((s) => s.id === currentStep)?.description}</CardDescription>
                </CardHeader>
                <CardContent>{renderStepContent()}</CardContent>
            </Card>

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between items-center">
                <Button onClick={prevStep} variant="outline" disabled={getCurrentStepIndex() === 0}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    이전
                </Button>

                <div className="flex gap-3">
                    {currentStep === 'preview' ? (
                        <Button disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading ? '생성 중...' : '테스트 생성'}
                        </Button>
                    ) : (
                        <Button onClick={nextStep} disabled={!canProceedToNext()} className="bg-blue-600 hover:bg-blue-700">
                            다음
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
