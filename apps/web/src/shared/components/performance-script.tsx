'use client';

import { useEffect } from 'react';
import { measureWebVitals, addResourceHints } from '@/shared/lib/performance';

export function PerformanceScript() {
	useEffect(() => {
		// Core Web Vitals 측정
		measureWebVitals();

		// 리소스 힌트 추가
		addResourceHints();
	}, []);

	return null;
}
