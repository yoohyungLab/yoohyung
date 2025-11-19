'use client';

import { getBackgroundGradient } from '@/shared/lib/color-utils';
import { TestResultHeader } from './test-result-header';
import { TestResultContent } from './test-result-content';
import type { TestResult } from '@pickid/supabase';

interface ITestResultContainerProps {
	testResult: TestResult;
}

export function TestResultContainer({ testResult }: ITestResultContainerProps) {
	return (
		<div
			className={`relative min-h-screen font-sans pb-8 bg-gradient-to-br ${getBackgroundGradient(testResult.theme_color || '#6B7280')}`}
		>
			<TestResultHeader testResult={testResult} />
			<TestResultContent testResult={testResult} />
		</div>
	);
}
