'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';

interface DefaultCarouselProps {
	items: React.ReactNode[];
	className?: string;
	showArrows?: boolean;
	showDots?: boolean;
	autoPlay?: boolean;
	autoPlayInterval?: number;
	orientation?: 'horizontal' | 'vertical';
	aspectRatio?: string; // aspect-[3/2] 같은 Tailwind 클래스
}

export function DefaultCarousel({
	items,
	className,
	showArrows = true,
	showDots = true,
	autoPlay = false,
	autoPlayInterval = 3000,
	orientation = 'horizontal',
	aspectRatio = 'aspect-[3/2]',
}: DefaultCarouselProps) {
	console.log('DefaultCarousel rendered with items:', items.length);

	const [current, setCurrent] = React.useState(0);
	const count = items.length;

	// 자동 재생
	React.useEffect(() => {
		if (!autoPlay || count <= 1) return;

		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % count);
		}, autoPlayInterval);

		return () => clearInterval(timer);
	}, [autoPlay, autoPlayInterval, count]);

	const scrollTo = (index: number) => {
		setCurrent(index);
	};

	console.log('DefaultCarousel: rendering with', items.length, 'items');
	console.log('DefaultCarousel: current state - current:', current, 'count:', count);

	return (
		<div className={cn('relative', aspectRatio, className)}>
			{/* 단순한 슬라이드 구현 */}
			<div className="relative w-full h-full overflow-hidden">
				{items.map((item, index) => (
					<div
						key={index}
						className={cn(
							'absolute inset-0 transition-transform duration-500',
							current === index ? 'translate-x-0' : 'translate-x-full'
						)}
					>
						{item}
					</div>
				))}
			</div>

			{/* 인디케이터 도트 */}
			{showDots && count > 1 && (
				<div className="absolute bottom-4 right-8 flex gap-1.5">
					{Array.from({ length: count }).map((_, index) => (
						<button
							key={index}
							onClick={() => {
								console.log('Dot clicked:', index);
								setCurrent(index);
							}}
							className={cn(
								'h-1 rounded-full transition-all duration-200',
								current === index ? 'w-6 bg-white' : 'w-1 bg-white/40 hover:bg-white/60'
							)}
							aria-label={`슬라이드 ${index + 1}로 이동`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
