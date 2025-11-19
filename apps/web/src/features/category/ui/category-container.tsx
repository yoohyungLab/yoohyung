'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@pickid/supabase';
import { DefaultSelect } from '@pickid/ui';
import { CategoryNavigation } from './category-navigation';
import { CategoryCard, type ITestItem } from './category-card';

interface CategoryContainerProps {
	allTests: ITestItem[];
	allCategories: Category[];
}

export function CategoryContainer({ allTests, allCategories }: CategoryContainerProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [sortBy, setSortBy] = useState<'recent' | 'starts'>('recent');

	// 현재 선택된 카테고리 (URL에서 가져오기, 기본값: 첫 번째)
	const currentSlug = searchParams.get('category') || allCategories[0]?.slug || '';
	const currentCategory = allCategories.find((cat) => cat.slug === currentSlug);

	// 카테고리별 테스트 필터링
	const filteredTests = useMemo(() => {
		if (!currentCategory) return [];

		return allTests.filter((test) => {
			if (!test.category_ids) return false;

			// category_ids를 배열로 변환
			const categoryIds = Array.isArray(test.category_ids)
				? test.category_ids
				: typeof test.category_ids === 'string'
					? [test.category_ids]
					: [];

			return categoryIds.includes(currentCategory.id as string);
		});
	}, [allTests, currentCategory]);

	// 정렬
	const sortedTests = useMemo(() => {
		return [...filteredTests].sort((a, b) => {
			if (sortBy === 'recent') {
				return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
			}
			return (b.starts || 0) - (a.starts || 0);
		});
	}, [filteredTests, sortBy]);

	// 카테고리 변경 핸들러
	const handleCategoryChange = (targetSlug: string) => {
		const params = new URLSearchParams(searchParams);
		params.set('category', targetSlug);
		router.replace(`/category?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<CategoryNavigation categories={allCategories} currentSlug={currentSlug} onCategoryChange={handleCategoryChange} />
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8">
				{/* 필터 */}
				<div className="flex items-center justify-between mb-6">
					<div className="text-sm text-gray-600">총 {sortedTests.length.toLocaleString()}개</div>
					<div className="w-40">
						<DefaultSelect
							value={sortBy}
							onValueChange={(v) => setSortBy(v as 'recent' | 'starts')}
							options={[
								{ value: 'recent', label: '최신순' },
								{ value: 'starts', label: '조회순' },
							]}
							placeholder="정렬 선택"
							size="sm"
							variant="default"
						/>
					</div>
				</div>

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
