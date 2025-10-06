'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@repo/ui';
import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import type { TestCardProps } from '@/shared/types/home';

interface RecommendedSectionProps {
	tests: TestCardProps[];
}

export function RecommendedSection({ tests }: RecommendedSectionProps) {
	return (
		<section className="space-y-4">
			<Carousel className="w-full">
				<CarouselContent className="-ml-2">
					{tests.map((test) => (
						<CarouselItem key={test.id} className="pl-2 basis-[280px]">
							<CarouselCard {...test} />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</section>
	);
}
