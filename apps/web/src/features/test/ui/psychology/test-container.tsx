'use client';

import { useState, useMemo, useCallback } from 'react';
import type { TestWithNestedDetails } from '@pickid/supabase';
import { useTestTaking, colorThemes } from '@/features/test';
import { TestIntro } from './test-intro';
import { TestQuestion } from './test-question';
import { Loading } from '@/shared/ui/loading';

interface TestContainerProps {
	test: TestWithNestedDetails;
	onComplete: () => void;
	onExit: () => void;
}

export function TestContainer({ test, onComplete, onExit }: TestContainerProps) {
	const [isStarting, setIsStarting] = useState(true);

	const theme = useMemo(() => {
		return colorThemes[0];
	}, []);

	const { progress, currentQuestion, handleAnswer, handlePrevious, setSelectedGender } = useTestTaking({
		test,
		config: { allowBackNavigation: true, showProgress: true, showQuestionNumbers: true, requireAllAnswers: true },
		onComplete,
		onExit,
	});

	const handleStart = useCallback(
		(selectedGender?: 'male' | 'female') => {
			setIsStarting(false);
			if (selectedGender) setSelectedGender(selectedGender);
		},
		[setSelectedGender]
	);

	if (isStarting) return <TestIntro test={test} onStart={handleStart} theme={theme} />;
	if (!test?.questions?.length) {
		return (
			<div className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient}`}>
				<article className="w-full max-w-[420px] bg-white rounded-[2rem] p-6 shadow-2xl text-center">
					<h2 className="text-lg font-bold text-gray-800 mb-2">질문이 없습니다</h2>
					<p className="text-sm text-gray-600">테스트가 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요.</p>
				</article>
			</div>
		);
	}
	if (progress.isCompleted) return <Loading variant="result" />;
	if (!currentQuestion) return null;

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
