'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@pickid/supabase';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { TestProgress, TestAnswer, TestCompletionResult, TestConfig } from '@/shared/types';

// ============================================================================
// 타입 정의
// ============================================================================

interface TestTakingVMProps {
	test: TestWithNestedDetails | null;
	config?: Partial<TestConfig>;
	onComplete?: (result: TestCompletionResult) => void;
	onExit?: () => void;
}

interface TestTakingVMReturn {
	progress: TestProgress;
	currentQuestion: TestWithNestedDetails['questions'][0] | null;
	canGoBack: boolean;
	selectedGender: string;
	handleAnswer: (choiceId: string) => void;
	handlePrevious: () => void;
	handleExit: () => void;
	resetTest: () => void;
	setSelectedGender: (gender: string) => void;
	onComplete?: (result: TestCompletionResult) => void;
}

// ============================================================================
// 기본 설정
// ============================================================================

const DEFAULT_CONFIG: TestConfig = {
	allowBackNavigation: true,
	showProgress: true,
	showQuestionNumbers: true,
	requireAllAnswers: true,
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

const createInitialProgress = (test: TestWithNestedDetails | null): TestProgress => ({
	currentQuestionIndex: 0,
	totalQuestions: test?.questions?.length || 0,
	answers: [],
	startTime: Date.now(),
	isCompleted: false,
});

const calculateTotalScore = (answers: TestAnswer[]): number => {
	return answers.reduce((sum, answer) => sum + answer.score, 0);
};

const calculateDuration = (startTime: number): number => {
	return Math.round((Date.now() - startTime) / 1000);
};

// 테스트 결과 저장 함수
const saveTestResult = async (result: TestCompletionResult) => {
	try {
		// 1. 점수 계산
		let totalScore = 0;
		for (const answer of result.answers) {
			const { data: choiceData, error: choiceError } = await supabase
				.from('test_choices')
				.select('score')
				.eq('id', answer.choiceId)
				.single();

			if (choiceError) {
				console.error('Error fetching choice score for choiceId:', answer.choiceId, choiceError);
				continue;
			}

			totalScore += choiceData.score || 0;
		}

		// 2. 결과 매칭
		const { data: results, error: resultsError } = await supabase
			.from('test_results')
			.select('*')
			.eq('test_id', result.testId)
			.order('result_order');

		if (resultsError) {
			console.error('Error fetching test results:', resultsError);
			return;
		}

		let matchingResult = null;
		if (results && results.length > 0) {
			// 성별 필터링
			const genderFilteredResults = result.gender
				? results.filter(
						(r: { target_gender?: string | null }) => !r.target_gender || r.target_gender === result.gender
				  )
				: results;

			// 점수 범위 매칭
			for (const testResult of genderFilteredResults) {
				if (testResult.match_conditions) {
					const conditions = testResult.match_conditions as { min?: number; max?: number };
					const minScore = conditions.min ?? 0;
					const maxScore = conditions.max ?? Number.MAX_SAFE_INTEGER;

					if (totalScore >= minScore && totalScore <= maxScore) {
						matchingResult = testResult;
						break;
					}
				}
			}

			// 폴백: 첫 번째 결과
			if (!matchingResult) {
				matchingResult = results[0];
			}
		}

		// 3. 사용자 정보 가져오기
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const sessionId = user?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// 4. 응답 저장
		const { data: responseData, error: responseError } = await supabase
			.from('user_test_responses')
			.insert([
				{
					test_id: result.testId,
					user_id: user?.id || null,
					session_id: sessionId,
					result_id: matchingResult?.id || null,
					total_score: totalScore,
					responses: result.answers,
					gender: result.gender || null,
					started_at: new Date(new Date(result.completedAt).getTime() - result.duration * 1000).toISOString(),
					completed_at: result.completedAt,
					completion_time_seconds: result.duration,
					created_date: new Date().toISOString().split('T')[0],
				},
			])
			.select()
			.single();

		if (responseError) {
			console.error('Error saving user response:', responseError);
			throw responseError;
		}

		// 6. 테스트 응답수 증가 (결과 완료 시 카운트)
		try {
			await supabase.rpc('increment_test_response', { test_uuid: result.testId });
		} catch (e) {
			console.warn('Failed to increment response_count:', e);
		}

		// 7. 세션 스토리지에 결과 저장
		if (typeof window !== 'undefined') {
			const sessionData = {
				testId: result.testId,
				totalScore,
				resultId: matchingResult?.id || 'temp',
				resultName: matchingResult?.result_name || '기본 결과',
				description: matchingResult?.description || '결과를 불러오는 중 오류가 발생했습니다.',
				features: matchingResult?.features || { error: ['오류 발생'] },
				completedAt: result.completedAt,
				duration: result.duration,
			};
			sessionStorage.setItem('testResult', JSON.stringify(sessionData));
		}

		return responseData;
	} catch (error) {
		console.error('Error saving test result:', error);
		throw error;
	}
};

// ============================================================================
// 테스트 진행 ViewModel
// ============================================================================

export function useTestTakingVM({ test, config = {}, onComplete, onExit }: TestTakingVMProps): TestTakingVMReturn {
	const mergedConfig = { ...DEFAULT_CONFIG, ...config };

	const [progress, setProgress] = useState<TestProgress>(() => createInitialProgress(test));
	const [selectedGender, setSelectedGender] = useState<string>('');

	// 테스트 변경 시 진행 상태 초기화
	useEffect(() => {
		if (test) {
			setProgress(createInitialProgress(test));
		}
	}, [test]);

	// 현재 질문 계산
	const currentQuestion = useMemo(() => {
		if (!test?.questions || test.questions.length === 0) return null;
		return test.questions[progress.currentQuestionIndex];
	}, [test?.questions, progress.currentQuestionIndex]);

	// 이전 질문으로 갈 수 있는지 확인
	const canGoBack = useMemo(() => {
		return mergedConfig.allowBackNavigation && progress.currentQuestionIndex > 0;
	}, [mergedConfig.allowBackNavigation, progress.currentQuestionIndex]);

	/**
	 * 답변 처리
	 */
	const handleAnswer = useCallback(
		(choiceId: string) => {
			if (!currentQuestion || !test?.questions) return;

			// 선택지 찾기
			const choice = currentQuestion.choices?.find((c) => c.id === choiceId);
			if (!choice) return;

			// 기존 답변 제거 후 새 답변 추가
			const filteredAnswers = progress.answers.filter((answer) => answer.questionId !== currentQuestion.id);

			const newAnswer: TestAnswer = {
				questionId: currentQuestion.id,
				choiceId: choice.id,
				score: choice.score || 0,
				answeredAt: Date.now(),
			};

			const newAnswers = [...filteredAnswers, newAnswer];
			const isLastQuestion = progress.currentQuestionIndex === test.questions.length - 1;

			if (isLastQuestion) {
				// 마지막 질문 - 완료 처리
				const totalScore = calculateTotalScore(newAnswers);
				const duration = calculateDuration(progress.startTime);

				const result: TestCompletionResult = {
					testId: test.test.id,
					resultId: test.results?.[0]?.id || '',
					totalScore,
					answers: newAnswers,
					completedAt: new Date().toISOString(),
					duration,
					gender: selectedGender,
				};

				setProgress((prev) => ({
					...prev,
					answers: newAnswers,
					isCompleted: true,
				}));

				// 결과 저장 및 완료 콜백 호출 (저장 중에는 UI가 깜빡이지 않도록 즉시 완료 콜백 실행)
				onComplete?.(result);
				// 백그라운드로 저장 실행 (실패해도 콘솔만 기록)
				saveTestResult(result).catch((error) => {
					console.error('Failed to save test result:', error);
				});
			} else {
				// 다음 질문으로 이동
				setProgress((prev) => ({
					...prev,
					answers: newAnswers,
					currentQuestionIndex: prev.currentQuestionIndex + 1,
				}));
			}
		},
		[
			currentQuestion,
			progress.answers,
			progress.currentQuestionIndex,
			progress.startTime,
			test,
			onComplete,
			selectedGender,
		]
	);

	/**
	 * 이전 질문으로 이동
	 */
	const handlePrevious = useCallback(() => {
		if (!canGoBack) return;

		setProgress((prev) => {
			const newIndex = prev.currentQuestionIndex - 1;
			// 현재 질문 이후의 답변들 제거
			const filteredAnswers = prev.answers.filter((_, index) => index < newIndex);

			return {
				...prev,
				currentQuestionIndex: newIndex,
				answers: filteredAnswers,
			};
		});
	}, [canGoBack]);

	/**
	 * 테스트 종료
	 */
	const handleExit = useCallback(() => {
		onExit?.();
	}, [onExit]);

	/**
	 * 테스트 초기화
	 */
	const resetTest = useCallback(() => {
		setProgress(createInitialProgress(test));
	}, [test]);

	return {
		progress,
		currentQuestion,
		canGoBack,
		selectedGender,
		handleAnswer,
		handlePrevious,
		handleExit,
		resetTest,
		setSelectedGender,
		onComplete,
	};
}
