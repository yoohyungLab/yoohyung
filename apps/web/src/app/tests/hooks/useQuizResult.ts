import { useEffect, useState } from 'react';
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
}

/**
 * 퀴즈 결과 로드 훅
 * - 세션 스토리지에서 결과 로드
 * - 점수에 맞는 결과 메시지 조회
 *
 * Note: popularTests는 컴포넌트에서 usePopularTests 직접 호출
 */
export function useQuizResult({ testId }: IUseQuizResultParams) {
	const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);
	const [resultMessage, setResultMessage] = useState<IQuizResultMessage | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const loadResult = async () => {
			try {
				const savedResult = loadTestResult<IQuizResult>();
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
						const minScore = result.match_conditions?.min || 0;
						const maxScore = result.match_conditions?.max || 100;
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
			} catch (err) {
				console.error('Failed to load quiz result:', err);
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setIsLoading(false);
			}
		};

		loadResult();
	}, [testId]);

	return { quizResult, resultMessage, isLoading, error };
}
