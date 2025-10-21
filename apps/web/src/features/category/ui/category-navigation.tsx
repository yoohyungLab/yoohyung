'use client';

import { useRef, useCallback } from 'react';
import type { Category } from '@pickid/supabase';

interface CategoryNavigationProps {
	categories: Category[];
	currentSlug: string;
	onCategoryChange: (slug: string) => void;
}

/**
 * 카테고리 네비게이션 컴포넌트
 * 단순한 가로 스크롤 카테고리 목록
 */
export function CategoryNavigation({ categories, currentSlug, onCategoryChange }: CategoryNavigationProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef(false);
	const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

	// 드래그 스크롤 시작
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (!scrollRef.current) return;

		isDraggingRef.current = true;
		dragStartRef.current = {
			x: e.pageX - scrollRef.current.offsetLeft,
			scrollLeft: scrollRef.current.scrollLeft,
		};

		scrollRef.current.style.cursor = 'grabbing';
		scrollRef.current.style.userSelect = 'none';
	}, []);

	// 드래그 스크롤 중
	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDraggingRef.current || !scrollRef.current) return;

		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - dragStartRef.current.x) * 2;
		scrollRef.current.scrollLeft = dragStartRef.current.scrollLeft - walk;
	}, []);

	// 드래그 스크롤 종료
	const handleMouseUp = useCallback(() => {
		if (!scrollRef.current) return;

		isDraggingRef.current = false;
		scrollRef.current.style.cursor = 'grab';
		scrollRef.current.style.userSelect = '';
	}, []);

	// 카테고리 클릭 핸들러
	const handleCategoryClick = useCallback(
		(slug: string) => {
			if (isDraggingRef.current) return;
			onCategoryChange(slug);
		},
		[onCategoryChange]
	);

	return (
		<div className="px-4 py-3">
			<div
				ref={scrollRef}
				className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab"
				style={{
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
					WebkitOverflowScrolling: 'touch',
				}}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				{categories.map((cat) => {
					const isActive = cat.slug === currentSlug;
					return (
						<button
							key={cat.id}
							onClick={() => handleCategoryClick(cat.slug)}
							className={`
								flex-shrink-0 px-3 py-1.5 rounded-lg transition-all duration-200 ease-in-out
								whitespace-nowrap text-xs font-semibold
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
