import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@pickid/ui';
import { LoadingState } from '@/components/ui';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';
import {
	BasicInfoStep,
	PreviewStep,
	QuestionStep,
	ResultStep,
	StepIndicator,
	TypeSelectionStep,
} from '@/components/test/test-create';
import { TEST_CREATION_STEPS } from '@/constants/test';
import { useTestDetail } from '@/hooks';
import type { Test, TestInsert, TestQuestionInsert, TestResultInsert, TestStatus, TestType } from '@pickid/supabase';
import { convertQuestionsData, convertResultsData } from '@/utils/test.utils';
import { ROUTES, HREF } from '@/constants/routes';
import { COMMON_MESSAGES } from '@pickid/shared';
import { useTestForm } from '@/providers/TestCreationFormProvider';
import { useTests } from '@/hooks/useTests';
import { generateShortCode, generateSlug } from '@/utils/test.utils';

const VALID_STATUSES: TestStatus[] = ['draft', 'published', 'archived'];
const VALID_TYPES: TestType[] = ['psychology', 'balance', 'character', 'quiz', 'meme', 'lifestyle'];

export function EditTestPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [initialTest, setInitialTest] = useState<Test | null>(null);
	const { getValues, watch, reset } = useTestForm();
	const { saveTest, isSaving } = useTests();

	// TODO: onst type = watch('type'); 처럼 중복 코드 너무 많아서 커스텀훅으로 빼던가 해야할듯
	const type = watch('type');

	const { data: testWithDetails, isLoading } = useTestDetail({
		testId: id || '',
		enabled: !!id,
	});

	useEffect(() => {
		if (!id) {
			navigate(ROUTES.tests);
		}
	}, [id, navigate]);

	useEffect(() => {
		if (!testWithDetails) return;

		const { test, questions: questionsData, results: resultsData } = testWithDetails;

		setInitialTest(test);

		const validType = VALID_TYPES.includes(test.type as TestType) ? (test.type as TestType) : 'psychology';
		const validStatus = VALID_STATUSES.includes(test.status as TestStatus) ? (test.status as TestStatus) : 'draft';

		reset({
			type: validType,
			basicInfo: {
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
				features: test.features || {},
			},
			questions: convertQuestionsData(questionsData),
			results: convertResultsData(resultsData),
		});
	}, [testWithDetails, reset]);

	const handleUpdate = async () => {
		try {
			const { type, basicInfo, questions, results } = getValues();

			const finalShortCode = basicInfo.short_code || generateShortCode();
			const finalSlug = basicInfo.slug || generateSlug(basicInfo.title || '');
			const finalStatus = basicInfo.status || 'published';

			const testData: TestInsert = {
				...basicInfo,
				id: id!,
				short_code: finalShortCode,
				slug: finalSlug,
				type: type || 'psychology',
				status: finalStatus,
				published_at: finalStatus === 'published' ? new Date().toISOString() : null,
				category_ids: basicInfo.category_ids || [],
				requires_gender: Boolean(basicInfo.requires_gender),
				estimated_time: basicInfo.estimated_time || 5,
				max_score: basicInfo.max_score || 100,
				intro_text: basicInfo.intro_text || null,
				thumbnail_url: basicInfo.thumbnail_url || null,
				description: basicInfo.description || null,
			};

			const questionsData: TestQuestionInsert[] = questions.map((q, index) => ({
				question_text: q.question_text,
				question_order: index,
				image_url: q.image_url,
				question_type: q.question_type || 'multiple_choice',
				correct_answers: q.correct_answers || null,
				explanation: q.explanation || null,
				choices: q.choices.map((c, choiceIndex) => ({
					choice_text: c.choice_text,
					choice_order: choiceIndex,
					score: c.score,
					is_correct: c.is_correct,
					code: (c as { code?: string | null }).code || null,
				})),
			}));

			const resultsData: TestResultInsert[] = results.map((r, index) => ({
				result_name: r.result_name,
				description: r.description,
				result_order: index,
				background_image_url: r.background_image_url,
				theme_color: r.theme_color,
				match_conditions: r.match_conditions,
				features: r.features,
				target_gender: r.target_gender || null,
			}));

			await saveTest({ testData, questionsData, resultsData });
			alert(COMMON_MESSAGES.UPDATED);
			navigate(ROUTES.tests);
		} catch (err) {
			console.error('테스트 업데이트 실패:', err);
			alert(COMMON_MESSAGES.FAILED);
		}
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

	const currentStepInfo = TEST_CREATION_STEPS.find((s) => s.id === step);

	if (isLoading) return <LoadingState message="테스트를 불러오는 중..." />;
	if (!testWithDetails) return null;

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto p-6 space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<IconButton
							icon={<ArrowLeft className="w-4 h-4" />}
							text="테스트 목록으로"
							onClick={() => navigate(ROUTES.tests)}
						/>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">테스트 수정</h1>
							<p className="text-gray-600 text-sm">{initialTest?.title || '테스트'}</p>
						</div>
					</div>
					{initialTest && (
						<IconButton
							text="미리보기"
							icon={<ExternalLink className="w-4 h-4 mr-2" />}
							variant="outline"
							onClick={() => window.open(HREF.TEST_DETAIL(initialTest.id), '_blank')}
						/>
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
						{step === 1 && <TypeSelectionStep />}
						{step === 2 && <BasicInfoStep />}
						{step === 3 && <QuestionStep />}
						{step === 4 && <ResultStep />}
						{step === 5 && <PreviewStep />}
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
							loading={isSaving}
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
