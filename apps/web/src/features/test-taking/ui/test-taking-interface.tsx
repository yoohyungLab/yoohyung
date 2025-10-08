'use client';

import { useState, useMemo } from 'react';
import { useTestTakingVM } from '../hooks';
import { colorThemes } from '../themes';
import { TestStartScreen } from './test-start-screen';
import { GenderSelectionScreen } from './gender-selection-screen';
import { TestCalculatingScreen } from './test-calculating-screen';
import { TestQuestionScreen } from './test-question-screen';
import type { TestTakingInterfaceProps } from '@/shared/types';

// 성별 필드 타입 정의
interface GenderField {
	key: string;
	label: string;
	type: string;
	required: boolean;
	choices: Array<{ value: string; label: string }>;
}

export function TestTakingInterface({ test, onComplete, onExit }: TestTakingInterfaceProps) {
	const [isStarting, setIsStarting] = useState(true);
	const [isGenderSelection, setIsGenderSelection] = useState(false);
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
		setSelectedGender: setVMSelectedGender,
	} = useTestTakingVM({
		test,
		config: {
			allowBackNavigation: true,
			showProgress: true,
			showQuestionNumbers: true,
			requireAllAnswers: true,
		},
		onComplete,
		onExit,
	});

	const handleAnswer = (choiceId: string) => {
		const isLastQuestion = progress.currentQuestionIndex === progress.totalQuestions - 1;
		if (isLastQuestion) setIsCalculating(true);
		originalHandleAnswer(choiceId);
		if (isLastQuestion) setTimeout(() => setIsCalculating(false), 2000);
	};

	const handleStart = () => {
		// 성별 필드가 설정되어 있고 활성화되어 있는지 확인
		const preQuestions = (test?.test as { pre_questions?: GenderField[] })?.pre_questions;
		const hasGenderField = preQuestions?.some((field) => field.key === 'gender' && field.required);

		if (hasGenderField) {
			setIsGenderSelection(true);
		} else {
			setIsStarting(false);
		}
	};

	const handleGenderSelected = (gender: string) => {
		setIsGenderSelection(false);
		setIsStarting(false);
		// useTestTakingVM의 setSelectedGender도 호출
		setVMSelectedGender(gender);
	};

	if (isStarting) {
		return <TestStartScreen test={test} onStart={handleStart} theme={theme} />;
	}

	if (isGenderSelection) {
		return <GenderSelectionScreen test={test} onGenderSelected={handleGenderSelected} theme={theme} />;
	}

	if (isCalculating) {
		return <TestCalculatingScreen theme={theme} />;
	}

	if (progress.isCompleted || !currentQuestion) {
		return null; // 결과 페이지로 이동
	}

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
