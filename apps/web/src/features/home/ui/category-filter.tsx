'use client';

import { useCategories } from '@/shared/hooks/useCategories';
import { useState } from 'react';

const categoryStyles: Record<string, { gradient: string }> = {
	all: { gradient: 'from-gray-600 to-gray-700' },
	personality: { gradient: 'from-violet-500 to-purple-600' },
	typetype: { gradient: 'from-indigo-500 to-blue-600' },
	category: { gradient: 'from-pink-500 to-rose-600' },
	'category-1': { gradient: 'from-amber-500 to-orange-600' },
	'category-2': { gradient: 'from-emerald-500 to-teal-600' },
	'category-3': { gradient: 'from-cyan-500 to-blue-500' },
	test: { gradient: 'from-fuchsia-500 to-pink-600' },
	tendency: { gradient: 'from-red-500 to-rose-600' },
	'test-1': { gradient: 'from-lime-500 to-green-600' },
	'category-4': { gradient: 'from-sky-500 to-blue-600' },
	psychologypsychology: { gradient: 'from-purple-500 to-violet-600' },
	'category-5': { gradient: 'from-slate-500 to-gray-600' },
	'category-6': { gradient: 'from-orange-500 to-red-600' },
};

export function CategoryFilter() {
	const { categories } = useCategories();
	const [showAll, setShowAll] = useState(false);

	const displayedCategories = showAll ? categories : categories.slice(0, 7);

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2">
				{displayedCategories.map((category) => {
					const style = categoryStyles[category.slug] || categoryStyles.all;

					return (
						<button
							key={category.id}
							className="group relative px-3 py-2 rounded-lg text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-transparent transition-all overflow-hidden"
						>
							<span className="relative z-10 group-hover:text-white transition-colors">{category.label}</span>
							<div
								className={`absolute inset-0 bg-gradient-to-r ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
							></div>
						</button>
					);
				})}
			</div>

			{categories.length > 7 && (
				<div className="text-center">
					<button
						onClick={() => setShowAll(!showAll)}
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
