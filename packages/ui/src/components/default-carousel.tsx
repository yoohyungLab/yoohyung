'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '../lib/utils';

interface DefaultCarouselProps {
	items: React.ReactNode[];
	className?: string;
	autoPlay?: boolean;
	autoPlayInterval?: number;
}

export function DefaultCarousel({ items, className, autoPlay = true, autoPlayInterval = 5000 }: DefaultCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop: true, dragFree: false },
		autoPlay ? [Autoplay({ delay: autoPlayInterval, stopOnInteraction: false })] : []
	);

	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const scrollTo = React.useCallback(
		(index: number) => {
			if (emblaApi) emblaApi.scrollTo(index);
		},
		[emblaApi]
	);

	const onSelect = React.useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	React.useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);

		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi, onSelect]);

	if (items.length === 0) return null;

	return (
		<div className={cn('relative aspect-[3/2] w-full overflow-hidden', className)}>
			<div ref={emblaRef} className="overflow-hidden h-full">
				<div className="flex h-full">
					{items.map((item, index) => (
						<div key={index} className="flex-[0_0_100%] min-w-0 h-full">
							{item}
						</div>
					))}
				</div>
			</div>

			{/* 인디케이터 도트 */}
			{items.length > 1 && (
				<div className="absolute bottom-4 right-8 flex gap-1.5">
					{items.map((_, index) => (
						<button
							key={index}
							onClick={() => scrollTo(index)}
							className={cn(
								'h-1 rounded-full transition-all duration-200 cursor-pointer',
								selectedIndex === index ? 'w-6 bg-white' : 'w-1 bg-white/40 hover:bg-white/60 active:bg-white/80'
							)}
							aria-label={`슬라이드 ${index + 1}로 이동`}
							type="button"
						/>
					))}
				</div>
			)}
		</div>
	);
}
