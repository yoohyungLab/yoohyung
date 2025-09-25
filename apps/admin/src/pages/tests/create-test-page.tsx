import { Button } from '@repo/ui';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import { ArrowLeft, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 컴포넌트 임포트
import {
	BasicInfoStep,
	PreviewStep,
	QuestionStep,
	ResultStep,
	StepIndicator,
	TypeSelectionStep,
} from '@/components/test/test-create';
import { steps } from '@/constants/testData';
import { useTestCreation } from '@/hooks/useTestCreation';

export function CreateTestPage() {
	const navigate = useNavigate();
	const {
		// 테스트 생성 관련
		step,
		type,
		setStep,
		setType,
		nextStep,
		prevStep,
		basicInfo,
		updateBasicInfo,
		questions: formQuestions,
		results: formResults,
		saveTest,
		isLoading,
		addQuestion,
		removeQuestion,
		updateQuestion,
		addChoice,
		removeChoice,
		updateChoice,
		addResult,
		removeResult,
		updateResult,
	} = useTestCreation();

	const currentStepInfo = steps.find((s) => s.id === step);

	const renderStep = () => {
		switch (step) {
			case 1:
				return <TypeSelectionStep selectedType={type} onSelectType={setType} />;
			case 2:
				return (
					<BasicInfoStep
						testData={basicInfo}
						selectedType={type || ''}
						onUpdateTestData={updateBasicInfo}
						onUpdateTitle={(title: string) => updateBasicInfo({ title })}
					/>
				);
			case 3:
				return (
					<QuestionStep
						selectedType={type || ''}
						questions={formQuestions}
						onAddQuestion={addQuestion}
						onRemoveQuestion={removeQuestion}
						onUpdateQuestion={updateQuestion}
						onAddChoice={addChoice}
						onRemoveChoice={removeChoice}
						onUpdateChoice={updateChoice}
					/>
				);
			case 4:
				return (
					<ResultStep
						selectedType={type || ''}
						results={formResults}
						onAddResult={addResult}
						onRemoveResult={removeResult}
						onUpdateResult={updateResult}
					/>
				);
			case 5:
				return (
					<PreviewStep testData={basicInfo} questions={formQuestions} results={formResults} selectedType={type || ''} />
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
				<StepIndicator steps={steps} currentStep={step} onStepClick={setStep} disabled={!type} />

				<AdminCard variant="step" padding="lg">
					<AdminCardHeader variant="step" title={currentStepInfo?.title} subtitle={currentStepInfo?.description} />
					<AdminCardContent>{renderStep()}</AdminCardContent>
				</AdminCard>

				<AdminCard variant="action" padding="md">
					<div className="flex justify-between items-center">
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
				</AdminCard>
			</div>
		</div>
	);
}
