'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@pickid/supabase';
import { useFavorites } from '@/shared/hooks/useFavorites';
import type { Test, Category } from '@pickid/supabase';
import type { TestCard, TestCardProps } from '@/shared/types/home';

/**
 * 테스트 목록 ViewModel (홈페이지용)
 * - 테스트 목록 조회 및 필터링
 * - 카테고리별 정렬
 * - 즐겨찾기 기능
 * - 검색 기능
 */
export function useTestListVM() {
	const [rawTests, setRawTests] = useState<Test[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 즐겨찾기 기능
	const { toggleFavorite, isFavorite } = useFavorites();

	// 테스트 데이터 로딩
	const loadTests = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const [testsData, categoriesData] = await Promise.all([
				supabase.from('tests').select('*').eq('status', 'published').order('created_at', { ascending: false }),
				supabase.from('categories').select('*').eq('status', 'active').order('name'),
			]);

			if (testsData.error) throw testsData.error;
			if (categoriesData.error) throw categoriesData.error;

			setRawTests(testsData.data || []);
			setCategories(categoriesData.data || []);
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

	// 초기 로딩
	useEffect(() => {
		loadTests();
	}, [loadTests]);

	// 카테고리 매핑 함수 - 메모이제이션으로 성능 최적화
	const getCategoryNames = useCallback(
		(categoryIds: string[] | null): string[] => {
			if (isLoading || categories.length === 0) {
				return ['로딩 중...'];
			}

			if (!categoryIds || categoryIds.length === 0) {
				return ['미분류'];
			}

			// PostgreSQL 배열 처리
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

	// 테스트 데이터를 카드 형태로 변환 - 메모이제이션
	const testsAsCards = useMemo((): TestCard[] => {
		if (isLoading || error || !rawTests.length) {
			return [];
		}
		return rawTests.map((test) => ({
			id: test.id,
			title: test.title,
			description: test.description || '',
			image: test.thumbnail_url || '/images/egen-teto/thumbnail.png',
			tags: getCategoryNames(test.category_ids),
			type: test.type,
			status: test.status,
			slug: test.slug,
			category_ids: test.category_ids,
			thumbnail_url: test.thumbnail_url,
		starts: test.start_count,
		completions: test.response_count,
		}));
	}, [rawTests, isLoading, error, getCategoryNames]);

	// 인기 테스트 (응답 수 기준) - 메모이제이션
	const popularTests = useMemo((): TestCard[] => {
		if (!testsAsCards.length) return [];

		return [...testsAsCards]
			.sort((a, b) => {
				return (b.completions || 0) - (a.completions || 0);
			})
			.slice(0, 6);
	}, [testsAsCards]);

	// 추천 테스트 (조회 수 기준) - 메모이제이션
	const recommendedTests = useMemo((): TestCard[] => {
		if (!testsAsCards.length) return [];

		return [...testsAsCards]
			.sort((a, b) => {
				return (b.starts || 0) - (a.starts || 0);
			})
			.slice(1, 7);
	}, [testsAsCards]);

	// 테스트 카드에 즐겨찾기 정보를 추가하는 헬퍼 함수
	const enhanceTestCard = useCallback(
		(test: TestCard): TestCardProps => ({
			...test,
			isFavorite: isFavorite(test.id),
			onToggleFavorite: toggleFavorite,
		}),
		[isFavorite, toggleFavorite]
	);

	// 여러 테스트 카드에 즐겨찾기 정보를 추가하는 헬퍼 함수
	const enhanceTestCards = useCallback(
		(tests: TestCard[]): TestCardProps[] => tests.map(enhanceTestCard),
		[enhanceTestCard]
	);

	// 즐겨찾기 정보가 포함된 섹션별 데이터
	const enhancedSectionData = useMemo(
		() => ({
			trending: enhanceTestCards(popularTests),
			recommended: enhanceTestCards(recommendedTests),
			dynamic: enhanceTestCards(testsAsCards),
			topByType: enhanceTestCards(popularTests), // 명예의 전당용 (인기 테스트 사용)
		}),
		[popularTests, recommendedTests, testsAsCards, enhanceTestCards]
	);

	return {
		// 기본 데이터
		testsAsCards,
		popularTests,
		recommendedTests,
		isLoading,
		error,
		refresh: loadTests,

		// 즐겨찾기 기능
		toggleFavorite,
		isFavorite,
		enhanceTestCard,
		enhanceTestCards,

		// 즐겨찾기 정보가 포함된 데이터
		enhancedSectionData,
	};
}
