'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@pickid/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const router = useRouter();

	useEffect(() => {
		console.error('Application error:', error);
	}, [error]);

	const handleGoHome = () => router.push('/');
	const handleGoBack = () => router.back();

	return <ErrorMessage error={error} variant="page" onRetry={reset} onGoHome={handleGoHome} onGoBack={handleGoBack} />;
}
