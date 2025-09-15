import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import { ArrowLeft, ArrowRight, Check, Save, RefreshCw, ExternalLink } from 'lucide-react';
import { testService } from '../../api/test.service';

// 분리된 컴포넌트들 임포트
import { TypeSelectionStep } from '../../components/test/test-creation/steps/TypeSelectionStep';
import { BasicInfoStep } from '../../components/test/test-creation/steps/BasicInfoStep';
import { QuestionsStep } from '../../components/test/test-creation/steps/QuestionsStep';
import { ResultsStep } from '../../components/test/test-creation/steps/ResultsStep';
import { PreviewStep } from '../../components/test/test-creation/steps/PreviewStep';

// 훅과 유틸리티 함수들 임포트
import { useTestCreation } from '../../hooks/useTestCreation';
import { testTypes, steps } from '../../constants/testData';
import type { Test } from '../../types/test';

export function EditTestPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialTest, setInitialTest] = useState<Test | null>(null);
    const [loadingTest, setLoadingTest] = useState(true);
    const hasLoadedRef = useRef(false);

    const {
        step,
        type,
        data,
        questions,
        results,
        loading,
        setStep,
        nextStep,
        prevStep,
        selectType,
        updateData,
        updateQuestions,
        addQuestion,
        removeQuestion,
        updateResults,
        addResult,
        removeResult,
        setLoading,
        canProceed,
    } = useTestCreation();

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

                const test = await testService.getTestById(id);
                setInitialTest(test as any);

                // 테스트 데이터로 폼 초기화
                selectType(test.type || 'psychology');
                updateData({
                    title: test.title,
                    description: test.description || '',
                    slug: test.slug || '',
                    status: test.status || 'draft',
                });
            } catch (error) {
                console.error('테스트 로딩 실패:', error);
                alert('테스트를 불러오는데 실패했습니다.');
                navigate('/tests');
            } finally {
                setLoadingTest(false);
            }
        };

        loadTest();
    }, [id]);

    const typeConfig = testTypes.find((t) => t.id === type);
    const currentStepInfo = steps.find((s) => s.id === step);

    // 스텝별 컴포넌트 렌더링
    const renderStep = () => {
        const commonProps = { type, data, questions, results };

        switch (step) {
            case 1:
                return <TypeSelectionStep selectedType={type} onSelectType={selectType} />;
            case 2:
                return (
                    <BasicInfoStep
                        testData={data}
                        selectedType={type}
                        onUpdateTestData={updateData}
                        onUpdateTitle={(title: string) => updateData({ title })}
                    />
                );
            case 3:
                return (
                    <QuestionsStep
                        questions={questions}
                        selectedType={type}
                        onGenerateTemplate={() => {}}
                        onAddQuestion={addQuestion}
                        onRemoveQuestion={removeQuestion}
                        onUpdateQuestion={() => {}}
                        onAddChoice={() => {}}
                        onRemoveChoice={() => {}}
                        onUpdateChoice={() => {}}
                    />
                );
            case 4:
                return (
                    <ResultsStep
                        results={results}
                        selectedType={type}
                        onGenerateTemplate={() => {}}
                        onAddResult={addResult}
                        onRemoveResult={removeResult}
                        onUpdateResult={() => {}}
                    />
                );
            case 5:
                return <PreviewStep testData={data} questions={questions} results={results} selectedType={type} />;
            default:
                return null;
        }
    };

    // 테스트 업데이트 처리
    const handleUpdate = async () => {
        if (!id) return;

        setLoading(true);
        try {
            // 실제 업데이트 API 호출
            await testService.updateTest(id, {
                title: data.title,
                description: data.description,
                slug: data.slug,
                type: type,
                status: data.status,
            });

            alert('테스트가 성공적으로 업데이트되었습니다.');
            navigate('/tests');
        } catch (error) {
            console.error('테스트 업데이트 실패:', error);
            alert('테스트 업데이트에 실패했습니다.');
        } finally {
            setLoading(false);
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
                                <Button variant="outline" disabled={loading}>
                                    임시저장
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    disabled={loading || !canProceed()}
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                    {loading ? (
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
                            <Button
                                onClick={nextStep}
                                disabled={!canProceed()}
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
