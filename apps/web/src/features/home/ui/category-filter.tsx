'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@pickid/supabase';

interface CategoryFilterProps {
	categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
	const [showAll, setShowAll] = useState(false);
	const router = useRouter();

	// 표시할 카테고리 결정
	const displayedCategories = showAll ? categories : categories.slice(0, 7);
	const hasMoreCategories = categories.length > 7;

	// 카테고리 클릭 핸들러
	const handleCategoryClick = useCallback(
		(slug: string) => {
			router.push(`/category?category=${slug}`);
		},
		[router]
	);

	const handleToggleShowAll = () => {
		setShowAll(!showAll);
	};

	return (
		<div className="space-y-3">
			{/* 카테고리 그리드 */}
			<div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2">
				{displayedCategories.map((category) => (
					<button
						key={category.id}
						onClick={() => handleCategoryClick(category.slug)}
						className="group relative px-3 py-2 rounded-lg text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-transparent transition-all overflow-hidden"
					>
						<span className="relative z-10 group-hover:text-white transition-colors">{category.name}</span>
						<div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
					</button>
				))}
			</div>

			{/* 더보기/접기 버튼 */}
			{hasMoreCategories && (
				<div className="text-center">
					<button
						onClick={handleToggleShowAll}
						className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
					>
						<span>{showAll ? '접기' : `${categories.length - 7}개 더보기`}</span>
						<svg
							className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
