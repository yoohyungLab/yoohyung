'use client';

import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import type { TestCardProps } from '@/shared/types/home';

interface TopTestsSectionProps {
	tests: TestCardProps[];
}

export function TopTestsSection({ tests }: TopTestsSectionProps) {
	return (
		<section className="space-y-4">
			<div className="grid grid-cols-2 gap-2">
				{tests.map((test) => (
					<CarouselCard key={test.id} {...test} description={test.description || ''} />
				))}
				{/* 아이템 수가 홀수라면 마지막에 빈 블록 추가해서 정렬 유지 */}
				{tests.length % 2 !== 0 && <div className="hidden sm:block" />}
			</div>
		</section>
	);
}
