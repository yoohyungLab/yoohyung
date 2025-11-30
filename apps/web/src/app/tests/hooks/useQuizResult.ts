import { useEffect, useState, useRef } from 'react';
import { testResultService } from '@/api/services/test-result.service';
import { trackResultViewed } from '@/lib/analytics';
import { loadTestResult } from '../utils/session-storage';
import type { IQuizResult } from '../types/quiz';

interface IQuizResultMessage {
	result_name: string;
	description: string;
	theme_color: string;
}

interface IUseQuizResultParams {
	testId: string;
	enabled?: boolean;
}


export function useQuizResult({ testId, enabled = true }: IUseQuizResultParams) {
	const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);
	const [resultMessage, setResultMessage] = useState<IQuizResultMessage | null>(null);
	const [isLoading, setIsLoading] = useState(enabled);
	const [error, setError] = useState<Error | null>(null);
	const hasLoadedRef = useRef(false);

	useEffect(() => {
		if (!enabled) {
			setIsLoading(false);
			return;
		}

		if (hasLoadedRef.current) return;

		async function loadResult() {
			try {
				const savedResult = loadTestResult<IQuizResult>(testId);
				if (!savedResult) {
					setError(new Error('RESULT_NOT_FOUND'));
					setIsLoading(false);
					return;
				}

				setQuizResult(savedResult);
				trackResultViewed(testId, savedResult.test_title, false);

				// 점수 구간별 결과 메시지 조회
				const results = await testResultService.getQuizResultMessages(testId);

				if (results?.length) {
					const matchedResult = results.find((result) => {
						const matchConditions = result.match_conditions as { min?: number; max?: number } | null;
						const minScore = matchConditions?.min || 0;
						const maxScore = matchConditions?.max || 100;
						return savedResult.score >= minScore && savedResult.score <= maxScore;
					});

					if (matchedResult) {
						setResultMessage({
							result_name: matchedResult.result_name,
							description: matchedResult.description || '',
							theme_color: matchedResult.theme_color || '#3B82F6',
						});
					}
				}

				hasLoadedRef.current = true;
			} catch (err) {
				console.error('Failed to load quiz result:', err);
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setIsLoading(false);
			}
		}

		loadResult();
	}, [testId, enabled]);

	return { quizResult, resultMessage, isLoading, error };
}
