'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@pickid/shared';
import type { TestWithNestedDetails } from '@pickid/supabase';

/**
 * 테스트 상세 ViewModel
 * - 단일 테스트의 완전한 정보 조회
 * - 질문, 선택지, 결과 포함
 * - 테스트 진행 전 준비 단계
 */
export function useTestDetailVM(id: string) {
	const [test, setTest] = useState<TestWithNestedDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadTest = useCallback(async () => {
		if (!id) return;

		try {
			setIsLoading(true);
			setError(null);

			// 테스트 기본 정보 조회 (published 상태만)
			const { data: testData, error: testError } = await supabase
				.from('tests')
				.select('*')
				.eq('id', id)
				.eq('status', 'published')
				.single();

			if (testError) {
				// PGRST116: 0 rows returned (테스트가 없음)
				if (testError.code === 'PGRST116') {
					throw new Error('테스트를 찾을 수 없습니다.');
				}
				throw testError;
			}

			// 테스트 데이터가 없는 경우
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

			// 결과 조회
			const { data: resultsData, error: resultsError } = await supabase
				.from('test_results')
				.select('*')
				.eq('test_id', id)
				.order('result_order');

			if (resultsError) throw resultsError;

			// 데이터 구조 변환
			const formattedTest: TestWithNestedDetails = {
				test: testData,
				questions:
					questionsData?.map((q: { test_choices?: Array<{ choice_order: number }> }) => ({
						...q,
						choices: q.test_choices?.sort((a, b) => a.choice_order - b.choice_order) || [],
					})) || [],
				results: resultsData || [],
			};

			setTest(formattedTest);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			setTest(null); // 에러 발생 시 test를 null로 설정
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
