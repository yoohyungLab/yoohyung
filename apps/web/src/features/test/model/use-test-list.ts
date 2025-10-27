'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { categoryService, testService } from '@/shared/api/services';
import type { Category } from '@pickid/supabase';

import type { TestCard } from '@/shared/types';

export function useTestList() {
	const [rawTests, setRawTests] = useState<TestCard[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 테스트 데이터 로딩
	const loadTests = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const [tests, categories] = await Promise.all([
				testService.getPublishedTests(),
				categoryService.getActiveCategories(),
			]);

			// TestCard 변환 (supabase 테스트는 이미 서비스에서 published만 조회되므로 안전)
			const mappedTests = (tests || []).map((test) => ({
				id: test.id,
				title: test.title,
				description: test.description || '',
				image: test.thumbnail_url || '/images/placeholder.svg',
				tags: test.category_ids?.map(() => '미분류') || ['미분류'],
				type: test.type,
				status: test.status,
				slug: test.slug,
				category_ids: test.category_ids || null,
				thumbnail_url: test.thumbnail_url,
				starts: test.start_count,
				completions: test.response_count,
			}));

			setRawTests(mappedTests);
			setCategories(categories);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다.';
			setError(errorMessage);
			console.error('Error loading tests:', err);
			setRawTests([]);
			setCategories([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTests();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // loadTests는 빈 의존성 배열로 정의되어 있으므로 제외

	// 카테고리 매핑
	const getCategoryNames = useCallback(
		(categoryIds: string[] | null): string[] => {
			if (isLoading || categories.length === 0) return ['로딩 중...'];
			if (!categoryIds || categoryIds.length === 0) return ['미분류'];

			let processedCategoryIds = categoryIds;
			if (typeof categoryIds === 'string') {
				try {
					processedCategoryIds = JSON.parse(categoryIds);
				} catch {
					processedCategoryIds = [categoryIds];
				}
			}

			const categoryNames = processedCategoryIds
				.map((categoryId) => {
					const category = categories.find((cat) => cat.id === categoryId);
					return category?.name || '알 수 없음';
				})
				.filter((name) => name !== '알 수 없음');

			return categoryNames.length > 0 ? categoryNames : ['미분류'];
		},
		[categories, isLoading]
	);

	// 테스트 카드 변환 - rawTests를 그대로 사용 (이미 TestCard로 변환됨)
	const testsAsCards = useMemo((): TestCard[] => {
		if (isLoading || error || !rawTests.length) return [];

		return rawTests.map((test) => ({
			...test,
			tags: getCategoryNames(test.category_ids),
		}));
	}, [rawTests, isLoading, error, getCategoryNames]);

	// 인기 테스트 (응답 수 기준)
	const popularTests = useMemo((): TestCard[] => {
		if (!testsAsCards.length) return [];
		return [...testsAsCards].sort((a, b) => (b.completions || 0) - (a.completions || 0)).slice(0, 6);
	}, [testsAsCards]);

	// 추천 테스트 (시작 수 기준)
	const recommendedTests = useMemo((): TestCard[] => {
		if (!testsAsCards.length) return [];
		return [...testsAsCards].sort((a, b) => (b.starts || 0) - (a.starts || 0)).slice(1, 7);
	}, [testsAsCards]);

	return {
		testsAsCards,
		popularTests,
		recommendedTests,
		isLoading,
		error,
		refresh: loadTests,
	};
}
