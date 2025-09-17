import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ArrowLeft, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 컴포넌트 임포트
import { BasicInfoStep, PreviewStep, QuestionStep, ResultStep, StepIndicator, TypeSelectionStep } from '@/components/test/test-create';
import { steps, testTypes } from '../../constants/testData';
import { useBasicInfo } from '../../hooks/useBasicInfo';
import { useQuestions } from '../../hooks/useQuestions';
import { useResults } from '../../hooks/useResults';
import { useTestSave } from '../../hooks/useTestSave';
import { useTestSteps } from '../../hooks/useTestSteps';

export function CreateTestPage() {
    const navigate = useNavigate();
    const { step, type, setStep, setType, nextStep, prevStep } = useTestSteps();
    const { basicInfo, updateBasicInfo } = useBasicInfo();
    const questions = useQuestions();
    const results = useResults();
    const { saveTest, isLoading } = useTestSave(basicInfo, type, questions.questions, results.results);

    const currentStepInfo = steps.find(s => s.id === step);
    const typeConfig = testTypes.find(t => t.id === type);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <TypeSelectionStep selectedType={type} onSelectType={setType} />;
            case 2:
                return (
                    <BasicInfoStep
                        testData={basicInfo}
                        selectedType={type}
                        onUpdateTestData={updateBasicInfo}
                        onUpdateTitle={(title: string) => updateBasicInfo({ title })}
                    />
                );
            case 3:
                return (
                    <QuestionStep
                        selectedType={type || ''}
                        questions={questions.questions}
                        onAddQuestion={questions.addQuestion}
                        onRemoveQuestion={questions.removeQuestion}
                        onUpdateQuestion={questions.updateQuestion}
                        onAddChoice={questions.addChoice}
                        onRemoveChoice={questions.removeChoice}
                        onUpdateChoice={questions.updateChoice}
                    />
                );
            case 4:
                return (
                    <ResultStep
                        selectedType={type || ''}
                        results={results.results}
                        onAddResult={results.addResult}
                        onRemoveResult={results.removeResult}
                        onUpdateResult={results.updateResult}
                    />
                );
            case 5:
                return (
                    <PreviewStep 
                        testData={basicInfo} 
                        questions={questions.questions} 
                        results={results.results} 
                        selectedType={type || ''} 
                    />
                );
            default:
                return null;
        }
    };

    const handleSave = async () => {
        try {
            await saveTest();
            alert('테스트가 성공적으로 생성되었습니다!');
            navigate('/tests');
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-5 space-y-6">
                <StepIndicator 
                    steps={steps} 
                    currentStep={step} 
                    onStepClick={setStep} 
                    disabled={!type} 
                />

                <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-gray-900">
                                {currentStepInfo?.title}
                            </CardTitle>
                            <p className="text-gray-600 text-sm">{currentStepInfo?.description}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">{renderStep()}</CardContent>
                </Card>

                <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-6">
                    <Button
                        onClick={prevStep}
                        variant="outline"
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        이전 단계
                    </Button>

                    <div className="flex items-center gap-4">
                        {step === 5 ? (
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        저장 중...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        테스트 생성
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={nextStep}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
