import { Button } from '@pickid/ui';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
	BasicInfoStep,
	PreviewStep,
	QuestionStep,
	ResultStep,
	StepIndicator,
	TypeSelectionStep,
} from '@/components/test/test-create';
import { TEST_CREATION_STEPS } from '@/constants/test.constants';
import { useTestCreation } from '@/hooks/useTestCreation';

export function CreateTestPage() {
	const navigate = useNavigate();
	const {
		step,
		type,
		setStep,
		setType,
		nextStep,
		prevStep,
		basicInfo,
		updateBasicInfo,
		questions,
		results,
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
		generateShortCode,
		updateResultVariantRules,
	} = useTestCreation();

	const handleSave = async () => {
		try {
			await saveTest();
			alert('테스트가 성공적으로 생성되었습니다!');
			navigate('/tests');
		} catch (err) {
			console.error('저장 실패:', err);
			alert('저장 중 오류가 발생했습니다.');
		}
	};

	const currentStepInfo = TEST_CREATION_STEPS.find((s) => s.id === step);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto p-5 space-y-6">
				<StepIndicator steps={TEST_CREATION_STEPS} currentStep={step} onStepClick={setStep} disabled={!type} />

				<AdminCard variant="step" padding="lg">
					<AdminCardHeader variant="step" title={currentStepInfo?.title} subtitle={currentStepInfo?.description} />
					<AdminCardContent>
						{step === 1 && <TypeSelectionStep selectedType={type} onSelectType={setType} />}
						{step === 2 && (
							<BasicInfoStep
								testData={basicInfo}
								selectedType={type || ''}
								onUpdateTestData={updateBasicInfo}
								onUpdateTitle={(title: string) => updateBasicInfo({ title })}
								onRegenerateShortCode={() => updateBasicInfo({ short_code: generateShortCode() })}
								onUpdateResultVariantRules={updateResultVariantRules}
							/>
						)}
						{step === 3 && (
							<QuestionStep
								selectedType={type || ''}
								questions={questions}
								onAddQuestion={addQuestion}
								onRemoveQuestion={removeQuestion}
								onUpdateQuestion={updateQuestion}
								onAddChoice={addChoice}
								onRemoveChoice={removeChoice}
								onUpdateChoice={updateChoice}
							/>
						)}
						{step === 4 && (
							<ResultStep
								selectedType={type || ''}
								results={results}
								onAddResult={addResult}
								onRemoveResult={removeResult}
								onUpdateResult={updateResult}
							/>
						)}
						{step === 5 && <PreviewStep testData={basicInfo} questions={questions} results={results} selectedType={type || ''} />}
					</AdminCardContent>
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

						{step === 5 ? (
							<Button
								onClick={handleSave}
								loading={isLoading}
								loadingText="저장 중..."
								className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
							>
								<Check className="w-4 h-4" />
								테스트 생성
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
				</AdminCard>
			</div>
		</div>
	);
}
