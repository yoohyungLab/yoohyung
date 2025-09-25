'use client';

import { HomeCard } from '@/shared/ui/cards/home-card';
import { useFavorites } from '@/shared/hooks/use-favorites';

interface DynamicTestsSectionProps {
	tests: Array<{
		id: string;
		title: string;
		image: string;
		tag: string;
	}>;
}

export function DynamicTestsSection({ tests }: DynamicTestsSectionProps) {
	const { toggleFavorite, isFavorite } = useFavorites();

	if (tests.length === 0) return null;

	return (
		<section className="space-y-4 mt-12">
			<h2 className="text-xl font-bold text-gray-900">🆕 새로운 테스트</h2>
			<div className="grid grid-cols-2 gap-2">
				{tests.map((test) => (
					<HomeCard
						key={test.id}
						id={test.id}
						title={test.title}
						image={test.image}
						tag={test.tag}
						isFavorite={isFavorite(test.id)}
						onToggleFavorite={toggleFavorite}
					/>
				))}
			</div>
		</section>
	);
}
