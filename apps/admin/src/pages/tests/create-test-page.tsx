import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import { ArrowLeft, ArrowRight, Check, Save, RefreshCw } from 'lucide-react';

// 컴포넌트 임포트
import { TypeSelectionStep } from '../../components/test/test-creation/steps/TypeSelectionStep';
import { BasicInfoStep } from '../../components/test/test-creation/steps/BasicInfoStep';
import { QuestionsStep } from '../../components/test/test-creation/steps/QuestionsStep';
import { ResultsStep } from '../../components/test/test-creation/steps/ResultsStep';
import { PreviewStep } from '../../components/test/test-creation/steps/PreviewStep';

import { useTestCreation } from '../../hooks/useTestCreation';
import { testTypes, steps } from '../../constants/testData';

export function CreateTestPage() {
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
        addQuestion,
        removeQuestion,
        addResult,
        removeResult,
        setLoading,
        canProceed,
    } = useTestCreation();

    const currentStepInfo = steps.find((s) => s.id === step);
    const typeConfig = testTypes.find((t) => t.id === type);

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

    const handlePublish = async () => {
        setLoading(true);
        try {
            // TODO: API 호출
            console.log('Publishing test:', { type, data, questions, results });
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 임시
            alert('테스트가 발행되었습니다!');
        } catch {
            alert('발행 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
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
                            {type ? `${typeConfig?.name} 테스트를 생성하고 있습니다` : '테스트 유형을 선택하여 시작하세요'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
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
                                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
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
                                    onClick={handlePublish}
                                    disabled={loading || !canProceed()}
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
