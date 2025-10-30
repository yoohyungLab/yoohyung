'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { TestResultShareModal } from './test-result-share-modal';
import { TestResultStructuredData } from './test-result-structured-data';
import { trackResultViewed } from '@/shared/lib/analytics';
import { getBackgroundGradient } from '@/shared/lib/color-utils';
import { Loading } from '@/shared/ui/loading';
import { useTestResult, useTestResultShare } from '@/features/test';
import { TestResultHeader } from './test-result-header';
import { TestResultContent } from './test-result-content';
import { SharedResultLanding } from './shared-result-landing';

export function TestResultContainer() {
	const params = useParams();
	const searchParams = useSearchParams();
	const testId = params?.id as string;
	const isSharedLink = searchParams.get('ref') === 'share';

	const { testResult, totalScore, userGender, isLoading, error, isLoggedIn, userName } = useTestResult({ testId });
	const { isShareModalOpen, setIsShareModalOpen, handleShare } = useTestResultShare({
		testId,
		resultName: testResult?.result_name || '',
	});

	useEffect(() => {
		if (testResult) {
			trackResultViewed(testId, testResult.result_name, isLoggedIn);
		}
	}, [testResult, testId, isLoggedIn]);

	if (isLoading) return <Loading variant="result" />;

	if (error) throw typeof error === 'string' ? new Error(error) : (error as Error);
	if (!testResult) throw new Error('RESULT_NOT_FOUND');

	if (isSharedLink) return <SharedResultLanding testResult={testResult} testId={testId} />;

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
