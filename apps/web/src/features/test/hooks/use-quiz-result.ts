import { useEffect, useState } from 'react';
import { supabase } from '@pickid/supabase';
import type { IQuizResult } from '../model/types/quiz';

interface QuizResultMessage {
	result_name: string;
	description: string;
	theme_color: string;
}

interface TestResultRow {
	result_name: string;
	description: string | null;
	theme_color: string | null;
	match_conditions: { min?: number; max?: number } | null;
}

export function useQuizResult(testId: string) {
	const [resultMessage, setResultMessage] = useState<QuizResultMessage | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadResult = async () => {
			try {
				// 세션 스토리지에서 퀴즈 결과 가져오기
				const savedResult = sessionStorage.getItem('quizResult');
				if (!savedResult) {
					setIsLoading(false);
					return;
				}

				const quizResult: IQuizResult = JSON.parse(savedResult);

				// DB에서 점수 구간별 결과 메시지 가져오기
				const { data, error } = await supabase
					.from('test_results')
					.select('result_name, description, theme_color, match_conditions')
					.eq('test_id', testId);

				if (error) throw error;

				const results = data as TestResultRow[] | null;

				if (results && results.length > 0) {
					// 점수에 맞는 결과 찾기
					const matchedResult = results.find((result) => {
						const conditions = result.match_conditions;
						const minScore = conditions?.min || 0;
						const maxScore = conditions?.max || 100;
						return quizResult.score >= minScore && quizResult.score <= maxScore;
					});

					if (matchedResult) {
						setResultMessage({
							result_name: matchedResult.result_name,
							description: matchedResult.description || '',
							theme_color: matchedResult.theme_color || '#3B82F6',
						});
					}
				}
			} catch (error) {
				console.error('Failed to load quiz result message:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadResult();
	}, [testId]);

	return {
		resultMessage,
		isLoading,
	};
}
