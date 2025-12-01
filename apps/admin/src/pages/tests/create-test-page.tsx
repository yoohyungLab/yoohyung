import { useState } from 'react';
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
import { TEST_CREATION_STEPS } from '@/constants/test';
import { ROUTES } from '@/constants/routes';
import { COMMON_MESSAGES } from '@pickid/shared';
import { useTestForm } from '@/providers/TestCreationFormProvider';
import { useTests } from '@/hooks/useTests';
import { generateShortCode, generateSlug } from '@/utils/test.utils';
import type { TestInsert, TestQuestionInsert, TestResultInsert } from '@pickid/supabase';

export function CreateTestPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const { getValues, watch } = useTestForm();
	const { saveTest, isSaving } = useTests();

	// TODO: 의미없는 구조분해 지양
	const type = watch('type');

	const handleSave = async () => {
		try {
			const { type, basicInfo, questions, results } = getValues();

			const finalShortCode = basicInfo.short_code || generateShortCode();
			const finalSlug = basicInfo.slug || generateSlug(basicInfo.title || '');
			const finalStatus = basicInfo.status || 'published';

			const testData: TestInsert = {
				...basicInfo,
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
			alert(COMMON_MESSAGES.CREATED);
			navigate(ROUTES.tests);
		} catch (err) {
			console.error('저장 실패:', err);
			alert(COMMON_MESSAGES.FAILED);
		}
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

	const currentStepInfo = TEST_CREATION_STEPS.find((s) => s.id === step);

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto p-6 space-y-6">
				<StepIndicator steps={TEST_CREATION_STEPS} currentStep={step} onStepClick={setStep} disabled={!type} />

				<AdminCard variant="step" padding="lg">
					<AdminCardHeader variant="step" title={currentStepInfo?.title} subtitle={currentStepInfo?.description} />
					<AdminCardContent>
						{step === 1 && <TypeSelectionStep />}
						{step === 2 && <BasicInfoStep />}
						{step === 3 && <QuestionStep />}
						{step === 4 && <ResultStep />}
						{step === 5 && <PreviewStep />}
					</AdminCardContent>
				</AdminCard>

				<AdminCard variant="action" padding="md">
					<div className="flex justify-between items-center">
						<Button
							onClick={prevStep}
							variant="outline"
							disabled={step === 1}
							className="flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							이전 단계
						</Button>

						{step === 5 ? (
							<Button
								onClick={handleSave}
								loading={isSaving}
								loadingText="저장 중..."
								className="bg-neutral-600 hover:bg-neutral-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
							>
								<Check className="w-4 h-4" />
								테스트 생성
							</Button>
						) : (
							<Button
								onClick={nextStep}
								className="bg-neutral-600 hover:bg-neutral-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
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
