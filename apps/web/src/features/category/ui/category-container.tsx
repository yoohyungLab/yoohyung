'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@pickid/supabase';
import { CategoryNavigation } from './category-navigation';
import { TestFilter } from './test-filter';
import { CategoryCard, type TestItem } from './category-card';

interface CategoryContainerProps {
	tests: TestItem[];
	allCategories: Category[];
	currentSlug: string;
}

export function CategoryContainer({ tests, allCategories, currentSlug }: CategoryContainerProps) {
	const router = useRouter();
	const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'starts'>('popular');

	// 정렬된 테스트
	const sortedTests = useMemo(() => {
		return [...tests].sort((a, b) => {
			if (sortBy === 'popular') return (b.completions || 0) - (a.completions || 0);
			if (sortBy === 'recent') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
			if (sortBy === 'starts') return (b.starts || 0) - (a.starts || 0);
			return 0;
		});
	}, [tests, sortBy]);

	// 카테고리 네비게이션 핸들러
	const handleCategoryChange = (targetSlug: string) => {
		if (targetSlug !== currentSlug) {
			router.push(`/category/${targetSlug}`);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* 헤더 */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<CategoryNavigation
						categories={allCategories}
						currentSlug={currentSlug}
						onCategoryChange={handleCategoryChange}
					/>
				</div>
			</header>

			{/* 메인 콘텐츠 */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				<TestFilter sortBy={sortBy} onSortChange={setSortBy} totalCount={sortedTests.length} />

				{/* 테스트 그리드 */}
				{sortedTests.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
