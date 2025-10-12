'use client';

import { useState, useMemo } from 'react';
import { useTestTakingVM } from '../model';
import { colorThemes } from '../lib';
import { TestIntro } from './test-intro';
import { ResultLoading } from './result-loading';
import { TestQuestion } from './test-question';
import type { TestTakingInterfaceProps } from '@/shared/types';

/**
 * 테스트 전체 컨테이너
 * 시작 → 질문 → 결과 로딩 → 완료 플로우 관리
 */
export function TestContainer({ test, onComplete, onExit }: TestTakingInterfaceProps) {
	const [isStarting, setIsStarting] = useState(true);
	const [isLoadingResult, setIsLoadingResult] = useState(false);

	// 테마 계산 (테스트 ID 기반 해시)
	const theme = useMemo(() => {
		const testId = test?.test?.id || 'default';
		const hash = testId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colorThemes[hash % colorThemes.length];
	}, [test?.test?.id]);

	// 테스트 진행 로직
	const { progress, currentQuestion, handleAnswer, handlePrevious, setSelectedGender } = useTestTakingVM({
		test,
		config: { allowBackNavigation: true, showProgress: true, showQuestionNumbers: true, requireAllAnswers: true },
		onComplete: (result) => {
			setIsLoadingResult(true);
			setTimeout(() => {
				onComplete?.(result);
			}, 1500);
		},
		onExit,
	});

	const handleStart = (selectedGender?: 'male' | 'female') => {
		setIsStarting(false);
		if (selectedGender) {
			setSelectedGender(selectedGender);
		}
	};

	// 화면 상태별 렌더링
	if (isStarting) return <TestIntro test={test} onStart={handleStart} theme={theme} />;
	if (isLoadingResult) return <ResultLoading />;
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
