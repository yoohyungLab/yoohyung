'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Loading } from '@/components/loading';

// 최소 로딩 시간: 애니메이션이 한 바퀴 다 돌 때까지
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
