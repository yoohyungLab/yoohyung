'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@pickid/supabase';
import { CategoryNavigation } from './category-navigation';
import { TestFilter } from './test-filter';
import { CategoryCard, type ITestItem } from './category-card';

interface CategoryContainerProps {
	allTests: ITestItem[];
	allCategories: Category[];
}

export function CategoryContainer({ allTests, allCategories }: CategoryContainerProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [sortBy, setSortBy] = useState<'recent' | 'starts'>('recent');

	// URL에서 현재 카테고리 가져오기 (기본값: 첫 번째 카테고리)
	const currentSlug = searchParams.get('category') || allCategories?.[0]?.slug || '';

	// 현재 카테고리에 해당하는 테스트 필터링
	const filteredTests = useMemo(() => {
		if (!allCategories || !allTests) return [];

		const currentCategory = allCategories.find((cat) => cat.slug === currentSlug);
		if (!currentCategory) return [];

		return allTests.filter((test) => {
			if (!test.category_ids) return false;

			// category_ids가 배열인지 문자열인지 확인
			let categoryIds: string[] = [];
			if (typeof test.category_ids === 'string') {
				try {
					categoryIds = JSON.parse(test.category_ids);
				} catch {
					categoryIds = [test.category_ids];
				}
			} else if (Array.isArray(test.category_ids)) {
				categoryIds = test.category_ids;
			}

			return categoryIds.includes(currentCategory.id);
		});
	}, [allTests, allCategories, currentSlug]);

	// 정렬된 테스트
	const sortedTests = useMemo(() => {
		return [...filteredTests].sort((a, b) => {
			if (sortBy === 'recent') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
			if (sortBy === 'starts') return (b.starts || 0) - (a.starts || 0);
			return 0;
		});
	}, [filteredTests, sortBy]);

	// 카테고리 네비게이션 핸들러 (쿼리스트링 방식)
	const handleCategoryChange = useCallback(
		(targetSlug: string) => {
			if (targetSlug !== currentSlug) {
				// 쿼리스트링으로 카테고리 변경
				const params = new URLSearchParams(searchParams);
				params.set('category', targetSlug);
				router.replace(`/category?${params.toString()}`, { scroll: false });
			}
		},
		[router, currentSlug, searchParams]
	);

	// 첫 로드 시 기본 카테고리 설정
	useEffect(() => {
		if (!currentSlug && allCategories && allCategories.length > 0) {
			const params = new URLSearchParams(searchParams);
			params.set('category', allCategories[0].slug);
			router.replace(`/category?${params.toString()}`, { scroll: false });
		}
	}, [currentSlug, allCategories, router, searchParams]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* 헤더 */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-40 overflow-hidden">
				<CategoryNavigation
					categories={allCategories}
					currentSlug={currentSlug}
					onCategoryChange={handleCategoryChange}
				/>
			</header>

			{/* 메인 콘텐츠 */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				<TestFilter sortBy={sortBy} onSortChange={setSortBy} totalCount={sortedTests.length} />

				{/* 테스트 그리드 */}
				{sortedTests.length > 0 ? (
					<div className="grid grid-cols-2 gap-3">
						{sortedTests.map((test) => (
							<CategoryCard key={test.id} test={test} />
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="text-4xl mb-4">🔍</div>
						<p className="text-gray-600">아직 테스트가 없어요</p>
					</div>
				)}
			</main>
		</div>
	);
}

export default CategoryContainer;
