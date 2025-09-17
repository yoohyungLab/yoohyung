import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import { ArrowLeft, ArrowRight, Check, Save, RefreshCw, ExternalLink } from 'lucide-react';
import { testService } from '../../api/test.service';

// 분리된 컴포넌트들 임포트
import { TypeSelectionStep } from '../../components/test/test-create/steps/type-selection-step';
import { BasicInfoStep } from '../../components/test/test-create/steps/basic-info-step';
import { QuestionStep } from '../../components/test/test-create/steps/question-step';
import { ResultStep } from '../../components/test/test-create/steps/result-step';
import { PreviewStep } from '../../components/test/test-create/steps/preview-step';

// 훅과 유틸리티 함수들 임포트
import { useTestSteps } from '../../hooks/useTestSteps';
import { useBasicInfo } from '../../hooks/useBasicInfo';
import { useQuestions } from '../../hooks/useQuestions';
import { useResults } from '../../hooks/useResults';
import { useTestSave } from '../../hooks/useTestSave';
import { testTypes, steps } from '../../constants/testData';
import type { Test } from '@repo/supabase';
import type { QuestionCreationData, ResultCreationData } from '../../api/test-creation.service';

export function EditTestPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialTest, setInitialTest] = useState<Test | null>(null);
    const [loadingTest, setLoadingTest] = useState(true);
    const hasLoadedRef = useRef(false);

    // 새로운 훅들 사용
    const { step, type, nextStep, prevStep, setStep, setType } = useTestSteps();
    const { basicInfo, updateBasicInfo } = useBasicInfo();
    const [initialQuestions, setInitialQuestions] = useState<QuestionCreationData[]>([]);
    const [initialResults, setInitialResults] = useState<ResultCreationData[]>([]);
    const questionsHook = useQuestions(initialQuestions);
    const resultsHook = useResults(initialResults);
    const { saveTest, isLoading } = useTestSave(basicInfo, type, questionsHook.questions, resultsHook.results, id);

    // ID가 변경될 때 로딩 상태 초기화
    useEffect(() => {
        hasLoadedRef.current = false;
        setInitialTest(null);
        setLoadingTest(true);
    }, [id]);

    // 테스트 데이터 로드
    useEffect(() => {
        const loadTest = async () => {
            if (!id) {
                navigate('/tests');
                return;
            }

            // 이미 로드된 경우 중복 요청 방지
            if (hasLoadedRef.current) {
                return;
            }

            try {
                setLoadingTest(true);
                hasLoadedRef.current = true;

                // 테스트와 관련된 모든 데이터 가져오기
                const { test, questions: questionsData, results: resultsData } = await testService.getTestWithDetails(id);
                setInitialTest(test);

                // 테스트 데이터로 폼 초기화
                setType(test.type || 'psychology');
                updateBasicInfo({
                    id: test.id,
                    title: test.title,
                    description: test.description || '',
                    slug: test.slug || '',
                    status: test.status || 'draft',
                    category_ids: (test.category_ids || []).map((id) => String(id)),
                    thumbnail_url: test.thumbnail_url,
                    estimated_time: test.estimated_time || 5,
                    max_score: test.max_score || 100,
                    intro_text: test.intro_text || '',
                });

                // 질문 데이터 로드 및 변환
                if (questionsData && questionsData.length > 0) {
                    const convertedQuestions: QuestionCreationData[] = questionsData.map((q) => ({
                        id: q.id,
                        question_text: q.question_text || '',
                        question_order: q.question_order || 0,
                        image_url: q.image_url,
                        choices:
                            q.choices?.map((c) => ({
                                id: c.id,
                                choice_text: c.choice_text || '',
                                choice_order: c.choice_order || 0,
                                score: c.score,
                                is_correct: c.is_correct,
                            })) || [],
                    }));
                    setInitialQuestions(convertedQuestions);
                } else {
                    // 질문이 없는 경우 기본 질문 추가
                    setInitialQuestions([
                        {
                            question_text: '',
                            question_order: 0,
                            image_url: null,
                            choices: [
                                { choice_text: '', choice_order: 0, score: 1, is_correct: false },
                                { choice_text: '', choice_order: 1, score: 2, is_correct: false },
                            ],
                        },
                    ]);
                }

                // 결과 데이터 로드 및 변환
                if (resultsData && resultsData.length > 0) {
                    const convertedResults: ResultCreationData[] = resultsData.map((r) => ({
                        id: r.id,
                        result_name: r.result_name || '',
                        result_order: r.result_order || 0,
                        description: r.description,
                        match_conditions: (r.match_conditions as Record<string, unknown>) || { type: 'score', min: 0, max: 30 },
                        background_image_url: r.background_image_url,
                        theme_color: r.theme_color || '#3B82F6',
                        features: (r.features as Record<string, unknown>) || {},
                    }));
                    setInitialResults(convertedResults);
                } else {
                    // 결과가 없는 경우 기본 결과 추가
                    setInitialResults([
                        {
                            result_name: '',
                            result_order: 0,
                            description: '',
                            match_conditions: { type: 'score', min: 0, max: 30 },
                            background_image_url: null,
                            theme_color: '#3B82F6',
                            features: {},
                        },
                    ]);
                }
            } catch (error) {
                console.error('테스트 로딩 실패:', error);
                const errorMessage = error instanceof Error ? error.message : '테스트를 불러오는데 실패했습니다.';

                // 테스트가 존재하지 않는 경우
                if (errorMessage.includes('not found')) {
                    alert('요청하신 테스트를 찾을 수 없습니다.');
                } else {
                    alert(`테스트 로딩 중 오류가 발생했습니다: ${errorMessage}`);
                }

                navigate('/tests');
            } finally {
                setLoadingTest(false);
            }
        };

        loadTest();
    }, [id, navigate, setType, updateBasicInfo]);

    const typeConfig = testTypes.find((t) => t.id === type);
    const currentStepInfo = steps.find((s) => s.id === step);

    // 스텝별 컴포넌트 렌더링
    const renderStep = () => {
        switch (step) {
            case 1:
                return <TypeSelectionStep selectedType={type} onSelectType={setType} />;
            case 2:
                return (
                    <BasicInfoStep
                        testData={{
                            ...basicInfo,
                            estimated_time: basicInfo.estimated_time || undefined,
                            scheduled_at: basicInfo.scheduled_at || undefined,
                            max_score: basicInfo.max_score || undefined,
                            status: (basicInfo.status as 'draft' | 'published') || 'draft',
                            type: type || 'psychology',
                        }}
                        selectedType={type || 'psychology'}
                        onUpdateTestData={updateBasicInfo}
                        onUpdateTitle={(title: string) => updateBasicInfo({ title })}
                    />
                );
            case 3:
                return (
                    <QuestionStep
                        questions={questionsHook.questions}
                        selectedType={type || ''}
                        onAddQuestion={questionsHook.addQuestion}
                        onRemoveQuestion={questionsHook.removeQuestion}
                        onUpdateQuestion={questionsHook.updateQuestion}
                        onAddChoice={questionsHook.addChoice}
                        onRemoveChoice={questionsHook.removeChoice}
                        onUpdateChoice={questionsHook.updateChoice}
                    />
                );
            case 4:
                return (
                    <ResultStep
                        results={resultsHook.results}
                        selectedType={type || ''}
                        onAddResult={resultsHook.addResult}
                        onRemoveResult={resultsHook.removeResult}
                        onUpdateResult={resultsHook.updateResult}
                    />
                );
            case 5:
                return (
                    <PreviewStep
                        testData={{
                            ...basicInfo,
                            estimated_time: basicInfo.estimated_time || undefined,
                            scheduled_at: basicInfo.scheduled_at || undefined,
                            max_score: basicInfo.max_score || undefined,
                            status: (basicInfo.status as 'draft' | 'published') || 'draft',
                            type: type || 'psychology',
                        }}
                        questions={questionsHook.questions}
                        results={resultsHook.results}
                        selectedType={type || 'psychology'}
                    />
                );
            default:
                return null;
        }
    };

    // 테스트 업데이트 처리
    const handleUpdate = async () => {
        if (!id) return;

        try {
            await saveTest();
            alert('테스트가 성공적으로 업데이트되었습니다.');
            navigate('/tests');
        } catch (error) {
            console.error('테스트 업데이트 실패:', error);
            alert('테스트 업데이트에 실패했습니다.');
        }
    };

    // 로딩 중일 때
    if (loadingTest) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-lg">테스트를 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" onClick={() => navigate('/tests')} className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                테스트 목록으로
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">테스트 수정</h1>
                                <p className="text-gray-600 mt-1">
                                    {initialTest?.title || '테스트'} {type ? `(${typeConfig?.name})` : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Save className="w-4 h-4 mr-2" />
                            임시저장
                        </Button>
                        {initialTest && (
                            <Button variant="outline" onClick={() => window.open(`/tests/${initialTest.id}`, '_blank')}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                미리보기
                            </Button>
                        )}
                    </div>
                </div>

                {/* 진행 단계 */}
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            {steps.map((stepInfo, index) => {
                                const isActive = stepInfo.id === step;
                                const isCompleted = step > stepInfo.id;
                                const canAccess = type && (stepInfo.id <= step || isCompleted);

                                return (
                                    <div key={stepInfo.id} className="flex items-center">
                                        <button
                                            onClick={() => canAccess && setStep(stepInfo.id)}
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
                                                {isCompleted ? <Check className="w-5 h-5" /> : stepInfo.id}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold">{stepInfo.title}</p>
                                                <p className="text-xs opacity-75">{stepInfo.description}</p>
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
                        <CardTitle className="text-xl">{currentStepInfo?.title}</CardTitle>
                        <p className="text-gray-600">{currentStepInfo?.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">{renderStep()}</CardContent>
                </Card>

                {/* 네비게이션 버튼 */}
                <div className="flex justify-between items-center">
                    <Button onClick={prevStep} variant="outline" disabled={step === 1} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        이전 단계
                    </Button>

                    <div className="flex items-center gap-3">
                        {step === 5 ? (
                            <>
                                <Button variant="outline" disabled={isLoading}>
                                    임시저장
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            업데이트 중...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            테스트 업데이트
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={nextStep} disabled={false} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
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
