import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@pickid/ui';
import { ErrorState } from '@/components/ui';
import { LoadingState } from '@/components/ui';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { testService } from '@/shared/api/services/test.service';
import { AdminCard, AdminCardHeader, AdminCardContent } from '@/components/ui/admin-card';

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
import type { Test } from '@pickid/supabase';
import type { QuestionCreationData } from '@/shared/api/services/test.service';

// ============================================================================
// 타입 정의
// ============================================================================

interface EditTestPageState {
	initialTest: Test | null;
	loadingTest: boolean;
	error: string | null;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

const convertQuestionsData = (questionsData: any[]): QuestionCreationData[] => {
	if (!questionsData || questionsData.length === 0) {
		return [
			{
				question_text: '',
				question_order: 0,
				image_url: null,
				choices: [
					{ choice_text: '', choice_order: 0, score: 1, is_correct: false },
					{ choice_text: '', choice_order: 1, score: 2, is_correct: false },
				],
			},
		];
	}

	return questionsData.map((q) => ({
		id: q.id,
		question_text: q.question_text || '',
		question_order: q.question_order || 0,
		image_url: q.image_url,
		choices:
			q.choices?.map((c: any) => ({
				id: c.id,
				choice_text: c.choice_text || '',
				choice_order: c.choice_order || 0,
				score: c.score,
				is_correct: c.is_correct,
			})) || [],
	}));
};

const convertResultsData = (resultsData: any[]): any[] => {
	if (!resultsData || resultsData.length === 0) {
		return [
			{
				result_name: '',
				result_order: 0,
				description: '',
				match_conditions: { type: 'score', min: 0, max: 30 },
				background_image_url: null,
				theme_color: '#3B82F6',
				features: {},
				target_gender: null,
			},
		];
	}

	return resultsData.map((r) => ({
		id: r.id,
		result_name: r.result_name || '',
		result_order: r.result_order || 0,
		description: r.description,
		match_conditions: (r.match_conditions as Record<string, unknown>) || { type: 'score', min: 0, max: 30 },
		background_image_url: r.background_image_url,
		theme_color: r.theme_color || '#3B82F6',
		features: (r.features as any) || {},
		target_gender: r.target_gender ?? null, // null 체크를 위해 ?? 사용
	}));
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export function EditTestPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const hasLoadedRef = useRef(false);

	const [state, setState] = useState<EditTestPageState>({
		initialTest: null,
		loadingTest: true,
		error: null,
	});

	// 훅 사용
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

	// ID가 변경될 때 로딩 상태 초기화
	useEffect(() => {
		hasLoadedRef.current = false;
		setState({
			initialTest: null,
			loadingTest: true,
			error: null,
		});
	}, [id]);

	// 테스트 데이터 로드
	useEffect(() => {
		const loadTest = async () => {
			if (!id) {
				navigate('/tests');
				return;
			}

			if (hasLoadedRef.current) return;

			try {
				setState((prev) => ({ ...prev, loadingTest: true }));
				hasLoadedRef.current = true;

				const testWithDetails = await testService.getTestWithDetails(id);
				const { test, questions: questionsData, results: resultsData } = testWithDetails;

				setState((prev) => ({ ...prev, initialTest: test }));

				// 테스트 데이터로 폼 초기화
				setType(test.type || 'psychology');
				updateBasicInfo({
					id: test.id,
					title: test.title,
					description: test.description || '',
					slug: test.slug || '',
					status: (test.status as 'draft' | 'published' | 'archived') || 'draft',
					category_ids: test.category_ids || [],
					thumbnail_url: test.thumbnail_url,
					estimated_time: test.estimated_time || 5,
					max_score: test.max_score || 100,
					intro_text: test.intro_text || '',
					requires_gender: Boolean((test as any).requires_gender),
					short_code: test.short_code || '',
					type: (test.type as 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle') || 'psychology',
				});

				// 질문 및 결과 데이터 변환 및 설정
				setQuestions(convertQuestionsData(questionsData));
				setResults(convertResultsData(resultsData) as any);
			} catch (error) {
				console.error('테스트 로딩 실패:', error);
				const errorMessage = error instanceof Error ? error.message : '테스트를 불러오는데 실패했습니다.';
				setState((prev) => ({ ...prev, error: errorMessage }));
			} finally {
				setState((prev) => ({ ...prev, loadingTest: false }));
			}
		};

		loadTest();
	}, [id, navigate, setType, updateBasicInfo, setQuestions, setResults]);

	// 스텝별 컴포넌트 렌더링
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
						questions={questions}
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
						results={results as any}
						onAddResult={addResult}
						onRemoveResult={removeResult}
						onUpdateResult={updateResult as any}
					/>
				);
			case 5:
				return (
					<PreviewStep
						testData={basicInfo}
						questions={questions as any}
						results={results as any}
						selectedType={type || ''}
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
			await saveTest(id);
			alert('테스트가 성공적으로 업데이트되었습니다.');
			navigate('/tests');
		} catch (error) {
			console.error('테스트 업데이트 실패:', error);
			alert('테스트 업데이트에 실패했습니다.');
		}
	};

	const currentStepInfo = steps.find((s) => s.id === step);

	// 로딩 중일 때
	if (state.loadingTest) {
		return <LoadingState message="테스트를 불러오는 중..." />;
	}

	// 에러 상태
	if (state.error) {
		return (
			<ErrorState title="테스트를 불러올 수 없습니다" message={state.error} onRetry={() => window.location.reload()} />
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto p-5 space-y-6">
				{/* 헤더 */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Button variant="outline" onClick={() => navigate('/tests')} className="flex items-center gap-2">
							<ArrowLeft className="w-4 h-4" />
							테스트 목록으로
						</Button>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">테스트 수정</h1>
							<p className="text-gray-600 text-sm">{state.initialTest?.title || '테스트'}</p>
						</div>
					</div>
					{state.initialTest && (
						<Button variant="outline" onClick={() => window.open(`/tests/${state.initialTest!.id}`, '_blank')}>
							<ExternalLink className="w-4 h-4 mr-2" />
							미리보기
						</Button>
					)}
				</div>

				<StepIndicator steps={steps} currentStep={step} onStepClick={setStep} disabled={!type} />

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
					<AdminCardContent>{renderStep()}</AdminCardContent>
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

					<div className="flex items-center gap-4">
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
		</div>
	);
}
