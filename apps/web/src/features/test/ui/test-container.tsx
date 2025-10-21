'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTestTakingVM } from '@/features/test';
import { colorThemes } from '@/features/test';
import { TestIntro } from './test-intro';
import { TestQuestion } from './test-question';
import type { TestTakingInterfaceProps, TestCompletionResult } from '@/shared/types';

/**
 * 테스트 전체 컨테이너
 * 시작 → 질문 → 결과 로딩 → 완료 플로우 관리
 */
export function TestContainer(props: TestTakingInterfaceProps) {
	const { test, onComplete, onExit } = props;
	const [isStarting, setIsStarting] = useState(true);

	// 테스트가 변경될 때 상태 초기화
	useEffect(() => {
		setIsStarting(true);
	}, [test?.test?.id]);

	// 테마 계산 (테스트 ID 기반 해시)
	const theme = useMemo(() => {
		const testId = test?.test?.id || 'default';
		const hash = testId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colorThemes[hash % colorThemes.length];
	}, [test?.test?.id]);

	// 결과 완료 핸들러
	const handleComplete = useCallback(
		(result: TestCompletionResult) => {
			onComplete?.(result);
		},
		[onComplete]
	);

	// 테스트 진행 로직
	const { progress, currentQuestion, handleAnswer, handlePrevious, setSelectedGender } = useTestTakingVM({
		test,
		config: { allowBackNavigation: true, showProgress: true, showQuestionNumbers: true, requireAllAnswers: true },
		onComplete: handleComplete,
		onExit,
	});

	const handleStart = useCallback(
		(selectedGender?: 'male' | 'female') => {
			setIsStarting(false);
			if (selectedGender) {
				setSelectedGender(selectedGender);
			}
		},
		[setSelectedGender]
	);

	// 화면 상태별 렌더링
	if (isStarting) return <TestIntro test={test} onStart={handleStart} theme={theme} />;
	if (progress.isCompleted || !currentQuestion) return null;

	return (
		<TestQuestion
			progress={progress}
			currentQuestion={currentQuestion}
			onAnswer={handleAnswer}
			onPrevious={handlePrevious}
			theme={theme}
		/>
	);
}
