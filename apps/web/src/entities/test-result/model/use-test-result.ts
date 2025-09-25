'use client';

import { EGEN_TETO_RESULTS } from '@/shared/constants';
import { useSearchParams, useRouter } from 'next/navigation';

export function useTestResult() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// const resultType = searchParams.get('type') as TestResult | null;
	const resultType = searchParams?.get('type') as string | null;
	const isShared = searchParams?.get('shared') === 'true';

	const getResultData = () => {
		const storedData = sessionStorage.getItem('testResult');
		if (storedData) {
			try {
				return JSON.parse(storedData);
			} catch (error) {
				console.error('Failed to parse stored result data:', error);
				return null;
			}
		}
		return null;
	};

	const resultDataFromStorage = getResultData();
	const scoreParam = resultDataFromStorage?.score;
	const genderParam = resultDataFromStorage?.gender as 'male' | 'female' | null;

	const isValid = resultType && EGEN_TETO_RESULTS[resultType] && scoreParam !== null && genderParam;

	const data = isValid ? EGEN_TETO_RESULTS[resultType] : null;
	const totalScore = scoreParam ? parseInt(scoreParam, 10) : 0;

	const handleRestart = () => {
		sessionStorage.removeItem('testResult');
		router.push('/tests/egen-teto');
	};

	return {
		resultType,
		isShared,
		data,
		totalScore,
		genderParam,
		isValid,
		handleRestart,
	};
}
