'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@pickid/ui';
import type { Category } from '@pickid/supabase';

interface CategoryNavigationProps {
	categories: Category[];
	currentSlug: string;
	onCategoryChange: (slug: string) => void;
}

/**
 * 카테고리 네비게이션 컴포넌트
 * 카테고리 목록을 가로 스크롤로 표시하는 컴포넌트
 */
export function CategoryNavigation({ categories, currentSlug, onCategoryChange }: CategoryNavigationProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 현재 활성 카테고리로 자동 스크롤
	useEffect(() => {
		if (scrollContainerRef.current) {
			const activeButton = scrollContainerRef.current.querySelector(
				`[data-category-slug="${currentSlug}"]`
			) as HTMLElement;
			if (activeButton) {
				activeButton.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center',
				});
			}
		}
	}, [currentSlug]);

	return (
		<div
			ref={scrollContainerRef}
			className="overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
		>
			<div className="flex gap-2 min-w-max pb-1">
				{categories.map((cat) => {
					const isActive = cat.slug === currentSlug;
					return (
						<Button
							key={cat.id}
							variant={isActive ? 'default' : 'outline'}
							size="sm"
							onClick={() => onCategoryChange(cat.slug)}
							className="whitespace-nowrap flex-shrink-0"
							data-category-slug={cat.slug}
						>
							{cat.name}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
