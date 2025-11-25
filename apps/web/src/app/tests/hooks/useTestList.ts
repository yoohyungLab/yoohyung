'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService, testService } from '@/api/services';
import { queryKeys } from '@pickid/shared';
import type { Category, Test, TestCard } from '@pickid/supabase';

export function useTestList() {
	// 테스트 데이터 조회
	const { data: tests = [], isLoading: isLoadingTests } = useQuery({
		queryKey: queryKeys.tests.lists(),
		queryFn: () => testService.getPublishedTests(),
		staleTime: 5 * 60 * 1000,
	});

	// 카테고리 데이터 조회
	const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
		queryKey: queryKeys.categories.active(),
		queryFn: () => categoryService.getActiveCategories(),
		staleTime: 5 * 60 * 1000,
	});

	const isLoading = isLoadingTests || isLoadingCategories;

	// 카테고리 매핑 함수
	const getCategoryNames = (categoryIds: string[] | null): string[] => {
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
				const category = categories.find((cat: Category) => cat.id === categoryId);
				return (category?.name as string) || '알 수 없음';
			})
			.filter((name) => name !== '알 수 없음');

		return categoryNames.length > 0 ? categoryNames : ['미분류'];
	};

	// TestCard 변환
	const testsAsCards = useMemo((): TestCard[] => {
		if (isLoading || !tests.length) return [];

		return tests.map((test: Test) => ({
			id: test.id as string,
			title: test.title as string,
			description: (test.description as string) || '',
			image: (test.thumbnail_url as string) || '/images/placeholder.svg',
			tags: getCategoryNames((test.category_ids as string[] | null) || null),
			type: test.type as string,
			status: test.status as string,
			slug: test.slug as string,
			category_ids: (test.category_ids as string[] | null) || null,
			thumbnail_url: test.thumbnail_url as string | null,
			starts: (test.start_count as number | null),
			completions: (test.response_count as number | null),
		}));
	}, [tests, categories, isLoading]);

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
		error: null,
	};
}
