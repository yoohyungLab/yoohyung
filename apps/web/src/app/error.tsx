'use client';

import { useEffect } from 'react';
import { ErrorFallback } from '@/shared/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return <ErrorFallback error={error} reset={reset} />;
}
