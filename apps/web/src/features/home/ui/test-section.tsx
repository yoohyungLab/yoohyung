'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Badge } from '@pickid/ui';
import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import type { TestCardProps } from '@/shared/types';

type TestSectionType = 'popular' | 'new' | 'recommended' | 'trending';

interface TestSectionProps {
	tests: TestCardProps[];
	title: string;
	sectionType: TestSectionType;
	className?: string;
}

const SECTION_CONFIG = {
	popular: { badgeVariant: 'hot' as const, badgeText: 'HOT' },
	new: { badgeVariant: 'new' as const, badgeText: 'NEW' },
	recommended: { badgeVariant: 'recommended' as const, badgeText: 'PICK' },
	trending: { badgeVariant: 'trending' as const, badgeText: 'TOP' },
} as const;

export function TestSection({ tests, title, sectionType, className = '' }: TestSectionProps) {
	const { badgeVariant, badgeText } = SECTION_CONFIG[sectionType];
	const sectionId = `${title.toLowerCase().replace(/\s+/g, '-')}-heading`;

	return (
		<section className={`py-8 ${className}`} aria-labelledby={sectionId}>
			<div className="flex items-center gap-2 mb-6">
				<h2 id={sectionId} className="text-2xl font-bold">
					{title}
				</h2>
				<Badge variant={badgeVariant}>{badgeText}</Badge>
			</div>

			<Carousel className="w-full">
				<CarouselContent className="pl-3 -ml-3 gap-4">
					{tests.map((test) => (
						<CarouselItem key={test.id} className="pl-3 -ml-3 basis-[180px] sm:basis-[200px]">
							<CarouselCard {...test} description={test.description || ''} />
						</CarouselItem>
					))}
				</CarouselContent>
				{tests.length > 2 && (
					<>
						<CarouselPrevious />
						<CarouselNext />
					</>
				)}
			</Carousel>
		</section>
	);
}
