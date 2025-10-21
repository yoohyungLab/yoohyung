'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { TestResultShareModal } from '@/shared/components/test-result-share-modal';
import { TestResultStructuredData } from '@/shared/components/test-result-structured-data';
import { trackResultViewed } from '@/shared/lib/analytics';
import { getBackgroundGradient } from '@/shared/lib/color-utils';
import { Loading } from '@/shared/components/loading';
import { useTestResult, useTestResultShare } from '@/features/test';
import { TestResultHeader } from './test-result-header';
import { TestResultContent } from './test-result-content';
import { SharedResultLanding } from './shared-result-landing';

const MIN_LOADING_TIME = 3200;

export function TestResultContainer() {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();
	const testId = params?.id as string;
	const isSharedLink = searchParams.get('ref') === 'share';
	const [isMinLoadingComplete, setIsMinLoadingComplete] = useState(false);

	const {
		testResult,
		totalScore,
		userGender,
		isLoading: baseLoading,
		error,
		isLoggedIn,
		userName,
	} = useTestResult({ testId });

	const { isShareModalOpen, setIsShareModalOpen, handleShare } = useTestResultShare({
		testId,
		resultName: testResult?.result_name || '',
	});

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMinLoadingComplete(true);
		}, MIN_LOADING_TIME);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (testResult && isMinLoadingComplete) {
			trackResultViewed(testId, testResult.result_name, isLoggedIn);
		}
	}, [testResult, testId, isLoggedIn, isMinLoadingComplete]);

	const isLoading = baseLoading || !isMinLoadingComplete;

	if (isLoading) {
		return <Loading variant="result" />;
	}

	if (error) {
		router.push(`/not-found?error=server&message=${encodeURIComponent(error)}`);
		return null;
	}

	if (!testResult) {
		router.push('/not-found?error=not_found');
		return null;
	}

	if (isSharedLink) {
		return <SharedResultLanding testResult={testResult} testId={testId} />;
	}

	const backgroundGradient = getBackgroundGradient(testResult.theme_color || '#6B7280');
	const displayUserName = isLoggedIn && userName ? userName : undefined;

	return (
		<div className={`relative min-h-screen font-sans pt-6 pb-8 bg-gradient-to-br ${backgroundGradient}`}>
			<div className="relative z-10">
				<TestResultStructuredData
					testId={testId}
					testTitle="심리테스트"
					resultName={testResult.result_name}
					resultDescription={testResult.description || ''}
					resultImage={testResult.background_image_url || undefined}
					totalScore={totalScore}
					userGender={userGender || undefined}
				/>

				<TestResultHeader testResult={testResult} />

				<TestResultContent testResult={testResult} onShare={handleShare} userName={displayUserName} testId={testId} />
			</div>

			<TestResultShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				resultType={testResult.result_name || ''}
				totalScore={totalScore}
				title={testResult.result_name || ''}
				description={testResult.description || ''}
				emoji="✨"
			/>
		</div>
	);
}
