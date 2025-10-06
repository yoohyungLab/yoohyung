'use client';

import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import type { TestCardProps } from '@/shared/types/home';

interface DynamicTestsSectionProps {
	tests: TestCardProps[];
}

export function DynamicTestsSection({ tests }: DynamicTestsSectionProps) {
	if (tests.length === 0) return null;

	return (
		<section className="space-y-4">
			<div className="grid grid-cols-2 gap-2">
				{tests.map((test) => (
					<CarouselCard key={test.id} {...test} description={test.description || ''} />
				))}
			</div>
		</section>
	);
}
