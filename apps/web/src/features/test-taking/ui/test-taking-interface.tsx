'use client';

import { useState, useMemo } from 'react';
import { useTestTakingVM } from '../hooks';
import { colorThemes } from '../themes';
import { TestStartScreen } from './test-start-screen';
import { ResultCalculatingScreen } from './test-calculating-screen';
import { TestQuestionScreen } from './test-question-screen';
import type { TestTakingInterfaceProps } from '@/shared/types';

export function TestTakingInterface({ test, onComplete, onExit }: TestTakingInterfaceProps) {
	const [isStarting, setIsStarting] = useState(true);
	const [isCalculating, setIsCalculating] = useState(false);

	const theme = useMemo(() => {
		const testId = test?.test?.id || 'default';
		const hash = testId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colorThemes[hash % colorThemes.length];
	}, [test?.test?.id]);

	const {
		progress,
		currentQuestion,
		handleAnswer: originalHandleAnswer,
		handlePrevious,
		setSelectedGender,
	} = useTestTakingVM({
		test,
		config: { allowBackNavigation: true, showProgress: true, showQuestionNumbers: true, requireAllAnswers: true },
		onComplete: (result) => {
			// 테스트 완료 시 계산 화면을 보여주고 결과 페이지로 이동
			setIsCalculating(true);
			setTimeout(() => {
				setIsCalculating(false);
				onComplete?.(result);
			}, 2000);
		},
		onExit,
	});

	const handleAnswer = (choiceId: string) => {
		originalHandleAnswer(choiceId);
	};

	const handleStart = (selectedGender?: 'male' | 'female') => {
		setIsStarting(false);
		if (selectedGender) {
			setSelectedGender(selectedGender);
		}
	};

	// 화면 상태별 렌더링
	if (isStarting) return <TestStartScreen test={test} onStart={handleStart} theme={theme} />;
	if (isCalculating) return <ResultCalculatingScreen />;
	if (progress.isCompleted || !currentQuestion) return null;

	return (
		<TestQuestionScreen
			progress={progress}
			currentQuestion={currentQuestion}
			onAnswer={handleAnswer}
			onPrevious={handlePrevious}
			theme={theme}
		/>
	);
}
