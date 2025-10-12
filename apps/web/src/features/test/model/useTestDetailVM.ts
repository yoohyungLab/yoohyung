'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@pickid/supabase';
import type { TestWithNestedDetails } from '@pickid/supabase';

/**
 * 테스트 상세 ViewModel
 * 단일 테스트의 완전한 정보 조회 (질문, 선택지 포함)
 */
export function useTestDetailVM(id: string) {
	const [test, setTest] = useState<TestWithNestedDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadTest = useCallback(async () => {
		if (!id) {
			setError('잘못된 접근입니다.');
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			// 테스트 기본 정보 조회
			const { data: testData, error: testError } = await supabase
				.from('tests')
				.select('*')
				.eq('id', id)
				.eq('status', 'published')
				.single();

			if (testError) {
				if (testError.code === 'PGRST116') {
					throw new Error('테스트를 찾을 수 없습니다.');
				}
				throw testError;
			}

			if (!testData) {
				throw new Error('테스트를 찾을 수 없습니다.');
			}

			// 질문과 선택지 조회
			const { data: questionsData, error: questionsError } = await supabase
				.from('test_questions')
				.select(
					`
					*,
					test_choices (*)
				`
				)
				.eq('test_id', id)
				.order('question_order');

			if (questionsError) throw questionsError;

			// 데이터 구조 변환
			type TChoiceLite = { choice_order: number } & Record<string, unknown>;
			type TQuestionLite = { test_choices?: TChoiceLite[] } & Record<string, unknown>;
			const formattedQuestions = ((questionsData || []) as TQuestionLite[]).map((q) => ({
				...q,
				choices: (q.test_choices ?? [])
					.slice()
					.sort((a: TChoiceLite, b: TChoiceLite) => a.choice_order - b.choice_order),
			})) as unknown as TestWithNestedDetails['questions'];

			const formattedTest: TestWithNestedDetails = {
				test: testData,
				questions: formattedQuestions,
				results: [], // 결과는 결과 페이지에서만 로드
			};

			setTest(formattedTest);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			setTest(null);
			console.error('Error loading test:', err);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadTest();
	}, [loadTest]);

	return { test, isLoading, error, refresh: loadTest };
}
