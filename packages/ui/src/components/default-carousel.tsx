'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

interface DefaultCarouselProps {
	items: React.ReactNode[];
	className?: string;
}

export function DefaultCarousel({ items, className }: DefaultCarouselProps) {
	const [current, setCurrent] = React.useState(0);
	const count = items.length;

	// 자동 재생 (5초마다)
	React.useEffect(() => {
		if (count <= 1) return;

		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % count);
		}, 5000);

		return () => clearInterval(timer);
	}, [count]);

	return (
		<div className={cn('relative aspect-[3/2] w-full overflow-hidden', className)}>
			{/* 슬라이드 컨테이너 */}
			<div className="relative w-full h-full">
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
			{count > 1 && (
				<div className="absolute bottom-4 right-8 flex gap-1.5">
					{Array.from({ length: count }).map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrent(index)}
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
