'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DefaultSelect } from '@pickid/ui';
import type { Category, Test } from '@pickid/supabase';
import { CategoryNavigation } from './category-navigation';
import { CategoryCard } from './category-card';

interface CategoryContainerProps {
	allTests: Test[];
	allCategories: Category[];
}

export function CategoryContainer({ allTests, allCategories }: CategoryContainerProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [sortBy, setSortBy] = useState<'recent' | 'starts'>('recent');

	const currentSlug = searchParams.get('category') || allCategories[0]?.slug || '';
	const currentCategory = allCategories.find((cat) => cat.slug === currentSlug);

	// 필터링
	const filteredTests = useMemo(() => {
		if (!currentCategory) return [];

		return allTests.filter((test) => {
			const categoryIds = test.category_ids;
			if (!categoryIds) return false;

			const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
			return ids.includes(currentCategory.id);
		});
	}, [allTests, currentCategory]);

	// 정렬
	const sortedTests = useMemo(() => {
		return [...filteredTests].sort((a, b) => {
			if (sortBy === 'recent') {
				return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
			}
			return (b.start_count || 0) - (a.start_count || 0);
		});
	}, [filteredTests, sortBy]);

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
