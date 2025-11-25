'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Badge } from '@pickid/ui';
import { CarouselCard } from '@/components/cards/carousel-card';
import type { TestCard } from '@pickid/supabase';

type TestSectionType = 'popular' | 'new' | 'recommended' | 'trending';

interface TestSectionProps {
	tests: TestCard[];
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
						<CarouselItem key={test.id as string} className="pl-3 -ml-3 basis-[180px] sm:basis-[200px]">
							<CarouselCard
								id={test.id as string}
								title={test.title as string}
								description={(test.description as string) || ''}
								image={test.image as string}
								tags={test.tags as string[]}
							/>
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
