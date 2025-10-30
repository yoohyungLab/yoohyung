'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Loading } from '@/shared/ui/loading';

const MIN_LOADING_TIME = 3200;

export default function ResultLayout({ children }: { children: ReactNode }) {
	const [isMinDelayComplete, setIsMinDelayComplete] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMinDelayComplete(true);
		}, MIN_LOADING_TIME);

		return () => clearTimeout(timer);
	}, []);

	if (!isMinDelayComplete) {
		return <Loading variant="result" />;
	}

	return children;
}
