'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@pickid/ui';
import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import type { TestCardProps } from '@/shared/types/home';

type TestSectionVariant = 'carousel' | 'grid';
type TestSectionSize = 'small' | 'medium' | 'large';

interface TestSectionProps {
	tests: TestCardProps[];
	title: string;
	variant?: TestSectionVariant;
	size?: TestSectionSize;
	showCarousel?: boolean;
	className?: string;
}

const sizeConfig = {
	small: {
		carousel: 'basis-[180px] sm:basis-[200px]',
		grid: 'grid-cols-2',
		spacing: 'pl-3 -ml-3',
	},
	medium: {
		carousel: 'basis-[280px]',
		grid: 'grid-cols-2 sm:grid-cols-3',
		spacing: 'pl-2 -ml-2',
	},
	large: {
		carousel: 'basis-[320px]',
		grid: 'grid-cols-2 sm:grid-cols-4',
		spacing: 'pl-4 -ml-4',
	},
};

export function TestSection({
	tests,
	title,
	variant = 'carousel',
	size = 'small',
	showCarousel = true,
	className = '',
}: TestSectionProps) {
	const config = sizeConfig[size];

	if (variant === 'grid') {
		return (
			<section className={`py-8 ${className}`} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
				<h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`} className="text-xl font-bold text-gray-900 mb-5">
					{title}
				</h2>
				<div className={`grid ${config.grid} gap-4`}>
					{tests.map((test) => (
						<CarouselCard key={test.id} {...test} description={test.description || ''} />
					))}
					{tests.length % 2 !== 0 && <div className="hidden sm:block" />}
				</div>
			</section>
		);
	}

	return (
		<section className={`py-8 ${className}`} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
			<h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`} className="text-xl font-bold text-gray-900 mb-5">
				{title}
			</h2>
			<Carousel className="w-full">
				<CarouselContent className={`${config.spacing} gap-4`}>
					{tests.map((test) => (
						<CarouselItem key={test.id} className={`${config.spacing} ${config.carousel}`}>
							<CarouselCard {...test} description={test.description || ''} />
						</CarouselItem>
					))}
				</CarouselContent>
				{showCarousel && (
					<>
						<CarouselPrevious />
						<CarouselNext />
					</>
				)}
			</Carousel>
		</section>
	);
}
