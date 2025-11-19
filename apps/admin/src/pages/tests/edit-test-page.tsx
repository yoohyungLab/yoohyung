import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@pickid/ui';
import { ErrorState, LoadingState } from '@/components/ui';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { testService } from '@/shared/api/services/test.service';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
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
import type { Test } from '@pickid/supabase';
import { convertQuestionsData, convertResultsData } from '@/utils/test.utils';

type TestStatus = 'draft' | 'published' | 'archived';
type TestType = 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';

const VALID_STATUSES: TestStatus[] = ['draft', 'published', 'archived'];
const VALID_TYPES: TestType[] = ['psychology', 'balance', 'character', 'quiz', 'meme', 'lifestyle'];

export function EditTestPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [initialTest, setInitialTest] = useState<Test | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		step,
		type,
		setStep,
		setType,
		nextStep,
		prevStep,
		basicInfo,
		updateBasicInfo,
		saveTest,
		isLoading,
		questions,
		results,
		setQuestions,
		setResults,
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

	useEffect(() => {
		const loadTest = async () => {
			if (!id) {
				navigate('/tests');
				return;
			}

			try {
				setLoading(true);
				const testWithDetails = await testService.getTestWithDetails(id);
				const { test, questions: questionsData, results: resultsData } = testWithDetails;

				setInitialTest(test);

				const validType = VALID_TYPES.includes(test.type as TestType) ? (test.type as TestType) : 'psychology';
				const validStatus = VALID_STATUSES.includes(test.status as TestStatus) ? (test.status as TestStatus) : 'draft';

				setType(validType);
				updateBasicInfo({
					id: test.id,
					title: test.title,
					description: test.description || '',
					slug: test.slug || '',
					status: validStatus,
					category_ids: test.category_ids || [],
					thumbnail_url: test.thumbnail_url,
					estimated_time: test.estimated_time || 5,
					max_score: test.max_score || 100,
					intro_text: test.intro_text || '',
					requires_gender: Boolean(test.requires_gender),
					short_code: test.short_code || '',
					type: validType,
				});

				setQuestions(convertQuestionsData(questionsData));
				setResults(convertResultsData(resultsData));
			} catch (err) {
				console.error('테스트 로딩 실패:', err);
				setError(err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.');
			} finally {
				setLoading(false);
			}
		};

		loadTest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleUpdate = async () => {
		if (!id) return;
		try {
			await saveTest(id);
			alert('테스트가 성공적으로 업데이트되었습니다.');
			navigate('/tests');
		} catch (err) {
			console.error('테스트 업데이트 실패:', err);
			alert('테스트 업데이트에 실패했습니다.');
		}
	};

	if (loading) return <LoadingState message="테스트를 불러오는 중..." />;
	if (error)
		return <ErrorState title="테스트를 불러올 수 없습니다" message={error} onRetry={() => window.location.reload()} />;

	const currentStepInfo = TEST_CREATION_STEPS.find((s) => s.id === step);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto p-5 space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Button variant="outline" onClick={() => navigate('/tests')} className="flex items-center gap-2">
							<ArrowLeft className="w-4 h-4" />
							테스트 목록으로
						</Button>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">테스트 수정</h1>
							<p className="text-gray-600 text-sm">{initialTest?.title || '테스트'}</p>
						</div>
					</div>
					{initialTest && (
						<Button variant="outline" onClick={() => window.open(`/tests/${initialTest.id}`, '_blank')}>
							<ExternalLink className="w-4 h-4 mr-2" />
							미리보기
						</Button>
					)}
				</div>

				<StepIndicator steps={TEST_CREATION_STEPS} currentStep={step} onStepClick={setStep} disabled={!type} />

				<AdminCard variant="step" padding="lg">
					<AdminCardHeader
						variant="step"
						title={
							<div className="space-y-1">
								<div className="text-lg font-bold text-gray-900">{currentStepInfo?.title}</div>
								<p className="text-gray-600 text-sm">{currentStepInfo?.description}</p>
							</div>
						}
					/>
					<AdminCardContent>
						{step === 1 && <TypeSelectionStep selectedType={type} onSelectType={setType} />}
						{step === 2 && (
							<BasicInfoStep
								testData={basicInfo}
								selectedType={type || ''}
								onUpdateTestData={updateBasicInfo}
								onUpdateTitle={(title: string) => updateBasicInfo({ title })}
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
						{step === 5 && (
							<PreviewStep testData={basicInfo} questions={questions} results={results} selectedType={type || ''} />
						)}
					</AdminCardContent>
				</AdminCard>

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

					{step === 5 ? (
						<Button
							onClick={handleUpdate}
							loading={isLoading}
							loadingText="업데이트 중..."
							className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
						>
							<Check className="w-4 h-4" />
							테스트 업데이트
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
	);
}
