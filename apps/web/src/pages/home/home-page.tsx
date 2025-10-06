'use client';

import {
	TrendingSection,
	RecommendedSection,
	TopTestsSection,
	DynamicTestsSection,
	CategoryFilter,
	BannerCarousel,
} from '@/features/home';
import { useTests } from '@/shared/hooks/useTests';
import { Loading } from '@/shared/components/loading';
import type { Banner } from '@/shared/types/home';
import BalanceGameSection from './balance';

// 배너 데이터 - 상수로 분리
const BANNERS: Banner[] = [
	{ id: 'banner-1', image: '/images/banner-2.png' },
	{ id: 'banner-2', image: '/images/banner-2.png' },
	{ id: 'banner-3', image: '/images/banner-2.png' },
];

export default function HomePage() {
	const { testsAsCards, loading, enhancedSectionData } = useTests();

	return (
		<>
			<header className="w-full">
				<BannerCarousel banners={BANNERS} autoPlay autoPlayInterval={5000} />
			</header>

			<main className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4">
					<nav className="py-6" aria-label="테스트 카테고리">
						<CategoryFilter />
					</nav>

					<section className="py-8" aria-labelledby="popular-tests-heading">
						<h2 id="popular-tests-heading" className="text-xl font-bold text-gray-900 mb-5">
							인기 테스트
						</h2>
						<TrendingSection tests={enhancedSectionData.trending} />
					</section>

					<BalanceGameSection />

					{testsAsCards.length > 0 && (
						<section className="py-8" aria-labelledby="new-tests-heading">
							<h2 id="new-tests-heading" className="text-xl font-bold text-gray-900 mb-5">
								새로 추가된 테스트
							</h2>
							{loading ? <Loading className="py-16" /> : <DynamicTestsSection tests={enhancedSectionData.dynamic} />}
						</section>
					)}

					<section className="py-8" aria-labelledby="recommended-tests-heading">
						<h2 id="recommended-tests-heading" className="text-xl font-bold text-gray-900 mb-5">
							추천 테스트
						</h2>
						<RecommendedSection tests={enhancedSectionData.recommended} />
					</section>

					<section className="py-8 pb-12" aria-labelledby="hall-of-fame-heading">
						<h2 id="hall-of-fame-heading" className="text-xl font-bold text-gray-900 mb-5">
							명예의 전당
						</h2>
						<TopTestsSection tests={enhancedSectionData.topByType} />
					</section>
				</div>
			</main>
		</>
	);
}
