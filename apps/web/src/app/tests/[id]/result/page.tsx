'use client';

import { Suspense } from 'react';
import { TestResultContainer, TestResultLoading } from '@/features/test';

export default function TestResultPage() {
	return (
		<Suspense fallback={<TestResultLoading />}>
			<TestResultContainer />
		</Suspense>
	);
}
