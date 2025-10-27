'use client';

import { useCallback, useEffect, useState } from 'react';

import { categoryService } from '@/shared/api/services/category.service';
import { testService } from '@/shared/api/services/test.service';
import { mapTestWithDetailsToNested } from '@/shared/lib/test-mappers';
import type { Category, TestWithNestedDetails } from '@pickid/supabase';

export function useTestDetail(id: string) {
	const [test, setTest] = useState<TestWithNestedDetails | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadTest = useCallback(async () => {
		if (!id || id.trim() === '') {
			setError('잘못된 접근입니다.');
			setIsLoading(false);
			return;
		}

		try {
			console.log('Starting test fetch for id:', id);
			setIsLoading(true);
			setError(null);

			// 병렬로 테스트 데이터와 카테고리 데이터 조회
			console.log('Fetching test data and categories...');
			const [testData, categoryData] = await Promise.all([
				testService.getTestWithDetails(id),
				categoryService.getAllCategories(),
			]);

			console.log('Test data result:', { testData: !!testData, categories: categoryData.length });

			if (!testData) {
				throw new Error('테스트를 찾을 수 없습니다.');
			}

			// 카테고리 데이터 저장
			setCategories(categoryData);

			// TestWithDetails를 TestWithNestedDetails로 변환
			const formattedTest = mapTestWithDetailsToNested(testData);

			console.log('Test fetch successful:', {
				title: formattedTest.test?.title,
				requires_gender: formattedTest.test?.requires_gender,
				category_ids: formattedTest.test?.category_ids,
			});
			setTest(formattedTest);
		} catch (err) {
			console.log('Test fetch failed:', err);
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			setTest(null);
		} finally {
			console.log('Test fetch completed, setting isLoading to false');
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadTest();
	}, [loadTest]);

	return { test, categories, isLoading, error, refresh: loadTest };
}
