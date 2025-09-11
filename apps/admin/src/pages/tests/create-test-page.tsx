import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Textarea,
    Label,
    Badge,
    Switch,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Plus,
    Trash2,
    Save,
    RefreshCw,
    Target,
    Brain,
    Users,
    Zap,
    Heart,
    Coffee,
    Upload,
    Wand2,
    Image,
    X,
    GripVertical,
    AlertCircle,
    Clock,
} from 'lucide-react';

type Step = 'type' | 'basic' | 'questions' | 'results' | 'preview';
type TestType = 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';

interface TestTypeConfig {
    id: TestType;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    features: string[];
    examples: string[];
}

const testTypes: TestTypeConfig[] = [
    {
        id: 'psychology',
        name: '심리형',
        description: 'MBTI, 색상/동물 등 성향 분석',
        icon: <Brain className="w-6 h-6" />,
        color: 'blue',
        features: ['점수 매핑', '성향 분석', '다차원 결과'],
        examples: ['MBTI 테스트', '성격 유형 테스트', '색깔 심리 테스트'],
    },
    {
        id: 'balance',
        name: '밸런스형',
        description: '2지선다/다지선다 선택',
        icon: <Users className="w-6 h-6" />,
        color: 'green',
        features: ['선택 비율', '통계 기반', '간단한 선택'],
        examples: ['이상형 월드컵', '음식 vs 음식', '취향 밸런스 게임'],
    },
    {
        id: 'character',
        name: '캐릭터 매칭형',
        description: '특정 IP/캐릭터와 매칭',
        icon: <Heart className="w-6 h-6" />,
        color: 'pink',
        features: ['캐릭터 매칭', '이미지 중심', '팬덤 콘텐츠'],
        examples: ['포켓몬 찾기', '디즈니 프린세스', '동물상 테스트'],
    },
    {
        id: 'quiz',
        name: '퀴즈형',
        description: '지식/정답 기반',
        icon: <Brain className="w-6 h-6" />,
        color: 'purple',
        features: ['정답 체크', '점수 계산', '지식 테스트'],
        examples: ['상식 퀴즈', '전문 지식 테스트', 'IQ 테스트'],
    },
    {
        id: 'meme',
        name: '밈형',
        description: '밈/이모지 매칭',
        icon: <Zap className="w-6 h-6" />,
        color: 'yellow',
        features: ['랜덤 결과', '재미 중심', '바이럴 콘텐츠'],
        examples: ['짤방 테스트', '밈 성향', '인터넷 밈 매칭'],
    },
    {
        id: 'lifestyle',
        name: '라이프스타일형',
        description: '취향 기반',
        icon: <Coffee className="w-6 h-6" />,
        color: 'orange',
        features: ['취향 분석', '라이프스타일', '추천 시스템'],
        examples: ['여행 스타일', '음식 취향', '패션 스타일'],
    },
];

const categories = [
    { id: 1, name: 'personality', display_name: '성격/심리', emoji: '🧠' },
    { id: 2, name: 'love', display_name: '연애/관계', emoji: '💕' },
    { id: 3, name: 'career', display_name: '직업/진로', emoji: '💼' },
    { id: 4, name: 'lifestyle', display_name: '라이프스타일', emoji: '☕' },
    { id: 5, name: 'entertainment', display_name: '엔터테인먼트', emoji: '🎭' },
    { id: 6, name: 'knowledge', display_name: '지식/상식', emoji: '📚' },
    { id: 7, name: 'fun', display_name: '재미/밈', emoji: '😂' },
    { id: 8, name: 'culture', display_name: '문화/트렌드', emoji: '🎨' },
];

const steps = [
    { id: 'type', title: '유형 선택', description: '테스트 유형을 선택하세요' },
    { id: 'basic', title: '기본 정보', description: '테스트의 기본 정보를 입력하세요' },
    { id: 'questions', title: '질문 작성', description: '테스트 질문을 작성하세요' },
    { id: 'results', title: '결과 설정', description: '테스트 결과를 정의하세요' },
    { id: 'preview', title: '미리보기', description: '테스트를 확인하고 발행하세요' },
];

export default function CreateTestPage() {
    const [currentStep, setCurrentStep] = useState<Step>('type');
    const [selectedType, setSelectedType] = useState<TestType | null>(null);
    const [loading, setLoading] = useState(false);
    const [autoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // 테스트 기본 정보
    const [testData, setTestData] = useState({
        title: '',
        description: '',
        intro_text: '',
        category_ids: [] as number[],
        emoji: '🧠',
        slug: '',
        thumbnail_url: '',
        estimated_time: 5,
        status: 'draft' as 'draft' | 'published',
        scheduled_at: null as string | null,
        max_score: 100,
    });

    // 질문 데이터
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: '',
            image_url: '',
            group: '',
            choices: [
                { text: '', image_url: '', score: 1, correct: false, result_id: null },
                { text: '', image_url: '', score: 2, correct: false, result_id: null },
            ],
        },
    ]);

    // 결과 데이터
    const [results, setResults] = useState([
        {
            id: 1,
            name: '',
            description: '',
            features: [] as string[],
            match_results: [] as number[],
            jobs: [] as string[],
            bg_image_url: '',
            theme_color: '#3B82F6',
            condition: { type: 'score', min: 0, max: 30 },
        },
    ]);

    const getTypeConfig = () => testTypes.find((t) => t.id === selectedType);
    const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9가-힣]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const canProceedToNext = () => {
        switch (currentStep) {
            case 'type':
                return selectedType !== null;
            case 'basic':
                return testData.title.trim() && testData.category_ids.length > 0;
            case 'questions':
                return (
                    questions.length > 0 &&
                    questions.every((q) => q.text.trim() && q.choices.length >= 2 && q.choices.every((c) => c.text.trim()))
                );
            case 'results':
                return results.length > 0 && results.every((r) => r.name.trim() && r.description.trim());
            default:
                return true;
        }
    };

    const nextStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex < steps.length - 1 && canProceedToNext()) {
            setCurrentStep(steps[currentIndex + 1].id as Step);
        }
    };

    const prevStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id as Step);
        }
    };

    // 유형별 질문 템플릿 자동 생성
    const generateQuestionTemplate = (type: TestType) => {
        const templates = {
            psychology: [
                {
                    text: '사람들과의 모임에서 나는?',
                    choices: [
                        { text: '사람들과 대화하며 에너지를 얻는다', score: 5 },
                        { text: '조용히 관찰하며 시간을 보낸다', score: 1 },
                    ],
                },
                {
                    text: '새로운 계획을 세울 때 나는?',
                    choices: [
                        { text: '체계적으로 단계별로 계획한다', score: 5 },
                        { text: '대략적인 방향만 정하고 융통성 있게 진행한다', score: 1 },
                    ],
                },
            ],
            balance: [
                {
                    text: '치킨 vs 피자, 당신의 선택은?',
                    choices: [
                        { text: '치킨 🍗', score: 1 },
                        { text: '피자 🍕', score: 2 },
                    ],
                },
                {
                    text: '여행 vs 집콕, 어떤 휴가를 선호하나요?',
                    choices: [
                        { text: '새로운 곳으로 여행 ✈️', score: 1 },
                        { text: '집에서 편안한 휴식 🏠', score: 2 },
                    ],
                },
            ],
            character: [
                {
                    text: '가장 끌리는 색깔은?',
                    choices: [
                        { text: '빨간색 - 열정적이고 역동적', score: 1, result_id: 1 },
                        { text: '파란색 - 차분하고 신뢰감 있는', score: 2, result_id: 2 },
                        { text: '노란색 - 밝고 활기찬', score: 3, result_id: 3 },
                    ],
                },
                {
                    text: '선호하는 활동은?',
                    choices: [
                        { text: '모험적인 야외 활동', score: 1, result_id: 1 },
                        { text: '조용한 독서나 영화감상', score: 2, result_id: 2 },
                        { text: '친구들과의 즐거운 파티', score: 3, result_id: 3 },
                    ],
                },
            ],
            quiz: [
                {
                    text: '대한민국의 수도는?',
                    choices: [
                        { text: '서울', score: 10, correct: true },
                        { text: '부산', score: 0, correct: false },
                        { text: '대구', score: 0, correct: false },
                        { text: '인천', score: 0, correct: false },
                    ],
                },
                {
                    text: '지구에서 가장 큰 대륙은?',
                    choices: [
                        { text: '아시아', score: 10, correct: true },
                        { text: '아프리카', score: 0, correct: false },
                        { text: '북아메리카', score: 0, correct: false },
                        { text: '유럽', score: 0, correct: false },
                    ],
                },
            ],
            meme: [
                {
                    text: '월요일 아침 기분을 표현한다면?',
                    choices: [
                        { text: '😭 (현실 부정)', score: 1 },
                        { text: '😤 (의욕 충만)', score: 2 },
                        { text: '😴 (5분만 더...)', score: 3 },
                    ],
                },
                {
                    text: '친구가 갑자기 연락 없이 집에 왔다면?',
                    choices: [
                        { text: '🏃‍♂️ (도망)', score: 1 },
                        { text: '🤗 (환영)', score: 2 },
                        { text: '😒 (당황)', score: 3 },
                    ],
                },
            ],
            lifestyle: [
                {
                    text: '이상적인 주말 오후는?',
                    choices: [
                        { text: '카페에서 여유로운 독서', score: 1 },
                        { text: '친구들과 쇼핑몰 탐방', score: 2 },
                        { text: '집에서 넷플릭스 시청', score: 3 },
                    ],
                },
                {
                    text: '패션 스타일 선호도는?',
                    choices: [
                        { text: '심플하고 깔끔한 미니멀', score: 1 },
                        { text: '개성 있고 독특한 스타일', score: 2 },
                        { text: '편안하고 캐주얼한 룩', score: 3 },
                    ],
                },
            ],
        };

        const template = templates[type] || templates.psychology;
        setQuestions(
            template.map((q, index) => ({
                id: index + 1,
                text: q.text,
                image_url: '',
                group: '',
                choices: q.choices.map((c) => ({
                    text: c.text,
                    image_url: '',
                    score: c.score || 1,
                    correct: c.correct || false,
                    result_id: c.result_id || null,
                })),
            }))
        );
    };

    // 유형별 결과 템플릿 자동 생성
    const generateResultTemplate = (type: TestType) => {
        const templates = {
            psychology: [
                {
                    name: '외향적 리더형',
                    description: '사람들과의 소통을 즐기고 자연스럽게 리더십을 발휘하는 타입입니다.',
                    theme_color: '#EF4444',
                },
                {
                    name: '내향적 사색형',
                    description: '혼자만의 시간을 소중히 여기며 깊이 있는 사고를 좋아하는 타입입니다.',
                    theme_color: '#3B82F6',
                },
                {
                    name: '균형잡힌 조화형',
                    description: '상황에 따라 유연하게 대처하며 균형감각이 뛰어난 타입입니다.',
                    theme_color: '#10B981',
                },
            ],
            character: [
                {
                    name: '🔥 열정의 레드',
                    description: '에너지가 넘치고 도전을 즐기는 당신! 모든 일에 열정적으로 임합니다.',
                    theme_color: '#DC2626',
                },
                {
                    name: '💙 신뢰의 블루',
                    description: '차분하고 믿음직한 당신! 사람들에게 안정감을 주는 존재입니다.',
                    theme_color: '#2563EB',
                },
                {
                    name: '⭐ 활기의 옐로',
                    description: '밝고 긍정적인 당신! 주변을 환하게 만드는 에너지를 가지고 있습니다.',
                    theme_color: '#EAB308',
                },
            ],
            quiz: [
                {
                    name: '지식왕 👑',
                    description: '놀라운 지식의 소유자! 다양한 분야에 해박한 지식을 가지고 있습니다.',
                    theme_color: '#7C3AED',
                },
                { name: '상식인 📚', description: '기본적인 상식을 잘 알고 있는 평범하지만 똑똑한 당신!', theme_color: '#059669' },
                {
                    name: '호기심 많은 초보자 🌱',
                    description: '아직 배울 것이 많지만 호기심이 가득한 당신! 계속 성장해나가세요.',
                    theme_color: '#0891B2',
                },
            ],
        };

        const template = templates[type] || templates.psychology;
        setResults(
            template.map((r, index) => ({
                id: index + 1,
                name: r.name,
                description: r.description,
                features: [],
                match_results: [],
                jobs: [],
                bg_image_url: '',
                theme_color: r.theme_color,
                condition: { type: 'score', min: index * 34, max: (index + 1) * 33 },
            }))
        );
    };

    const renderTypeSelection = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">어떤 테스트를 만들고 싶나요?</h2>
                <p className="text-gray-600">테스트 유형에 따라 최적화된 작성 도구를 제공합니다</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testTypes.map((type) => (
                    <Card
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                            selectedType === type.id ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' : 'border hover:border-gray-300'
                        }`}
                    >
                        <CardHeader className="text-center">
                            <div
                                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    selectedType === type.id ? 'bg-blue-500 text-white' : `bg-${type.color}-100 text-${type.color}-600`
                                }`}
                            >
                                {type.icon}
                            </div>
                            <CardTitle className="text-xl">{type.name}</CardTitle>
                            <p className="text-sm text-gray-600">{type.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">주요 특징</h4>
                                <div className="flex flex-wrap gap-1">
                                    {type.features.map((feature, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">예시</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {type.examples.slice(0, 2).map((example, index) => (
                                        <li key={index}>• {example}</li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedType && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                                {getTypeConfig()?.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900">{getTypeConfig()?.name} 테스트가 선택되었습니다</h3>
                                <p className="text-sm text-blue-700">
                                    {getTypeConfig()?.description}에 최적화된 작성 도구를 사용할 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    const renderBasicInfo = () => (
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
                            onChange={(e) => {
                                setTestData({
                                    ...testData,
                                    title: e.target.value,
                                    slug: generateSlug(e.target.value),
                                });
                            }}
                            placeholder="예: 나는 어떤 MBTI 유형일까?"
                            className="mt-2 text-lg"
                        />
                        {testData.slug && <p className="text-sm text-gray-500 mt-1">URL: /tests/{testData.slug}</p>}
                    </div>

                    <div>
                        <Label className="text-base font-medium">테스트 설명</Label>
                        <Textarea
                            value={testData.description}
                            onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                            placeholder="테스트에 대한 간단한 설명을 입력하세요 (SNS 공유시 표시됩니다)"
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label className="text-base font-medium">시작 문구</Label>
                        <Textarea
                            value={testData.intro_text}
                            onChange={(e) => setTestData({ ...testData, intro_text: e.target.value })}
                            placeholder="테스트 시작 전 사용자에게 보여줄 문구를 입력하세요"
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-base font-medium">예상 소요 시간</Label>
                            <Select
                                value={testData.estimated_time.toString()}
                                onValueChange={(value) => setTestData({ ...testData, estimated_time: parseInt(value) })}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1분 (초단편)</SelectItem>
                                    <SelectItem value="3">3분 (빠른 테스트)</SelectItem>
                                    <SelectItem value="5">5분 (표준)</SelectItem>
                                    <SelectItem value="10">10분 (상세)</SelectItem>
                                    <SelectItem value="15">15분 (심화)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedType === 'psychology' && (
                            <div>
                                <Label className="text-base font-medium">최대 점수</Label>
                                <Input
                                    type="number"
                                    value={testData.max_score}
                                    onChange={(e) => setTestData({ ...testData, max_score: parseInt(e.target.value) || 100 })}
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
                        <Label className="text-base font-medium">대표 이모지</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                            {['🧠', '💕', '💼', '🎨', '🌟', '🎯', '🔥', '💎', '🎪', '🦄', '🌈', '⭐', '🎭', '🎲', '🎊', '💫'].map(
                                (emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => setTestData({ ...testData, emoji })}
                                        className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 transition-colors ${
                                            testData.emoji === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-medium">대표 이미지</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                            {testData.thumbnail_url ? (
                                <div className="relative">
                                    <img src={testData.thumbnail_url} alt="대표이미지" className="w-full h-40 object-cover rounded" />
                                    <Button
                                        onClick={() => setTestData({ ...testData, thumbnail_url: '' })}
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
                            <Button variant="outline" className="flex-1">
                                <Wand2 className="w-4 h-4 mr-2" />
                                AI 생성
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-medium">
                            카테고리 <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        const newIds = testData.category_ids.includes(category.id)
                                            ? testData.category_ids.filter((id) => id !== category.id)
                                            : [...testData.category_ids, category.id];
                                        setTestData({ ...testData, category_ids: newIds });
                                    }}
                                    className={`p-3 border rounded-lg text-left transition-all ${
                                        testData.category_ids.includes(category.id)
                                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{category.emoji}</span>
                                        <span className="text-sm font-medium">{category.display_name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
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
                                setTestData({
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
                                    onChange={(e) => setTestData({ ...testData, scheduled_at: e.target.value })}
                                    className="flex-1"
                                />
                                <Button variant="outline" onClick={() => setTestData({ ...testData, scheduled_at: null })}>
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

    const renderQuestions = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">질문 목록</h3>
                    <p className="text-gray-600 mt-1">{getTypeConfig()?.name} 테스트에 맞는 질문을 작성하세요</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => generateQuestionTemplate(selectedType!)} variant="outline" className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        템플릿 생성
                    </Button>
                    <Button
                        onClick={() =>
                            setQuestions([
                                ...questions,
                                {
                                    id: Math.max(...questions.map((q) => q.id)) + 1,
                                    text: '',
                                    image_url: '',
                                    group: '',
                                    choices: [
                                        { text: '', image_url: '', score: 1, correct: false, result_id: null },
                                        { text: '', image_url: '', score: 2, correct: false, result_id: null },
                                    ],
                                },
                            ])
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                    >
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
                                        onClick={() => setQuestions(questions.filter((q) => q.id !== question.id))}
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
                                        onChange={(e) => {
                                            const updated = [...questions];
                                            const index = questions.findIndex((q) => q.id === question.id);
                                            updated[index].text = e.target.value;
                                            setQuestions(updated);
                                        }}
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
                                    <Button
                                        onClick={() => {
                                            const updated = [...questions];
                                            const index = questions.findIndex((q) => q.id === question.id);
                                            updated[index].choices.push({
                                                text: '',
                                                image_url: '',
                                                score: updated[index].choices.length + 1,
                                                correct: false,
                                                result_id: null,
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
                                    {question.choices.map((choice, choiceIndex) => (
                                        <div key={choiceIndex} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                {String.fromCharCode(65 + choiceIndex)}
                                            </div>

                                            <div className="flex-1">
                                                <Input
                                                    value={choice.text}
                                                    onChange={(e) => {
                                                        const updated = [...questions];
                                                        const qIndex = questions.findIndex((q) => q.id === question.id);
                                                        updated[qIndex].choices[choiceIndex].text = e.target.value;
                                                        setQuestions(updated);
                                                    }}
                                                    placeholder={`선택지 ${choiceIndex + 1}`}
                                                />
                                            </div>

                                            {selectedType === 'quiz' ? (
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">정답</Label>
                                                    <Switch
                                                        checked={choice.correct}
                                                        onCheckedChange={(checked) => {
                                                            const updated = [...questions];
                                                            const qIndex = questions.findIndex((q) => q.id === question.id);
                                                            updated[qIndex].choices[choiceIndex].correct = checked;
                                                            setQuestions(updated);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">점수</Label>
                                                    <Input
                                                        type="number"
                                                        value={choice.score}
                                                        onChange={(e) => {
                                                            const updated = [...questions];
                                                            const qIndex = questions.findIndex((q) => q.id === question.id);
                                                            updated[qIndex].choices[choiceIndex].score = parseInt(e.target.value) || 1;
                                                            setQuestions(updated);
                                                        }}
                                                        className="w-20"
                                                        min="1"
                                                    />
                                                </div>
                                            )}

                                            {question.choices.length > 2 && (
                                                <Button
                                                    onClick={() => {
                                                        const updated = [...questions];
                                                        const qIndex = questions.findIndex((q) => q.id === question.id);
                                                        updated[qIndex].choices.splice(choiceIndex, 1);
                                                        setQuestions(updated);
                                                    }}
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

    const renderResults = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">결과 설정</h3>
                    <p className="text-gray-600 mt-1">{getTypeConfig()?.name} 테스트 결과를 정의하세요</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => generateResultTemplate(selectedType!)} variant="outline" className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        템플릿 생성
                    </Button>
                    <Button
                        onClick={() =>
                            setResults([
                                ...results,
                                {
                                    id: Math.max(...results.map((r) => r.id)) + 1,
                                    name: '',
                                    description: '',
                                    features: [],
                                    match_results: [],
                                    jobs: [],
                                    bg_image_url: '',
                                    theme_color: '#3B82F6',
                                    condition: { type: 'score', min: 0, max: 30 },
                                },
                            ])
                        }
                        className="bg-green-600 hover:bg-green-700"
                    >
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
                                        onClick={() => setResults(results.filter((r) => r.id !== result.id))}
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
                                            onChange={(e) => {
                                                const updated = [...results];
                                                const index = results.findIndex((r) => r.id === result.id);
                                                updated[index].name = e.target.value;
                                                setResults(updated);
                                            }}
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
                                                    onChange={(e) => {
                                                        const updated = [...results];
                                                        const index = results.findIndex((r) => r.id === result.id);
                                                        updated[index].condition.min = parseInt(e.target.value) || 0;
                                                        setResults(updated);
                                                    }}
                                                    placeholder="최소점수"
                                                />
                                                <Input
                                                    type="number"
                                                    value={result.condition.max}
                                                    onChange={(e) => {
                                                        const updated = [...results];
                                                        const index = results.findIndex((r) => r.id === result.id);
                                                        updated[index].condition.max = parseInt(e.target.value) || 10;
                                                        setResults(updated);
                                                    }}
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
                                                onChange={(e) => {
                                                    const updated = [...results];
                                                    const index = results.findIndex((r) => r.id === result.id);
                                                    updated[index].theme_color = e.target.value;
                                                    setResults(updated);
                                                }}
                                                className="w-16 h-10"
                                            />
                                            <Input
                                                value={result.theme_color}
                                                onChange={(e) => {
                                                    const updated = [...results];
                                                    const index = results.findIndex((r) => r.id === result.id);
                                                    updated[index].theme_color = e.target.value;
                                                    setResults(updated);
                                                }}
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
                                        onChange={(e) => {
                                            const updated = [...results];
                                            const index = results.findIndex((r) => r.id === result.id);
                                            updated[index].description = e.target.value;
                                            setResults(updated);
                                        }}
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
                                                    onClick={() => {
                                                        const updated = [...results];
                                                        const index = results.findIndex((r) => r.id === result.id);
                                                        updated[index].bg_image_url = '';
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

    const renderPreview = () => (
        <div className="space-y-8">
            {/* 테스트 정보 카드 */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">{testData.emoji}</div>
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
                        {testData.category_ids.map((id) => {
                            const category = categories.find((c) => c.id === id);
                            return (
                                <Badge key={id} variant="outline" className="bg-white">
                                    {category?.emoji} {category?.display_name}
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
                            {questions.slice(0, 3).map((question, index) => (
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
                            {results.map((result, index) => (
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
                        {[
                            { check: testData.title.trim(), text: '테스트 제목이 입력되었나요?' },
                            { check: testData.category_ids.length > 0, text: '카테고리가 선택되었나요?' },
                            { check: questions.length >= 3, text: '질문이 3개 이상 작성되었나요?' },
                            { check: results.length >= 2, text: '결과가 2개 이상 설정되었나요?' },
                            { check: questions.every((q) => q.choices.length >= 2), text: '모든 질문에 선택지가 2개 이상인가요?' },
                            {
                                check: results.every((r) => r.sections.some((s) => s.content.length > 20)),
                                text: '모든 결과에 충분한 내용이 있나요?',
                            },
                        ].map((item, index) => (
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 'type':
                return renderTypeSelection();
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">새 테스트 만들기</h1>
                        <p className="text-gray-600 mt-1">
                            {selectedType ? `${getTypeConfig()?.name} 테스트를 생성하고 있습니다` : '테스트 유형을 선택하여 시작하세요'}
                        </p>
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
                        <Button variant="outline">
                            <Save className="w-4 h-4 mr-2" />
                            임시저장
                        </Button>
                    </div>
                </div>

                {/* 진행 단계 */}
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = getCurrentStepIndex() > index;
                                const canAccess = selectedType && (index <= getCurrentStepIndex() || isCompleted);

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <button
                                            onClick={() => canAccess && setCurrentStep(step.id as Step)}
                                            disabled={!canAccess}
                                            className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                                                isActive
                                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'
                                                    : isCompleted
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-150'
                                                    : canAccess
                                                    ? 'hover:bg-gray-100'
                                                    : 'opacity-50 cursor-not-allowed'
                                            }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : isCompleted
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-300 text-gray-600'
                                                }`}
                                            >
                                                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold">{step.title}</p>
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

                {/* 메인 콘텐츠 */}
                <Card className="bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">{steps.find((s) => s.id === currentStep)?.title}</CardTitle>
                        <p className="text-gray-600">{steps.find((s) => s.id === currentStep)?.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">{renderStepContent()}</CardContent>
                </Card>

                {/* 네비게이션 버튼 */}
                <div className="flex justify-between items-center">
                    <Button onClick={prevStep} variant="outline" disabled={getCurrentStepIndex() === 0} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        이전 단계
                    </Button>

                    <div className="flex items-center gap-3">
                        {currentStep === 'preview' ? (
                            <>
                                <Button variant="outline" onClick={() => setTestData({ ...testData, status: 'draft' })} disabled={loading}>
                                    임시저장
                                </Button>
                                <Button
                                    onClick={() => {
                                        setLoading(true);
                                        // 실제 API 호출 로직
                                        setTimeout(() => {
                                            setLoading(false);
                                            // 성공 페이지로 이동
                                        }, 2000);
                                    }}
                                    disabled={loading || !canProceedToNext()}
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            생성 중...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            테스트 발행
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={nextStep}
                                disabled={!canProceedToNext()}
                                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                            >
                                다음 단계
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
