'use client';

import type { Category } from '@pickid/supabase';

interface CategoryNavigationProps {
	categories: Category[];
	currentSlug: string;
	onCategoryChange: (slug: string) => void;
}

export function CategoryNavigation({ categories, currentSlug, onCategoryChange }: CategoryNavigationProps) {
	return (
		<div className="px-4 py-3 overflow-x-auto scrollbar-hide">
			<div className="flex gap-1">
				{categories.map((cat) => {
					const isActive = cat.slug === currentSlug;
					return (
						<button
							key={cat.id}
							onClick={() => onCategoryChange(cat.slug as string)}
							className={`
								flex-shrink-0 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-xs font-semibold
								${
									isActive
										? 'bg-primary text-primary-foreground border border-transparent shadow-sm'
										: 'bg-white text-gray-700 border border-gray-200 hover:bg-primary hover:text-white hover:border-transparent'
								}
							`}
						>
							{cat.name}
						</button>
					);
				})}
			</div>
		</div>
	);
}
