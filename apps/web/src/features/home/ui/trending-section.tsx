'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@repo/ui';
import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import type { TestCardProps } from '@/shared/types/home';

interface TrendingSectionProps {
	tests: TestCardProps[];
}

export function TrendingSection({ tests }: TrendingSectionProps) {
	return (
		<Carousel className="w-full">
			<CarouselContent className="-ml-3">
				{tests.map((test) => (
					<CarouselItem key={test.id} className="pl-3 basis-[180px] sm:basis-[200px]">
						<CarouselCard {...test} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
